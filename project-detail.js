const tabDesc = document.getElementById('tab-desc');
const tabReq = document.getElementById('tab-req');
const contentDesc = document.getElementById('content-desc');
const contentReq = document.getElementById('content-req');
const applyBtn = document.getElementById('apply-btn');
const successModal = document.getElementById('success-modal');

// Tab Switching
tabDesc.addEventListener('click', () => {
    tabDesc.classList.add('active');
    tabReq.classList.remove('active');
    contentDesc.style.display = 'block';
    contentReq.style.display = 'none';
});

tabReq.addEventListener('click', () => {
    tabReq.classList.add('active');
    tabDesc.classList.remove('active');
    contentReq.style.display = 'block';
    contentDesc.style.display = 'none';
});

// Apply Button Logic
applyBtn.addEventListener('click', () => {
    applyBtn.innerHTML = 'Sending Application... ⏳';
    
    setTimeout(() => {
        applyBtn.innerHTML = 'Apply Now';
        // Show success modal
        successModal.classList.add('active');
    }, 1500);
});