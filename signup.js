import { auth, db } from './firebase-config.js'; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

document.getElementById("signupBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const contactInfo = document.getElementById("contact-info").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const terms = document.getElementById("terms-checkbox").checked;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
    const isPhone = /^\d{10}$/.test(contactInfo);

    if (!name || !contactInfo || !password || !confirmPassword) {
        showToast("Ellaa fields-um fill pannu da!"); return;
    }
    if (!isEmail && !isPhone) {
        showToast("Correct-aana Email illana 10-digit Mobile number kudu machi!"); return;
    }
    if (password !== confirmPassword) {
        showToast("Password match aagala!"); return;
    }
    if (password.length < 6) {
        showToast("Password minimum 6 characters irukkanum!"); return;
    }
    if (!terms) {
        showToast("Terms & Privacy Policy accept pannu!"); return;
    }

    if (isPhone) {
        showToast("Mobile login disabled! Email vachu Signup panniko 😅"); return;
    }

    try {
        document.getElementById("signupBtn").innerHTML = "Creating... ⏳";
        const userCredential = await createUserWithEmailAndPassword(auth, contactInfo, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name, 
            email: contactInfo, 
            role: "New User", 
            profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
            createdAt: serverTimestamp()
        });

        showToast("Account create aachu! Welcome to CineLink 🎬");
        
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            showToast("Intha Email already registered — Login pannu!");
        } else {
            showToast("Signup failed: " + error.message);
        }
        document.getElementById("signupBtn").innerHTML = "Create Account";
    }
});