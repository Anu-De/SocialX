document.getElementById('post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('caption', document.getElementById('caption').value);
    formData.append('image', document.getElementById('image').files[0]);
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Post created successfully!');
            // Reset form or redirect user
            document.getElementById('post-form').reset();
        } else {
            alert('Failed to create post.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the post.');
    }
});

