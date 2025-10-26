// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PlagiarismCourtTest
 * @notice Test suite for the StoryNFT and PlagiarismCourt contracts.
 * @dev Uses Foundry's Test utilities to simulate deployment, interactions, and validation.
 */

import "forge-std/Test.sol";
import "../src/StoryNFT.sol";
import "../src/PlagiarismCourt.sol";

contract PlagiarismCourtTest is Test {
    StoryNFT public storyNFT;
    PlagiarismCourt public court;

    // Define test addresses
    address public owner = address(0xA11CE);
    address public reporter = address(0xB0B);
    address public defendant = address(0xC0DE);
    address public voter1 = address(0xD00D);
    address public voter2 = address(0xE00E);

    uint256 public constant STAKE_AMOUNT = 0.01 ether;
    string public constant STORY_CONTENT = "Once upon a decentralized time...";

    /**
     * @notice Deploys new instances of the contracts before each test.
     */
    function setUp() public {
        // Deploy StoryNFT as the owner
        vm.startPrank(owner);
        storyNFT = new StoryNFT("QuillNode Stories", "QNS", owner, 500);
        vm.stopPrank();

        // Deploy PlagiarismCourt with reference to StoryNFT
        vm.startPrank(owner);
        court = new PlagiarismCourt(address(storyNFT));
        vm.stopPrank();

        // Fund accounts for testing
        vm.deal(reporter, 10 ether);
        vm.deal(defendant, 10 ether);
        vm.deal(voter1, 10 ether);
        vm.deal(voter2, 10 ether);
    }

    /**
     * @notice Tests that a reporter can successfully mint a story NFT.
     */
    function testMintStory() public {
        vm.startPrank(reporter);

        uint256 initialBalance = storyNFT.balanceOf(reporter);

        storyNFT.mintStory("ipfs://metadata", "avail DA Hash");

        uint256 newBalance = storyNFT.balanceOf(reporter);

        assertEq(newBalance, initialBalance + 1, "Story mint failed");
        vm.stopPrank();
    }

    /**
     * @notice Tests that a report can be filed with a valid stake.
     */
    function testReportStory() public {
        // Reporter mints a story
        vm.startPrank(reporter);
        uint256 tokenId = storyNFT.mintStory("ipfs://metadata", "avail DA Hash");
        vm.stopPrank();

        // Defendant reports it
        vm.startPrank(defendant);
        court.reportStory{value: STAKE_AMOUNT}(tokenId, "proof link");
        vm.stopPrank();

        // Verify report recorded
        (address reportedBy, uint256 stake,,,,, bool resolved) = court.getReportSummary(tokenId, 0);
        assertEq(reportedBy, defendant, "Reporter mismatch");
        assertEq(stake, STAKE_AMOUNT, "Stake mismatch");
        assertFalse(resolved, "Report should not be resolved yet");
    }

    /**
     * @notice Tests that voting works correctly after a report is made.
     */
    function testVotingFlow() public {
        // Reporter mints a story
        vm.startPrank(reporter);
        uint256 tokenId = storyNFT.mintStory("ipfs://metadata", "avail DA Hash");
        vm.stopPrank();

        // Defendant reports
        vm.startPrank(defendant);
        uint256 reportIndex = court.reportStory{value: STAKE_AMOUNT}(tokenId, "proof link");
        vm.stopPrank();

        // Voters cast votes
        vm.startPrank(voter1);
        court.vote(tokenId, reportIndex, true);
        vm.stopPrank();

        vm.startPrank(voter2);
        court.vote(tokenId, reportIndex, false);
        vm.stopPrank();

        // Check vote counts
        (uint256 yesVotes, uint256 noVotes) = court.getVoteCount(tokenId, reportIndex);
        assertEq(yesVotes, 1, "Yes vote count mismatch");
        assertEq(noVotes, 1, "No vote count mismatch");
    }

    /**
     * @notice Tests resolving a report after voting.
     */
    function testResolveReportAndStakeClaim() public {
        // Reporter mints a story
        vm.startPrank(reporter);
        uint256 tokenId = storyNFT.mintStory("ipfs://metadata", "avail DA Hash");
        vm.stopPrank();

        // Defendant reports
        vm.startPrank(defendant);
        uint256 reportIndex = court.reportStory{value: STAKE_AMOUNT}(tokenId, "proof link");
        vm.stopPrank();

        // Two voters vote in favor of plagiarism
        vm.startPrank(voter1);
        court.vote(tokenId, reportIndex, true);
        vm.stopPrank();

        vm.startPrank(voter2);
        court.vote(tokenId, reportIndex, true);
        vm.stopPrank();

        // Owner resolves the case
        vm.startPrank(owner);
        court.resolveReport(tokenId, reportIndex);
        vm.stopPrank();

        // Check final state
        // (, , bool resolved) = court.reports(tokenId);
        // assertTrue(resolved, "Report should be resolved");
    }
}
