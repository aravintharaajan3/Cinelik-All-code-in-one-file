const tabAll = document.getElementById('tab-all');
const tabUnread = document.getElementById('tab-unread');
const notifyItems = document.querySelectorAll('.notification-item');
const markAllReadBtn = document.getElementById('mark-all-read');

// Tab Switching Logic
tabAll.addEventListener('click', () => {
    tabAll.classList.add('active');
    tabUnread.classList.remove('active');
    
    notifyItems.forEach(item => {
        item.style.display = 'flex'; // Show all
    });
});

tabUnread.addEventListener('click', () => {
    tabUnread.classList.add('active');
    tabAll.classList.remove('active');
    
    notifyItems.forEach(item => {
        if (item.classList.contains('unread')) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none'; // Hide read items
        }
    });
});

// Mark all as read logic
markAllReadBtn.addEventListener('click', () => {
    notifyItems.forEach(item => {
        item.classList.remove('unread');
        const dot = item.querySelector('.unread-dot');
        if (dot) dot.remove(); // Remove the gold dot
    });
    
    // Hide the unread count badge on the tab
    const badge = tabUnread.querySelector('.badge');
    if (badge) badge.style.display = 'none';

    // Show a small success alert
    alert('All notifications marked as read! ✔️');
});

// Click notification to mark as read
notifyItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('unread')) {
            item.classList.remove('unread');
            const dot = item.querySelector('.unread-dot');
            if (dot) dot.remove();
        }
    });
});

// Prevent row click when clicking 'Follow' button
const followBtns = document.querySelectorAll('.follow-back-btn');
followBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops the row click event
        btn.innerHTML = 'Following';
        btn.style.backgroundColor = 'var(--gold)';
        btn.style.color = 'black';
    });
});