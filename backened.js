const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ DATABASE CONNECTION (LOCAL + CLOUD SUPPORT)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "bloodbank"
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// ✅ VALIDATION
const isPhone = p => /^[0-9]{10}$/.test(p);
const isAadhaar = a => /^[0-9]{12}$/.test(a);

// ✅ ADD DONOR
app.post("/add-donor", (req, res) => {
  const { name, age, blood, phone, city, aadhaar } = req.body;

  if (!name || !age || !blood || !phone || !city || !aadhaar)
    return res.status(400).json({ message: "All fields required" });

  if (age < 18 || age > 60)
    return res.status(400).json({ message: "Age must be 18-60" });

  if (!isPhone(phone))
    return res.status(400).json({ message: "Invalid phone" });

  if (!isAadhaar(aadhaar))
    return res.status(400).json({ message: "Invalid Aadhaar" });

  db.query(
    "INSERT INTO donors VALUES (NULL,?,?,?,?,?,?)",
    [name, age, blood, phone, city, aadhaar],
    err => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }
      res.json({ message: "Donor Added Successfully ✅" });
    }
  );
});

// ✅ GET ALL DONORS
app.get("/donors", (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(result);
  });
});

// ✅ SEARCH DONORS
app.get("/search", (req, res) => {
  const { city = "", blood = "" } = req.query;

  let sql = "SELECT * FROM donors WHERE city LIKE ?";
  let values = [`%${city}%`];

  if (blood) {
    sql += " AND blood=?";
    values.push(blood);
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Search error" });
    res.json(result);
  });
});

// ✅ REQUEST BLOOD
app.post("/request-blood", (req, res) => {
  const { name, blood, phone, city } = req.body;

  if (!name || !blood || !phone || !city)
    return res.status(400).json({ message: "All fields required" });

  if (!isPhone(phone))
    return res.status(400).json({ message: "Invalid phone" });

  db.query(
    "INSERT INTO requests VALUES (NULL,?,?,?,?)",
    [name, blood, phone, city],
    err => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json({ message: "Request Saved ✅" });
    }
  );
});

// ✅ ROOT ROUTE (for testing)
app.get("/", (req, res) => {
  res.send("Blood Bank Backend Running ✅");
});

// ✅ PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});