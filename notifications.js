import { db } from './firebase-config.js'; // Future ready!

document.addEventListener('DOMContentLoaded', () => {
    const tabAll = document.getElementById('tab-all');
    const tabUnread = document.getElementById('tab-unread');
    const notifyItems = document.querySelectorAll('.notification-item');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const unreadBadge = document.querySelector('#tab-unread .badge');
    const toastMessage = document.getElementById('toast-message');

    // TOAST LOGIC
    function showToast(msg) {
        if(!toastMessage) return;
        toastMessage.innerText = msg;
        toastMessage.classList.remove('hidden');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
            setTimeout(() => toastMessage.classList.add('hidden'), 300);
        }, 2000);
    }

    // --- LOCAL STORAGE SYNC SETUP ---
    let readStates = JSON.parse(localStorage.getItem('cinelink_read_states')) || {};

    notifyItems.forEach((item, index) => {
        if (item.classList.contains('unread') && readStates[index]) {
            item.classList.remove('unread');
            const dot = item.querySelector('.unread-dot');
            if (dot) dot.remove();
        }
    });

    function updateUnreadCount() {
        const currentUnread = document.querySelectorAll('.notification-item.unread').length;
        localStorage.setItem('cinelink_unread_count', currentUnread);

        if (currentUnread > 0) {
            if(unreadBadge) {
                unreadBadge.innerText = currentUnread;
                unreadBadge.style.display = 'inline-block';
            }
        } else {
            if(unreadBadge) unreadBadge.style.display = 'none';
        }
    }

    updateUnreadCount();

    // --- TAB SWITCHING ---
    tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabUnread.classList.remove('active');
        
        notifyItems.forEach(item => {
            item.style.display = 'flex'; 
            item.style.opacity = '1'; 
        });
    });

    tabUnread.addEventListener('click', () => {
        tabUnread.classList.add('active');
        tabAll.classList.remove('active');
        
        notifyItems.forEach(item => {
            if (item.classList.contains('unread')) {
                item.style.display = 'flex';
                item.style.opacity = '1'; 
            } else {
                item.style.display = 'none'; 
            }
        });
    });


    // --- MARK ALL AS READ LOGIC ---
    markAllReadBtn.addEventListener('click', () => {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        
        if(unreadItems.length === 0) {
            showToast('No new notifications to read!');
            return;
        }

        notifyItems.forEach((item, index) => {
            if (item.classList.contains('unread')) {
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();
                
                readStates[index] = true;
                
                if (tabUnread.classList.contains('active')) {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            }
        });
        
        localStorage.setItem('cinelink_read_states', JSON.stringify(readStates));
        updateUnreadCount();
        showToast('All notifications marked as read ✓');
    });


    // --- CLICK NOTIFICATION TO MARK AS READ ---
    notifyItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (item.classList.contains('unread')) {
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();

                readStates[index] = true;
                localStorage.setItem('cinelink_read_states', JSON.stringify(readStates));

                updateUnreadCount();

                if (tabUnread.classList.contains('active')) {
                    item.style.opacity = '0'; 
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); 
                }
            }
        });
    });

    // --- PREVENT ROW CLICK WHEN CLICKING FOLLOW BACK ---
    const followBtns = document.querySelectorAll('.follow-back-btn');
    followBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            btn.innerHTML = 'Following';
            btn.style.backgroundColor = 'var(--gold)';
            btn.style.color = 'black';
            
            showToast('Started following Ananya Ravi!');
        });
    });

});