document.getElementById('post-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const caption = document.getElementById('caption').value;
    const imageFile = document.getElementById('image').files[0];

    if (!caption || !imageFile) {
        alert('Caption and image are required.');
        return;
    }

    // Initialize ethers.js
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = 'YOUR_CONTRACT_ADDRESS';
        const abi = [
            // Add the ABI of your CreatePost contract here
        ];

        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            // Upload the image to IPFS
            const imageURL = await uploadFileToIPFS(imageFile);
            // Upload metadata (caption and image URL) to IPFS
            const metadataURL = await uploadMetadataToIPFS(caption, imageURL);

            // Create a new post with the metadata URL
            const tx = await contract.createPost(metadataURL, "");
            await tx.wait();
            alert('Post created successfully!');
            document.getElementById('post-form').reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create post: ' + error.message);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

async function uploadFileToIPFS(file) {
    const url = `https://ipfs.infura.io:5001/api/v0/add`;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa('1631ef03693c423985d085d6e876ab62:2i+vDDJeqctxdowM1syTjDc1Dh3bQgfe4QtpYFDU1/zeqT6vP62WCg')}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload file to IPFS');
    }

    const data = await response.json();
    return `https://ipfs.infura.io/ipfs/${data.Hash}`;
}

async function uploadMetadataToIPFS(caption, imageURL) {
    const url = `https://ipfs.infura.io:5001/api/v0/add`;
    const metadata = JSON.stringify({
        caption: caption,
        image: imageURL
    });

    const formData = new FormData();
    formData.append("file", new Blob([metadata], { type: 'application/json' }));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa('1631ef03693c423985d085d6e876ab62:2i+vDDJeqctxdowM1syTjDc1Dh3bQgfe4QtpYFDU1/zeqT6vP62WCg')}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS');
    }

    const data = await response.json();
    return `https://ipfs.infura.io/ipfs/${data.Hash}`;
}
