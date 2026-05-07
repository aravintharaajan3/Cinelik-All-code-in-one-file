import { auth, db } from './firebase-config.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let selectedPrimaryRole = null;
const continueBtn = document.getElementById('continue-btn');

// Module-la irukkurathala HTML onclick-ku window-la attach pannanum
window.selectRole = function(roleValue, elementId) {
    const allBoxes = document.querySelectorAll('.role-box');
    allBoxes.forEach(box => {
        box.classList.remove('active');
    });

    const selectedBox = document.getElementById(elementId);
    selectedBox.classList.add('active');

    selectedPrimaryRole = roleValue;

    continueBtn.disabled = false;
    continueBtn.style.transform = 'scale(1.02)';
    setTimeout(() => {
        continueBtn.style.transform = 'scale(1)';
    }, 150);
}

continueBtn.addEventListener('click', async () => {
    if (selectedPrimaryRole) {
        continueBtn.innerHTML = 'SAVING... ⏳';
        
        // Login aagirukka user-a edu
        const user = auth.currentUser; 
        
        if (user) {
            try {
                // Firebase database-la role update panrom
                const userRef = doc(db, "users", user.uid);
                
                // First letter capital aakka (e.g., 'actor' -> 'Actor', 'director' -> 'Director')
                const formattedRole = selectedPrimaryRole.charAt(0).toUpperCase() + selectedPrimaryRole.slice(1);
                
                await updateDoc(userRef, {
                    role: formattedRole
                });

                // Update aana appuram home page-ku po
                window.location.href = 'index.html';
            } catch (error) {
                alert("Error saving role: " + error.message);
                continueBtn.innerHTML = 'CONTINUE ➔';
            }
        } else {
            alert("Nee login aagala machi! First Signup pannu.");
            window.location.href = 'signup.html';
        }
    }
});