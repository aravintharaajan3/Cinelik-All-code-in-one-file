const reelContainer = document.querySelector('.reel-container');
const playIndicator = document.getElementById('play-indicator');
const likeBtn = document.getElementById('like-btn');
const likeCount = document.getElementById('like-count');
const saveBtn = document.getElementById('save-btn');

let isPlaying = true;
let isLiked = false;
let isSaved = false;

// Play/Pause simulation
reelContainer.addEventListener('click', (e) => {
    if (e.target.closest('.reel-actions') || e.target.closest('.reel-bottom-info') || e.target.closest('.reel-header')) {
        return;
    }

    if (isPlaying) {
        // Pause icon logic
        playIndicator.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        `;
        playIndicator.classList.add('show');
        isPlaying = false;
    } else {
        // Play icon logic
        playIndicator.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        `;
        playIndicator.classList.add('show');
        setTimeout(() => playIndicator.classList.remove('show'), 500);
        isPlaying = true;
    }
});

// Like Button Logic
likeBtn.addEventListener('click', () => {
    if (isLiked) {
        likeBtn.classList.remove('liked');
        likeCount.innerText = '12.4K';
        isLiked = false;
    } else {
        likeBtn.classList.add('liked');
        likeCount.innerText = '12.5K';
        isLiked = true;
    }
});

// Save Button Logic
saveBtn.addEventListener('click', () => {
    if (isSaved) {
        saveBtn.classList.remove('saved');
        isSaved = false;
    } else {
        saveBtn.classList.add('saved');
        isSaved = true;
    }
});