const captionInput = document.getElementById('post-caption');
const shareBtn = document.getElementById('share-btn');
const addPhotoBtn = document.getElementById('add-photo-btn');
const mediaPreview = document.getElementById('media-preview');
const previewImg = document.getElementById('preview-img');
const removeMediaBtn = document.getElementById('remove-media');

// Enable/Disable Share button based on input
function checkInput() {
    if (captionInput.value.trim() !== '' || mediaPreview.style.display === 'block') {
        shareBtn.disabled = false;
    } else {
        shareBtn.disabled = true;
    }
}

captionInput.addEventListener('input', checkInput);

// Simulate adding a photo
addPhotoBtn.addEventListener('click', () => {
    // Adding a dummy cinematic image
    previewImg.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
    mediaPreview.style.display = 'block';
    checkInput();
});

// Remove photo
removeMediaBtn.addEventListener('click', () => {
    mediaPreview.style.display = 'none';
    previewImg.src = '';
    checkInput();
});

// Post tags selection logic
const tags = document.querySelectorAll('.post-tag');
tags.forEach(tag => {
    tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
    });
});

// Share action
shareBtn.addEventListener('click', () => {
    shareBtn.innerHTML = 'Posting⏳';
    
    setTimeout(() => {
        alert('Post Published Successfully! 🎉');
        // Go back to the feed
        window.history.back();
    }, 1500);
});