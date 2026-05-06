const signupBtn = document.getElementById('signup-btn');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('password-input');
const confirmPassInput = document.getElementById('confirm-password-input');
const termsCheckbox = document.getElementById('terms-checkbox');

signupBtn.addEventListener('click', () => {
    // Validation Logic
    if (nameInput.value === '' || emailInput.value === '' || passInput.value === '' || confirmPassInput.value === '') {
        showError('Fill all fields! ⚠️');
        return;
    }

    if (passInput.value !== confirmPassInput.value) {
        showError('Passwords do not match! ❌');
        return;
    }

    if (!termsCheckbox.checked) {
        showError('Accept Terms! 📝');
        return;
    }

    // Success animation and redirect to Onboarding
    signupBtn.innerHTML = 'Creating Account... ⏳';
    signupBtn.style.backgroundColor = 'var(--gold)';
    signupBtn.style.color = 'black';
    
    setTimeout(() => {
        // After signing up, take them to the role selection page
        window.location.href = 'onboarding.html'; 
    }, 1500);
});

function showError(msg) {
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = msg;
    signupBtn.style.backgroundColor = '#FF3B30';
    signupBtn.style.color = 'white';
    
    setTimeout(() => {
        signupBtn.innerHTML = originalText;
        signupBtn.style.backgroundColor = 'var(--gold)';
        signupBtn.style.color = 'black';
    }, 2000);
}