import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    
    // Get all inputs
    const titleInp = document.getElementById('proj-title');
    const roleInp = document.getElementById('proj-role');
    const typeInp = document.getElementById('proj-type');
    const locInp = document.getElementById('proj-loc');
    const compInp = document.getElementById('proj-comp');
    const budgetInp = document.getElementById('proj-budget');
    const dateInp = document.getElementById('proj-date');
    const descInp = document.getElementById('proj-desc');
    
    const submitBtn = document.getElementById('submit-project-btn');
    const toastMessage = document.getElementById('toast-message');

    let dbUserName = "Aravinth";
    let dbUserAvatar = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80";
    let dbUserRole = "Creator";

    // TOAST FUNCTION
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

    // Fetch user data so project is posted under the right person
    async function fetchUserData() {
        try {
            const userSnap = await getDoc(doc(db, "users", "aravinth_profile"));
            if (userSnap.exists()) {
                const uData = userSnap.data();
                if(uData.name) dbUserName = uData.name;
                if(uData.profilePic) dbUserAvatar = uData.profilePic;
                if(uData.role) dbUserRole = uData.role;
            }
        } catch(e) { console.error("Error fetching user data:", e); }
    }
    
    await fetchUserData();

    // Handling submission
    submitBtn.addEventListener('click', async () => {
        // Validation
        if (!titleInp.value.trim() || !locInp.value.trim() || !descInp.value.trim()) {
            showToast("Please fill all mandatory fields (*)");
            return;
        }

        submitBtn.innerHTML = 'Posting Project... ⏳';
        submitBtn.disabled = true;

        try {
            // Formatting Pay
            let payFormat = compInp.value;
            if (compInp.value === "Paid" && budgetInp.value.trim() !== "") {
                payFormat = `₹${budgetInp.value}`;
            }

            // Formatting Date
            let dateFormat = "TBD";
            if (dateInp.value) {
                const d = new Date(dateInp.value);
                dateFormat = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            }

            // Database writing
            await addDoc(collection(db, "projects"), {
                userId: "aravinth_profile", // Default test user ID
                userName: dbUserName,
                role: `${dbUserRole} • Direct Casting`,
                avatar: dbUserAvatar,
                title: titleInp.value.trim(),
                description: descInp.value.trim(),
                location: locInp.value.trim(),
                date: dateFormat,
                pay: payFormat,
                urgent: true, // Making new posts urgent by default for visibility
                tags: [roleInp.value, typeInp.value, "New"],
                saves: 0,
                timestamp: serverTimestamp()
            });

            showToast("Casting Call Posted! 🎬🎉");
            
            // Redirect to Projects feed after short delay
            setTimeout(() => {
                window.location.href = 'projects.html';
            }, 1500);

        } catch (error) {
            console.error("Error posting project: ", error);
            showToast("Error posting project. Try again.");
            submitBtn.innerHTML = 'Post Project';
            submitBtn.disabled = false;
        }
    });

});