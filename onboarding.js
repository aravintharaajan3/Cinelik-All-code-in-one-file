let selectedPrimaryRole = null;
const continueBtn = document.getElementById('continue-btn');

function selectRole(roleValue, elementId) {
    // 1. Remove 'active' class from all boxes
    const allBoxes = document.querySelectorAll('.role-box');
    allBoxes.forEach(box => {
        box.classList.remove('active');
    });

    // 2. Add 'active' class to the clicked box
    const selectedBox = document.getElementById(elementId);
    selectedBox.classList.add('active');

    // 3. Save the selected role
    selectedPrimaryRole = roleValue;

    // 4. Enable the Continue button with a subtle pop animation
    continueBtn.disabled = false;
    continueBtn.style.transform = 'scale(1.02)';
    setTimeout(() => {
        continueBtn.style.transform = 'scale(1)';
    }, 150);
}

// Redirect action
continueBtn.addEventListener('click', () => {
    if (selectedPrimaryRole) {
        continueBtn.innerHTML = 'LOADING... ⏳';
        
        // Simulate a delay, then "redirect"
        setTimeout(() => {
            alert(`Awesome! You are joining as a ${selectedPrimaryRole.toUpperCase()}.\n\nIn the real app, we will use this to tune your Home Feed!`);
            // To actually redirect in your folder, uncomment the line below:
            // window.location.href = 'home.html';
        }, 1200);
    }
});