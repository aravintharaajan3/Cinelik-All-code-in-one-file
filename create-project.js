// Wait for the DOM to fully load before attaching events
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Back Button Functionality
    const backBtn = document.getElementById("back-btn");
    if(backBtn) {
        backBtn.addEventListener("click", function() {
            window.history.back();
        });
    }

    // 2. Submit Button Functionality
    const submitBtn = document.getElementById("submit-project-btn");
    if(submitBtn) {
        submitBtn.addEventListener("click", function() {
            // Logically you'd validate the form here first
            alert('Awesome! Your project has been posted successfully.');
            
            // Redirect back to projects screen
            window.location.href = 'projects.html';
        });
    }

});