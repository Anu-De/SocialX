// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registration {
    struct User {
        uint256 uniqueID;
        string username;
        string firstName;
        string lastName;
        uint256 dateOfBirth; // Store as timestamp
        bool isRegistered;
    }

    mapping(address => User) private users;
    mapping(string => address) private usernames; // Mapping for unique usernames
    mapping(bytes32 => bool) private emailHashes; // Mapping to track unique email hashes
    address public admin;
    address[] public userAddresses; // Store user addresses for easy access

    event UserRegistered(address indexed userAddress, uint256 uniqueID, string username);
    event UserRemoved(address indexed userAddress);

    constructor() {
        admin = msg.sender; // Admin is the contract deployer
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    function hashEmail(string memory email) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(email));
    }

    // Check if user is registered
    function isUserRegistered() public view returns (bool) {
        return users[msg.sender].isRegistered;
    }

    // Register a new user
    function registerUser(string memory _username,string memory _firstName,string memory _lastName,uint256 _dob,string memory _email) public {
        require(!users[msg.sender].isRegistered, "User is already registered");
        require(usernames[_username] == address(0), "Username already taken");

        bytes32 hashedEmail = hashEmail(_email);
        require(!emailHashes[hashedEmail], "Email already used");

        uint256 uniqueID = uint256(uint160(msg.sender)); // Use address as unique ID
        users[msg.sender] = User(uniqueID, _username, _firstName, _lastName, _dob, true);
        usernames[_username] = msg.sender;
        emailHashes[hashedEmail] = true; // Mark this email hash as used
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, uniqueID, _username);
    }

    // Update user profile
    function updateUser(string memory _username, string memory _firstName, string memory _lastName, uint256 _dob) public onlyRegistered {
        require(usernames[_username] == address(0) || usernames[_username] == msg.sender, "Username already taken by another user");

        users[msg.sender].username = _username;
        users[msg.sender].firstName = _firstName;
        users[msg.sender].lastName = _lastName;
        users[msg.sender].dateOfBirth = _dob;
    }

    // Admin-only user removal
    function removeUser(address userAddress) public onlyAdmin {
        require(users[userAddress].isRegistered, "User not registered");
        delete users[userAddress];
        emit UserRemoved(userAddress);
    }

    // Fetch a user's profile for UI
    function getUserDetails(address userAddress) public view returns (
        uint256 uniqueID, 
        string memory username, 
        string memory firstName, 
        string memory lastName, 
        uint256 dateOfBirth
    ) {
        require(users[userAddress].isRegistered, "User not registered");
        User memory user = users[userAddress];
        return (user.uniqueID, user.username, user.firstName, user.lastName, user.dateOfBirth);
    }

    // Fetch all registered users
    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }

    // Prevent accidental Ether transfers
    fallback() external {
        revert("This contract does not accept payments");
    }
}
