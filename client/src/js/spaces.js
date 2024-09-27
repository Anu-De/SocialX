let communityData = {};

// Function to render community list
function renderCommunityList() {
    const communityList = document.getElementById('community-list');
    communityList.innerHTML = '';

    for (const community in communityData) {
        const communityDiv = document.createElement('div');
        communityDiv.classList.add('community');
        communityDiv.setAttribute('data-name', community);
        communityDiv.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="Profile">
            <span class="community-name">${community}</span>
        `;
        communityDiv.addEventListener('click', () => selectCommunity(community));
        communityList.appendChild(communityDiv);
    }
}

// Function to select a community
function selectCommunity(community) {
    document.getElementById('community-name').textContent = community;
    renderMessages(community);
    renderMembers(community);

    document.getElementById('message-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
}

// Function to render messages
function renderMessages(community) {
    const messagesDiv = document.getElementById('community-messages');
    messagesDiv.innerHTML = '';

    communityData[community].messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.type);
        messageDiv.textContent = message.text;
        messagesDiv.appendChild(messageDiv);
    });
}

// Function to render members of the selected community
function renderMembers(community) {
    const membersDiv = document.getElementById('community-members');
    membersDiv.innerHTML = '<h3>Members</h3>';

    communityData[community].members.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('member');
        memberDiv.textContent = member;
        membersDiv.appendChild(memberDiv);
    });
}

// Handle sending a message
document.getElementById('send-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    const activeCommunity = document.getElementById('community-name').textContent;

    if (messageText && activeCommunity !== 'Select a Community') {
        const message = { type: 'sent', text: messageText };
        communityData[activeCommunity].messages.push(message);

        renderMessages(activeCommunity);
        messageInput.value = '';
    }
});

// Handle adding a new community
document.getElementById('add-community-btn').addEventListener('click', function() {
    const newCommunity = prompt('Enter the name of the new community:');
    
    if (newCommunity && !communityData[newCommunity]) {
        communityData[newCommunity] = {
            members: [],
            messages: []
        };
        renderCommunityList();
    } else if (communityData[newCommunity]) {
        alert('Community already exists');
    }
});

// Handle adding a new member
document.getElementById('add-member-btn').addEventListener('click', function() {
    const activeCommunity = document.getElementById('community-name').textContent;
    if (activeCommunity !== 'Select a Community') {
        const newMember = prompt('Enter the name of the new member:');
        
        if (newMember && !communityData[activeCommunity].members.includes(newMember)) {
            communityData[activeCommunity].members.push(newMember);
            renderMembers(activeCommunity);
        } else if (communityData[activeCommunity].members.includes(newMember)) {
            alert('Member already exists in this community');
        }
    } else {
        alert('Please select a community first');
    }
});

// Initial render
renderCommunityList();