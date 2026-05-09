import { db } from './firebase-config.js';
// NEW: Added doc and getDoc to fetch user details!
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    const portfolioContainer = document.getElementById('portfolio-container');
    const postsCountDisplay = document.getElementById('dyn-posts');

    // ==========================================
    // --- FETCH USER PROFILE DATA ---
    // ==========================================
    async function fetchUserProfile() {
        try {
            const userSnap = await getDoc(doc(db, "users", "aravinth_profile"));
            
            if (userSnap.exists()) {
                const uData = userSnap.data();
                
                // Update Name & Verified Icon
                document.getElementById('dyn-name').innerHTML = `${uData.name || "Aravinth"} <span class="verified-icon">✔</span>`;
                
                // Update Text Details
                if(uData.role) document.getElementById('dyn-role').innerText = uData.role;
                if(uData.location) document.getElementById('dyn-location').innerText = uData.location;
                if(uData.bio) document.getElementById('dyn-bio').innerText = uData.bio;
                
                // Update Avatar
                if(uData.profilePic) document.getElementById('dyn-avatar').src = uData.profilePic;

                // Format Skills nicely as tags
                if(uData.skills) {
                    const skillsArray = uData.skills.split(',').map(skill => skill.trim()).filter(s => s !== "");
                    let tagsHTML = "";
                    skillsArray.forEach(skill => {
                        tagsHTML += `<span class="tag">${skill}</span>`;
                    });
                    document.getElementById('dyn-skills').innerHTML = tagsHTML;
                }
            }
        } catch(e) {
            console.error("Error fetching user profile:", e);
        }
    }

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
                if (post.imageUrl && post.imageUrl !== "") {
                    contentHTML = `<img src="${post.imageUrl}" alt="Post">`;
                } else {
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

    // Run both fetches concurrently!
    await Promise.all([fetchUserProfile(), loadMyProfileData()]);

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