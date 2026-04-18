
/* ===============================
   BACKEND URL
================================*/
const BASE_URL = "https://bloodbank-api-znui.onrender.com";


/* ===============================
   INIT
================================*/
document.addEventListener("DOMContentLoaded", () => {
    loadCounts();
});


/* ===============================
   DASHBOARD COUNTS (SAFE)
================================*/
async function loadCounts() {
    try {
        const donorEl = document.getElementById("donorCount");
        const requestEl = document.getElementById("requestCount");

        if (donorEl) donorEl.innerText = "Loading...";
        if (requestEl) requestEl.innerText = "Loading...";

        const [donorsRes, requestsRes] = await Promise.all([
            fetch(`${BASE_URL}/donors`),
            fetch(`${BASE_URL}/requests`)
        ]);

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
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value,
        blood: document.getElementById("blood").value,
        phone: document.getElementById("phone").value.trim(),
        city: document.getElementById("city").value.trim(),
        aadhaar: document.getElementById("aadhaar").value.trim()
    };

    try {
        const res = await fetch(`${BASE_URL}/add-donor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donor)
        });

        const data = await res.json();
        alert(data.message || "Success");
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
        name: document.getElementById("patientName").value.trim(),
        blood: document.getElementById("bloodGroup").value,
        phone: document.getElementById("phone").value.trim(),
        city: document.getElementById("city").value.trim()
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
   SEARCH DONOR
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
                    <td colspan="4">No donors found ❌</td>
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
        console.log(err);
        alert("Search failed ❌");
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
                    <td>
                        <button onclick="deleteDonor(${d.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}


/* ===============================
   ADMIN - LOAD REQUESTS
================================*/
async function loadRequests() {

    try {
        const res = await fetch(`${BASE_URL}/requests`);
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
                    <td>
                        <button onclick="deleteRequest(${r.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.log(err);
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
   NOTIFICATION (OPTIONAL)
================================*/
function showNotification(msg) {
    alert(msg);
}
