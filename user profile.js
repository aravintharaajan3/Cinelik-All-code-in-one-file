import { db } from './firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    let userId = params.get('user');

    // Default load (just in case no URL param is given)
    if (!userId) {
        userId = 'aravinth_profile'; 
    }

    try {
        // 1. Fetch User details from 'users' collection
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const user = userSnap.data();

            // Populate DOM
            document.getElementById('up-name').innerText = user.name || "Unknown Creator";
            document.getElementById('up-role').innerText = user.role || "Creator";
            document.getElementById('up-loc').innerText = user.location || "Location not specified";
            document.getElementById('up-bio').innerText = user.bio || "No bio available.";
            
            if (user.profilePic) {
                document.getElementById('up-avatar').src = user.profilePic;
            }

            // 2. Fetch User's Posts to show in Portfolio grid
            fetchUserPosts(user.name);

        } else {
            document.getElementById('up-name').innerText = "User Data Missing";
            document.getElementById('up-bio').innerText = "This profile is not saved in Firebase yet.";
        }
    } catch (err) {
        console.error("Error loading user data from Firebase:", err);
        document.getElementById('up-name').innerText = "Error Loading Data";
    }
});

// Function to fetch posts by this user
async function fetchUserPosts(userName) {
    const portfolioContainer = document.getElementById('up-portfolio');
    portfolioContainer.innerHTML = ''; // Clear loading state

    try {
        // Fetch from 'posts' collection where userName matches
        const q = query(collection(db, "posts"), where("userName", "==", userName));
        const querySnapshot = await getDocs(q);
        
        let postCount = 0;
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            postCount++;
            
            let contentHTML = "";
            if (post.imageUrl && post.imageUrl !== "") {
                contentHTML = `<img src="${post.imageUrl}" alt="Portfolio Item" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px;">`;
            } else {
                contentHTML = `<div style="width: 100%; height: 110px; background: #222; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #777; font-size: 10px; padding: 5px; text-align: center;">${post.content.substring(0, 30)}...</div>`;
            }
            
            portfolioContainer.innerHTML += contentHTML;
        });

        // Update post count stat
        document.getElementById('up-stat-proj').innerText = postCount;

        if (postCount === 0) {
            portfolioContainer.innerHTML = `<p style="grid-column: span 3; text-align: center; color: #666; font-size: 12px; margin-top: 20px;">No posts yet.</p>`;
        }

    } catch (e) {
        console.error("Error fetching user posts:", e);
    }
}

// Global function for the Follow button inside HTML
window.toggleFollow = function() {
    const btn = document.getElementById('follow-btn');
    if (btn.innerText === "Follow") {
        btn.innerText = "Following";
        btn.classList.add("following");
        // In real app, you would add +1 to followers in Firebase here
    } else {
        btn.innerText = "Follow";
        btn.classList.remove("following");
        // Remove from Firebase here
    }
};