document.addEventListener('DOMContentLoaded', () => {
    
    // Like Button Interaction
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.innerText);

            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                this.innerHTML = `🤍 <span>${count - 1}</span>`;
            } else {
                this.classList.add('liked');
                this.innerHTML = `❤️ <span>${count + 1}</span>`;
            }
        });
    });

    // Save Button Interaction
    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.innerText === '🔖') {
                this.innerText = '✔️';
                this.style.color = '#F5C518'; // Gold color active
            } else {
                this.innerText = '🔖';
                this.style.color = 'white'; // White color inactive
            }
        });
    });

});