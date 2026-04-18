/* ===============================
   BACKEND URL
================================*/
const BASE_URL = "https://bloodbank-api-znui.onrender.com";


/* ===============================
   PAGE INIT
================================*/
document.addEventListener("DOMContentLoaded", () => {
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
    console.log("Count Error:", err);
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
    blood: document.getElementById("blood").value.trim().toUpperCase(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim().toLowerCase(),
    aadhaar: document.getElementById("aadhaar").value.trim()
  };

  try {
    const res = await fetch(`${BASE_URL}/add-donor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

  const request = {
    name: document.getElementById("patientName").value.trim(),
    blood: document.getElementById("bloodGroup").value.trim().toUpperCase(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim().toLowerCase()
  };

  try {
    await fetch(`${BASE_URL}/request-blood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    alert("Request Submitted Successfully ✅");
    e.target.reset();

  } catch (err) {
    console.log(err);
    alert("Request Failed ❌");
  }
});


/* ===============================
   SEARCH DONORS
================================*/
async function searchDonors() {
  const blood = document.getElementById("blood_group").value
    .trim()
    .toUpperCase();

  const city = document.getElementById("city").value
    .trim()
    .toLowerCase();

  if (!blood || !city) {
    alert("Please select Blood Group and City ❌");
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
        <th>Blood Group</th>
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
    alert("Search Failed ❌");
  }
}


/* ===============================
   ADMIN LOGIN
================================*/
function login() {
  const id = document.getElementById("hospitalId").value.trim();
  const password = document.getElementById("password").value.trim();

  if (id === "admin" && password === "admin123") {
    localStorage.setItem("admin", "true");
    alert("Login Successful ✅");
    window.location = "admin.html";
  } else {
    alert("Invalid Credentials ❌");
  }
}


/* ===============================
   LOAD DONORS (ADMIN)
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
            <button onclick="deleteDonor(${d.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.log("Load Donors Error:", err);
  }
}


/* ===============================
   LOAD REQUESTS (ADMIN)
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
            <button onclick="deleteRequest(${r.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.log("Load Requests Error:", err);
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
   LOGOUT
================================*/
function logout() {
  localStorage.removeItem("admin");
  localStorage.setItem("justLoggedOut", "true");
  window.location = "login.html";
}
/* ===============================
   AUTHORIZED HOSPITAL PARTNERSHIP
================================*/
document.getElementById("hospitalForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const authCode = document.getElementById("authorizationCode").value.trim();

  /* TEMPORARY AUTHORIZATION CODE */
  const validCode = "HOSPITAL2026";

  if (authCode !== validCode) {
    alert("Only authorized hospital representatives can apply ❌");
    return;
  }

  const hospital = {
    hospital_name: document.getElementById("hospitalName").value.trim(),
    contact_person: document.getElementById("contactPerson").value.trim(),
    designation: document.getElementById("designation").value,
    phone: document.getElementById("hospitalPhone").value.trim(),
    email: document.getElementById("hospitalEmail").value.trim(),
    city: document.getElementById("hospitalCity").value.trim()
  };

  try {
    const res = await fetch(`${BASE_URL}/add-hospital`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(hospital)
    });

    const data = await res.json();

    alert(data.message);
    e.target.reset();

  } catch (err) {
    console.log(err);
    alert("Hospital Registration Failed ❌");
  }
});
