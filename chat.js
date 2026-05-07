import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DYNAMIC USER LOADING ---
    const params = new URLSearchParams(window.location.search);
    let userId = params.get('user') || 'karthik'; // URL la illana karthik default

    fetch('users.json')
        .then(res => res.json())
        .then(data => {
            const user = data[userId];
            if (user) {
                document.getElementById('chat-head-name').innerHTML = `${user.name} <span style="color: #1DA1F2; font-size: 14px;">✔</span>`;
                document.getElementById('chat-head-role').innerText = `${user.role} • Online`;
                document.getElementById('chat-head-avatar').src = user.profilePic;
            }
        })
        .catch(err => console.error("Error loading chat data:", err));

    // --- 2. AWESOME CHAT LOGIC ---
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('typing-indicator');

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    scrollToBottom();

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === "") return;

        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = hours + ':' + minutes + ' ' + ampm;

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'sent');
        msgDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${timeString}</span><span class="read-receipt">✓</span>
        `;

        chatBox.insertBefore(msgDiv, typingIndicator);
        messageInput.value = '';
        scrollToBottom();

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
            
            const allTicks = document.querySelectorAll('.read-receipt');
            if(allTicks.length > 0) {
                allTicks[allTicks.length - 1].innerText = '✓✓';
            }
        }, 2000);
    }

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});