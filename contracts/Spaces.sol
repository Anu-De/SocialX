// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registration.sol";
import "./Voting.sol";

contract Spaces {

    Registration public registrationContract;
    Voting public votingContract;

    struct Community {
        uint256 id;                   // Unique community ID
        string name;                  // Name of the community
        address admin;                // Community admin
        mapping(address => bool) members;  // Members of the community
        mapping(address => string) roles;  // User roles (Admin, Member, etc.)
    }

    uint256 public communityCounter;
    mapping(uint256 => Community) public communities;
    mapping(address => uint256[]) public userCommunities; // To track which communities a user belongs to

    event CommunityCreated(uint256 indexed communityId, string name, address indexed admin);
    event UserJoinedCommunity(uint256 indexed communityId, address indexed user);
    event RoleAssigned(uint256 indexed communityId, address indexed user, string role);

    constructor(address _registrationContract, address _votingContract) {
        registrationContract = Registration(_registrationContract);
        votingContract = Voting(_votingContract);
    }

    // Create a community
    function createCommunity(string memory _name) public {
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "You must be registered.");

        communityCounter++;
        Community storage newCommunity = communities[communityCounter];
        newCommunity.id = communityCounter;
        newCommunity.name = _name;
        newCommunity.admin = msg.sender;
        newCommunity.members[msg.sender] = true;
        newCommunity.roles[msg.sender] = "Admin"; // Creator is the admin

        userCommunities[msg.sender].push(communityCounter);

        emit CommunityCreated(communityCounter, _name, msg.sender);
    }

    // Join a community
    function joinCommunity(uint256 _communityId) public {
        require(communities[_communityId].id != 0, "Community does not exist.");
        require(!communities[_communityId].members[msg.sender], "You are already a member.");
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "You must be registered.");

        communities[_communityId].members[msg.sender] = true;
        userCommunities[msg.sender].push(_communityId);

        emit UserJoinedCommunity(_communityId, msg.sender);
    }

    // Assign role to a member based on votes
    function proposeRoleAssignment(uint256 _communityId, address _member, string memory _role, uint256 _requiredVotePercentage) public {
        Community storage community = communities[_communityId];
        require(msg.sender == community.admin, "Only the admin can propose role assignments.");
        require(community.members[_member], "User is not a member of the community.");

        // Start a voting process using Voting.sol
        votingContract.startProposal(_communityId, _requiredVotePercentage, msg.sender, _member, _role);
    }

    // Assign role after successful vote
    function assignRole(uint256 _communityId, address _member, string memory _role) public {
        require(votingContract.isProposalApproved(_communityId, _member), "Proposal for role assignment not approved.");
        communities[_communityId].roles[_member] = _role;

        emit RoleAssigned(_communityId, _member, _role);
    }

    // Check if user is a member of the community
    function isMember(uint256 _communityId, address _user) public view returns (bool) {
        return communities[_communityId].members[_user];
    }

    // Get the communities that a user belongs to
    function getUserCommunities(address _user) public view returns (uint256[] memory) {
        return userCommunities[_user];
    }

    // Get the role of a user in a community
    function getUserRole(uint256 _communityId, address _user) public view returns (string memory) {
        return communities[_communityId].roles[_user];
    }

    // Get all members of a community (in a simplified form for UI integration)
    function getCommunityMembers(uint256 _communityId) public view returns (address[] memory) {
        uint256 count;
        for (uint256 i = 0; i < userCommunities[msg.sender].length; i++) {
            if (communities[_communityId].members[msg.sender]) {
                count++;
            }
        }

        address[] memory memberList = new address[](count);
        uint256 index;

        for (uint256 i = 0; i < userCommunities[msg.sender].length; i++) {
            if (communities[_communityId].members[msg.sender]) {
                memberList[index] = msg.sender;
                index++;
            }
        }

        return memberList;
    }
}
