document.addEventListener('DOMContentLoaded', () => {
    const tabAll = document.getElementById('tab-all');
    const tabUnread = document.getElementById('tab-unread');
    const notifyItems = document.querySelectorAll('.notification-item');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const unreadBadge = document.querySelector('#tab-unread .badge');

    // --- LOCAL STORAGE SYNC SETUP ---
    // Fetch saved states. Index 0 is Karthik Raj, 1 is Meera Krishnan
    let readStates = JSON.parse(localStorage.getItem('cinelink_read_states')) || {};

    // Apply saved states immediately when page loads
    notifyItems.forEach((item, index) => {
        // If it was supposed to be unread, but memory says we read it, remove unread classes!
        if (item.classList.contains('unread') && readStates[index]) {
            item.classList.remove('unread');
            const dot = item.querySelector('.unread-dot');
            if (dot) dot.remove();
        }
    });

    // Function to update the Badge (3) number dynamically
    function updateUnreadCount() {
        // Count elements with both .unread and .notification-item
        const currentUnread = document.querySelectorAll('.notification-item.unread').length;
        
        // Save count to local storage so home.js can read it and hide the bell dot!
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

    // Call it once on load to set count to 2 if not previously read
    updateUnreadCount();


    // --- TAB SWITCHING ---
    tabAll.addEventListener('click', () => {
        tabAll.classList.add('active');
        tabUnread.classList.remove('active');
        
        // Show all
        notifyItems.forEach(item => {
            item.style.display = 'flex'; 
            item.style.opacity = '1'; // Reset opacity for All tab
        });
    });

    tabUnread.addEventListener('click', () => {
        tabUnread.classList.add('active');
        tabAll.classList.remove('active');
        
        // Show only unread
        notifyItems.forEach(item => {
            if (item.classList.contains('unread')) {
                item.style.display = 'flex';
                item.style.opacity = '1'; // Make sure unread items are visible
            } else {
                item.style.display = 'none'; 
            }
        });
    });


    // --- MARK ALL AS READ LOGIC ---
    markAllReadBtn.addEventListener('click', () => {
        // Only target items that are currently unread
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        
        if(unreadItems.length === 0) {
            alert('No new notifications to read!');
            return;
        }

        // Iterate through all items to save their index-based read state
        notifyItems.forEach((item, index) => {
            if (item.classList.contains('unread')) {
                // 1. Remove visual indicators
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();
                
                // 2. Save read state to local memory
                readStates[index] = true;
                
                // 3. (Optional) If inside Unread tab, make them fade out
                if (tabUnread.classList.contains('active')) {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            }
        });
        
        // Save full updated readStates object to localStorage
        localStorage.setItem('cinelink_read_states', JSON.stringify(readStates));

        // 4. Update the Badge count to zero
        updateUnreadCount();
    });


    // --- CLICK NOTIFICATION TO MARK AS READ ---
    // Handle dynamic unread status per item click
    notifyItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Check if it's currently unread
            if (item.classList.contains('unread')) {
                // 1. Remove unread status visuals
                item.classList.remove('unread');
                const dot = item.querySelector('.unread-dot');
                if (dot) dot.remove();

                // 2. Save individual read state to memory
                readStates[index] = true;
                localStorage.setItem('cinelink_read_states', JSON.stringify(readStates));

                // 3. Update the Badge Count
                updateUnreadCount();

                // 4. (Optional) Smooth fade out if inside Unread tab
                if (tabUnread.classList.contains('active')) {
                    item.style.opacity = '0'; // Smooth fade out
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Waits for transition to complete
                }
            }
        });
    });

    // --- PREVENT ROW CLICK WHEN CLICKING FOLLOW BACK ---
    const followBtns = document.querySelectorAll('.follow-back-btn');
    followBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent parent row's click listener (mark as read) from firing
            e.stopPropagation(); 
            
            btn.innerHTML = 'Following';
            btn.style.backgroundColor = 'var(--gold)';
            btn.style.color = 'black';
        });
    });

});