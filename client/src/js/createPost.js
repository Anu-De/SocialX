document.getElementById('post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const caption = document.getElementById('caption').value;
    const imageFile = document.getElementById('image').files[0];
    
    if (!caption || !imageFile) {
        alert('Caption and image are required.');
        return;
    }
    
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            alert('Post created successfully!');
            document.getElementById('post-form').reset();
        } else {
            const errorText = await response.text();
            console.error('Error:', errorText);
            alert('Failed to create post: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the post.');
    }
});
