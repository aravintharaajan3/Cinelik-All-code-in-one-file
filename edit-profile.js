import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const saveBtn = document.getElementById('save-profile-btn');
    
    // Inputs
    const nameInp = document.getElementById('edit-name');
    const roleInp = document.getElementById('edit-role');
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

    // =====================================
    // 1. FETCH EXISTING DATA FROM FIREBASE
    // =====================================
    try {
        const docSnap = await getDoc(doc(db, "users", "aravinth_profile"));
        if (docSnap.exists()) {
            const data = docSnap.data();
            if(data.name) nameInp.value = data.name;
            if(data.role) roleInp.value = data.role;
            if(data.location) locInp.value = data.location;
            if(data.bio) bioInp.value = data.bio;
            if(data.skills) skillsInp.value = data.skills;
            if(data.youtube) ytInp.value = data.youtube;
            if(data.instagram) instaInp.value = data.instagram;
            if(data.profilePic) {
                profileImg.src = data.profilePic;
                base64Avatar = data.profilePic;
            }
        }
    } catch (e) { 
        console.log("No existing profile found or error fetching.", e); 
    }

    // =====================================
    // 2. PROFILE PHOTO PICKER & COMPRESSION
    // =====================================
    function openFilePicker() {
        avatarInput.click();
    }
    
    avatarWrapper.addEventListener('click', openFilePicker);
    photoTriggerText.addEventListener('click', openFilePicker);

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Profile pictures should be small and square, compressing it!
                    const canvas = document.createElement('canvas');
                    canvas.width = 300; 
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw centered and cropped
                    const size = Math.min(img.width, img.height);
                    const x = (img.width / 2) - (size / 2);
                    const y = (img.height / 2) - (size / 2);
                    ctx.drawImage(img, x, y, size, size, 0, 0, canvas.width, canvas.height);
                    
                    base64Avatar = canvas.toDataURL('image/jpeg', 0.6); // 60% Quality
                    profileImg.src = base64Avatar;
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // =====================================
    // 3. SAVE DATA TO FIREBASE
    // =====================================
    saveBtn.addEventListener('click', async () => {
        saveBtn.innerHTML = 'Saving...';
        saveBtn.disabled = true;

        try {
            // Saving data under "users" collection inside document "aravinth_profile"
            await setDoc(doc(db, "users", "aravinth_profile"), {
                name: nameInp.value.trim(),
                role: roleInp.value.trim(),
                location: locInp.value.trim(),
                bio: bioInp.value.trim(),
                skills: skillsInp.value.trim(),
                youtube: ytInp.value.trim(),
                instagram: instaInp.value.trim(),
                profilePic: base64Avatar || profileImg.src,
                updatedAt: serverTimestamp()
            }, { merge: true });

            alert('Profile Updated Successfully! 🎬');
            
            // Redirecting to profile page to see the fresh changes
            window.location.href = 'profile.html'; 
        } catch (err) {
            console.error("Error saving profile:", err);
            alert('Error saving profile. Try again.');
            saveBtn.innerHTML = 'Save';
            saveBtn.disabled = false;
        }
    });
});