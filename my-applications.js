const applications = [
    { id: 1, title: "Female Lead Needed", category: "Short Film", status: "shortlisted", director: "Karthik Raj", directorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", date: "Applied 2 days ago" },
    { id: 2, title: "Character Artist", category: "Web Series", status: "applied", director: "Vikram Editz", directorImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", date: "Applied 5 days ago" },
    { id: 3, title: "Music Video Heroine", category: "Music Video", status: "shortlisted", director: "Meera K", directorImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", date: "Applied 1 week ago" },
    { id: 4, title: "Side Role (College Student)", category: "Feature Film", status: "applied", director: "Siva Kumar", directorImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", date: "Applied 10 days ago" },
    { id: 5, title: "Background Dancers", category: "Music Video", status: "applied", director: "Ananya Ravi", directorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", date: "Applied 12 days ago" }
];

// Calculate and set the numbers dynamically based on the array
function initStats() {
    const total = applications.length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
    const applied = applications.filter(app => app.status === 'applied').length;

    document.getElementById('count-all').innerText = total;
    document.getElementById('count-shortlisted').innerText = shortlisted;
    document.getElementById('count-applied').innerText = applied;
}

// Render the list of applications
function renderApps(filter = 'all') {
    const container = document.getElementById('apps-container');
    container.innerHTML = '';

    const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

    filtered.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-top">
                <div class="project-info">
                    <h3>${app.title}</h3>
                    <p>${app.category}</p>
                </div>
                <div class="status-badge status-${app.status}">${app.status}</div>
            </div>
            <div class="app-bottom">
                <div class="posted-by">
                    <img src="${app.directorImg}" alt="Director">
                    <span>By ${app.director}</span>
                </div>
                <div class="applied-date">${app.date}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Handle clicks on both tabs and stat boxes
function filterApplications(type) {
    // 1. Reset all tabs and stat cards
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('highlighted'));

    // 2. Highlight the selected tab and corresponding stat card
    document.getElementById(`tab-${type}`).classList.add('active');
    document.getElementById(`stat-${type}`).classList.add('highlighted');
    
    // 3. Re-render the list
    renderApps(type);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    initStats();
    filterApplications('all'); // Initialize with 'all' selected
});