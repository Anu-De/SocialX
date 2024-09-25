document.addEventListener('DOMContentLoaded', function () {
    const postList = document.getElementById('postList');
    const postButton = document.getElementById('postButton');
    const postContent = document.getElementById('postContent');
    const profileNav = document.getElementById('profileNav');
    const createPostNav = document.getElementById('createPostNav');
    const profileNavSidebar = document.getElementById('profileNavSidebar');

    profileNav.addEventListener('click', () => {
        window.location.href = '/profile';
    });
    profileNavSidebar.addEventListener('click', () => {
        window.location.href = '/profile';
    });

    createPostNav.addEventListener('click', () => {
        window.location.href = '/createPost';
    });

    postButton.addEventListener('click', function () {
        const content = postContent.value.trim();
        const imageUrl = '/public/uploads/1727289109456.jpg'; // Replace with actual image path
        if (content) {
            addPost(content, imageUrl);
            postContent.value = ''; // Clear the textarea
        }
    });

    function fetchPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach((post) => {
            renderPost(post);
        });
    }

    function addPost(content, imageUrl) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const newPost = { id: Date.now(), username: 'User Name', content, imageUrl };
        posts.unshift(newPost); // Add new post at the beginning
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPost(newPost);
    }

    function renderPost(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.setAttribute('data-id', post.id);
        postDiv.innerHTML = `
            <h3>${post.username}</h3>
            <p>${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
            <div class="actions">
                <button class="like-button">Like</button>
                <button class="comment-button">Comment</button>
                <button class="share-button">Share</button>
                <button class="tag-button">Tag</button>
                <button class="delete-button">Delete</button>
            </div>
            <div class="comments"></div>
            <div class="tag-input" style="display:none;">
                <input type="text" placeholder="Tag a user..." class="tag-user">
                <button class="tag-submit">Tag</button>
            </div>
        `;

        postList.prepend(postDiv); // Add new post at the top

        postDiv.querySelector('.like-button').addEventListener('click', function () {
            alert('You liked this post!');
        });

        postDiv.querySelector('.comment-button').addEventListener('click', function () {
            const comment = prompt("Enter your comment:");
            if (comment) {
                const commentDiv = document.createElement('div');
                commentDiv.textContent = comment;
                postDiv.querySelector('.comments').appendChild(commentDiv);
            }
        });

        postDiv.querySelector('.share-button').addEventListener('click', function () {
            alert('Post shared!');
        });

        postDiv.querySelector('.tag-button').addEventListener('click', function () {
            const tagInput = postDiv.querySelector('.tag-input');
            tagInput.style.display = tagInput.style.display === 'none' ? 'block' : 'none';
        });

        postDiv.querySelector('.tag-submit').addEventListener('click', function () {
            const tagUser = postDiv.querySelector('.tag-user').value.trim();
            if (tagUser) {
                const tagDiv = document.createElement('div');
                tagDiv.textContent = `Tagged: ${tagUser}`;
                postDiv.querySelector('.comments').appendChild(tagDiv);
                postDiv.querySelector('.tag-user').value = ''; // Clear the input
                postDiv.querySelector('.tag-input').style.display = 'none'; // Hide the input
            }
        });

        postDiv.querySelector('.delete-button').addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this post?')) {
                postList.removeChild(postDiv);
                removePostFromStorage(post.id);
            }
        });
    }

    function removePostFromStorage(postId) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    fetchPosts();
});
