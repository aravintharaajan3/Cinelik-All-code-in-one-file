import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-profile-btn');
    const toastMessage = document.getElementById('toast-message');
    
    // Inputs
    const nameInp = document.getElementById('edit-name');
    const roleInp = document.getElementById('edit-role'); // Ithu ippo Select tag
    const locInp = document.getElementById('edit-loc');
    const bioInp = document.getElementById('edit-bio');
    const skillsInp = document.getElementById('edit-skills');
    const ytInp = document.getElementById('edit-yt');
    const instaInp = document.getElementById('edit-insta');
    
    // Avatar Elements
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const photoTriggerText = document.getElementById('trigger-photo');
    const avatarInput = document.getElementById('avatar-input');
    const profileImg = document.getElementById('profile-img');

    let base64Avatar = "";
    let currentUser = null;

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

    // =====================================
    // 1. DYNAMIC FETCH WITH AUTH STATE
    // =====================================
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    if(data.name) nameInp.value = data.name;
                    
                    // Smart Dropdown Selector Logic
                    if(data.role && data.role !== "New User") {
                        let optionExists = Array.from(roleInp.options).some(opt => opt.value === data.role);
                        if (optionExists) {
                            roleInp.value = data.role;
                        } else {
                            // Oruvela pazhaya database-la custom role iruntha atha add panni select pannum
                            const newOption = new Option(data.role, data.role);
                            roleInp.add(newOption);
                            roleInp.value = data.role;
                        }
                    }
                    
                    if(data.location) locInp.value = data.location;
                    if(data.bio) bioInp.value = data.bio;
                    if(data.skills) skillsInp.value = data.skills;
                    if(data.youtube) ytInp.value = data.youtube;
                    if(data.instagram) instaInp.value = data.instagram;
                    if(data.profilePic) {
                        profileImg.src = data.profilePic;
                        base64Avatar = data.profilePic;
                    }
                } else {
                    showToast("Profile not found! Please save your details.");
                }
            } catch (e) { 
                console.error("Error fetching profile.", e); 
                showToast("Error loading profile!");
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    // =====================================
    // 2. PROFILE PHOTO PICKER & COMPRESSION
    // =====================================
    function openFilePicker() { avatarInput.click(); }
    avatarWrapper.addEventListener('click', openFilePicker);
    photoTriggerText.addEventListener('click', openFilePicker);

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 300; 
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');
                    
                    const size = Math.min(img.width, img.height);
                    const x = (img.width / 2) - (size / 2);
                    const y = (img.height / 2) - (size / 2);
                    ctx.drawImage(img, x, y, size, size, 0, 0, canvas.width, canvas.height);
                    
                    base64Avatar = canvas.toDataURL('image/jpeg', 0.7); 
                    profileImg.src = base64Avatar;
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // =====================================
    // 3. DYNAMIC SAVE DATA TO FIREBASE
    // =====================================
    saveBtn.addEventListener('click', async () => {
        if (!currentUser) {
            showToast("Session expired! Please login again.");
            return;
        }

        // Basic Validation
        if (!nameInp.value.trim() || !roleInp.value) {
            showToast("Name and Primary Role kandippa thevai! ⚠️");
            return;
        }

        saveBtn.innerHTML = 'Saving...';
        saveBtn.disabled = true;

        try {
            await setDoc(doc(db, "users", currentUser.uid), {
                name: nameInp.value.trim(),
                role: roleInp.value, // Dropdown la irunthu theliva value pogum
                location: locInp.value.trim(),
                bio: bioInp.value.trim(),
                skills: skillsInp.value.trim(),
                youtube: ytInp.value.trim(),
                instagram: instaInp.value.trim(),
                profilePic: base64Avatar || profileImg.src,
                updatedAt: serverTimestamp()
            }, { merge: true }); // Merge true pottathaala email overwite aagathu

            showToast('Profile Updated Successfully! 🎬');
            
            setTimeout(() => {
                window.location.href = 'profile.html'; 
            }, 1500);
            
        } catch (err) {
            console.error("Error saving profile:", err);
            showToast('Error saving profile. Try again.');
            saveBtn.innerHTML = 'Save';
            saveBtn.disabled = false;
        }
    });
});