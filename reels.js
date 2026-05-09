document.addEventListener("DOMContentLoaded", () => {
    const reelsWrapper = document.getElementById('reels-wrapper');
    const playIndicator = document.getElementById('play-indicator');
    const playIconSvg = document.getElementById('play-icon-svg');

    // TOAST LOGIC
    const toastMessage = document.getElementById('toast-message');
    function showToast(msg) {
        if(!toastMessage) return;
        toastMessage.innerText = msg;
        toastMessage.classList.remove('hidden');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
            setTimeout(() => toastMessage.classList.add('hidden'), 300);
        }, 2000);
    }

    const dummyReels = [
        {
            id: 1,
            user: "Meera Krishnan",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
            video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            likes: "12.4K",
            comments: "342",
            caption: "Emotional monologue from my latest audition piece. Let me know your thoughts! 🎬🥺 #acting #monologue",
            audio: "Original Audio - Meera Krishnan"
        },
        {
            id: 2,
            user: "Vikram Edits",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
            video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            likes: "8.9K",
            comments: "120",
            caption: "Cinematic B-Roll from yesterday's ad shoot 🎥🔥 #cinematography #filmmaking",
            audio: "Trending - Epic Cinematic Music"
        },
        {
            id: 3,
            user: "Aravinth",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
            video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            likes: "45.2K",
            comments: "1.2K",
            caption: "Tech meets Cinema. Wait for the VFX drop! 🤯💻 #vfx #aftereffects",
            audio: "Beat Drop - Tech Vibes"
        }
    ];

    function renderReels() {
        dummyReels.forEach(reel => {
            const reelHTML = `
                <div class="reel-container" data-id="${reel.id}">
                    <video src="${reel.video}" loop playsinline class="reel-video-bg"></video>
                    <div class="reel-gradient"></div>

                    <div class="reel-actions">
                        <div class="action-btn like-btn">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon heart-icon">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span class="count like-count">${reel.likes}</span>
                        </div>
                        
                        <div class="action-btn">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <span class="count">${reel.comments}</span>
                        </div>
                        
                        <div class="action-btn">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            <span class="count">Share</span>
                        </div>
                        
                        <div class="action-btn save-btn">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon save-icon">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span class="count">Save</span>
                        </div>
                    </div>

                    <div class="reel-bottom-info">
                        <div class="user-row">
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <img src="${reel.avatar}" alt="${reel.user}" class="reel-avatar">
                                <h3 class="reel-username">${reel.user} <span class="verified-icon">✔</span></h3>
                            </div>
                            <button class="follow-btn">Follow</button>
                        </div>
                        
                        <p class="reel-caption">${reel.caption}</p>
                        
                        <div class="audio-track">
                            <span class="music-icon">🎵</span>
                            <marquee scrollamount="4">${reel.audio}</marquee>
                        </div>
                    </div>
                </div>
            `;
            reelsWrapper.insertAdjacentHTML('beforeend', reelHTML);
        });
    }

    renderReels();

    const videos = document.querySelectorAll('.reel-video-bg');
    const observerOptions = { root: reelsWrapper, rootMargin: '0px', threshold: 0.6 };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                video.pause();
                video.currentTime = 0; 
            }
        });
    }, observerOptions);

    videos.forEach(video => { videoObserver.observe(video); });

    reelsWrapper.addEventListener('click', (e) => {
        if (e.target.closest('.reel-actions') || e.target.closest('.reel-bottom-info') || e.target.closest('.reel-header') || e.target.closest('.bottom-nav')) {
            return; 
        }

        const container = e.target.closest('.reel-container');
        if (!container) return;

        const video = container.querySelector('video');
        if (!video) return;

        if (video.paused) {
            video.play();
            playIconSvg.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
            playIndicator.classList.add('show');
            setTimeout(() => playIndicator.classList.remove('show'), 500);
        } else {
            video.pause();
            playIconSvg.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
            playIndicator.classList.add('show');
        }
    });

    reelsWrapper.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            likeBtn.classList.toggle('liked');
            if(likeBtn.classList.contains('liked')) showToast("Reel Liked ❤️");
            return;
        }

        const saveBtn = e.target.closest('.save-btn');
        if (saveBtn) {
            saveBtn.classList.toggle('saved');
            if(saveBtn.classList.contains('saved')) showToast("Saved to collections 📌");
            return;
        }

        const followBtn = e.target.closest('.follow-btn');
        if (followBtn) {
            if (followBtn.classList.contains('following')) {
                followBtn.classList.remove('following');
                followBtn.innerText = "Follow";
            } else {
                followBtn.classList.add('following');
                followBtn.innerText = "Following";
                showToast("Started following user!");
            }
            return;
        }
    });

    // ==========================================
    // --- CREATE MENU POPUP LOGIC ---
    // ==========================================
    const createBtn = document.getElementById('main-create-trigger');
    const createOverlay = document.getElementById('create-overlay');

    if (createBtn && createOverlay) {
        createBtn.addEventListener('click', () => {
            createOverlay.classList.add('active');
        });

        createOverlay.addEventListener('click', (e) => {
            if (e.target === createOverlay) {
                createOverlay.classList.remove('active');
            }
        });
    }

    const createOptions = document.querySelectorAll('.create-option');
    createOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            createOverlay.classList.remove('active');
            
            setTimeout(() => {
                if (type === 'post') {
                    window.location.href = 'create-post.html';
                } else if (type === 'story') {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*,video/*';
                    fileInput.multiple = true;
                    fileInput.onchange = (e) => {
                        if(e.target.files.length > 0) {
                            showToast(`Story uploaded successfully! 🚀`);
                        }
                    };
                    fileInput.click();
                } else if (type === 'reel') {
                    // NEW: REAL VIDEO RECORDING / UPLOAD TRIGGER FOR REEL
                    const reelInput = document.createElement('input');
                    reelInput.type = 'file';
                    reelInput.accept = 'video/*'; // Only accepts Video
                    reelInput.setAttribute('capture', 'environment'); // Prompts phone camera instantly
                    
                    reelInput.onchange = (e) => {
                        if(e.target.files.length > 0) {
                            showToast(`Reel uploading... 🎬🔥`);
                            // Real app la inga thaan Firebase Storage-ku video-va anuppuvom
                        }
                    };
                    reelInput.click();
                }
            }, 300); 
        });
    });

});