import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    const trendingContainer = document.getElementById('trending-container');
    const verifiedContainer = document.getElementById('verified-container');

    // Function to render user cards with ONCLICK link!
    function renderTalents(talentsArray, container) {
        container.innerHTML = '';
        talentsArray.forEach(talent => {
            const cardHTML = `
                <div class="talent-card" onclick="location.href='user profile.html?user=${talent.id}'" style="cursor: pointer; display: inline-block; text-align: center; margin-right: 15px; width: 100px;">
                    <img src="${talent.img}" alt="${talent.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #333;">
                    <h4 style="margin: 8px 0 2px 0; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${talent.name}</h4>
                    <p style="margin: 0; font-size: 11px; color: #888;">${talent.role}</p>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // =====================================
    // FETCH REAL USERS FROM FIREBASE
    // =====================================
    async function loadTalentsFromDB() {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            let talents = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                talents.push({
                    id: doc.id,
                    name: data.name || "Unknown Creator",
                    role: data.role || "Creator",
                    img: data.profilePic || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80"
                });
            });

            // Fallback Dummy Data incase DB is totally empty
            if (talents.length === 0) {
                talents = [
                    { id: 'karthik', name: 'Karthik Raj', role: 'Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
                    { id: 'meera', name: 'Meera Krishnan', role: 'Actress', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
                ];
            }

            // Trick to make the horizontal scroll look full if we only have 1 or 2 real users in DB
            let displayTalents = [...talents];
            if (displayTalents.length < 4) {
                displayTalents = [...displayTalents, ...talents, ...talents]; 
            }

            // Shuffle or split for different sections
            renderTalents(displayTalents, trendingContainer);
            renderTalents(displayTalents.reverse(), verifiedContainer);

        } catch (error) {
            console.error("Error fetching users from Firebase:", error);
            trendingContainer.innerHTML = '<p style="color: #666; font-size: 12px;">Failed to load talents.</p>';
        }
    }

    // Run the fetch
    await loadTalentsFromDB();
});