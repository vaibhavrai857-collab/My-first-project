
/* ===============================
   BACKEND URL
================================*/
const BASE_URL = "https://bloodbank-api-znui.onrender.com";


/* ===============================
   INIT
================================*/
document.addEventListener("DOMContentLoaded", function () {
    loadCounts();
});


/* ===============================
   DASHBOARD COUNTS
================================*/
async function loadCounts() {
    try {
        const donorEl = document.getElementById("donorCount");
        const requestEl = document.getElementById("requestCount");

        const donorsRes = await fetch(`${BASE_URL}/donors`);
        const requestsRes = await fetch(`${BASE_URL}/requests`);

        const donors = await donorsRes.json();
        const requests = await requestsRes.json();

        if (donorEl) donorEl.innerText = donors.length;
        if (requestEl) requestEl.innerText = requests.length;

    } catch (err) {
        console.log("Count error:", err);
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

    try {
        const res = await fetch(`${BASE_URL}/add-donor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donor)
        });

        const data = await res.json();

        alert(data.message);
        e.target.reset();

    } catch (err) {
        console.log(err);
        alert("Server Error ❌");
    }
});


/* ===============================
   REQUEST BLOOD
================================*/
document.getElementById("requestForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const req = {
        name: document.getElementById("patientName").value,
        blood: document.getElementById("bloodGroup").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value
    };

    try {
        await fetch(`${BASE_URL}/request-blood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req)
        });

        alert("Request Submitted ✅");
        e.target.reset();

    } catch (err) {
        console.log(err);
        alert("Error ❌");
    }
});


/* ===============================
   SEARCH DONOR (FIXED)
================================*/
async function searchDonors() {

    const blood = document.getElementById("blood_group")?.value;
    const city = document.getElementById("city")?.value;

    if (!blood || !city) {
        alert("Select Blood Group & City");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/search?blood=${blood}&city=${city}`);

        if (!res.ok) {
            alert("Server Error ❌");
            return;
        }

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
        console.log("Search error:", err);
        alert("Search failed ❌");
    }
}
function login() {

    const id = document.getElementById("hospitalId")?.value;
    const password = document.getElementById("password")?.value;

    // simple static login (you can upgrade later)
    if (id === "admin" && password === "admin123") {

        localStorage.setItem("admin", "true");

        alert("Login Successful ✅");

        window.location = "admin.html";

    } else {
        alert("Invalid Credentials ❌");
    }
}

/* ===============================
   ADMIN - LOAD DONORS
================================*/
async function loadDonors() {

    try {
        const res = await fetch(`${BASE_URL}/donors`);
        const data = await res.json();

        const table = document.getElementById("adminTable");
        if (!table) return;

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

    } catch (err) {
        console.log("Donor load error:", err);
    }
}


/* ===============================
   ADMIN - LOAD REQUESTS (FIXED CRASH)
================================*/
async function loadRequests() {

    try {
        const res = await fetch(`${BASE_URL}/requests`);

        // FIX: if backend missing /requests, prevent crash
        if (!res.ok) {
            console.log("Requests API not found");
            return;
        }

        const data = await res.json();

        const table = document.getElementById("requestTable");
        if (!table) return;

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
                    <td><button onclick="deleteRequest(${r.id})">Delete</button></td>
                </tr>
            `;
        });

    } catch (err) {
        console.log("Request load error:", err);
    }
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
   DELETE REQUEST
================================*/
async function deleteRequest(id) {
    await fetch(`${BASE_URL}/delete-request/${id}`, {
        method: "DELETE"
    });

    loadRequests();
}


/* ===============================
   ADMIN LOGOUT
================================*/
function logout() {
    localStorage.removeItem("admin");
    window.location = "login.html";
}
