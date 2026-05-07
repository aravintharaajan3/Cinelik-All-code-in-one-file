document.addEventListener('DOMContentLoaded', () => {
    
    const projectsData = [
        {
            userId: 'karthik', 
            userName: 'Karthik Raj',
            role: 'Director • 12 Projects Completed',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            title: 'Female Lead Needed',
            description: 'Looking for a talented actress (18-25) for an emotional short film.',
            location: 'Chennai',
            date: '25 May 2026',
            pay: '₹0 - ₹5,000',
            urgent: true,
            tags: ['Acting', 'Tamil', '18-25 yrs', 'Emotional'],
            saves: '56 Saved'
        },
        {
            userId: 'vikram', 
            userName: 'Vikram Editz',
            role: 'Editor • 5 Projects Completed',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            title: 'Editor Required',
            description: 'Need an editor for a 15 min short film. Experience in Premiere Pro required.',
            location: 'Chennai',
            date: '10 Jun 2026',
            pay: '₹10,000 - ₹15,000',
            urgent: false,
            tags: ['Editing', 'Premiere Pro', 'Post Production'],
            saves: '24 Saved'
        }
    ];

    const container = document.getElementById('projects-container');

    function renderProjects() {
        container.innerHTML = '';
        
        projectsData.forEach(project => {
            let tagsHTML = project.tags.map(tag => `<span class="project-tag" style="background: #222; color: #ccc; padding: 4px 10px; border-radius: 4px; font-size: 11px; margin-right: 6px;">${tag}</span>`).join('');
            let urgentHTML = project.urgent ? `<span style="color: #FF4500; font-size: 12px; display: flex; align-items: center; gap: 4px;">🔥 Urgent</span>` : '';
            
            // 👇 INGA THAAN MAGIC - URL la data anuppurom 👇
            let detailUrl = `project-detail.html?title=${encodeURIComponent(project.title)}&user=${encodeURIComponent(project.userName)}&role=${encodeURIComponent(project.role)}&loc=${encodeURIComponent(project.location)}&pay=${encodeURIComponent(project.pay)}&date=${encodeURIComponent(project.date)}&avatar=${encodeURIComponent(project.avatar)}`;

            const cardHTML = `
                <div class="project-card" style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                    <div class="project-header" style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <div class="user-info" onclick="location.href='user profile.html?user=${project.userId}'" style="display: flex; gap: 10px; cursor: pointer; align-items: center;">
                            <img src="${project.avatar}" alt="${project.userName}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                            <div>
                                <h4 style="margin: 0; color: #fff; font-size: 14px;">${project.userName} <span style="color: #1DA1F2; font-size: 14px;">✔</span></h4>
                                <p style="margin: 0; color: #888; font-size: 12px;">${project.role}</p>
                            </div>
                        </div>
                    </div>

                    <h3 style="color: #fff; margin: 0 0 8px 0; font-size: 16px;">${project.title}</h3>
                    <p style="color: #aaa; font-size: 13px; line-height: 1.5; margin-bottom: 15px;">${project.description}</p>
                    
                    <div class="project-meta" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <span style="color: #ddd; font-size: 12px;">📍 ${project.location}</span>
                        <span style="color: #ddd; font-size: 12px;">📅 ${project.date}</span>
                        <span style="color: #ddd; font-size: 12px;">💰 ${project.pay}</span>
                        ${urgentHTML}
                    </div>

                    <div class="tags-container" style="margin-bottom: 20px;">${tagsHTML}</div>

                    <div class="project-actions" style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #888; font-size: 12px; display: flex; align-items: center; gap: 4px;">🔖 ${project.saves}</span>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="window.location.href='${detailUrl}'" style="background: transparent; border: 1px solid #444; color: #fff; padding: 8px 15px; border-radius: 6px; font-weight: 600; cursor: pointer;">View Details</button>
                            <button onclick="window.location.href='${detailUrl}'" style="background: #F5C518; border: none; color: #000; padding: 8px 15px; border-radius: 6px; font-weight: 600; cursor: pointer;">Apply Now</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    renderProjects();
});