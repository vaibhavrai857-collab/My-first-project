
/* ===============================
   SAFE INITIALIZATION
================================*/
document.addEventListener("DOMContentLoaded", function () {
    initApp();
});


function initApp() {
    try {
        loadCounts();
        setupNavigation();
    } catch (error) {
        console.log("App initialized safely without backend:", error);
    }
}


/* ===============================
   SAFE DASHBOARD COUNTS
   (NO BACKEND - NO ERRORS)
================================*/
function loadCounts() {

    // Static values (safe for GitHub Pages)
    const donorCount = 120;
    const requestCount = 45;

    const donorEl = document.getElementById("donorCount");
    const requestEl = document.getElementById("requestCount");

    if (donorEl) donorEl.innerText = donorCount;
    if (requestEl) requestEl.innerText = requestCount;
}


/* ===============================
   BUTTON NAVIGATION SYSTEM
================================*/
function setupNavigation() {

    const buttons = [
        { id: "registerBtn", page: "register.html" },
        { id: "loginBtn", page: "login.html" },
        { id: "searchBtn", page: "search.html" },
        { id: "requestBtn", page: "request.html" },
        { id: "adminBtn", page: "admin.html" }
    ];

    buttons.forEach(item => {

        const el = document.getElementById(item.id);

        if (el) {
            el.addEventListener("click", function () {
                showNotification("Opening page...");
                setTimeout(() => {
                    window.location.href = item.page;
                }, 300);
            });
        }
    });
}


/* ===============================
   NOTIFICATION SYSTEM (TOAST)
================================*/
function showNotification(message) {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#28a745";
    toast.style.color = "#fff";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "14px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    toast.style.fontFamily = "Arial";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}
