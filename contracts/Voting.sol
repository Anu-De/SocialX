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

interface ICreate {
    function posts(uint256 _postID) external view returns (bool exists);
    function deletePost(uint256 _postID) external;
}

contract CommunityVoting {
    IRegistration public registrationContract;
    ICreate public createContract;

    struct Community {
        uint256 id;
        string name;
        address admin;
        mapping(address => bool) members;
        mapping(address => string) roles;  // User roles within the community
    }

    uint256 public communityCounter;
    mapping(uint256 => Community) public communities;
    mapping(address => uint256[]) public userCommunities;  // Track user's community memberships

    struct Proposal {
        uint256 proposalID;
        address proposer;
        uint256 communityID; // For role assignment within communities
        address member;      // Member being proposed for a role or post removal
        string proposedRole; // Role being proposed
        uint256 postID;      // Post ID if it’s a post removal proposal
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) voted;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    event CommunityCreated(uint256 indexed communityId, string name, address indexed admin);
    event RoleAssigned(uint256 indexed communityId, address indexed member, string role);
    event ProposalCreated(address indexed proposer, uint256 indexed proposalID, uint256 communityID, string proposedRole);
    event PostRemovalProposalCreated(address indexed proposer, uint256 indexed proposalID, uint256 postID);
    event ProposalExecuted(uint256 proposalID, bool executed);

   modifier onlyRegistered() {
    (uint256 uniqueID, , , , ) = registrationContract.getUserDetails(msg.sender);
    require(uniqueID != 0, "You must be registered.");
    _;
}

    constructor(address _registrationContract, address _createContract) {
        registrationContract = IRegistration(_registrationContract);
        createContract = ICreate(_createContract);
    }

    // Create a community
    function createCommunity(string memory _name) public onlyRegistered {
        communityCounter++;
        Community storage newCommunity = communities[communityCounter];
        newCommunity.id = communityCounter;
        newCommunity.name = _name;
        newCommunity.admin = msg.sender;
        newCommunity.members[msg.sender] = true;
        newCommunity.roles[msg.sender] = "Admin"; // The creator becomes the admin by default

        userCommunities[msg.sender].push(communityCounter);

        emit CommunityCreated(communityCounter, _name, msg.sender);
    }

    // Propose a role assignment within a community
    function proposeRoleAssignment(uint256 _communityId, address _member, string memory _role) public onlyRegistered {
        require(communities[_communityId].admin == msg.sender, "Only the admin can propose roles.");
        require(communities[_communityId].members[_member], "User must be a member.");

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.proposalID = proposalCount;
        newProposal.communityID = _communityId;
        newProposal.member = _member;
        newProposal.proposedRole = _role;
        newProposal.proposer = msg.sender;
        newProposal.deadline = block.timestamp + 1 days; // Voting duration: 1 day

        emit ProposalCreated(msg.sender, proposalCount, _communityId, _role);
    }

    // Propose post removal
    function proposePostRemoval(uint256 _postID) public onlyRegistered {
        require(createContract.posts(_postID), "Post does not exist.");

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.proposalID = proposalCount;
        newProposal.postID = _postID;
        newProposal.proposer = msg.sender;
        newProposal.deadline = block.timestamp + 1 days; // Voting duration: 1 day

        emit PostRemovalProposalCreated(msg.sender, proposalCount, _postID);
    }

    // Vote on a proposal (either for role assignment or post removal)
    function voteOnProposal(uint256 _proposalID, bool _vote) public onlyRegistered {
        Proposal storage proposal = proposals[_proposalID];
        require(!proposal.voted[msg.sender], "You have already voted.");
        require(block.timestamp <= proposal.deadline, "Voting period has ended.");
        require(!proposal.executed, "Proposal already executed.");

        if (_vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        proposal.voted[msg.sender] = true;
    }

    // Execute a proposal after the voting period ends
    function executeProposal(uint256 _proposalID) public {
        Proposal storage proposal = proposals[_proposalID];
        require(block.timestamp > proposal.deadline, "Voting period is not over.");
        require(!proposal.executed, "Proposal already executed.");

        proposal.executed = true;

        if (proposal.postID != 0) { // Post removal proposal
            if (proposal.yesVotes > proposal.noVotes) {
                createContract.deletePost(proposal.postID); // Remove the post if votes in favor
            }
        } else { // Role assignment proposal
            if (proposal.yesVotes > proposal.noVotes) {
                communities[proposal.communityID].roles[proposal.member] = proposal.proposedRole;
                emit RoleAssigned(proposal.communityID, proposal.member, proposal.proposedRole);
            }
        }

        emit ProposalExecuted(_proposalID, proposal.executed);
    }

    // Utility functions for getting user/community data
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
