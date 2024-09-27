// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registration {
    struct User {
        uint256 uniqueID;
        string username;
        string firstName;
        string lastName;
        uint256 age;
        bool isRegistered;
        bytes32 passwordHash; // Store the hash of the password for security
    }

    mapping(address => User) private users;
    mapping(string => address) private usernames; // Mapping for unique usernames
    mapping(bytes32 => bool) private emailHashes; // Mapping to track unique email hashes
    address public admin;
    address[] public userAddresses; // Store user addresses for easy access

    event UserRegistered(address indexed userAddress, uint256 uniqueID, string username);
    event UserUpdated(address indexed userAddress, string username);
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

    function hashPassword(string memory password) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(password));
    }

    function hashEmail(string memory email) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(email));
    }

    // Check if user is registered
    function isUserRegistered() public view returns (bool) {
        return users[msg.sender].isRegistered;
    }

    // Register a new user
    function registerUser(
        string memory _username,
        string memory _firstName,
        string memory _lastName,
        uint256 _age,
        string memory _email,
        string memory newPassword,
        string memory confirmPassword
    ) public {
        require(!users[msg.sender].isRegistered, "User is already registered");
        require(usernames[_username] == address(0), "Username already taken");
        require(keccak256(abi.encodePacked(newPassword)) == keccak256(abi.encodePacked(confirmPassword)), "Passwords do not match");

        bytes32 hashedEmail = hashEmail(_email);
        require(!emailHashes[hashedEmail], "Email already used");

        uint256 uniqueID = uint256(uint160(msg.sender)); // Use address as unique ID
        bytes32 passwordHash = hashPassword(newPassword);

        users[msg.sender] = User(uniqueID, _username, _firstName, _lastName, _age, true, passwordHash);
        usernames[_username] = msg.sender;
        emailHashes[hashedEmail] = true; // Mark this email hash as used
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, uniqueID, _username);
    }

    // Update user profile
    function updateUser(
        string memory _username,
        string memory _firstName,
        string memory _lastName,
        uint256 _age,
        string memory newPassword,
        string memory confirmPassword
    ) public onlyRegistered {
        require(usernames[_username] == address(0) || usernames[_username] == msg.sender, "Username already taken by another user");
        require(keccak256(abi.encodePacked(newPassword)) == keccak256(abi.encodePacked(confirmPassword)), "Passwords do not match");

        users[msg.sender].username = _username;
        users[msg.sender].firstName = _firstName;
        users[msg.sender].lastName = _lastName;
        users[msg.sender].age = _age;
        users[msg.sender].passwordHash = hashPassword(newPassword);

        emit UserUpdated(msg.sender, _username);
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
        uint256 age
    ) {
        require(users[userAddress].isRegistered, "User not registered");
        User memory user = users[userAddress];
        return (user.uniqueID, user.username, user.firstName, user.lastName, user.age);
    }

    // // Fetch all registered users
    // function getAllUsers() public view returns (address[] memory) {
    //     return userAddresses;
    // }

    // Login with username and password
    function login(string memory _username, string memory password) public view returns (bool) {
        address userAddress = usernames[_username];
        require(userAddress != address(0), "User does not exist");
        require(users[userAddress].passwordHash == hashPassword(password), "Invalid password");
        return true; // Login successful
    }

    // Prevent accidental Ether transfers
    fallback() external {
        revert("This contract does not accept payments");
    }
}