document.addEventListener("DOMContentLoaded", function() {
    
    // 1. URL-la irunthu user id edukkirom (example: profile.html?user=meera)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user') || 'arun'; // Default-a Arun profile varum

    // 2. Fetch JSON and update HTML
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const userProfile = data[userId];

            if (userProfile) {
                document.getElementById('dyn-name').innerText = userProfile.name;
                document.getElementById('dyn-role').innerText = userProfile.role;
                document.getElementById('dyn-location').innerText = userProfile.location;
                document.getElementById('dyn-languages').innerText = userProfile.languages;
                document.getElementById('dyn-bio').innerText = userProfile.bio;
                
                document.getElementById('dyn-posts').innerText = userProfile.posts;
                document.getElementById('dyn-followers').innerText = userProfile.followers;
                document.getElementById('dyn-following').innerText = userProfile.following;
                document.getElementById('dyn-projects').innerText = userProfile.projects;
                document.getElementById('dyn-rating').innerText = userProfile.rating;
                
                document.getElementById('dyn-avatar').src = userProfile.profilePic;
            }
        })
        .catch(error => console.error('Error loading data:', error));

    // Keela un pazhaya JS code edhavathu iruntha (like Create menu open aagurathu), adha apdiye vidu...
});
const portfolioVideos = [
    { title: "Emotional Scene", type: "Short Film", time: "00:45", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80" },
    { title: "Dialogue Performance", type: "Short Film", time: "01:02", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80" }
];
const achievements = [
    { icon: "🏆", title: "Best Actor", desc: "Short Film Festival 2023" },
    { icon: "🏅", title: "Nominated", desc: "Next Gen Talent Award 2024" }
];

document.addEventListener('DOMContentLoaded', () => {
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolioVideos.forEach(video => {
        portfolioContainer.innerHTML += `
            <div class="video-card">
                <img src="${video.image}" class="video-thumb" alt="${video.title}">
                <div class="video-play">▶</div>
                <div class="video-time">${video.time}</div>
                <div class="video-info"><div class="video-title">${video.title}</div><div class="video-type">${video.type}</div></div>
            </div>`;
    });

    const achievementsContainer = document.getElementById('achievements-container');
    achievements.forEach(ach => {
        achievementsContainer.innerHTML += `
            <div class="achievement-card">
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-info"><h4>${ach.title}</h4><p>${ach.desc}</p></div>
            </div>`;
    });

    // Popup logic
    const postBtnWrapper = document.querySelector('.post-btn-wrapper');
    const createOverlay = document.getElementById('create-overlay');
    if (postBtnWrapper && createOverlay) {
        postBtnWrapper.addEventListener('click', () => createOverlay.classList.add('active'));
        createOverlay.addEventListener('click', (e) => { if (e.target === createOverlay) createOverlay.classList.remove('active'); });
    }
});