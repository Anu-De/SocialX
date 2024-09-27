// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registration.sol"; // Importing Registration contract
import "./Create.sol"; // Importing Create contract for posts

contract Profile {

    Registration public registrationContract; // Instance of the Registration contract
    Create public createContract; // Instance of the Create contract

    struct UserProfile {
        address userAddress; // User's Ethereum address
        string bio;          // User bio
        string profilePicture; // URL for the user's profile picture
        bool exists;         // Check if profile exists
    }

    mapping(address => UserProfile) public profiles; // Address to UserProfile mapping

    event ProfileUpdated(address indexed user, string bio, string profilePicture);
    
    constructor(address _registrationContract, address _createContract) {
        registrationContract = Registration(_registrationContract); // Set the Registration contract
        createContract = Create(_createContract); // Set the Create contract
    }

    // Function to create or update a user profile
    function setProfile(
        string memory _bio,
        string memory _profilePicture
    ) public {
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "User must be registered.");
        
        UserProfile storage profile = profiles[msg.sender];
        profile.userAddress = msg.sender;
        profile.bio = _bio;
        profile.profilePicture = _profilePicture;
        profile.exists = true;

        emit ProfileUpdated(msg.sender, _bio, _profilePicture);
    }

    // Function to get user profile details
    function getProfile(address _user) public view returns (UserProfile memory) {
        require(profiles[_user].exists, "Profile does not exist.");
        return profiles[_user];
    }

    // Function to get user's core details from Registration contract
    function getUserDetails(address _user) public view returns (string memory, string memory) {
        return registrationContract.getUserDetails(_user);
    }

    // Function to get user's posts
    function getUserPosts() public view returns (uint256[] memory) {
        return createContract.getUserPosts(msg.sender);
    }
}
