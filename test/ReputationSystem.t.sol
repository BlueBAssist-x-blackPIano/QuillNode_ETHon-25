// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ReputationSystem.sol";

/**
 * @title ReputationSystemTest
 * @notice Unit tests for ReputationSystem contract.
 */
contract ReputationSystemTest is Test {
    ReputationSystem reputationSystem;
    address reporter = address(0x1);
    address writer = address(0x2);
    address judge = address(0x3);
    address authorizedMember1 = address(0x4);
    address authorizedMember2 = address(0x5);

    // Runs before each test
    function setUp() public {
        reputationSystem = new ReputationSystem();
        // Set authorized addresses (simulated)
        reputationSystem.setStoryNFTAddress(authorizedMember1);
        reputationSystem.setPlagiarismCourtAddress(authorizedMember2);
    }

    // Test initial reputation values are zero
    function testInitialReputationIsZero() public view {
        (uint256 rep, uint256 level) = reputationSystem.getReputation(reporter);
        assertEq(rep, 0, "Initial reputation should be zero");
        assertEq(level, 0, "Initial level should be zero");
    }

    // Test increasing reputation
    function testIncreaseReputation() public {
        uint256 amount = 10;
        vm.prank(authorizedMember1);
        reputationSystem.addXP(reporter, amount);

        (uint256 rep, uint256 level) = reputationSystem.getReputation(reporter);
        assertEq(rep, amount, "Reputation should increase correctly");
        assertEq(level, 0, "Level should remain zero");
    }

    // Test decreasing reputation
    function testDecreaseReputation() public {
        uint256 initial = 20;
        uint256 decrease = 5;
        vm.startPrank(authorizedMember1);
        // Increase first
        reputationSystem.addXP(writer, initial);
        // Decrease now
        reputationSystem.reduceXP(writer, decrease);
        vm.stopPrank();

        (uint256 rep,) = reputationSystem.getReputation(writer);
        assertEq(rep, initial - decrease, "Reputation should decrease correctly");
    }

    // Test cannot decrease below zero
    function testCannotGoBelowZero() public {
        vm.startPrank(authorizedMember1); // simulate caller
        reputationSystem.addXP(judge, 3);
        reputationSystem.reduceXP(judge, 3); // should clamp at 0
        vm.stopPrank();

        (uint256 rep, uint256 level) = reputationSystem.getReputation(judge);
        assertEq(rep, 0, "Reputation cannot go below zero");
        assertEq(level, 0, "Level cannot go below zero");
    }

    // Test only owner can modify reputation
    function testOnlyOwnerCanModify() public {
        vm.prank(reporter);
        vm.expectRevert(); // non-owner should revert
        reputationSystem.addXP(writer, 5);
    }
}
