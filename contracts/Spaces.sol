// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRegistration {
    function getUserDetails(address _user) external view returns (
        uint256 uniqueID, 
        string memory username, 
        string memory firstName, 
        string memory lastName, 
        uint256 age
    );
}

interface IVoting {
    function startProposal(uint256 communityId, uint256 requiredVotePercentage, address proposer, address member, string memory role) external;
    function isProposalApproved(uint256 communityId, address member) external view returns (bool);
}

contract Spaces {

    IRegistration public registrationContract;
    IVoting public votingContract;

    struct Community {
        uint256 id;
        string name;
        address admin;
        mapping(address => bool) members;
        mapping(address => string) roles;
    }

    uint256 public communityCounter;
    mapping(uint256 => Community) public communities;
    mapping(address => uint256[]) public userCommunities; 

    event CommunityCreated(uint256 indexed communityId, string name, address indexed admin);
    event UserJoinedCommunity(uint256 indexed communityId, address indexed user);
    event RoleAssigned(uint256 indexed communityId, address indexed user, string role);

    constructor(address _registrationContract, address _votingContract) {
        registrationContract = IRegistration(_registrationContract);
        votingContract = IVoting(_votingContract);
    }

    // Modifier to check if the user is registered
    modifier onlyRegistered() {
        (uint256 uniqueID, , , , ) = registrationContract.getUserDetails(msg.sender);
        require(uniqueID != 0, "You must be registered.");
        _;
    }

    // Create a community
    function createCommunity(string memory _name) public onlyRegistered {
        communityCounter++;
        Community storage newCommunity = communities[communityCounter];
        newCommunity.id = communityCounter;
        newCommunity.name = _name;
        newCommunity.admin = msg.sender;
        newCommunity.members[msg.sender] = true;
        newCommunity.roles[msg.sender] = "Admin";

        userCommunities[msg.sender].push(communityCounter);

        emit CommunityCreated(communityCounter, _name, msg.sender);
    }

    // Join a community
    function joinCommunity(uint256 _communityId) public onlyRegistered {
        require(communities[_communityId].id != 0, "Community does not exist.");
        require(!communities[_communityId].members[msg.sender], "You are already a member.");

        communities[_communityId].members[msg.sender] = true;
        userCommunities[msg.sender].push(_communityId);

        emit UserJoinedCommunity(_communityId, msg.sender);
    }

    // Propose role assignment
    function proposeRoleAssignment(uint256 _communityId, address _member, string memory _role, uint256 _requiredVotePercentage) public onlyRegistered {
        Community storage community = communities[_communityId];
        require(msg.sender == community.admin, "Only the admin can propose role assignments.");
        require(community.members[_member], "User is not a member of the community.");

        votingContract.startProposal(_communityId, _requiredVotePercentage, msg.sender, _member, _role);
    }

    // Assign role after successful vote
    function assignRole(uint256 _communityId, address _member, string memory _role) public {
        require(votingContract.isProposalApproved(_communityId, _member), "Proposal for role assignment not approved.");
        communities[_communityId].roles[_member] = _role;

        emit RoleAssigned(_communityId, _member, _role);
    }

    // Other functions remain unchanged...
}
