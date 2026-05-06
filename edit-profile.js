const saveBtn = document.getElementById('save-profile-btn');

saveBtn.addEventListener('click', () => {
    // Basic loading animation to simulate saving to database
    saveBtn.innerHTML = 'Saving...';
    saveBtn.style.opacity = '0.5';
    
    setTimeout(() => {
        alert('Profile Updated Successfully! 🎬');
        
        // Return to the profile page
        window.history.back();
    }, 1200);
});

// Dummy logic for profile photo click
const avatarWrapper = document.querySelector('.avatar-wrapper');
avatarWrapper.addEventListener('click', () => {
    // In a real app, this would open the device file picker
    alert('Opening gallery to choose a new photo...');
});