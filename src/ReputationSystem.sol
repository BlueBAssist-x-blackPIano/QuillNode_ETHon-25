// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ReputationSystem
 * @notice Tracks and manages XP, reputation, and levels for writers and readers across QuillNode.
 * @dev This contract is intended to be used by other QuillNode contracts like StoryNFT and PlagiarismCourt.
 */
contract ReputationSystem is Ownable {
    // -------------------------------------------------------
    // ERRORS
    // -------------------------------------------------------
    error InvalidAddress(); // thrown when zero address used
    error InsufficientXP(); // thrown when trying to redeem or level up without enough XP
    error UnauthorizedAccess(); // thrown when non-owner/non-contract tries to modify XP

    // -------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------
    event XPAdded(address indexed user, uint256 amount);
    event XPReduced(address indexed user, uint256 amount);
    event LevelUp(address indexed user, uint256 newLevel);

    // -------------------------------------------------------
    // STRUCTS & ENUMS
    // -------------------------------------------------------
    struct Reputation {
        uint256 xp;
        uint256 level;
    }

    // -------------------------------------------------------
    // STATE VARIABLES
    // -------------------------------------------------------
    mapping(address => Reputation) private _reputation;
    address public storyNFTAddress; // Address of StoryNFT contract
    address public plagiarismCourt; // Address of PlagiarismCourt contract

    uint256 public constant XP_PER_LEVEL = 100; // XP needed to level up

    // -------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------
    constructor() Ownable(msg.sender) {}

    // -------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------
    modifier onlyAuthorized() {
        if (msg.sender != owner() && msg.sender != storyNFTAddress && msg.sender != plagiarismCourt) {
            revert UnauthorizedAccess();
        }
        _;
    }

    // -------------------------------------------------------
    // SETTERS
    // -------------------------------------------------------

    /// @notice Sets the linked StoryNFT contract
    function setStoryNFTAddress(address _addr) external onlyOwner {
        if (_addr == address(0)) revert InvalidAddress();
        storyNFTAddress = _addr;
    }

    /// @notice Sets the linked PlagiarismCourt contract
    function setPlagiarismCourtAddress(address _addr) external onlyOwner {
        if (_addr == address(0)) revert InvalidAddress();
        plagiarismCourt = _addr;
    }

    // -------------------------------------------------------
    // CORE FUNCTIONS
    // -------------------------------------------------------

    /**
     * @notice Adds XP to a user's reputation.
     * @param user Address of the user to reward.
     * @param amount Amount of XP to add.
     */
    function addXP(address user, uint256 amount) external onlyAuthorized {
        if (user == address(0)) revert InvalidAddress();
        _reputation[user].xp += amount;

        // Level up if XP exceeds threshold
        while (_reputation[user].xp >= XP_PER_LEVEL * (_reputation[user].level + 1)) {
            _reputation[user].level++;
            emit LevelUp(user, _reputation[user].level);
        }

        emit XPAdded(user, amount);
    }

    /**
     * @notice Reduces XP from a user's reputation.
     * @param user Address of the user to penalize.
     * @param amount Amount of XP to reduce.
     */
    function reduceXP(address user, uint256 amount) external onlyAuthorized {
        if (user == address(0)) revert InvalidAddress();
        if (_reputation[user].xp < amount) revert InsufficientXP();

        _reputation[user].xp -= amount;
        emit XPReduced(user, amount);
    }

    // -------------------------------------------------------
    // GETTERS
    // -------------------------------------------------------

    /// @notice Returns user's XP and Level
    function getReputation(address user) external view returns (uint256 xp, uint256 level) {
        Reputation memory rep = _reputation[user];
        return (rep.xp, rep.level);
    }

    /// @notice Returns XP of a user
    function getXP(address user) external view returns (uint256) {
        return _reputation[user].xp;
    }

    /// @notice Returns Level of a user
    function getLevel(address user) external view returns (uint256) {
        return _reputation[user].level;
    }
}
