document.addEventListener("DOMContentLoaded", function () {

    // Safe startup (prevents crash)
    loadCounts();

    setupNavigation();
});


// ===============================
// SAFE COUNTS (NO BACKEND)
// ===============================
function loadCounts() {

    // ❌ Removed backend API:
    // http://localhost:3000/count-donors

    // ✅ Static values for GitHub Pages
    const donorCount = 120;
    const requestCount = 45;

    const donorEl = document.getElementById("donorCount");
    const requestEl = document.getElementById("requestCount");

    if (donorEl) donorEl.innerText = donorCount;
    if (requestEl) requestEl.innerText = requestCount;
}


// ===============================
// BUTTON NAVIGATION FIX
// ===============================
function setupNavigation() {

    const links = [
        { id: "registerBtn", page: "register.html", msg: "Opening Register Page..." },
        { id: "loginBtn", page: "login.html", msg: "Opening Login Page..." },
        { id: "searchBtn", page: "search.html", msg: "Opening Search Page..." },
        { id: "requestBtn", page: "request.html", msg: "Opening Request Page..." }
    ];

    links.forEach(item => {
        const btn = document.getElementById(item.id);

        if (btn) {
            btn.addEventListener("click", function () {
                showNotification(item.msg);
                setTimeout(() => {
                    window.location.href = item.page;
                }, 500);
            });
        }
    });
}


// ===============================
// NOTIFICATION SYSTEM
// ===============================
function showNotification(message) {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#28a745";
    toast.style.color = "white";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    toast.style.fontSize = "14px";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
