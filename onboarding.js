import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const toastMessage = document.getElementById('toast-message');
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

let selectedPrimaryRole = null;
let currentUser = null;
const continueBtn = document.getElementById('continue-btn');

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        window.location.href = 'login.html'; // Protect page
    }
});

window.selectRole = function(roleValue, elementId) {
    document.querySelectorAll('.role-box').forEach(box => box.classList.remove('active'));
    document.getElementById(elementId).classList.add('active');

    selectedPrimaryRole = roleValue;
    continueBtn.disabled = false;
    continueBtn.style.transform = 'scale(1.02)';
    setTimeout(() => { continueBtn.style.transform = 'scale(1)'; }, 150);
}

continueBtn.addEventListener('click', async () => {
    if (selectedPrimaryRole && currentUser) {
        continueBtn.innerHTML = 'SAVING... ⏳';
        continueBtn.disabled = true;
        
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const formattedRole = selectedPrimaryRole.charAt(0).toUpperCase() + selectedPrimaryRole.slice(1);
            
            await updateDoc(userRef, { role: formattedRole });
            window.location.href = 'index.html';
        } catch (error) {
            showToast("Error saving role: " + error.message);
            continueBtn.innerHTML = 'CONTINUE ➔';
            continueBtn.disabled = false;
        }
    } else {
        showToast("Please select a role!");
    }
});