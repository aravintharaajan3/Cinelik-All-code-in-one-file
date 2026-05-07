document.addEventListener("DOMContentLoaded", function() {
    
    // 1. URL-la irunthu user ID edukkirom (e.g., ?user=karthik)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user') || 'aravinth'; // URL-la user illana default-a Aravinth profile varum

    // 2. data.json-la irunthu data fetch panrom
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const userProfile = data[userId];

            // 3. User data iruntha HTML-la update panrom
            if (userProfile) {
                document.getElementById('user-name').innerText = userProfile.name;
                document.getElementById('user-role').innerText = userProfile.role;
                document.getElementById('user-bio').innerHTML = userProfile.bio;
                
                document.getElementById('user-projects').innerText = userProfile.projects;
                document.getElementById('user-followers').innerText = userProfile.followers;
                document.getElementById('user-following').innerText = userProfile.following;
                
                document.getElementById('user-avatar').src = userProfile.profilePic;
                
                // Note: Cover photo and Social links namma UI-la irunthu remove pannitom, so ingayum thevaiyilla.
            } else {
                console.error("User profile not found in JSON!");
            }
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // 4. Tab Switching Logic (Portfolio, Reels, About tabs work aaga)
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show the corresponding section
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-section');
        });
    });

});