// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StoryNFT
 * @dev ERC721-based contract for publishing decentralized stories stored on IPFS/Arweave,
 *      linked with an Avail DA hash for proof of publication.
 *      Integrated with PlagiarismCourt and Reputation system.
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract StoryNFT is ERC721, ERC721URIStorage, ERC2981, Ownable {
    // -------------------------
    // Custom Errors
    // -------------------------
    error TokenDoesNotExist(); // Token ID does not exist
    error NotAuthor(); // Caller is not the author of the story
    error OnlyPlagiarismCourt(); // Unauthorized contract tries to call court functions
    error OnlyReputationContract(); // Unauthorized contract tries to call reputation functions

    // -------------------------
    // Enums and Structs
    // -------------------------
    enum ReadStatus {
        NotStarted,
        Reading,
        Finished
    }

    struct StoryMeta {
        string metadataURI;
        bytes32 availHash;
        address author;
        uint256 createdAt;
        bool flagged;
    }

    // -------------------------
    // State Variables
    // -------------------------
    uint256 private _nextTokenId;
    mapping(uint256 => StoryMeta) private _stories;
    mapping(uint256 => mapping(address => ReadStatus)) private _readStatus;

    address public plagiarismCourt;
    address public reputationContract;

    // -------------------------
    // Events
    // -------------------------
    event StoryMinted(
        uint256 indexed storyId,
        address indexed author,
        string metadataURI,
        bytes32 availHash
    );
    event StoryURIUpdated(
        uint256 indexed storyId,
        string oldURI,
        string newURI
    );
    event StoryFlagged(uint256 indexed storyId, address indexed reporter);
    event StoryResolved(uint256 indexed storyId, bool isGuilty);
    event StoryReadStatusUpdated(
        uint256 indexed storyId,
        address indexed reader,
        ReadStatus status
    );
    event StoryXPRecorded(
        uint256 indexed storyId,
        address indexed author,
        uint256 xp
    );
    event StoryBurned(uint256 indexed storyId, address indexed burner);

    // -------------------------
    // Constructor
    // -------------------------
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyReceiver,
        uint96 _royaltyFeeNumerator
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        _nextTokenId = 1;

        if (_royaltyReceiver != address(0)) {
            _setDefaultRoyalty(_royaltyReceiver, _royaltyFeeNumerator);
        }
    }

    // -------------------------
    // Modifiers
    // -------------------------
    modifier onlyPlagiarismCourt() {
        if (msg.sender != plagiarismCourt) revert OnlyPlagiarismCourt();
        _;
    }

    modifier onlyReputationContract() {
        if (msg.sender != reputationContract) revert OnlyReputationContract();
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        if (ownerOf(tokenId) == address(0)) revert TokenDoesNotExist();
        _;
    }

    // -------------------------
    // Admin Setters
    // -------------------------

    /// @notice Sets the address of the PlagiarismCourt contract
    function setPlagiarismCourt(address _court) external onlyOwner {
        plagiarismCourt = _court;
    }

    /// @notice Sets the address of the Reputation contract
    function setReputationContract(
        address _reputationContract
    ) external onlyOwner {
        reputationContract = _reputationContract;
    }

    /// @notice Sets the default royalty information
    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /// @notice Deletes the default royalty information
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    // -------------------------
    // Minting and Metadata
    // -------------------------

    /**
     * @dev Allows an author to mint a new story NFT
     * @param metadataURI URI of story metadata stored on IPFS or Arweave
     * @param availHash Commitment hash from Avail DA node confirming data publication
     * @return tokenId ID of the newly minted story NFT
     */
    function mintStory(
        string memory metadataURI,
        bytes32 availHash
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        _stories[tokenId] = StoryMeta({
            metadataURI: metadataURI,
            availHash: availHash,
            author: msg.sender,
            createdAt: block.timestamp,
            flagged: false
        });

        _setTokenURI(tokenId, metadataURI);

        emit StoryMinted(tokenId, msg.sender, metadataURI, availHash);
        return tokenId;
    }

    /**
     * @dev Allows the author to update the story URI in case of revision
     * @param tokenId ID of the story
     * @param newURI New metadata URI to be updated
     */
    function updateStoryURI(
        uint256 tokenId,
        string calldata newURI
    ) external tokenExists(tokenId) {
        if (ownerOf(tokenId) != msg.sender) revert NotAuthor();

        string memory oldURI = _stories[tokenId].metadataURI;
        _stories[tokenId].metadataURI = newURI;
        _setTokenURI(tokenId, newURI);

        emit StoryURIUpdated(tokenId, oldURI, newURI);
    }

    // -------------------------
    // Plagiarism Court Integration
    // -------------------------

    /**
     * @dev Flags a story as plagiarized
     * @param tokenId ID of the story being flagged
     * @param reporter Address that reported the plagiarism
     */
    function flagStory(
        uint256 tokenId,
        address reporter
    ) external onlyPlagiarismCourt tokenExists(tokenId) {
        _stories[tokenId].flagged = true;
        emit StoryFlagged(tokenId, reporter);
    }

    /**
     * @dev Resolves a flagged story
     * @param tokenId ID of the story
     * @param isGuilty True if plagiarism confirmed, false if cleared
     */
    function resolveStory(
        uint256 tokenId,
        bool isGuilty
    ) external onlyPlagiarismCourt tokenExists(tokenId) {
        _stories[tokenId].flagged = false;
        emit StoryResolved(tokenId, isGuilty);
    }

    /**
     * @dev Allows author or owner to burn a story NFT
     * @param tokenId ID of the story to burn
     */
    function burnStory(uint256 tokenId) external tokenExists(tokenId) {
        if (ownerOf(tokenId) != msg.sender && owner() != msg.sender)
            revert NotAuthor();

        // Clear story data
        delete _stories[tokenId];

        // Burn the NFT
        _burn(tokenId);

        emit StoryBurned(tokenId, msg.sender);
    }

    // -------------------------
    // Reputation Integration
    // -------------------------

    /**
     * @dev Records XP for a story's author after verification from Reputation contract
     * @param tokenId ID of the story
     * @param xp Amount of XP awarded
     */
    function recordXP(
        uint256 tokenId,
        uint256 xp
    ) external onlyReputationContract tokenExists(tokenId) {
        address author = _stories[tokenId].author;
        emit StoryXPRecorded(tokenId, author, xp);
    }

    // -------------------------
    // Reader Progress Tracking
    // -------------------------

    /**
     * @dev Allows a reader to update their reading status
     * @param tokenId ID of the story
     * @param status Reading status of the reader
     */
    function setReadStatus(
        uint256 tokenId,
        ReadStatus status
    ) external tokenExists(tokenId) {
        _readStatus[tokenId][msg.sender] = status;
        emit StoryReadStatusUpdated(tokenId, msg.sender, status);
    }

    /// @notice Returns the reading status of a reader for a given story
    function getReadStatus(
        uint256 tokenId,
        address reader
    ) external view tokenExists(tokenId) returns (ReadStatus) {
        return _readStatus[tokenId][reader];
    }

    /// @notice Returns the author of a story
    function getAuthor(
        uint256 tokenId
    ) external view tokenExists(tokenId) returns (address) {
        return _stories[tokenId].author;
    }

    /// @notice Returns the Avail DA hash of a story
    function getAvailHash(
        uint256 tokenId
    ) external view tokenExists(tokenId) returns (bytes32) {
        return _stories[tokenId].availHash;
    }

    /// @notice Returns the metadata URI of a story
    function getMetadataURI(
        uint256 tokenId
    ) external view tokenExists(tokenId) returns (string memory) {
        return _stories[tokenId].metadataURI;
    }

    /// @notice Returns whether a story is flagged for plagiarism
    function isFlagged(
        uint256 tokenId
    ) external view tokenExists(tokenId) returns (bool) {
        return _stories[tokenId].flagged;
    }

    /// @notice Returns the creation timestamp of a story
    function getCreatedAt(
        uint256 tokenId
    ) external view tokenExists(tokenId) returns (uint256) {
        return _stories[tokenId].createdAt;
    }

    // -------------------------
    // Overrides
    // -------------------------

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId ID of the token to query
     * @return URI string for the token
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Checks if the contract supports an interface
     * @param interfaceId Interface ID to check
     * @return bool indicating interface support
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
