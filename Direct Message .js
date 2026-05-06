const sendBtn = document.getElementById('send-btn');
const msgInput = document.getElementById('msg-input');
const chatBox = document.getElementById('chat-box');

// Function to send message
function sendMessage() {
    const text = msgInput.value.trim();
    if (text !== "") {
        // Create new message element
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'sent');
        
        // Get current time
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeStr = hours + ':' + minutes + ' ' + ampm;

        // Set HTML content
        msgDiv.innerHTML = `
            <p>${text}</p>
            <span class="msg-time">${timeStr}</span>
        `;
        
        // Append to chat area
        chatBox.appendChild(msgDiv);
        
        // Clear input
        msgInput.value = "";
        
        // Auto scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Simulate a reply after 2 seconds
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.classList.add('message', 'received');
            replyDiv.innerHTML = `
                <p>Great! Looking forward to it. Keep your scripts ready. 🎬</p>
                <span class="msg-time">Just now</span>
            `;
            chatBox.appendChild(replyDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 2000);
    }
}

// Click to send
sendBtn.addEventListener('click', sendMessage);

// Press Enter to send
msgInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Scroll to bottom on load
window.onload = () => {
    chatBox.scrollTop = chatBox.scrollHeight;
};