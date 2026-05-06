const searchInput = document.getElementById('search-chat');
const chatItems = document.querySelectorAll('.chat-item');

// Simple Search Filter
searchInput.addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    
    chatItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const msg = item.querySelector('p').textContent.toLowerCase();
        
        if (name.includes(filter) || msg.includes(filter)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});