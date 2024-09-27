// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IRegistration {
    function getUserDetails(address _user) external view returns (
        uint256 uniqueID, 
        string memory username, 
        string memory firstName, 
        string memory lastName, 
        uint256 age
    );
}

interface ICreate {
    function getUserPosts(address _user) external view returns (uint256[] memory);
}

contract Profile {
    IRegistration public registrationContract;
    ICreate public createContract;

    struct UserProfile {
        address userAddress;  // User's Ethereum address
        string bio;           // User bio
        string profilePicture; // URL for the user's profile picture
        bool exists;          // Check if profile exists
    }

    mapping(address => UserProfile) public profiles; // Address to UserProfile mapping

    event ProfileUpdated(address indexed user, string bio, string profilePicture);

    constructor(address _registrationContract, address _createContract) {
        registrationContract = IRegistration(_registrationContract);
        createContract = ICreate(_createContract);
    }

    // Modifier to check if the user is registered
    modifier onlyRegistered() {
        (uint256 uniqueID, , , , ) = registrationContract.getUserDetails(msg.sender);
        require(uniqueID != 0, "User must be registered.");
        _;
    }

    // Function to create or update a user profile
    function setProfile(string memory _bio, string memory _profilePicture) public onlyRegistered {
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

    // Function to get user's core details from the Registration contract
    function getUserDetails(address _user) public view returns (string memory, string memory) {
        ( , string memory username, , , ) = registrationContract.getUserDetails(_user);
        return (username, profiles[_user].profilePicture);
    }

    // Function to get user's posts from the Create contract
    function getUserPosts() public view onlyRegistered returns (uint256[] memory) {
        return createContract.getUserPosts(msg.sender);
    }
}
