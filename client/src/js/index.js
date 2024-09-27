import Web3 from 'web3';
import { uploadToIPFS } from './ipfs.js';
// import PostContractABI from '';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const PostContractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "author",
          "type": "address"
        }
      ],
      "name": "PostCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "postCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "posts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "createPost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPosts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "author",
              "type": "address"
            }
          ],
          "internalType": "struct PostContract.Post[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_author",
          "type": "address"
        }
      ],
      "name": "getPostsByAuthor",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "author",
              "type": "address"
            }
          ],
          "internalType": "struct PostContract.Post[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS';
const postContract = new web3.eth.Contract(PostContractABI, contractAddress);

document.addEventListener('DOMContentLoaded', function () {
    const postButton = document.getElementById('postButton');
    const postContent = document.getElementById('postContent');
    const postList = document.getElementById('postList');

    postButton.addEventListener('click', async function () {
        const content = postContent.value.trim();
        
        if (content) {
            const ipfsHash = await uploadToIPFS(content);
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            
            postContract.methods.createPost(content, ipfsHash).send({ from: account })
                .on('receipt', function (receipt) {
                    console.log('Post created', receipt);
                    postContent.value = ''; // Clear the textarea
                    addPost(content, ipfsHash); // Add the post to the UI
                });
        }
    });

    async function fetchPosts() {
        const posts = await postContract.methods.getPosts().call();
        posts.forEach((post) => {
            renderPost(post);
        });
    }

    async function fetchMyPosts() {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const posts = await postContract.methods.getPostsByAuthor(account).call();
        posts.forEach((post) => {
            renderPost(post);
        });
    }

    function addPost(content, ipfsHash) {
        const post = {
            content,
            ipfsHash,
            author: 'User Name'
        };
        renderPost(post);
    }

    function renderPost(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.author}</h3>
            <p>${post.content}</p>
            <a href="https://ipfs.io/ipfs/${post.ipfsHash}" target="_blank">View on IPFS</a>
            <div class="actions">
                <button class="like-button">Like</button>
                <button class="comment-button">Comment</button>
                <button class="share-button">Share</button>
                <button class="tag-button">Tag</button>
            </div>
        `;

        postList.prepend(postDiv);
    }

    fetchPosts();
    fetchMyPosts();
});
