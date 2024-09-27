// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Create {

    struct Post {
        uint256 postID;
        address author;           // User address
        string content;           // Post content
        string photo;             // Photo URL or IPFS hash
        uint256 likes;            // Count of likes
        uint256 timestamp;        // Time of creation
        bool exists;              // Check if post exists
    }

    mapping(uint256 => Post) public posts;  // Mapping of postID to Post
    mapping(address => uint256[]) public userPosts; // Mapping user's address to an array of post IDs
    uint256 public postCount = 0; // To track the number of posts

    event PostCreated(uint256 indexed postID, address indexed author, string content);
    event PostLiked(uint256 indexed postID, address indexed user);
    event PostDeleted(uint256 indexed postID);

    // Function to create a post with optional photo
    function createPost(string memory _content, string memory _photo) public {
        postCount++;
        posts[postCount] = Post(postCount, msg.sender, _content, _photo, 0, block.timestamp, true);
        userPosts[msg.sender].push(postCount);

        emit PostCreated(postCount, msg.sender, _content);
    }

    // Function to like a post
    function likePost(uint256 _postID) public {
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

    // Refactored function to get post details by postID
    function getPost(uint256 _postID) public view returns (
        uint256 postID,
        address author,
        string memory content,
        string memory photo,
        uint256 likes,
        uint256 timestamp
    ) {
        require(posts[_postID].exists, "Post does not exist");

        Post memory post = posts[_postID];
        return (
            post.postID,
            post.author,
            post.content,
            post.photo,
            post.likes,
            post.timestamp
        );
    }

    // Refactored function to get posts created by a specific user
     function getPostsByUser(address _user) public view returns (string[] memory contents, string[] memory photos) {
        uint256[] memory userPostIDs = userPosts[_user];
        uint256 numPosts = userPostIDs.length;

        // Initialize arrays to hold post contents and photos
        contents = new string[](numPosts);
        photos = new string[](numPosts);

        for (uint256 i = 0; i < numPosts; i++) {
            uint256 postID = userPostIDs[i];
            Post memory post = posts[postID];

            contents[i] = post.content;
            photos[i] = post.photo;
        }

        return (contents, photos);
    }

    // Function to get the total number of posts
    function getTotalPosts() public view returns (uint256) {
        return postCount;
    }

}
