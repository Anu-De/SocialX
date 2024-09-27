document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Connect to Ethereum
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        alert("Please install MetaMask to use this dApp!");
    }

    const contractAddress = "0x79A4FADea0f7731b2bCAa71b91Cf2E1C33540dD4";
    const abi = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "uniqueID",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "UserRegistered",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "UserRemoved",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "UserUpdated",
          "type": "event"
        },
        {
          "stateMutability": "nonpayable",
          "type": "fallback"
        },
        {
          "inputs": [],
          "name": "admin",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userAddresses",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "isUserRegistered",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_firstName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_lastName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_email",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "newPassword",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "confirmPassword",
              "type": "string"
            }
          ],
          "name": "registerUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_firstName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_lastName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "newPassword",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "confirmPassword",
              "type": "string"
            }
          ],
          "name": "updateUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "removeUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "getUserDetails",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "uniqueID",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "firstName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "lastName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "password",
              "type": "string"
            }
          ],
          "name": "login",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ];

    const contract = new web3.eth.Contract(abi, contractAddress);

    // Register a new user
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const age = document.getElementById("age").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        try {
            await contract.methods.registerUser(username, firstName, lastName, age, email, password, confirmPassword).send({ from: account });
            alert("User registered successfully!");
        } catch (error) {
            console.error(error);
            alert("Error registering user.");
        }
    });

    // Login user
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const result = await contract.methods.login(username, password).call();
            if (result) {
                alert("Login successful!");
            } else {
                alert("Invalid username or password.");
            }
        } catch (error) {
            console.error(error);
            // alert("Error logging in.");
        }
    });
});
