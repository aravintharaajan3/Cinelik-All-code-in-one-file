const trendingTalent = [
    { name: "Arun Prasath", role: "Actor", location: "📍 Chennai, TN", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", verified: true },
    { name: "Meera Krishnan", role: "Actress", location: "📍 Coimbatore, TN", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", verified: true },
    { name: "Vikram Editz", role: "Editor", location: "📍 Madurai, TN", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80", verified: true }
];
const verifiedTalent = [
    { name: "Ananya Ravi", role: "Actress", location: "📍 Chennai, TN", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80", verified: true },
    { name: "Karthik Raj", role: "Director", location: "📍 Trichy, TN", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", verified: true }
];
function generateCards(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.forEach(person => {
        container.innerHTML += `
            <div class="talent-card">
                <div class="play-btn">▶</div>
                <img src="${person.image}" alt="${person.name}" class="talent-image">
                <div class="talent-info">
                    <div class="talent-name">${person.name} ${person.verified ? '<span class="verified-icon">✔</span>' : ''}</div>
                    <div class="talent-role">${person.role}</div>
                    <div class="talent-location">${person.location}</div>
                </div>
            </div>`;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    generateCards(trendingTalent, 'trending-container');
    generateCards(verifiedTalent, 'verified-container');
    
    // Popup logic
    const postBtnWrapper = document.querySelector('.post-btn-wrapper');
    const createOverlay = document.getElementById('create-overlay');
    if (postBtnWrapper && createOverlay) {
        postBtnWrapper.addEventListener('click', () => createOverlay.classList.add('active'));
        createOverlay.addEventListener('click', (e) => { if (e.target === createOverlay) createOverlay.classList.remove('active'); });
    }
});