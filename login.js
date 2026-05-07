import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Eye icon toggle 
document.getElementById("toggle-password").addEventListener("click", () => {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const contactInfo = document.getElementById("login-contact").value.trim();
    const password = document.getElementById("password").value;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
    const isPhone = /^\d{10}$/.test(contactInfo);

    if (!contactInfo || !password) {
        alert("Details-a fill பண்ணு da!"); return;
    }
    if (!isEmail && !isPhone) {
        alert("Correct-aana Email இல்லனா 10-digit Mobile number கொடு machi!"); return;
    }

    // 📱 PHONE BLOCKER (As we decided earlier)
    if (isPhone) {
        alert("Machi, Mobile OTP login இப்போதைக்கு disable பண்ணிருக்கோம்! உன்னோட Email & Password வெச்சு Login பண்ணு 😅");
        return;
    }

    // 📧 EMAIL LOGIN FLOW
    try {
        document.getElementById("loginBtn").innerHTML = "Logging In... ⏳";
        
        // 1. Sign In panrom
        const userCredential = await signInWithEmailAndPassword(auth, contactInfo, password);
        const user = userCredential.user;

        // 2. Firestore-la irunthu User Data-va edukurom
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // 3. Smart Redirect Logic
            if (userData.role === "New User") {
                // Pudhu user-na onboarding-ku anuppu
                window.location.href = "onboarding.html";
            } else {
                // Already role select pannitaanga-na direct-a home-ku anuppu
                window.location.href = "index.html";
            }
        } else {
            // Document illana safe-a onboarding-ke anuppidalam
            window.location.href = "onboarding.html";
        }

    } catch (error) {
        alert("User இல்ல / Password தப்பு da! Check பண்ணு.");
        document.getElementById("loginBtn").innerHTML = "Log In";
    }
});