// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registration.sol"; // Importing Registration contract
import "./Voting.sol"; // Importing Voting contract for community-based deletions

contract Create {

    Registration registrationContract; // Instance of the registration contract

    struct Post {
        uint256 postID;
        address author;           // User address
        string content;          // Post content
        string photo;            // Photo URL or IPFS hash
        uint256 likes;           // Count of likes
        uint256 timestamp;       // Time of creation
        bool exists;             // Check if post exists
    }

    mapping(uint256 => Post) public posts;  // Mapping of postID to Post
    mapping(address => uint256[]) public userPosts; // User's posts
    uint256 public postCount = 0; // To track the number of posts

    event PostCreated(uint256 indexed postID, address indexed author, string content);
    event PostLiked(uint256 indexed postID, address indexed user);
    event PostDeleted(uint256 indexed postID);

    constructor(address _registrationContract) {
        registrationContract = Registration(_registrationContract);
    }

    modifier onlyRegistered() {
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "You must be registered to create content");
        _;
    }

    // Function to create a post with optional photo
    function createPost(string memory _content, string memory _photo) public onlyRegistered {
        postCount++;
        posts[postCount] = Post(postCount, msg.sender, _content, _photo, 0, block.timestamp, true);
        userPosts[msg.sender].push(postCount);

        emit PostCreated(postCount, msg.sender, _content);
    }

    // Function to like a post
    function likePost(uint256 _postID) public onlyRegistered {
        require(posts[_postID].exists, "Post does not exist");
        posts[_postID].likes++;

        emit PostLiked(_postID, msg.sender);
    }

    // Function to delete a post by the author
    function deletePost(uint256 _postID) public {
        require(posts[_postID].exists, "Post does not exist");
        require(posts[_postID].author == msg.sender, "Only the author can delete this post");

        delete posts[_postID];
        emit PostDeleted(_postID);
    }

    // Function to create a proposal for community deletion of a post
    function createDeletionProposal(uint256 _postID) public onlyRegistered {
        require(posts[_postID].exists, "Post does not exist");
            require(msg.sender == admin || isCommunityApproved(_postID), "Not authorized to delete the post");
            delete posts[_postID];
    }

    function isCommunityApproved(uint256 _postID) internal view returns (bool) {
    // Implement your logic for community approval
    return true; // Placeholder - replace with actual logic
}

// Function to get post details by postID
    function getPost(uint256 _postID) public view returns (Post memory) {
    require(posts[_postID].exists, "Post does not exist");
    return posts[_postID];
    }

// Function to get posts created by a specific user
    function getUserPosts(address _user) public view returns (uint256[] memory) {
    return userPosts[_user];
    }

// Function to get the total number of posts
    function getTotalPosts() public view returns (uint256) {
    return postCount;
    }

}
