document.addEventListener('DOMContentLoaded', async () => {
    const profileData = {
        profilePicture: './src/images/bg1.jpg',
        name: 'John Doe',
        bio: 'Web Developer | Tech Enthusiast | Blogger'
    };

    document.getElementById('profile-picture').src = profileData.profilePicture;
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-bio').textContent = profileData.bio;

    // Fetch posts from the server
    try {
        const response = await fetch('/api/posts');
        if (response.ok) {
            const posts = await response.json();

            // Update posts count
            document.getElementById('posts-number').textContent = posts.length;

            const postsContainer = document.getElementById('profile-posts');
            postsContainer.innerHTML = ''; // Clear existing posts

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.dataset.index = index;
                
                const img = document.createElement('img');
                img.src = post.imagePath;
                
                postElement.appendChild(img);
                postsContainer.appendChild(postElement);

                // Add right-click event listener
                postElement.addEventListener('contextmenu', async (event) => {
                    event.preventDefault();
                    const confirmed = confirm('Are you sure you want to delete this post?');
                    if (confirmed) {
                        try {
                            const deleteResponse = await fetch(`/api/posts/${index}`, {
                                method: 'DELETE'
                            });

                            if (deleteResponse.ok) {
                                alert('Post deleted successfully!');
                                // Remove the post element from the DOM
                                postElement.remove();
                                // Update posts count
                                document.getElementById('posts-number').textContent = postsContainer.children.length;
                            } else {
                                alert('Failed to delete post.');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            alert('An error occurred while deleting the post.');
                        }
                    }
                });
            });
        } else {
            console.error('Failed to fetch posts.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
