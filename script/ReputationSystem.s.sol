// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/ReputationSystem.sol";

/**
 * @title DeployReputationSystem
 * @notice Deployment script for the ReputationSystem contract.
 */
contract DeployReputationSystem is Script {
    function run() external {
        // Start broadcasting transactions (from private key in .env)
        vm.startBroadcast();

        // Deploy the ReputationSystem contract
        ReputationSystem reputationSystem = new ReputationSystem();

        // Log contract address for convenience
        console.log("ReputationSystem deployed at:", address(reputationSystem));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
