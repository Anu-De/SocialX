document.getElementById('connectButton').onclick = async () => {
  console.log('Connect button clicked');

  if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is available');
      try {
          // Request account access if needed
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Accounts:', accounts);

          // We use ethers.js to create a provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log('Provider created:', provider);

          // Get the signer
          const signer = provider.getSigner();
          console.log('Signer:', signer);

          // Get the user's Ethereum address
          const address = await signer.getAddress();
          console.log('Connected address:', address);

          // Display the address or perform any other action you need
          document.getElementById('walletAddress').innerText = 'Connected address: ' + address;
      } catch (error) {
          console.error('Error connecting to MetaMask:', error);
      }
  } else {
      console.error('MetaMask is not installed!');
      alert('Please install MetaMask!');
  }
};