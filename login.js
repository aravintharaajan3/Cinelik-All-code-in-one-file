const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('password-input');
const togglePassword = document.getElementById('toggle-password');
const eyeSvg = document.getElementById('eye-svg');

// Toggle Password Visibility Logic
togglePassword.addEventListener('click', () => {
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);
    
    // Change SVG stroke color to gold when password is visible
    if (type === 'text') {
        eyeSvg.setAttribute('stroke', '#F5C518'); // Gold color
    } else {
        eyeSvg.setAttribute('stroke', '#A0A0A0'); // Default muted color
    }
});

// Login Animation Logic
loginBtn.addEventListener('click', () => {
    // Basic validation
    if (emailInput.value === '' || passInput.value === '') {
        loginBtn.innerHTML = 'Enter details! ⚠️';
        loginBtn.style.backgroundColor = '#FF3B30';
        loginBtn.style.color = 'white';
        
        setTimeout(() => {
            loginBtn.innerHTML = 'Log In';
            loginBtn.style.backgroundColor = 'var(--gold)';
            loginBtn.style.color = 'black';
        }, 2000);
        return;
    }

    // Success animation and redirect to Onboarding
    loginBtn.innerHTML = 'Authenticating... ⏳';
    
    setTimeout(() => {
        // Redirects to the Onboarding / Role Selection page
        window.location.href = 'onboarding.html'; 
    }, 1500);
});