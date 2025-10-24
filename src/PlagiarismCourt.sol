// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {StoryNFT} from "./StoryNFT.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title PlagiarismCourt
 * @notice Decentralized plagiarism dispute system for StoryNFTs.
 *         Supports multiple reporters, proportional stake payouts,
 *         free voting, and batch finalization of reports.
 */
contract PlagiarismCourt is ERC721URIStorage, StoryNFT {
    /// -----------------------------------------------------------------------
    /// Custom Errors
    /// -----------------------------------------------------------------------
    error InvalidStory(); // Story does not exist
    error AlreadyReported(); // Reporter has already reported this story
    error StakeOutOfRange(); // Reporter stake not within allowed range
    error VotingNotActive(); // Voting not ongoing
    error AlreadyVoted(); // Voter has already voted
    error VotingStillOngoing(); // Trying to finalize before deadline
    error AlreadyResolved(); // Dispute already finalized
    error NoVotes(); // Cannot finalize with zero votes

    /// -----------------------------------------------------------------------
    /// Structs
    /// -----------------------------------------------------------------------
    struct Report {
        address reporter; // Reporter of plagiarism
        uint256 stake; // Stake amount placed by reporter
        string proofHash; // IPFS/Avail hash of proof
        uint256 yesVotes; // Votes in favor of plagiarism
        uint256 noVotes; // Votes against plagiarism
        uint256 deadline; // Timestamp when voting ends
        bool resolved; // Has the report been finalized
        mapping(address => bool) hasVoted; // Track voters for this report
    }

    struct StoryReports {
        uint256 reportCount; // Total reports for this story
        mapping(uint256 => Report) reports; // Mapping reportIndex => Report
    }

    /// -----------------------------------------------------------------------
    /// State Variables
    /// -----------------------------------------------------------------------
    StoryNFT public storyNFT; // Reference to StoryNFT contract
    address public developer; // Developer wallet (receives 40% cut)
    uint256 public constant MIN_STAKE = 0.001 ether;
    uint256 public constant MAX_STAKE = 0.5 ether;
    uint256 public constant VOTING_DURATION = 1 days;

    mapping(uint256 => StoryReports) public storyReports; // storyId => StoryReports

    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------
    event StoryReported(
        uint256 indexed storyId,
        uint256 indexed reportIndex,
        address indexed reporter,
        uint256 stake,
        string proofHash
    );
    event Voted(
        uint256 indexed storyId,
        uint256 indexed reportIndex,
        address indexed voter,
        bool support
    );
    event ReportFinalized(
        uint256 indexed storyId,
        uint256 indexed reportIndex,
        bool plagiarismConfirmed
    );
    event StoryDeleted(uint256 indexed storyId);
    event ReportResolved(
        uint256 indexed storyId,
        uint256 indexed reportIndex,
        bool plagiarismConfirmed
    );

    /// -----------------------------------------------------------------------
    /// Constructor
    /// -----------------------------------------------------------------------
    constructor(address _storyNFT) {
        storyNFT = StoryNFT(_storyNFT);
        developer = msg.sender;
    }

    /// -----------------------------------------------------------------------
    /// Reporting
    /// -----------------------------------------------------------------------

    /**
     * @notice Submit a plagiarism report for a story with stake and proof.
     * @param storyId ID of the story being reported.
     * @param proofHash IPFS/Avail hash pointing to proof file.
     */
    function reportStory(
        uint256 storyId,
        string calldata proofHash
    ) external payable returns (uint256) {
        if (storyNFT.ownerOf(storyId) == address(0)) revert InvalidStory();
        if (msg.value < MIN_STAKE || msg.value > MAX_STAKE)
            revert StakeOutOfRange();

        StoryReports storage sReports = storyReports[storyId];

        // Ensure reporter has not already reported this story
        for (uint256 i = 0; i < sReports.reportCount; i++) {
            if (sReports.reports[i].reporter == msg.sender)
                revert AlreadyReported();
        }

        uint256 index = sReports.reportCount;
        Report storage r = sReports.reports[index];
        r.reporter = msg.sender;
        r.stake = msg.value;
        r.proofHash = proofHash;
        r.deadline = block.timestamp + VOTING_DURATION;

        sReports.reportCount++;

        emit StoryReported(storyId, index, msg.sender, msg.value, proofHash);
        return index;
    }

    /// -----------------------------------------------------------------------
    /// Voting
    /// -----------------------------------------------------------------------

    /**
     * @notice Vote on a specific report.
     * @param storyId ID of the story.
     * @param reportIndex Index of the report to vote on.
     * @param support True = support plagiarism claim, false = reject.
     */
    function vote(uint256 storyId, uint256 reportIndex, bool support) external {
        Report storage r = storyReports[storyId].reports[reportIndex];
        if (block.timestamp > r.deadline) revert VotingNotActive();
        if (r.hasVoted[msg.sender]) revert AlreadyVoted();
        if (r.resolved) revert AlreadyResolved();

        r.hasVoted[msg.sender] = true;

        if (support) r.yesVotes++;
        else r.noVotes++;

        emit Voted(storyId, reportIndex, msg.sender, support);
    }

    /// -----------------------------------------------------------------------
    /// Finalization (Single Report)
    /// -----------------------------------------------------------------------

    /**
     * @notice Finalize a single report after voting ends.
     * @param storyId ID of the story.
     * @param reportIndex Index of the report to finalize.
     */
    function finalizeReport(uint256 storyId, uint256 reportIndex) external {
        Report storage r = storyReports[storyId].reports[reportIndex];
        if (block.timestamp < r.deadline) revert VotingStillOngoing();
        if (r.resolved) revert AlreadyResolved();
        if (r.yesVotes + r.noVotes == 0) revert NoVotes();

        r.resolved = true;
        bool plagiarismConfirmed = r.yesVotes > r.noVotes;

        if (plagiarismConfirmed) {
            // Burn story and pay reporter
            storyNFT.burnStory(storyId);
            emit StoryDeleted(storyId);

            uint256 developerCut = (r.stake * 40) / 100;
            uint256 reporterCut = r.stake - developerCut;

            payable(developer).transfer(developerCut);
            payable(r.reporter).transfer(reporterCut);
        } else {
            // Reporter loses: 40% to developer, 60% to accused story owner
            uint256 developerCut = (r.stake * 40) / 100;
            uint256 accusedCut = r.stake - developerCut;

            payable(developer).transfer(developerCut);
            payable(storyNFT.ownerOf(storyId)).transfer(accusedCut);
        }

        emit ReportFinalized(storyId, reportIndex, plagiarismConfirmed);
    }

    /// -----------------------------------------------------------------------
    /// Finalization (All Reports for a Story)
    /// -----------------------------------------------------------------------

    /**
     * @notice Finalize all reports of a story whose voting period has ended.
     *         Burns story if at least one report confirms plagiarism.
     *         Proportional payouts are distributed to winning reporters.
     * @param storyId ID of the story to finalize.
     */
    function finalizeAllReports(uint256 storyId) external {
        StoryReports storage sReports = storyReports[storyId];
        uint256 totalWinningStake = 0;
        uint256 totalReports = sReports.reportCount;
        bool plagiarismConfirmedOverall = false;

        // First pass: mark resolved reports and calculate total winning stake
        for (uint256 i = 0; i < totalReports; i++) {
            Report storage r = sReports.reports[i];

            // Skip if already resolved or voting not ended
            if (r.resolved || block.timestamp < r.deadline) continue;

            bool plagiarismConfirmed = r.yesVotes > r.noVotes;
            r.resolved = true;

            if (plagiarismConfirmed) {
                totalWinningStake += r.stake;
                plagiarismConfirmedOverall = true;
            } else {
                // Reporter lost: 40% dev, 60% to story owner
                uint256 developerCut = (r.stake * 40) / 100;
                uint256 accusedCut = r.stake - developerCut;

                payable(developer).transfer(developerCut);
                payable(storyNFT.ownerOf(storyId)).transfer(accusedCut);
            }

            emit ReportFinalized(storyId, i, plagiarismConfirmed);
        }

        // If any report confirmed plagiarism, burn story and distribute payouts
        if (plagiarismConfirmedOverall) {
            storyNFT.burnStory(storyId);
            emit StoryDeleted(storyId);

            uint256 developerCut = (totalWinningStake * 40) / 100;
            uint256 reportersTotal = totalWinningStake - developerCut;

            payable(developer).transfer(developerCut);

            // Distribute 60% proportionally to all winning reporters
            for (uint256 i = 0; i < totalReports; i++) {
                Report storage r = sReports.reports[i];
                if (r.yesVotes > r.noVotes) {
                    uint256 share = (r.stake * reportersTotal) /
                        totalWinningStake;
                    payable(r.reporter).transfer(share);
                }
            }
        }
    }

    /**
     * @notice Resolves a plagiarism report based on votes.
     * @param storyId The ID of the story.
     * @param reportIndex The index of the report for that story.
     */
    function resolveReport(uint256 storyId, uint256 reportIndex) external {
        Report storage report = storyReports[storyId].reports[reportIndex];
        require(!report.resolved, "Already resolved");

        bool plagiarismConfirmed = report.yesVotes > report.noVotes;
        report.resolved = true;

        emit ReportResolved(storyId, reportIndex, plagiarismConfirmed);
    }

    /**
     * @notice Deletes a resolved report for a specific story.
     * @dev Can only be called if the report has been resolved.
     *      The function removes the report from the storyReports array
     *      by replacing it with the last element and popping the array.
     * @param storyId The ID of the story whose report should be deleted.
     * @param reportIndex The index of the report to delete.
     */
    function deleteReport(uint256 storyId, uint256 reportIndex) external {
        uint256 totalReports = storyReports[storyId].reportCount;
        require(totalReports > 0, "No reports found");
        require(reportIndex < totalReports, "Invalid report index");

        Report storage report = storyReports[storyId].reports[reportIndex];
        require(report.resolved, "Cannot delete unresolved report");

        // Remove the last element
        delete (storyReports[storyId].reports[reportIndex]);
    }

    /// -----------------------------------------------------------------------
    /// View Helper
    /// -----------------------------------------------------------------------

    /**
     * @notice Get summary of a specific report (for frontend)
     */
    function getReportSummary(
        uint256 storyId,
        uint256 reportIndex
    )
        external
        view
        returns (
            address reporter,
            uint256 stake,
            string memory proofHash,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 deadline,
            bool resolved
        )
    {
        Report storage r = storyReports[storyId].reports[reportIndex];
        return (
            r.reporter,
            r.stake,
            r.proofHash,
            r.yesVotes,
            r.noVotes,
            r.deadline,
            r.resolved
        );
    }

    /**
     * @notice Get current vote counts for a report.
     */
    function getVoteCount(
        uint256 storyId,
        uint256 reportIndex
    ) external view returns (uint256 yesVotes, uint256 noVotes) {
        Report storage report = storyReports[storyId].reports[reportIndex];
        return (report.yesVotes, report.noVotes);
    }

    /// -----------------------------------------------------------------------
    /// Fallback / Receive (Optional)
    /// -----------------------------------------------------------------------
    // Allow the contract to accept ETH sent directly
    receive() external payable {}

    fallback() external payable {}
}
