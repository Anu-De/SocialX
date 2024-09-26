import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function uploadToIPFS(content) {
    const { path } = await ipfs.add(content);
    return path;
}

export { uploadToIPFS };
