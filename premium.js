function switchBilling(type) {
    const btnMonthly = document.getElementById('btn-monthly');
    const btnYearly = document.getElementById('btn-yearly');
    const proPrice = document.getElementById('pro-price');

    if (type === 'monthly') {
        btnMonthly.classList.add('active');
        btnYearly.classList.remove('active');
        
        proPrice.style.opacity = 0;
        setTimeout(() => {
            proPrice.innerHTML = '₹199<span>/mo</span>';
            proPrice.style.opacity = 1;
        }, 150);
    } else {
        btnYearly.classList.add('active');
        btnMonthly.classList.remove('active');
        
        proPrice.style.opacity = 0;
        setTimeout(() => {
            // ₹1999 per year (Saves roughly 20%)
            proPrice.innerHTML = '₹1999<span>/yr</span>';
            proPrice.style.opacity = 1;
        }, 150);
    }
}