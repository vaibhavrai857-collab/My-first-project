document.getElementById("donorForm")?.addEventListener("submit", async e => {
e.preventDefault();

let donor = {
name: document.getElementById("name").value,
age: document.getElementById("age").value,
blood: document.getElementById("blood").value,
phone: document.getElementById("phone").value,
city: document.getElementById("city").value,
aadhaar: document.getElementById("aadhaar").value
};

await fetch("http://localhost:3000/add-donor", {
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(donor)
});

alert("Registered Successfully ✅");
e.target.reset();
});


document.getElementById("requestForm")?.addEventListener("submit", async e => {
e.preventDefault();

let req = {
name: document.getElementById("patientName").value,
blood: document.getElementById("bloodGroup").value,
phone: document.getElementById("phone").value,
city: document.getElementById("city").value
};

await fetch("http://localhost:3000/request-blood", {
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(req)
});

alert("Request Submitted ✅");
e.target.reset();
});


async function searchDonors(){
let blood = document.getElementById("blood_group").value;
let city = document.getElementById("city").value;

let res = await fetch(`http://localhost:3000/search?city=${city}&blood=${blood}`);
let data = await res.json();

let table = document.getElementById("results");

table.innerHTML = `
<tr>
<th>Name</th><th>Blood</th><th>Phone</th><th>City</th>
</tr>
`;

data.forEach(d=>{
let r = table.insertRow();
r.insertCell(0).innerText = d.name;
r.insertCell(1).innerText = d.blood;
r.insertCell(2).innerText = d.phone;
r.insertCell(3).innerText = d.city;
});
}