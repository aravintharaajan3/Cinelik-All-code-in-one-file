let applicantsData = [
    { id: 1, name: "Nila Ramesh", role: "Actress", age: 22, loc: "Chennai", match: "98% Match", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", exp: "3 Projects", status: "pending" },
    { id: 2, name: "Sneha Menon", role: "Theatre Artist", age: 24, loc: "Coimbatore", match: "85% Match", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", exp: "Fresher", status: "shortlisted" },
    { id: 3, name: "Pooja Kumar", role: "Model / Actress", age: 21, loc: "Chennai", match: "70% Match", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80", exp: "1 Project", status: "pending" },
    { id: 4, name: "Anjali Devi", role: "Actress", age: 25, loc: "Madurai", match: "40% Match", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80", exp: "5 Projects", status: "rejected" }
];

function renderApplicants(filter) {
    const container = document.getElementById('applicants-container');
    container.innerHTML = '';

    const filteredData = applicantsData.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    if (filteredData.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#666; margin-top:20px; font-size:14px;">No applicants in this category.</p>`;
        return;
    }

    filteredData.forEach(app => {
        let actionButtons = '';
        let cardClass = '';

        if (app.status === 'pending') {
            actionButtons = `
                <button class="btn-action btn-reject" onclick="updateStatus(${app.id}, 'rejected')">Reject</button>
                <button class="btn-action btn-shortlist" onclick="updateStatus(${app.id}, 'shortlisted')">Shortlist</button>
                <div class="btn-msg" onclick="window.location.href='chat.html'">💬</div>
            `;
        } else if (app.status === 'shortlisted') {
            cardClass = 'card-shortlisted';
            actionButtons = `
                <button class="btn-action" style="background:#17BF63; color:white; pointer-events:none;">✓ Shortlisted</button>
                <div class="btn-msg" onclick="window.location.href='chat.html'">💬</div>
            `;
        } else if (app.status === 'rejected') {
            cardClass = 'card-rejected';
            actionButtons = `
                <button class="btn-action" style="background:transparent; border:1px solid #E0245E; color:#E0245E; pointer-events:none;">✕ Rejected</button>
            `;
        }

        container.innerHTML += `
            <div class="applicant-card ${cardClass}">
                <div class="match-badge">${app.match}</div>
                <div class="app-profile" onclick="window.location.href='profile.html'">
                    <img src="${app.img}" alt="${app.name}">
                    <div class="app-details">
                        <h4>${app.name}</h4>
                        <p>${app.role} • ${app.age} Yrs</p>
                    </div>
                </div>
                <div class="app-tags">
                    <span class="tag">📍 ${app.loc}</span>
                    <span class="tag">🎬 ${app.exp}</span>
                </div>
                <div class="app-actions">
                    ${actionButtons}
                </div>
            </div>
        `;
    });
}

function filterApplicants(type) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    renderApplicants(type);
}

function updateStatus(id, newStatus) {
    const applicant = applicantsData.find(a => a.id === id);
    if (applicant) {
        applicant.status = newStatus;
        
        // Find which tab is currently active to re-render properly
        const activeTab = document.querySelector('.tab.active').id.replace('tab-', '');
        renderApplicants(activeTab);

        // Show Toast Notification
        showToast(`Applicant ${newStatus === 'shortlisted' ? 'Shortlisted! 🎉' : 'Rejected'}`);
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderApplicants('all');
});