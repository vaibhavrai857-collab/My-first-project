/* ===============================
   BACKEND URL (CHANGE AFTER RENDER DEPLOY)
================================*/
const BASE_URL = "https://bloodbank-api-znui.onrender.com";


/* ===============================
   SAFE INITIALIZATION
================================*/
document.addEventListener("DOMContentLoaded", function () {
    initApp();
});

function initApp() {
    loadCounts();
    setupNavigation();
}


/* ===============================
   DASHBOARD COUNTS (SAFE FALLBACK)
================================*/
function loadCounts() {
    const donorEl = document.getElementById("donorCount");
    const requestEl = document.getElementById("requestCount");

    if (donorEl) donorEl.innerText = 120;
    if (requestEl) requestEl.innerText = 45;
}


/* ===============================
   NAVIGATION SYSTEM
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
            el.addEventListener("click", () => {
                showNotification("Opening page...");
                setTimeout(() => {
                    window.location.href = item.page;
                }, 300);
            });
        }
    });
}


/* ===============================
   REGISTER DONOR (API)
================================*/
document.getElementById("donorForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donor = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        blood: document.getElementById("blood").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        aadhaar: document.getElementById("aadhaar").value
    };

    const res = await fetch(`${BASE_URL}/add-donor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donor)
    });

    const data = await res.json();
    showNotification(data.message);
    e.target.reset();
});


/* ===============================
   REQUEST BLOOD (API)
================================*/
document.getElementById("requestForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const req = {
        name: document.getElementById("patientName").value,
        blood: document.getElementById("bloodGroup").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value
    };

    await fetch(`${BASE_URL}/request-blood`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
    });

    showNotification("Request Submitted Successfully");
    e.target.reset();
});


/* ===============================
   SEARCH DONOR (API)
================================*/
async function searchDonors() {

    const blood = document.getElementById("blood_group").value;
    const city = document.getElementById("city").value;

    const res = await fetch(`${BASE_URL}/search?city=${city}&blood=${blood}`);
    const data = await res.json();

    const table = document.getElementById("results");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Blood</th>
            <th>Phone</th>
            <th>City</th>
        </tr>
    `;

    if (!data.length) {
        table.innerHTML += `
            <tr>
                <td colspan="4" style="text-align:center;color:red;">
                    No donors found ❌
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(d => {
        table.innerHTML += `
            <tr>
                <td>${d.name}</td>
                <td>${d.blood}</td>
                <td>${d.phone}</td>
                <td>${d.city}</td>
            </tr>
        `;
    });
}


/* ===============================
   ADMIN - LOAD DONORS
================================*/
async function loadDonors() {

    const res = await fetch(`${BASE_URL}/donors`);
    const data = await res.json();

    const table = document.getElementById("adminTable");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Blood</th>
            <th>Phone</th>
            <th>City</th>
            <th>Action</th>
        </tr>
    `;

    data.forEach(d => {
        table.innerHTML += `
            <tr>
                <td>${d.name}</td>
                <td>${d.blood}</td>
                <td>${d.phone}</td>
                <td>${d.city}</td>
                <td><button onclick="deleteDonor(${d.id})">Delete</button></td>
            </tr>
        `;
    });
}


/* ===============================
   DELETE DONOR
================================*/
async function deleteDonor(id) {

    await fetch(`${BASE_URL}/delete-donor/${id}`, {
        method: "DELETE"
    });

    loadDonors();
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

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}
