const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

// Scroll to bottom on load
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}
window.onload = scrollToBottom;

// Function to send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;

    // Get current time
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = hours + ':' + minutes + ' ' + ampm;

    // Create message element
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'sent');
    msgDiv.innerHTML = `
        <p>${text}</p>
        <span class="time">${timeString}</span><span class="read-receipt">✓</span>
    `;

    // Append to chat box (before the typing indicator)
    chatBox.insertBefore(msgDiv, typingIndicator);
    messageInput.value = '';
    scrollToBottom();

    // Simulate reply after 1.5 seconds
    simulateReply();
}

function simulateReply() {
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('message', 'received');
        replyDiv.innerHTML = `
            <p>Perfect! Check your email, I will send the location map and script excerpt shortly.</p>
            <span class="time">Just now</span>
        `;
        
        chatBox.insertBefore(replyDiv, typingIndicator);
        scrollToBottom();
        
        // Change sent message tick to double tick (read)
        const allTicks = document.querySelectorAll('.read-receipt');
        if(allTicks.length > 0) {
            allTicks[allTicks.length - 1].innerText = '✓✓';
        }
    }, 2000);
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});