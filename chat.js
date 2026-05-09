import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    // --- 1. DYNAMIC USER LOADING FROM FIREBASE ---
    const params = new URLSearchParams(window.location.search);
    let userId = params.get('user'); 

    // Helper to update UI
    function updateChatHeader(name, role, avatar) {
        document.getElementById('chat-head-name').innerHTML = `${name} <span style="color: #1DA1F2; font-size: 14px;">✔</span>`;
        document.getElementById('chat-head-role').innerText = `${role} • Online`;
        document.getElementById('chat-head-avatar').src = avatar;
    }

    if (userId) {
        try {
            // Fetch exact user from Firebase
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const user = userSnap.data();
                updateChatHeader(
                    user.name || "Creator", 
                    user.role || "Talent", 
                    user.profilePic || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80"
                );
            } else {
                updateChatHeader("Unknown User", "Offline", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80");
            }
        } catch (error) {
            console.error("Error loading chat data from Firebase:", error);
            updateChatHeader("CineLink User", "Creator", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80");
        }
    } else {
        // Default demo fallback if opened directly
        updateChatHeader("Karthik Raj", "Director", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80");
    }

    // --- 2. AWESOME CHAT LOGIC (UI Simulation) ---
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

        // Getting current time
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = hours + ':' + minutes + ' ' + ampm;

        // Creating Sent Message Bubble
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'sent');
        msgDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${timeString}</span><span class="read-receipt">✓</span>
        `;

        chatBox.insertBefore(msgDiv, typingIndicator);
        messageInput.value = '';
        scrollToBottom();

        // Trigger the fake reply
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
            
            // Turn single ticks to double ticks for realism
            const allTicks = document.querySelectorAll('.read-receipt');
            if(allTicks.length > 0) {
                allTicks[allTicks.length - 1].innerText = '✓✓';
            }
        }, 2000); // 2 second delay for typing effect
    }

    // Events
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});