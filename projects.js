const projectsData = [
    { posterName: "Karthik Raj", posterRole: "Director", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", time: "2h ago", title: "Female Lead Needed", desc: "Looking for a talented actress (18-25) for an emotional short film.", location: "Chennai", date: "25 May 2026", budget: "₹0 - ₹5,000", tags: ["Acting", "Tamil", "18-25 yrs", "Emotional"], savedCount: 56, isUrgent: true },
    { posterName: "Vikram Editz", posterRole: "Editor", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", time: "5h ago", title: "Editor Required", desc: "Need an editor for a 15 min short film. Experience in Premiere Pro required.", location: "Coimbatore", date: "30 May 2026", budget: "₹2,000 - ₹8,000", tags: ["Editing", "Premiere Pro", "Short Film"], savedCount: 32, isUrgent: false }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('projects-container');
    projectsData.forEach(project => {
        let tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        container.innerHTML += `
            <div class="project-card">
                <div class="project-header">
                    <div class="poster-info">
                        <img src="${project.avatar}" alt="${project.posterName}" class="poster-avatar">
                        <div class="poster-details"><h4>${project.posterName} <span class="verified-icon">✔</span></h4><p>${project.posterRole}</p></div>
                    </div>
                    <div class="post-time">${project.time}</div>
                </div>
                <div class="project-body">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.desc}</p>
                    <div class="project-meta-grid">
                        <div class="meta-item">📍 ${project.location}</div>
                        <div class="meta-item">📅 ${project.date}</div>
                        <div class="meta-item">💰 ${project.budget}</div>
                        ${project.isUrgent ? '<div class="meta-item" style="color: red;">🔥 Urgent</div>' : ''}
                    </div>
                    <div class="project-tags">${tagsHTML}</div>
                </div>
                <div class="project-footer">
                    <div class="save-btn">🔖 ${project.savedCount} Saved</div>
                    
                    <!-- IDHU THAAN MACHI UPDATE AANA EDAM 👇 -->
                    <div class="action-btns">
                        <button class="btn-outline" onclick="window.location.href='project-detail.html'">View Details</button>
                        <button class="btn-solid" onclick="window.location.href='project-detail.html'">Apply Now</button>
                    </div>
                    <!-- 👆 Mela irukka rendu button-layum onclick link add panniruken -->

                </div>
            </div>`;
    });

    // Create Post Popup logic
    const postBtnWrapper = document.querySelector('.post-btn-wrapper');
    const createOverlay = document.getElementById('create-overlay');
    if (postBtnWrapper && createOverlay) {
        postBtnWrapper.addEventListener('click', () => createOverlay.classList.add('active'));
        createOverlay.addEventListener('click', (e) => { if (e.target === createOverlay) createOverlay.classList.remove('active'); });
    }
});