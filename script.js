
document.addEventListener("DOMContentLoaded", function () {

    // Safe initialization (prevents site crash)
    try {
        loadCounts();
    } catch (error) {
        console.log("Backend not available, using fallback data.");
    }

    // Attach button events safely
    setupButtons();
});


// ===============================
// SAFE DASHBOARD COUNTS
// ===============================
function loadCounts() {
    // ❌ Backend removed (prevents fetch crash)

    // ✅ Static fallback values
    const donorCount = 120;
    const requestCount = 45;

    const donorEl = document.getElementById("donorCount");
    const requestEl = document.getElementById("requestCount");

    if (donorEl) donorEl.innerText = donorCount;
    if (requestEl) requestEl.innerText = requestCount;
}


// ===============================
// BUTTON HANDLERS
// ===============================
function setupButtons() {

    // Register button
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            showNotification("Redirecting to Register Page...");
            window.location.href = "register.html";
        });
    }

    // Login button
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            showNotification("Opening Login Page...");
            window.location.href = "login.html";
        });
    }

    // Search button
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            showNotification("Searching donors...");
            window.location.href = "search.html";
        });
    }

    // Request button
    const requestBtn = document.getElementById("requestBtn");
    if (requestBtn) {
        requestBtn.addEventListener("click", function () {
            showNotification("Opening Request Page...");
            window.location.href = "request.html";
        });
    }
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
