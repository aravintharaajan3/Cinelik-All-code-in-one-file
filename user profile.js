document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    let userId = params.get('user');

    // Default load aavan ulla trick
    if (!userId) {
        userId = 'karthik'; 
    }

    fetch('users.json')
        .then(res => res.json())
        .then(data => {
            const user = data[userId];

            if (user) {
                document.getElementById('up-name').innerText = user.name;
                document.getElementById('up-role').innerText = user.role;
                document.getElementById('up-loc').innerText = user.location;
                document.getElementById('up-bio').innerText = user.bio;
                document.getElementById('up-avatar').src = user.profilePic;
                // Banner assignment logic removed from here

                document.getElementById('up-stat-proj').innerText = user.stats.projects;
                document.getElementById('up-stat-fol').innerText = user.stats.followers;
                document.getElementById('up-stat-flg').innerText = user.stats.following;

                const portfolioContainer = document.getElementById('up-portfolio');
                portfolioContainer.innerHTML = user.portfolio.map(imgSrc => 
                    `<img src="${imgSrc}" alt="Portfolio Item" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px;">`
                ).join('');
            } else {
                document.getElementById('up-name').innerText = "User Data Missing";
            }
        })
        .catch(err => console.error("Error loading user data:", err));
});

function toggleFollow() {
    const btn = document.getElementById('follow-btn');
    if (btn.innerText === "Follow") {
        btn.innerText = "Following";
        btn.classList.add("following");
    } else {
        btn.innerText = "Follow";
        btn.classList.remove("following");
    }
}