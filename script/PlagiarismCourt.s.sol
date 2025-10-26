// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PlagiarismCourt.sol";
import "../src/StoryNFT.sol";

/**
 * @title DeployPlagiarismCourt
 * @dev Foundry deployment script for PlagiarismCourt, dependent on StoryNFT.
 *
 * Run using:
 * forge script script/DeployPlagiarismCourt.s.sol --rpc-url <NETWORK_URL> --private-key <PRIVATE_KEY> --broadcast
 */
contract DeployPlagiarismCourt is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy StoryNFT first (since PlagiarismCourt needs its address)
        StoryNFT storyNFT = new StoryNFT("QuillNode Stories", "QNS", msg.sender, 500);

        // Step 2: Deploy PlagiarismCourt with the StoryNFT address
        PlagiarismCourt court = new PlagiarismCourt(address(storyNFT));

        // Step 3: Log the addresses for reference
        console.log("StoryNFT deployed at:", address(storyNFT));
        console.log("PlagiarismCourt deployed at:", address(court));

        vm.stopBroadcast();
    }
}
