document.addEventListener('DOMContentLoaded', function () {
    const postList = document.getElementById('postList');
    const postButton = document.getElementById('postButton');
    const postContent = document.getElementById('postContent');

    postButton.addEventListener('click', function () {
        const content = postContent.value.trim();
        if (content) {
            addPost(content);
            postContent.value = ''; // Clear the textarea
        }
    });

    function addPost(content) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>User Name</h3>
            <p>${content}</p>
            <div class="actions">
                <button class="like-button">Like</button>
                <button class="comment-button">Comment</button>
                <button class="share-button">Share</button>
                <button class="tag-button">Tag</button>
            </div>
            <div class="comments"></div>
            <div class="tag-input" style="display:none;">
                <input type="text" placeholder="Tag a user..." class="tag-user">
                <button class="tag-submit">Tag</button>
            </div>
        `;

        postList.prepend(postDiv); // Add new post at the top

        // Attach like functionality
        postDiv.querySelector('.like-button').addEventListener('click', function () {
            alert('You liked this post!');
        });

        // Attach comment functionality
        postDiv.querySelector('.comment-button').addEventListener('click', function () {
            const comment = prompt("Enter your comment:");
            if (comment) {
                const commentDiv = document.createElement('div');
                commentDiv.textContent = comment;
                postDiv.querySelector('.comments').appendChild(commentDiv);
            }
        });

        // Attach share functionality
        postDiv.querySelector('.share-button').addEventListener('click', function () {
            alert('Post shared!');
        });

        // Attach tag functionality
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
    }
});