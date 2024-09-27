// Chat data for each contact
const chatData = {
    "John Doe": [
        { type: "received", text: "Hey, how are you?", time: "4:15 PM" },
        { type: "sent", text: "I'm good! How about you?", time: "4:16 PM" },
        { type: "received", text: "All good, thanks for asking.", time: "4:17 PM" }
    ],
    "Jane Smith": [
        { type: "received", text: "Hi there! Long time no see.", time: "3:00 PM" },
        { type: "sent", text: "Yeah, it’s been a while. How have you been?", time: "3:01 PM" },
        { type: "received", text: "I've been great, how about you?", time: "3:02 PM" }
    ],
    "Mike Johnson": [
        { type: "received", text: "Hey, are you joining the meeting later?", time: "11:00 AM" },
        { type: "sent", text: "Yes, I will be there.", time: "11:05 AM" }
    ],
    "Anna Williams": [
        { type: "received", text: "Don't forget about the project deadline tomorrow.", time: "9:00 AM" },
        { type: "sent", text: "I’m on it! Thanks for the reminder.", time: "9:10 AM" }
    ]
};

// Function to render chat messages
function renderMessages(contact) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = "";  // Clear the current messages

    chatData[contact].forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.type);
        
        const messageText = document.createElement('p');
        messageText.textContent = message.text;
        messageDiv.appendChild(messageText);
        
        const timeStamp = document.createElement('span');
        timeStamp.classList.add('timestamp');
        timeStamp.textContent = message.time;
        messageDiv.appendChild(timeStamp);

        chatMessages.appendChild(messageDiv);
    });
}

// Function to switch contact when clicked
function switchContact(event) {
    const selectedContact = event.target.getAttribute('data-name');
    
    // Update the chat header
    document.getElementById('chat-name').textContent = selectedContact;

    // Render the messages for the selected contact
    renderMessages(selectedContact);

    // Update the active contact class
    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Add event listeners to all contacts
document.querySelectorAll('.contact').forEach(contact => {
    contact.addEventListener('click', switchContact);
});

// Handle message sending
document.getElementById('send-btn').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;
    
    if (messageText.trim()) {
        // Get the currently active contact
        const activeContact = document.getElementById('chat-name').textContent;
        
        // Add the new message to the chatData
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        chatData[activeContact].push({ type: 'sent', text: messageText, time: timeNow });
        
        // Re-render messages for the active contact
        renderMessages(activeContact);
        
        // Clear the input field
        messageInput.value = '';
      
    }
});
// Function to send a message
function sendMessage() {
    const messageText = messageInput.value;

    if (messageText) {
        const p = document.createElement('p');
        p.textContent = messageText;
        messageHistory.appendChild(p);

        // Clear the input box
        messageInput.value = '';
    }
}