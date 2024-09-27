// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registration.sol"; // Importing Registration contract

contract Messages {

    Registration public registrationContract; // Instance of the Registration contract

    struct Message {
        address sender;     // Address of the sender
        address receiver;   // Address of the receiver
        bytes32 content;    // Hashed message content for privacy
        uint256 timestamp;  // Time when the message was sent
    }

    // Mapping to store messages between users
    mapping(address => mapping(address => Message[])) private messages; // sender => receiver => messages

    // Mapping to track the last message time for each user
    mapping(address => uint256) public lastMessageTime; 
    uint256 public messageCooldown = 5 seconds; // Cooldown time for sending messages

    // Mapping to store contacts for each user
    mapping(address => mapping(address => bool)) private contacts; // sender => receiver => added (true/false)
    
    // Event to notify when a contact is added or removed
    event ContactAdded(address indexed user, address indexed contact);
    event ContactRemoved(address indexed user, address indexed contact);

    event MessageSent(address indexed sender, address indexed receiver, bytes32 content, uint256 timestamp);

    constructor(address _registrationContract) {
        registrationContract = Registration(_registrationContract); // Set the Registration contract
    }

    // Function to send a message to another user
    function sendMessage(address _receiver, string memory _content) public {
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "You must be registered.");
        require(registrationContract.getUserDetails(_receiver) != (0, "", "", "", 0), "Receiver must be registered.");

        // Check if cooldown period has passed
        require(block.timestamp >= lastMessageTime[msg.sender] + messageCooldown, "Please wait before sending another message.");

        // Hashing the message content for privacy
        bytes32 hashedContent = keccak256(abi.encodePacked(_content));

        Message memory newMessage = Message({
            sender: msg.sender,
            receiver: _receiver,
            content: hashedContent, // Store the hashed content
            timestamp: block.timestamp
        });

        messages[msg.sender][_receiver].push(newMessage); // Store the message

        // Update the last message time
        lastMessageTime[msg.sender] = block.timestamp;

        emit MessageSent(msg.sender, _receiver, hashedContent, block.timestamp); // Emit an event for the sent message
    }

    // Function to get messages between sender and receiver
    function getMessages(address _receiver) public view returns (Message[] memory) {
        return messages[msg.sender][_receiver]; // Retrieve messages for the sender and receiver
    }

    // Function to get the last message time for a user
    function getLastMessageTime(address _user) public view returns (uint256) {
        return lastMessageTime[_user];
    }

    // Add a contact to the user's contact list
    function addContact(address _contact) public {
        require(registrationContract.getUserDetails(_contact) != (0, "", "", "", 0), "Contact must be a registered user.");
        require(!contacts[msg.sender][_contact], "This contact is already added.");

        contacts[msg.sender][_contact] = true;

        emit ContactAdded(msg.sender, _contact); // Emit event for adding contact
    }

    // Remove a contact from the user's contact list
    function removeContact(address _contact) public {
        require(contacts[msg.sender][_contact], "This contact is not in your contact list.");

        contacts[msg.sender][_contact] = false;

        emit ContactRemoved(msg.sender, _contact); // Emit event for removing contact
    }

    // Function to check if an address is a contact
    function isContact(address _user, address _contact) public view returns (bool) {
        return contacts[_user][_contact];
    }

    // Function to get sender details
    function getSenderDetails() public view returns (uint256, string memory, string memory, string memory, uint256) {
        return registrationContract.getUserDetails(msg.sender); // Get details of the sender
    }

    // Getter function to retrieve user details from Registration contract for the receiver
    function getReceiverDetails(address _receiver) public view returns (uint256, string memory, string memory, string memory, uint256) {
        return registrationContract.getUserDetails(_receiver); // Get details of the receiver
    }
}
