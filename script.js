const BASE_URL = "https://bloodbank-api-znui.onrender.com";

/* ===============================
   INIT
================================*/
document.addEventListener("DOMContentLoaded", () => {
    loadCounts();
});

/* ===============================
   DASHBOARD COUNTS
================================*/
async function loadCounts() {
    try {
        const d = await fetch(`${BASE_URL}/count-donors`);
        const donors = await d.json();

        const r = await fetch(`${BASE_URL}/count-requests`);
        const requests = await r.json();

        const donorEl = document.getElementById("donorCount");
        const requestEl = document.getElementById("requestCount");

        if (donorEl) donorEl.innerText = donors.total || 0;
        if (requestEl) requestEl.innerText = requests.total || 0;

    } catch (err) {
        console.log("Counts error:", err);
    }
}

/* ===============================
   REGISTER DONOR
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
    alert(data.message);
    e.target.reset();
});

/* ===============================
   BLOOD REQUEST
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

    alert("Request Submitted ✅");
    e.target.reset();
});

/* ===============================
   SEARCH DONOR
================================*/
async function searchDonors() {

    const blood = document.getElementById("blood_group").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!blood || !city) {
        alert("Select Blood Group and City");
        return;
    }

    try {
        const res = await fetch(
            `${BASE_URL}/search?blood=${encodeURIComponent(blood)}&city=${encodeURIComponent(city)}`
        );

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

        if (!Array.isArray(data) || data.length === 0) {
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

    } catch (err) {
        console.log("Search Error:", err);
        alert("Server Error ❌");
    }
}
/* ===============================
   ADMIN LOAD
================================*/

/* ===============================
   ADMIN LOGIN
================================*/
function login() {

    const id = document.getElementById("hospitalId").value.trim();
    const password = document.getElementById("password").value.trim();

    // SIMPLE STATIC LOGIN (you can upgrade later)
    const ADMIN_ID = "admin";
    const ADMIN_PASSWORD = "1234";

    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {

        localStorage.setItem("admin", "true");

        alert("Login Successful ✅");

        window.location.href = "admin.html";

    } else {
        alert("Invalid Credentials ❌");
    }
}


/* ===============================
   LOGOUT
================================*/
function logout() {

    localStorage.removeItem("admin");

    localStorage.setItem("justLoggedOut", "true");

    window.location.href = "login.html";
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

/* =========================
   LOAD DONORS
========================= */
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
                <td>
                    <button onclick="deleteDonor(${d.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}


/* =========================
   LOAD REQUESTS
========================= */
async function loadRequests() {

    const res = await fetch(`${BASE_URL}/requests`);
    const data = await res.json();

    const table = document.getElementById("requestTable");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Blood</th>
            <th>Phone</th>
            <th>City</th>
            <th>Action</th>
        </tr>
    `;

    data.forEach(r => {
        table.innerHTML += `
            <tr>
                <td>${r.name}</td>
                <td>${r.blood}</td>
                <td>${r.phone}</td>
                <td>${r.city}</td>
                <td>
                    <button onclick="deleteRequest(${r.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}


/* =========================
   DELETE DONOR
========================= */
async function deleteDonor(id) {

    await fetch(`${BASE_URL}/delete-donor/${id}`, {
        method: "DELETE"
    });

    loadDonors();
}


/* =========================
   DELETE REQUEST
========================= */
async function deleteRequest(id) {

    await fetch(`${BASE_URL}/delete-request/${id}`, {
        method: "DELETE"
    });

    loadRequests();
}


/* =========================
   ADMIN INIT
========================= */
window.onload = function () {
    loadDonors();
    loadRequests();
};
