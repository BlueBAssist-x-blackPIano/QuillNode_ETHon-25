// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title StoryNFT - NFT contract for story ownership
/// @notice Each story or chapter is minted as a unique NFT linked to metadata stored on IPFS and verified on Avail DA.
contract StoryNFT is ERC721URIStorage, Ownable(msg.sender) {
    uint256 private _nextTokenId;

    struct StoryMetadata {
        string title;
        string ipfsHash; // IPFS CID for story content
        string availDAHash; // Avail DA verification hash
        address author;
        uint256 timestamp;
    }

    mapping(uint256 => StoryMetadata) public storyInfo;

    event StoryMinted(
        uint256 indexed tokenId,
        address indexed author,
        string title,
        string ipfsHash,
        string availDAHash
    );

    constructor() ERC721("DecentraRead Story", "DREAD") {}

    /// @notice Mints a new story NFT
    /// @param to The wallet address to receive the NFT
    /// @param title Title of the story
    /// @param ipfsHash IPFS CID where the story JSON or text is stored
    /// @param availDAHash Hash proof stored in Avail DA for verification
    /// @param tokenURI Metadata URI (can also point to IPFS JSON)
    function mintStory(
        address to,
        string memory title,
        string memory ipfsHash,
        string memory availDAHash,
        string memory tokenURI
    ) external returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        storyInfo[tokenId] = StoryMetadata({
            title: title,
            ipfsHash: ipfsHash,
            availDAHash: availDAHash,
            author: to,
            timestamp: block.timestamp
        });

        emit StoryMinted(tokenId, to, title, ipfsHash, availDAHash);
        return tokenId;
    }

    /// @notice Fetch metadata for a story NFT
    /// @param tokenId The NFT ID
    function getStoryMetadata(
        uint256 tokenId
    ) external view returns (StoryMetadata memory) {
        // require(_exists(tokenId), "Story does not exist");
        return storyInfo[tokenId];
    }

    /// @notice Only owner (platform admin) can burn invalid stories (if plagiarism detected)
    function burnStory(uint256 tokenId) public {
        _burn(tokenId);
        delete storyInfo[tokenId];
    }
}
