import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const captionInput = document.getElementById('post-caption');
    const shareBtn = document.getElementById('share-btn');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const mediaPreview = document.getElementById('media-preview');
    const previewImg = document.getElementById('preview-img');
    const removeMediaBtn = document.getElementById('remove-media');
    
    // Extra Tools
    const toolItems = document.querySelectorAll('.tool-item');
    const locationBtn = toolItems[1];
    const tagBtn = toolItems[2];
    const projectBtn = toolItems[3];

    let selectedImageFile = null;

    // Enable/Disable Share button
    function checkInput() {
        if (captionInput.value.trim() !== '' || mediaPreview.style.display === 'block') {
            shareBtn.disabled = false;
        } else {
            shareBtn.disabled = true;
        }
    }

    captionInput.addEventListener('input', checkInput);

    // 1. REAL FILE PICKER LOGIC
    addPhotoBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*'; 
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedImageFile = file;
                // Create a local temporary URL to show the selected image
                previewImg.src = URL.createObjectURL(file);
                mediaPreview.style.display = 'block';
                checkInput();
            }
        };
        fileInput.click(); 
    });

    removeMediaBtn.addEventListener('click', () => {
        mediaPreview.style.display = 'none';
        previewImg.src = '';
        selectedImageFile = null;
        checkInput();
    });

    // 2. EXTRA TOOLS LOGIC
    locationBtn.addEventListener('click', () => {
        let loc = prompt("Enter location (e.g., Chennai, Kodambakkam):");
        if(loc) captionInput.value += `\n📍 Location: ${loc}`;
        checkInput();
    });

    tagBtn.addEventListener('click', () => {
        let tag = prompt("Enter username to tag (e.g., @KarthikRaj):");
        if(tag) captionInput.value += ` ${tag} `;
        checkInput();
    });

    projectBtn.addEventListener('click', () => {
        let proj = prompt("Enter project name:");
        if(proj) captionInput.value += `\n🎬 Project: ${proj}`;
        checkInput();
    });

    // 3. POST TAGS LOGIC
    const tags = document.querySelectorAll('.post-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    // 4. FIREBASE WRITE LOGIC
    shareBtn.addEventListener('click', async () => {
        shareBtn.innerHTML = 'Posting⏳';
        shareBtn.disabled = true; 
        
        try {
            const postContent = captionInput.value.trim();
            const activeTagElement = document.querySelector('.post-tag.active');
            const activeTag = activeTagElement ? activeTagElement.innerText : 'Standard';

            // Placeholder image link (Will be replaced with Firebase Storage link later)
            let imageUrlToSave = "";
            if (selectedImageFile) {
                imageUrlToSave = "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=600&q=80";
            }

            // Save to Firestore
            await addDoc(collection(db, "posts"), {
                userName: "Arun Prasath", 
                content: postContent,
                tag: activeTag,
                imageUrl: imageUrlToSave, // Saving the image URL to DB!
                likes: 0,
                commentsCount: 0,
                timestamp: serverTimestamp() 
            });

            alert('Post Published Successfully! 🎉');
            window.location.href = 'index.html'; 

        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Oops! Post aagala. Console-a check pannu machi.");
            shareBtn.innerHTML = 'Share';
            shareBtn.disabled = false;
        }
    });
});