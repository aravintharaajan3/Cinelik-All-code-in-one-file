// --- 1. FIREBASE IMPORTS ---
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 2. NOTIFICATION BELL SYNC ---
    const bellBadge = document.querySelector('.notification-icon .badge');
    let unreadCount = localStorage.getItem('cinelink_unread_count');
    if (unreadCount === null) {
        unreadCount = 3; 
        localStorage.setItem('cinelink_unread_count', 3);
    }
    if (parseInt(unreadCount) <= 0) {
        if(bellBadge) bellBadge.style.display = 'none';
    } else {
        if(bellBadge) bellBadge.style.display = 'block';
    }

    // --- 3. TOAST NOTIFICATION HELPER ---
    const toastMessage = document.getElementById('toast-message');
    function showToast(msg) {
        if(!toastMessage) return;
        toastMessage.innerText = msg;
        toastMessage.classList.remove('hidden');
        toastMessage.classList.add('show');
        setTimeout(() => {
            toastMessage.classList.remove('show');
            setTimeout(() => toastMessage.classList.add('hidden'), 300);
        }, 2500);
    }

    // ==========================================
    // --- 4. REAL MULTIPLE STORY UPLOAD & VIEW LOGIC ---
    // ==========================================
    let myUploadedStories = []; // Stores multiple stories
    let currentStoryIndex = 0;  // Tracks which story is playing
    const myStoryBtn = document.getElementById('my-story-btn');
    
    const storyViewer = document.getElementById('story-viewer');
    const svImage = document.getElementById('sv-image');
    const svAvatar = document.getElementById('sv-avatar');
    const svName = document.getElementById('sv-name');
    const svClose = document.getElementById('sv-close');
    const svProgressBar = document.getElementById('story-progress');
    let storyTimeout;

    // Function to handle story upload (Multiple photos allowed)
    function triggerStoryUpload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*'; 
        fileInput.multiple = true; // NEW: Allow selecting multiple files at once!

        fileInput.onchange = (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                let loaded = 0;
                for (let i = 0; i < files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        myUploadedStories.push(event.target.result); 
                        loaded++;

                        // Once all selected files are processed
                        if (loaded === files.length) {
                            if(myStoryBtn) {
                                myStoryBtn.classList.add('unread');
                                const addIcon = myStoryBtn.querySelector('.add-icon');
                                if(addIcon) addIcon.style.display = 'none';
                            }
                            showToast(`Added ${files.length} stories! (${myUploadedStories.length} total) 🚀`);
                        }
                    };
                    reader.readAsDataURL(files[i]);
                }
            }
        };
        fileInput.click(); 
    }

    // Recursive function to play multiple stories
    function playMyStories(index = 0) {
        currentStoryIndex = index;
        
        // If we reached the end of the array, close the viewer
        if (index >= myUploadedStories.length) {
            closeStory();
            return;
        }

        svImage.src = myUploadedStories[index]; 
        svAvatar.src = myStoryBtn.querySelector('img').src;
        svName.innerText = "Your Story";
        
        myStoryBtn.classList.remove('unread'); 
        storyViewer.classList.remove('hidden');
        
        // Reset progress bar animation
        svProgressBar.style.transition = 'none';
        svProgressBar.style.width = '0%';
        
        setTimeout(() => {
            svProgressBar.style.transition = 'width 3s linear'; 
            svProgressBar.style.width = '100%';
        }, 50);

        // Clear previous timeout and set a new one to auto-play NEXT story
        clearTimeout(storyTimeout);
        storyTimeout = setTimeout(() => {
            playMyStories(index + 1); 
        }, 3000);
    }

    function closeStory() {
        storyViewer.classList.add('hidden');
        clearTimeout(storyTimeout);
        svProgressBar.style.transition = 'none';
        svProgressBar.style.width = '0%';
    }
    
    if(svClose) svClose.addEventListener('click', closeStory);

    // TAP TO SKIP LOGIC (Instagram style)
    if(storyViewer) {
        storyViewer.addEventListener('click', (e) => {
            if (e.target === svImage) {
                // If touching the image, SKIP to next story!
                if (svName.innerText === "Your Story") {
                    playMyStories(currentStoryIndex + 1);
                } else {
                    closeStory(); // Other people's dummy stories close on tap
                }
            } else if (e.target === storyViewer) {
                // If touching the black background area, close story
                closeStory();
            }
        });
    }

    // My Story Click Logic
    if (myStoryBtn) {
        myStoryBtn.addEventListener('click', () => {
            if (myUploadedStories.length > 0) {
                playMyStories(0); // Start from first story
            } else {
                triggerStoryUpload(); // Upload if empty
            }
        });
    }

    // Other Users' Stories
    const otherStories = document.querySelectorAll('.story:not(#my-story-btn)');
    otherStories.forEach(story => {
        story.addEventListener('click', () => {
            const imgUrl = story.querySelector('img').src;
            const userName = story.querySelector('.story-name').innerText;
            svImage.src = imgUrl; 
            svAvatar.src = imgUrl;
            svName.innerText = userName;
            story.classList.remove('unread');
            storyViewer.classList.remove('hidden');
            svProgressBar.style.transition = 'none';
            svProgressBar.style.width = '0%';
            
            setTimeout(() => {
                svProgressBar.style.transition = 'width 3s linear'; 
                svProgressBar.style.width = '100%';
            }, 50);

            clearTimeout(storyTimeout);
            storyTimeout = setTimeout(() => closeStory(), 3000);
        });
    });


    // ==========================================
    // --- 5. CREATE OPTIONS MODAL LOGIC ---
    // ==========================================
    const createBtn = document.getElementById('create-btn');
    const createOptionsOverlay = document.getElementById('create-options-overlay');
    const createOptionsModal = document.getElementById('create-options-modal');

    function closeCreateModal() {
        createOptionsModal.classList.add('hidden');
        setTimeout(() => createOptionsOverlay.classList.add('hidden'), 300);
    }

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            createOptionsOverlay.classList.remove('hidden');
            createOptionsModal.classList.remove('hidden');
        });
    }

    if (createOptionsOverlay) {
        createOptionsOverlay.addEventListener('click', closeCreateModal);
    }

    const createActions = document.querySelectorAll('.create-action');
    createActions.forEach(action => {
        action.addEventListener('click', () => {
            const type = action.getAttribute('data-type');
            closeCreateModal();
            
            setTimeout(() => {
                if (type === 'post') {
                    window.location.href = 'create-post.html';
                } else if (type === 'story') {
                    triggerStoryUpload(); // Reusing the real story upload function
                } else if (type === 'reel') {
                    showToast('Reels page coming soon! 🎬');
                } else if (type === 'live') {
                    showToast('Live streaming feature coming soon! 📡');
                }
            }, 300); 
        });
    });

    // ==========================================
    // --- 6. FIREBASE FETCH POSTS LOGIC ---
    // ==========================================
    const feedContainer = document.getElementById('feed-container');

    async function loadPosts() {
        feedContainer.innerHTML = ''; 
        try {
            const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                
                let imageHTML = '';
                if (post.imageUrl && post.imageUrl.trim() !== "") {
                    imageHTML = `<img src="${post.imageUrl}" alt="Post Image" class="post-image">`;
                }

                let locationDisplay = 'Just now';
                if (post.location && post.location.trim() !== "") {
                    locationDisplay = `📍 ${post.location} • Just now`;
                }

                const postHTML = `
                    <div class="post-card" id="post-${doc.id}" data-id="${doc.id}">
                        <div class="post-header">
                            <div class="post-user-info">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="User">
                                <div>
                                    <h4 class="username-display">${post.userName || 'Unknown User'} <span class="verified-icon">✔</span></h4>
                                    <p>${post.tag || 'Creator'} • ${locationDisplay}</p>
                                </div>
                            </div>
                            <div class="post-options" style="padding: 10px; cursor: pointer;">⋮</div>
                        </div>
                        <div class="post-content">
                            <p>${post.content || ''}</p>
                            ${imageHTML}
                        </div>
                        
                        <div class="post-actions">
                            <div class="action-btn like-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                <span>${post.likes || 0}</span>
                            </div>
                            <div class="action-btn comment-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                <span>${post.commentsCount || 0}</span>
                            </div>
                            <div class="action-btn share-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 
                                Share
                            </div>
                            <div class="action-btn save-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                        </div>
                    </div>
                `;
                feedContainer.insertAdjacentHTML('beforeend', postHTML);
            });
            feedContainer.insertAdjacentHTML('beforeend', '<div class="bottom-padding"></div>');

        } catch (error) {
            console.error("Firebase Fetch Error: ", error);
            showToast("Failed to load posts.");
        }
    }

    await loadPosts();


    // ==========================================
    // --- 7. DYNAMIC EVENT DELEGATION & POST OPTIONS ---
    // ==========================================
    let currentActiveCommentCountSpan = null; 
    let activeReplyContainer = null; 
    const commentModal = document.getElementById('comment-modal');
    const commentOverlay = document.getElementById('comment-overlay');
    const newCommentInput = document.getElementById('new-comment-input');
    
    const postOptionsOverlay = document.getElementById('post-options-overlay');
    const postOptionsModal = document.getElementById('post-options-modal');

    function closeOptionsModal() {
        postOptionsModal.classList.add('hidden');
        setTimeout(() => postOptionsOverlay.classList.add('hidden'), 300);
    }
    if(postOptionsOverlay) postOptionsOverlay.addEventListener('click', closeOptionsModal);

    const optionActions = document.querySelectorAll('.option-action');
    optionActions.forEach(action => {
        action.addEventListener('click', async () => {
            const actionType = action.getAttribute('data-action');
            const postId = postOptionsModal.getAttribute('data-post-id');
            const postUser = postOptionsModal.getAttribute('data-post-user');
            
            closeOptionsModal();

            try {
                switch(actionType) {
                    case 'report':
                        await addDoc(collection(db, "reports"), { 
                            reportedPostId: postId, 
                            reportedUser: postUser,
                            reportedBy: "Aravinth",
                            reason: "Inappropriate Content",
                            timestamp: serverTimestamp() 
                        });
                        showToast(`Thanks for letting us know. Post reported.`);
                        break;
                    case 'unfollow':
                        const postCardToRemove = document.getElementById(`post-${postId}`);
                        if(postCardToRemove) {
                            postCardToRemove.style.opacity = '0';
                            setTimeout(() => postCardToRemove.style.display = 'none', 500);
                        }
                        showToast(`You unfollowed ${postUser}`);
                        break;
                    case 'save':
                        await addDoc(collection(db, "saved_posts"), { 
                            postId: postId, 
                            savedBy: "Aravinth",
                            timestamp: serverTimestamp() 
                        });
                        showToast(`Post saved to your collections 📌`);
                        const savedCard = document.getElementById(`post-${postId}`);
                        if(savedCard) {
                            const saveBtnSvg = savedCard.querySelector('.save-btn svg');
                            if(saveBtnSvg) {
                                saveBtnSvg.style.fill = '#F5C518';
                                saveBtnSvg.style.stroke = '#F5C518';
                                savedCard.querySelector('.save-btn').classList.add('saved');
                            }
                        }
                        break;
                    case 'copy':
                        const postUrl = `${window.location.origin}/index.html?post=${postId}`;
                        await navigator.clipboard.writeText(postUrl);
                        showToast(`Link copied to clipboard 🔗`);
                        break;
                    case 'share':
                        if (navigator.share) {
                            await navigator.share({ title: `CineLink post by ${postUser}`, text: 'Check out this post!', url: window.location.href });
                        } else {
                            showToast("Web Share not supported on this device.");
                        }
                        break;
                    case 'about':
                        showToast(`${postUser} joined CineLink in 2026. Authentic Profile ✔️`);
                        break;
                }
            } catch (err) {
                console.error("Action error:", err);
                showToast("Something went wrong. Try again.");
            }
        });
    });

    feedContainer.addEventListener('click', async (e) => {
        
        const optionsBtn = e.target.closest('.post-options');
        if (optionsBtn) {
            const postCard = optionsBtn.closest('.post-card');
            const postId = postCard.getAttribute('data-id');
            const postUser = postCard.querySelector('.username-display').childNodes[0].textContent.trim();
            
            postOptionsModal.setAttribute('data-post-id', postId);
            postOptionsModal.setAttribute('data-post-user', postUser);

            postOptionsOverlay.classList.remove('hidden');
            postOptionsModal.classList.remove('hidden');
            return; 
        }

        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            const countSpan = likeBtn.querySelector('span');
            let count = parseInt(countSpan.innerText);
            const svgIcon = likeBtn.querySelector('svg');

            if (likeBtn.classList.contains('liked')) {
                likeBtn.classList.remove('liked');
                countSpan.innerText = count - 1;
                svgIcon.style.fill = 'none';
                svgIcon.style.stroke = 'currentColor';
            } else {
                likeBtn.classList.add('liked');
                countSpan.innerText = count + 1;
                svgIcon.style.fill = '#FF3B30';
                svgIcon.style.stroke = '#FF3B30';
            }
        }

        const commentBtn = e.target.closest('.comment-btn');
        if (commentBtn) {
            currentActiveCommentCountSpan = commentBtn.querySelector('span'); 
            commentOverlay.classList.remove('hidden');
            commentModal.classList.remove('hidden');
            newCommentInput.value = ""; 
            activeReplyContainer = null; 
        }

        const shareBtn = e.target.closest('.share-btn');
        if (shareBtn) {
            if (navigator.share) {
                try { await navigator.share({ title: 'CineLink', text: 'Check out this post!', url: window.location.href }); } catch (e) {}
            } else showToast("Link copied to clipboard!");
        }

        const saveBtn = e.target.closest('.save-btn');
        if (saveBtn) {
            const svgIcon = saveBtn.querySelector('svg');
            if (saveBtn.classList.contains('saved')) {
                saveBtn.classList.remove('saved');
                svgIcon.style.fill = 'none';
                svgIcon.style.stroke = 'currentColor';
                showToast("Post removed from saved");
            } else {
                saveBtn.classList.add('saved');
                svgIcon.style.fill = '#F5C518'; 
                svgIcon.style.stroke = '#F5C518';
                showToast("Post saved to collections 📌");
            }
        }
    });

    // ==========================================
    // --- 8. COMMENT MODAL INTERACTIONS ---
    // ==========================================
    const closeCommentsBtn = document.getElementById('close-comments');
    function closeCommentModal() {
        commentModal.classList.add('hidden');
        setTimeout(() => commentOverlay.classList.add('hidden'), 300);
    }
    if(closeCommentsBtn) closeCommentsBtn.addEventListener('click', closeCommentModal);
    if(commentOverlay) commentOverlay.addEventListener('click', closeCommentModal);

    const commentsList = document.getElementById('comments-list');
    const postCommentBtn = document.getElementById('post-comment-btn');

    if(commentsList) {
        commentsList.addEventListener('click', (e) => {
            const likeCol = e.target.closest('.comment-like-col');
            if (likeCol) {
                const likeBtn = likeCol.querySelector('.comment-like');
                const countSpan = likeCol.querySelector('.c-like-count');
                let count = parseInt(countSpan.innerText) || 0;

                if (likeBtn.classList.contains('liked')) {
                    likeBtn.classList.remove('liked');
                    countSpan.innerText = count > 0 ? count - 1 : 0;
                } else {
                    likeBtn.classList.add('liked');
                    countSpan.innerText = count + 1;
                }
            }

            const replyBtn = e.target.closest('.comment-reply-btn');
            if (replyBtn) {
                const parentComment = replyBtn.closest('.comment-item');
                const nameContainer = replyBtn.closest('.comment-content, .reply-content').querySelector('h4');
                const userName = nameContainer.childNodes[0].textContent.trim();
                
                let repliesCont = parentComment.querySelector('.replies-container');
                if(!repliesCont) {
                    repliesCont = document.createElement('div');
                    repliesCont.className = 'replies-container';
                    parentComment.querySelector('.comment-content').appendChild(repliesCont);
                }
                
                activeReplyContainer = repliesCont;
                newCommentInput.value = `@${userName} `;
                newCommentInput.focus();
            }
        });
    }

    if(postCommentBtn) {
        postCommentBtn.addEventListener('click', () => {
            const text = newCommentInput.value.trim();
            if(text !== "") {
                if(activeReplyContainer && text.startsWith('@')) {
                    const newReply = document.createElement('div');
                    newReply.className = 'reply-item';
                    newReply.innerHTML = `
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" class="reply-avatar">
                        <div class="reply-content">
                            <h4>Aravinth <span class="comment-time">Just now</span></h4>
                            <p>${text}</p>
                            <span class="comment-reply-btn">Reply</span>
                        </div>
                        <div class="comment-like-col">
                            <div class="comment-like"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                            <span class="c-like-count">0</span>
                        </div>
                    `;
                    activeReplyContainer.appendChild(newReply);
                } else {
                    const newComment = document.createElement('div');
                    newComment.className = 'comment-item';
                    newComment.innerHTML = `
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" class="comment-avatar">
                        <div class="comment-content">
                            <h4>Aravinth <span class="comment-time">Just now</span></h4>
                            <p>${text}</p>
                            <span class="comment-reply-btn">Reply</span>
                            <div class="replies-container"></div>
                        </div>
                        <div class="comment-like-col">
                            <div class="comment-like"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
                            <span class="c-like-count">0</span>
                        </div>
                    `;
                    commentsList.appendChild(newComment);
                }
                
                newCommentInput.value = "";
                activeReplyContainer = null; 
                
                if(currentActiveCommentCountSpan) {
                    let count = parseInt(currentActiveCommentCountSpan.innerText);
                    currentActiveCommentCountSpan.innerText = count + 1;
                }
                commentsList.scrollTop = commentsList.scrollHeight; 
            }
        });
    }
});