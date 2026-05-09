import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    const portfolioContainer = document.getElementById('portfolio-container');
    const postsCountDisplay = document.getElementById('dyn-posts');

    // ==========================================
    // --- FETCH MY POSTS FROM FIREBASE ---
    // ==========================================
    async function loadMyProfileData() {
        portfolioContainer.innerHTML = ''; 
        let postCount = 0;

        try {
            const q = query(
                collection(db, "posts"), 
                where("userName", "==", "Aravinth"), 
                orderBy("timestamp", "desc")
            );

            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                postCount++;

                let contentHTML = "";
                // If it's an image post, show the image taking 100% height and width
                if (post.imageUrl && post.imageUrl !== "") {
                    contentHTML = `<img src="${post.imageUrl}" alt="Post">`;
                } else {
                    // If text post, show text snippet nicely wrapped inside the square
                    contentHTML = `<div class="grid-text-preview">${post.content.substring(0, 50)}...</div>`;
                }

                const gridItem = `<div class="grid-item">${contentHTML}</div>`;
                portfolioContainer.insertAdjacentHTML('beforeend', gridItem);
            });

            if(postsCountDisplay) postsCountDisplay.innerText = postCount;

            if (postCount === 0) {
                portfolioContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px; color: #555; font-size: 13px;">No posts yet. Start creating!</div>`;
            }

        } catch (error) {
            console.error("Profile Fetch Error: ", error);
        }
    }

    await loadMyProfileData();

    // ==========================================
    // --- CREATE MENU POPUP LOGIC ---
    // ==========================================
    const createBtn = document.getElementById('main-create-trigger');
    const createOverlay = document.getElementById('create-overlay');

    if (createBtn && createOverlay) {
        createBtn.addEventListener('click', () => {
            createOverlay.classList.add('active');
        });

        createOverlay.addEventListener('click', (e) => {
            if (e.target === createOverlay) {
                createOverlay.classList.remove('active');
            }
        });
    }
});