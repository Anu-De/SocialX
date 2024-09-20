import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { gapi } from 'gapi-script';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Login = ({ setUser }) => {
  const [web3, setWeb3] = useState(null);
  
  // Google Client ID
  const googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
  
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: googleClientId,
        scope: 'email',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setUser({ address: accounts[0] });
      } catch (error) {
        console.error("MetaMask login failed:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const handleGoogleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(googleUser => {
      const profile = googleUser.getBasicProfile();
      setUser({ name: profile.getName(), email: profile.getEmail() });
    }).catch(error => {
      console.error("Google login failed:", error);
    });
  };

  const handleFacebookLogin = (response) => {
    if (response.status !== 'unknown') {
      setUser({ name: response.name, email: response.email });
    } else {
      console.error("Facebook login failed:", response);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <button onClick={handleMetaMaskLogin}>Login with MetaMask</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <FacebookLogin
        appId="YOUR_FACEBOOK_APP_ID"
        autoLoad={false}
        callback={handleFacebookLogin}
        render={renderProps => (
          <button onClick={renderProps.onClick}>Login with Facebook</button>
        )}
      />
    </div>
  );
};

export default Login;
