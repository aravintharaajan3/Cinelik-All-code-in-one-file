document.addEventListener('DOMContentLoaded', () => {
    // Namma JSON Database la irukka aalungaloda list
    const trendingTalents = [
        { id: 'karthik', name: 'Karthik Raj', role: 'Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { id: 'meera', name: 'Meera Krishnan', role: 'Actress', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
    ];

    const verifiedTalents = [
        { id: 'aravinth', name: 'Aravintharaajan', role: 'Producer', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
        { id: 'karthik', name: 'Karthik Raj', role: 'Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ];

    const trendingContainer = document.getElementById('trending-container');
    const verifiedContainer = document.getElementById('verified-container');

    // Function to generate user cards with ONCLICK link!
    function renderTalents(talentsArray, container) {
        container.innerHTML = '';
        talentsArray.forEach(talent => {
            
            // Inga thaan antha magical onclick link irukku (user profile.html?user=...)
            const cardHTML = `
                <div class="talent-card" onclick="location.href='user profile.html?user=${talent.id}'" style="cursor: pointer; display: inline-block; text-align: center; margin-right: 15px; width: 100px;">
                    <img src="${talent.img}" alt="${talent.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #333;">
                    <h4 style="margin: 8px 0 2px 0; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${talent.name}</h4>
                    <p style="margin: 0; font-size: 11px; color: #888;">${talent.role}</p>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // Call the function to display them
    renderTalents(trendingTalents, trendingContainer);
    renderTalents(verifiedTalents, verifiedContainer);
});