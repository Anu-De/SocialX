document.getElementById('post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const caption = document.getElementById('caption').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Post created successfully!');
            // Redirect to profile page after successful post creation
            window.location.href = '/profile.html';
        } else {
            alert('Failed to create post.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the post.');
    }
});
