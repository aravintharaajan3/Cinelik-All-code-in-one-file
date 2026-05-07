document.addEventListener("DOMContentLoaded", function() {
    
    // URL-la irunthu data vangurathu
    const params = new URLSearchParams(window.location.search);
    
    if(params.has('title')) document.getElementById('det-title').innerText = params.get('title');
    if(params.has('user')) document.getElementById('det-user').innerText = params.get('user');
    if(params.has('role')) document.getElementById('det-role').innerText = params.get('role');
    if(params.has('loc')) document.getElementById('det-loc').innerText = params.get('loc');
    if(params.has('pay')) document.getElementById('det-pay').innerText = params.get('pay');
    if(params.has('date')) document.getElementById('det-date').innerText = params.get('date');
    if(params.has('avatar')) document.getElementById('det-avatar').src = params.get('avatar');
    
    if(params.has('title')) {
        document.getElementById('det-desc').innerText = `Looking for talented individuals for "${params.get('title')}". Apply now to connect with ${params.get('user')}!`;
    }

    // Tabs Logic
    const tabDesc = document.getElementById('tab-desc');
    const tabReq = document.getElementById('tab-req');
    const contentDesc = document.getElementById('content-desc');
    const contentReq = document.getElementById('content-req');
    const applyBtn = document.getElementById('apply-btn');
    const successModal = document.getElementById('success-modal');

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

    // Apply Button Action
    applyBtn.addEventListener('click', () => {
        applyBtn.innerHTML = 'Sending Application... ⏳';
        setTimeout(() => {
            applyBtn.innerHTML = 'Apply Now';
            successModal.classList.add('active');
        }, 1500);
    });
});