const BASE_URL = "http://localhost:3000";

/* =========================
   LOGIN
========================= */
function login() {
  let id = document.getElementById("hospitalId").value;
  let pass = document.getElementById("password").value;

  if (id === "HOSP123" && pass === "admin123") {
    localStorage.setItem("admin", "true");
    window.location = "admin.html";
  } else {
    alert("Invalid Credentials ❌");
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("admin");
  localStorage.setItem("justLoggedOut", "true");
  window.location = "index.html";
}

/* =========================
   REGISTER DONOR
========================= */
document.getElementById("donorForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const donor = {
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value.trim(),
    blood: document.getElementById("blood").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim(),
    aadhaar: document.getElementById("aadhaar").value.trim()
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

/* =========================
   BLOOD REQUEST
========================= */
document.getElementById("requestForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const req = {
    name: document.getElementById("patientName").value.trim(),
    blood: document.getElementById("bloodGroup").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim()
  };

  await fetch(`${BASE_URL}/request-blood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });

  alert("Request Submitted ✅");
  e.target.reset();
});

/* =========================
   🔍 SEARCH DONORS (FIXED)
========================= */
async function searchDonors() {

  const blood = document.getElementById("blood_group").value.trim();
  const city = document.getElementById("city").value.trim();

  if (!blood || !city) {
    alert("Please select Blood Group and City");
    return;
  }

  const url = `${BASE_URL}/search?city=${encodeURIComponent(city)}&blood=${encodeURIComponent(blood)}`;

  try {

    const res = await fetch(url);
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
        </tr>`;
      return;
    }

    data.forEach(d => {
      table.innerHTML += `
        <tr>
          <td>${d.name}</td>
          <td>${d.blood}</td>
          <td>${d.phone}</td>
          <td>${d.city}</td>
        </tr>`;
    });

  } catch (err) {
    console.log(err);
    alert("Server not responding ❌");
  }
}

/* =========================
   LOAD DONORS (ADMIN)
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
        <td><button onclick="deleteDonor(${d.id})">Delete</button></td>
      </tr>`;
  });
}

/* =========================
   DELETE DONOR
========================= */
async function deleteDonor(id) {
  if (confirm("Delete this donor?")) {
    await fetch(`${BASE_URL}/delete-donor/${id}`, {
      method: "DELETE"
    });
    loadDonors();
  }
}

/* =========================
   DASHBOARD COUNTS
========================= */
async function loadCounts() {

  const d = await fetch(`${BASE_URL}/count-donors`);
  const donors = await d.json();

  const r = await fetch(`${BASE_URL}/count-requests`);
  const req = await r.json();

  document.getElementById("donorCount").innerText = donors.total;
  document.getElementById("requestCount").innerText = req.total;
}

/* =========================
   AUTO LOAD HOME
========================= */
if (document.body.classList.contains("home")) {
  loadCounts();
}