document.addEventListener('DOMContentLoaded', () => {
    const profileData = {
        profilePicture: './src/images/bg1.jpg',
        name: 'John Doe',
        bio: 'Web Developer | Tech Enthusiast | Blogger',
        stats: {
            posts: 150,
            followers: 300,
            following: 180
        },
        posts: [
            './src/images/bg1.jpg',
            './src/images/bg.webp',
            './src/images/1715106516343_processed.webp',
        ]
    };

    document.getElementById('profile-picture').src = profileData.profilePicture;
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-bio').textContent = profileData.bio;
    document.getElementById('posts-number').textContent = profileData.stats.posts;
    document.getElementById('followers-number').textContent = profileData.stats.followers;
    document.getElementById('following-number').textContent = profileData.stats.following;

    const postsContainer = document.getElementById('profile-posts');
    profileData.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        const img = document.createElement('img');
        img.src = post;
        postElement.appendChild(img);
        postsContainer.appendChild(postElement);
    });
});
