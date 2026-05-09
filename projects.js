import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    const container = document.getElementById('projects-container');

    // Function to render projects HTML
    function renderProjects(projectsData) {
        container.innerHTML = '';
        
        projectsData.forEach(project => {
            let tagsHTML = "";
            if (project.tags && Array.isArray(project.tags)) {
                tagsHTML = project.tags.map(tag => `<span class="project-tag" style="background: #222; color: #ccc; padding: 4px 10px; border-radius: 4px; font-size: 11px; margin-right: 6px; display: inline-block; margin-bottom: 5px;">${tag}</span>`).join('');
            }

            let urgentHTML = project.urgent ? `<span style="color: #FF4500; font-size: 12px; display: flex; align-items: center; gap: 4px;">🔥 Urgent</span>` : '';
            
            // Magical URL linking to Project Details page
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
                        <span style="color: #888; font-size: 12px; display: flex; align-items: center; gap: 4px;">🔖 ${project.saves || '0 Saved'}</span>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="window.location.href='${detailUrl}'" style="background: transparent; border: 1px solid #444; color: #fff; padding: 8px 15px; border-radius: 6px; font-weight: 600; cursor: pointer;">View</button>
                            <button onclick="window.location.href='${detailUrl}'" style="background: #F5C518; border: none; color: #000; padding: 8px 15px; border-radius: 6px; font-weight: 600; cursor: pointer;">Apply</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // =====================================
    // FETCH REAL PROJECTS FROM FIREBASE
    // =====================================
    async function loadProjectsFromDB() {
        try {
            const q = query(collection(db, "projects"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            let projects = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                projects.push({
                    id: doc.id,
                    userId: data.userId || 'unknown',
                    userName: data.userName || 'Creator',
                    role: data.role || 'Project Lead',
                    avatar: data.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
                    title: data.title || 'Untitled Project',
                    description: data.description || 'No description provided.',
                    location: data.location || 'Anywhere',
                    date: data.date || 'TBD',
                    pay: data.pay || 'Unpaid',
                    urgent: data.urgent || false,
                    tags: data.tags || [],
                    saves: data.saves ? `${data.saves} Saved` : '0 Saved'
                });
            });

            // FALLBACK DUMMY DATA: If Database 'projects' collection is empty, use this for testing
            if (projects.length === 0) {
                projects = [
                    {
                        userId: 'karthik', userName: 'Karthik Raj', role: 'Director • 12 Projects',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                        title: 'Female Lead Needed', description: 'Looking for a talented actress (18-25) for an emotional short film.',
                        location: 'Chennai', date: '25 May 2026', pay: '₹0 - ₹5,000', urgent: true,
                        tags: ['Acting', 'Tamil', '18-25 yrs', 'Emotional'], saves: '56 Saved'
                    },
                    {
                        userId: 'vikram', userName: 'Vikram Editz', role: 'Editor • 5 Projects',
                        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
                        title: 'Editor Required', description: 'Need an editor for a 15 min short film. Experience in Premiere Pro required.',
                        location: 'Chennai', date: '10 Jun 2026', pay: '₹10,000 - ₹15,000', urgent: false,
                        tags: ['Editing', 'Premiere Pro', 'Post Production'], saves: '24 Saved'
                    }
                ];
            }

            renderProjects(projects);

        } catch (error) {
            console.error("Error fetching projects from Firebase:", error);
            container.innerHTML = '<p style="color: #666; font-size: 12px; text-align: center;">Failed to load projects.</p>';
        }
    }

    // Initialize fetch
    await loadProjectsFromDB();
});