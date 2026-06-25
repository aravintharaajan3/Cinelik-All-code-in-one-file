import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    GoogleAuthProvider, 
    OAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// 👁️ Eye icon toggle 
document.getElementById("toggle-password").addEventListener("click", () => {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
});

// 📧 1. NORMAL EMAIL / PASSWORD LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
    const contactInfo = document.getElementById("login-contact").value.trim();
    const password = document.getElementById("password").value;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo);
    const isPhone = /^\d{10}$/.test(contactInfo);

    if (!contactInfo || !password) {
        showToast("Details-a fill pannu da!"); return;
    }
    if (!isEmail && !isPhone) {
        showToast("Correct-aana Email illana 10-digit Mobile number kudu machi!"); return;
    }

    if (isPhone) {
        showToast("Mobile login disabled. Unnoda Email & Password vachu Login pannu 😅"); return;
    }

    try {
        document.getElementById("loginBtn").innerHTML = "Logging In... ⏳";
        
        const userCredential = await signInWithEmailAndPassword(auth, contactInfo, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "New User") {
                window.location.href = "onboarding.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            window.location.href = "onboarding.html";
        }

    } catch (error) {
        showToast("User illa / Password thappu da! Check pannu.");
        document.getElementById("loginBtn").innerHTML = "Log In";
    }
});

// 🔑 2. FORGOT PASSWORD LOGIC
document.getElementById("forgot-password-link").addEventListener("click", async (e) => {
    e.preventDefault(); // prevents jumping to top of page
    const email = document.getElementById("login-contact").value.trim();

    if (!email || !email.includes('@')) {
        showToast("Machi, mela un Email-a type pannittu intha button-a amukku!");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Password Reset Link un Email-kku anuppiyachu! 📧");
    } catch (error) {
        console.error("Reset Error:", error);
        showToast("Error: Un Email correct-a nu check pannu!");
    }
});

// 🌐 3. SOCIAL LOGIN HELPER FUNCTION (For both Google & Apple)
async function handleSocialLogin(provider) {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if this Google/Apple user already exists in our DB
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // Puthiya user na DB la register panni onboarding ku anuppu
            await setDoc(userDocRef, {
                name: user.displayName || "CineLink User",
                email: user.email,
                role: "New User",
                profilePic: user.photoURL || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
                createdAt: serverTimestamp()
            });
            showToast("Welcome to CineLink! 🎉");
            setTimeout(() => { window.location.href = "onboarding.html"; }, 1500);
        } else {
            // Already account iruntha role check panni ulla anuppu
            const userData = userDoc.data();
            showToast(`Welcome back, ${userData.name}!`);
            setTimeout(() => {
                if (userData.role === "New User") {
                    window.location.href = "onboarding.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1000);
        }
    } catch (error) {
        console.error("Social Auth Error:", error);
        showToast("Social Login Cancelled / Failed.");
    }
}

// 🔵 4. GOOGLE LOGIN BUTTON
document.getElementById("google-login-btn").addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    handleSocialLogin(provider);
});

// 🍎 5. APPLE LOGIN BUTTON
document.getElementById("apple-login-btn").addEventListener("click", () => {
    const provider = new OAuthProvider('apple.com');
    handleSocialLogin(provider);
});