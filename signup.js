import { auth, db } from './firebase-config.js'; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("signupBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const contactInfo = document.getElementById("contact-info").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const terms = document.getElementById("terms-checkbox").checked;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
    const isPhone = /^\d{10}$/.test(contactInfo);

    if (!name || !contactInfo || !password || !confirmPassword) {
        alert("எல்லா fields-உம் fill பண்ணு da!"); return;
    }
    if (!isEmail && !isPhone) {
        alert("Correct-aana Email இல்லனா 10-digit Mobile number கொடு machi!"); return;
    }
    if (password !== confirmPassword) {
        alert("Password match ஆகல!"); return;
    }
    if (password.length < 6) {
        alert("Password minimum 6 characters இருக்கணும்!"); return;
    }
    if (!terms) {
        alert("Terms & Privacy Policy accept பண்ணு!"); return;
    }

    // 📱 PHONE BLOCKER
    if (isPhone) {
        alert("Machi, Mobile OTP login இப்போதைக்கு disable பண்ணிருக்கோம்! Testing-க்காக உன்னோட Email வெச்சு Signup பண்ணிக்கோ 😅");
        return;
    }

    // 📧 EMAIL FLOW
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

        alert("Account create ஆச்சு! Welcome to CineLink 🎬");
        window.location.href = "login.html";

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("இந்த Email already registered — Login பண்ணு!");
        } else {
            alert("Signup failed: " + error.message);
        }
        document.getElementById("signupBtn").innerHTML = "Create Account";
    }
});