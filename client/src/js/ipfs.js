const IPFS = require('ipfs-http-client');
const ipfs = IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function uploadToIPFS(content) {
    const { path } = await ipfs.add(content);
    return path;
}

export { uploadToIPFS };
