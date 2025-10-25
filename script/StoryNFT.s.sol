// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/StoryNFT.sol"; // Import your contract

/**
 * @title DeployStoryNFT
 * @dev Foundry deployment script for StoryNFT contract.
 *
 * Run using:
 * forge script script/DeployStoryNFT.s.sol --rpc-url <NETWORK_URL> --private-key <PRIVATE_KEY> --broadcast
 */
contract DeployStoryNFT is Script {
    function run() external {
        // For local testing with Anvil, we can use a default private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        // Start broadcasting (sends transactions on-chain)
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        StoryNFT storyNFT = new StoryNFT(
            "QuillNode Stories",
            "QNS",
            msg.sender,
            500
        );

        // Log contract address for confirmation
        console.log("StoryNFT deployed at:", address(storyNFT));

        vm.stopBroadcast();
    }
}
