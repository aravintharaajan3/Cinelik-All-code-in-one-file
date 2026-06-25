import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const portfolioContainer = document.getElementById('portfolio-container');
    const postsCountDisplay = document.getElementById('dyn-posts');
    const toastMessage = document.getElementById('toast-message');
    
    // UI Elements for Verification Badge
    const verifiedIcon = document.getElementById('dyn-verified-icon');
    const verifiedTag = document.getElementById('dyn-verified-tag');
    
    let globalUserName = "Creator"; 

    function showToast(msg) {
        if(!toastMessage) return;
        toastMessage.innerText = msg;
        toastMessage.classList.remove('hidden');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
            setTimeout(() => toastMessage.classList.add('hidden'), 300);
        }, 2500);
    }

    // ==========================================
    // --- 1. AUTH STATE CHECK & DATA FETCH ---
    // ==========================================
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userSnap = await getDoc(doc(db, "users", user.uid));
                
                if (userSnap.exists()) {
                    const uData = userSnap.data();
                    globalUserName = uData.name || user.displayName || "Creator"; 
                    
                    document.getElementById('dyn-name').innerText = globalUserName;
                    
                    // ✨ NEW LOGIC: Show verified badge ONLY if isVerified is true in DB
                    if (uData.isVerified === true) {
                        if (verifiedIcon) verifiedIcon.style.display = 'inline-block';
                        if (verifiedTag) verifiedTag.style.display = 'inline-block';
                    } else {
                        if (verifiedIcon) verifiedIcon.style.display = 'none';
                        if (verifiedTag) verifiedTag.style.display = 'none';
                    }
                    
                    if(uData.role) document.getElementById('dyn-role').innerText = uData.role;
                    if(uData.location) document.getElementById('dyn-location').innerText = uData.location;
                    if(uData.bio) document.getElementById('dyn-bio').innerText = uData.bio;
                    
                    if(uData.profilePic) document.getElementById('dyn-avatar').src = uData.profilePic;

                    if(uData.skills) {
                        const skillsArray = uData.skills.split(',').map(skill => skill.trim()).filter(s => s !== "");
                        let tagsHTML = "";
                        skillsArray.forEach(skill => {
                            tagsHTML += `<span class="tag">${skill}</span>`;
                        });
                        document.getElementById('dyn-skills').innerHTML = tagsHTML;
                    } else {
                        document.getElementById('dyn-skills').innerHTML = `<span class="tag">No skills added</span>`;
                    }

                    loadMyProfileData(globalUserName);
                }
            } catch(e) {
                console.error("Error fetching user profile:", e);
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    // ==========================================
    // --- 2. FETCH MY POSTS FROM FIREBASE ---
    // ==========================================
    async function loadMyProfileData(currentUserName) {
        portfolioContainer.innerHTML = ''; 
        let postCount = 0;

        try {
            const q = query(
                collection(db, "posts"), 
                where("userName", "==", currentUserName), 
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

    // ==========================================
    // --- 3. PORTFOLIO TABS LOGIC ---
    // ==========================================
    const tabs = document.querySelectorAll('.portfolio-tabs .tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (index === 0) {
                loadMyProfileData(globalUserName);
            } else if (index === 1) {
                portfolioContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px; color: #555; font-size: 13px;">No Reels yet. 🎬 Start creating!</div>`;
            } else if (index === 2) {
                portfolioContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px; color: #555; font-size: 13px;">No tagged posts. 🌍</div>`;
            }
        });
    });

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

    const storyBtn = document.getElementById('create-story-btn');
    const reelBtn = document.getElementById('create-reel-btn');

    if (storyBtn) {
        storyBtn.addEventListener('click', () => {
            createOverlay.classList.remove('active');
            showToast("Story feature coming soon! 📸");
        });
    }

    if (reelBtn) {
        reelBtn.addEventListener('click', () => {
            createOverlay.classList.remove('active');
            showToast("Reels feature coming soon! 🎬");
        });
    }

});