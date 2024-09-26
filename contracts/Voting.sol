// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registration.sol"; // Importing Registration contract
import "./Create.sol"; // Importing Create contract for posts

contract Voting {

    Registration registrationContract; // Instance of the registration contract
    Create createContract; // Instance of the Create contract
    address public admin;
    uint256 public proposalCount = 0;

    struct Proposal {
        uint256 postID;        // The ID of the post being voted on for removal
        uint256 yesVotes;      // Number of votes in favor of removal
        uint256 noVotes;       // Number of votes against removal
        uint256 deadline;      // Voting deadline (timestamp)
        bool executed;         // Whether the proposal has been executed
        mapping(address => bool) voted; // Track who has voted
    }

    mapping(uint256 => Proposal) public proposals; // Proposal ID to Proposal

    event ProposalCreated(address indexed proposer, uint256 indexed postID, uint256 proposalID);
    event ProposalExecuted(uint256 proposalID, uint256 indexed postID, bool removed);

    modifier onlyRegistered() {
        require(registrationContract.getUserDetails(msg.sender) != (0, "", "", "", 0), "You must be registered to vote");
        _;
    }

    constructor(address _registrationContract, address _createContract) {
        admin = msg.sender;
        registrationContract = Registration(_registrationContract); // Set the Registration contract
        createContract = Create(_createContract); // Set the Create contract
    }

    // Create a proposal to remove a post
    function createPostRemovalProposal(uint256 _postID) public onlyRegistered {
        // Check if the post exists
        require(createContract.posts(_postID).exists, "Post does not exist");

        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.postID = _postID;
        proposal.deadline = block.timestamp + 1 days; // Voting lasts for 1 day

        emit ProposalCreated(msg.sender, _postID, proposalCount);
    }

    // Vote on a proposal: 1 = Yes, 0 = No
    function voteOnPostProposal(uint256 proposalID, bool vote) public onlyRegistered {
        Proposal storage proposal = proposals[proposalID];
        require(!proposal.voted[msg.sender], "User has already voted");
        require(block.timestamp <= proposal.deadline, "Voting period has ended");
        require(!proposal.executed, "Proposal has already been executed");

        if (vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        proposal.voted[msg.sender] = true;
    }

    // Execute the proposal after the deadline
    function executePostProposal(uint256 proposalID) public {
        Proposal storage proposal = proposals[proposalID];
        require(block.timestamp > proposal.deadline, "Voting period is not over");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;
        bool removed = false;

        // If yesVotes are more than noVotes, remove the post
        if (proposal.yesVotes > proposal.noVotes) {
            createContract.deletePost(proposal.postID); // Call deletePost in Create contract
            removed = true;
        }

        emit ProposalExecuted(proposalID, proposal.postID, removed);
    }
function getProposal(uint256 proposalID) public view returns (
    uint256 postID,
    uint256 yesVotes,
    uint256 noVotes,
    uint256 deadline,
    bool executed
) {
    Proposal storage proposal = proposals[proposalID];
    require(proposal.deadline > 0, "Proposal does not exist"); // Check if proposal exists
    return (proposal.postID, proposal.yesVotes, proposal.noVotes, proposal.deadline, proposal.executed);
}

// Function to check if a user has voted on a specific proposal
function hasVoted(uint256 proposalID, address user) public view returns (bool) {
    Proposal storage proposal = proposals[proposalID];
    return proposal.voted[user];
}

// Function to get the total number of proposals
    function getTotalProposals() public view returns (uint256) {
    return proposalCount;
    }

}
