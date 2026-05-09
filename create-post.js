import { db } from './firebase-config.js'; 
import { collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const captionInput = document.getElementById('post-caption');
    const shareBtn = document.getElementById('share-btn');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const realFileInput = document.getElementById('real-file-input');
    const mediaPreview = document.getElementById('media-preview');
    const previewImg = document.getElementById('preview-img');
    const removeMediaBtn = document.getElementById('remove-media');
    
    const locationBtn = document.getElementById('add-location-btn');
    const tagBtn = document.getElementById('add-tag-btn');
    const projectBtn = document.getElementById('add-project-btn');

    const locOverlay = document.getElementById('location-overlay');
    const locModal = document.getElementById('location-modal');
    const tagOverlay = document.getElementById('tag-overlay');
    const tagModal = document.getElementById('tag-modal');
    const projOverlay = document.getElementById('project-overlay');
    const projModal = document.getElementById('project-modal');
    const privacyOverlay = document.getElementById('privacy-overlay');
    const privacyModal = document.getElementById('privacy-modal');
    
    const selectedLocDisplay = document.getElementById('selected-loc-display');
    const privacyBtn = document.getElementById('privacy-btn');
    const privacyText = document.getElementById('privacy-text');

    // UI Elements for dynamic user loading
    const currentUserAvatar = document.getElementById('current-user-avatar');
    const currentUserNameDisplay = document.getElementById('current-user-name');
    const toastMessage = document.getElementById('toast-message');

    let finalBase64Image = ""; 
    let selectedLocation = "";
    let selectedPrivacy = "Anyone"; 
    
    let dbUserName = "Aravinth";
    let dbUserAvatar = "";

    // TOAST FUNCTION
    function showToast(msg) {
        if(!toastMessage) return;
        toastMessage.innerText = msg;
        toastMessage.classList.remove('hidden');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
            setTimeout(() => toastMessage.classList.add('hidden'), 300);
        }, 2000);
    }

    // --- FETCH CURRENT USER DATA FROM FIREBASE ---
    async function fetchUserData() {
        try {
            const userSnap = await getDoc(doc(db, "users", "aravinth_profile"));
            if (userSnap.exists()) {
                const uData = userSnap.data();
                dbUserName = uData.name || "Aravinth";
                dbUserAvatar = uData.profilePic || "";
                
                currentUserNameDisplay.innerText = dbUserName;
                if (dbUserAvatar !== "") {
                    currentUserAvatar.src = dbUserAvatar;
                }
            } else {
                currentUserNameDisplay.innerText = dbUserName;
            }
        } catch(e) { 
            console.error("Error fetching user data:", e); 
            currentUserNameDisplay.innerText = dbUserName;
        }
    }
    
    await fetchUserData();

    function checkInput() {
        if (captionInput.value.trim() !== '' || finalBase64Image !== '') {
            shareBtn.disabled = false;
        } else {
            shareBtn.disabled = true;
        }
    }
    captionInput.addEventListener('input', checkInput);

    // --- FILE PICKER & COMPRESSION ---
    addPhotoBtn.addEventListener('click', () => realFileInput.click());

    realFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; 
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    finalBase64Image = canvas.toDataURL('image/jpeg', 0.6); 
                    previewImg.src = finalBase64Image;
                    mediaPreview.style.display = 'block';
                    checkInput();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    removeMediaBtn.addEventListener('click', () => {
        mediaPreview.style.display = 'none';
        previewImg.src = '';
        finalBase64Image = "";
        realFileInput.value = ''; 
        checkInput();
    });

    // --- MODAL OPEN/CLOSE HELPER ---
    function openModal(overlay, modal) {
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    }
    function closeModal(overlay, modal) {
        modal.classList.add('hidden');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    // --- PRIVACY LOGIC ---
    privacyBtn.addEventListener('click', () => openModal(privacyOverlay, privacyModal));
    document.getElementById('close-privacy').addEventListener('click', () => closeModal(privacyOverlay, privacyModal));
    privacyOverlay.addEventListener('click', () => closeModal(privacyOverlay, privacyModal));

    document.querySelectorAll('.privacy-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedPrivacy = item.getAttribute('data-value');
            privacyText.innerText = selectedPrivacy;
            document.querySelectorAll('.privacy-item svg').forEach(svg => svg.style.color = 'var(--text-muted)');
            item.querySelector('svg').style.color = 'var(--gold)';
            closeModal(privacyOverlay, privacyModal);
        });
    });

    // --- LOCATION LOGIC ---
    locationBtn.addEventListener('click', () => openModal(locOverlay, locModal));
    document.getElementById('close-location').addEventListener('click', () => closeModal(locOverlay, locModal));
    locOverlay.addEventListener('click', () => closeModal(locOverlay, locModal));

    document.querySelectorAll('.loc-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedLocation = item.innerText;
            selectedLocDisplay.innerText = `📍 ${selectedLocation}`;
            selectedLocDisplay.style.display = 'block';
            closeModal(locOverlay, locModal);
        });
    });

    // --- TAG PEOPLE LOGIC ---
    tagBtn.addEventListener('click', () => openModal(tagOverlay, tagModal));
    document.getElementById('close-tag').addEventListener('click', () => closeModal(tagOverlay, tagModal));
    tagOverlay.addEventListener('click', () => closeModal(tagOverlay, tagModal));

    document.querySelectorAll('.user-tag-item').forEach(item => {
        item.addEventListener('click', () => {
            const username = item.getAttribute('data-username');
            captionInput.value += ` ${username} `;
            checkInput();
            closeModal(tagOverlay, tagModal);
        });
    });

    // --- ADD PROJECT LOGIC ---
    projectBtn.addEventListener('click', () => openModal(projOverlay, projModal));
    document.getElementById('close-project').addEventListener('click', () => closeModal(projOverlay, projModal));
    projOverlay.addEventListener('click', () => closeModal(projOverlay, projModal));

    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', () => {
            const project = item.getAttribute('data-project');
            captionInput.value += `\n${project}`;
            checkInput();
            closeModal(projOverlay, projModal);
        });
    });

    const tags = document.querySelectorAll('.post-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    // --- FIREBASE WRITE LOGIC ---
    shareBtn.addEventListener('click', async () => {
        shareBtn.innerHTML = 'Posting⏳'; 
        shareBtn.disabled = true; 
        
        try {
            const postContent = captionInput.value.trim();
            const activeTagElement = document.querySelector('.post-tag.active');
            const activeTag = activeTagElement ? activeTagElement.innerText : 'Standard';

            // Saving dynamic user name along with post data
            await addDoc(collection(db, "posts"), {
                userName: dbUserName, // Saving exact DB name!
                userAvatar: dbUserAvatar,
                content: postContent,
                tag: activeTag,
                location: selectedLocation, 
                privacy: selectedPrivacy,
                imageUrl: finalBase64Image, 
                likes: 0,
                commentsCount: 0,
                timestamp: serverTimestamp() 
            });

            showToast('Post Published Successfully! 🎉');
            
            // Wait for toast to show, then redirect
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);

        } catch (error) {
            console.error("Error adding post: ", error);
            showToast("Oops! Upload aagala. Image size perusa irukkalam.");
            shareBtn.innerHTML = 'Share';
            shareBtn.disabled = false;
        }
    });
});