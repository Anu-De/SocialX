// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PostContract {
    struct Post {
        uint id;
        string content;
        string ipfsHash;
        address author;
    }

    Post[] public posts;
    uint public postCount;

    event PostCreated(uint id, string content, string ipfsHash, address author);

    function createPost(string memory _content, string memory _ipfsHash) public {
        postCount++;
        posts.push(Post(postCount, _content, _ipfsHash, msg.sender));
        emit PostCreated(postCount, _content, _ipfsHash, msg.sender);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getPostsByAuthor(address _author) public view returns (Post[] memory) {
        uint count = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].author == _author) {
                count++;
            }
        }

        Post[] memory result = new Post[](count);
        uint index = 0;
        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].author == _author) {
                result[index] = posts[i];
                index++;
            }
        }
        return result;
    }
}
