const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    // Show confirmation dialog
    const confirmLogout = confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
        logoutBtn.innerHTML = 'Logging out... ⏳';
        logoutBtn.style.backgroundColor = '#FF3B30';
        logoutBtn.style.color = 'white';
        
        setTimeout(() => {
            // Redirect to the login screen
            window.location.href = 'login.html'; 
        }, 1200);
    }
});