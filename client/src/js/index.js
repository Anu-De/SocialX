import Web3 from 'web3';
import { uploadToIPFS } from './ipfs.js';
import PostContractABI from './PostContractABI.json';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
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
