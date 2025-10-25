// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/StoryNFT.sol";

contract StoryNFTTest is Test {
    StoryNFT storyNFT;
    address writer = address(0x1);
    address reader = address(0x2);
    address developer = address(0x3);

    function setUp() public {
        storyNFT = new StoryNFT("QuillNode Stories", "QNS", developer, 500);
    }

    /// @notice Tests if a story can be minted by the writer
    function testMintStory() public {
        vm.startPrank(writer);
        uint256 storyId = storyNFT.mintStory(
            "ipfs://story1",
            bytes32("0xABC123")
        );
        vm.stopPrank();

        // Verify the owner of the story
        assertEq(storyNFT.ownerOf(storyId), writer);

        // Retrieve story metadata
        string memory uri = storyNFT.getMetadataURI(storyId);
        bytes32 availHash = storyNFT.getAvailHash(storyId);
        assertEq(uri, "ipfs://story1");
        assertEq(availHash, bytes32("0xABC123"));
    }

    /// @notice Tests if a reader can set reading status for a story
    function testSetReadingStatus() public {
        vm.startPrank(writer);
        uint256 storyId = storyNFT.mintStory(
            "ipfs://story1",
            bytes32("0xABC123")
        );
        vm.stopPrank();

        vm.startPrank(reader);
        storyNFT.setReadStatus(storyId, StoryNFT.ReadStatus.Reading); // 0 = Not Read, 1 = Reading, 2 = Finished
        vm.stopPrank();

        StoryNFT.ReadStatus status = storyNFT.getReadStatus(storyId, reader);
        assertTrue(status == StoryNFT.ReadStatus.Reading);
    }

    /// @notice Ensures only valid stories can be interacted with
    // function testRevertForInvalidStoryId() public {
    //     vm.expectRevert(StoryNFT.StoryDoesNotExist.selector);
    //     storyNFT.getStory(99);
    // }

    /// @notice Tests that a writer cannot mint a story with empty metadata
    function testRevertEmptyStory() public {
        vm.startPrank(writer);
        vm.expectRevert("Metadata URI cannot be empty");
        storyNFT.mintStory("", bytes32(0));
        vm.stopPrank();
    }
}
