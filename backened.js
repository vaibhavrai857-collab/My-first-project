const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection (MATCHING YOUR DB)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // your password
  database: "bloodbank" // ✅ matches your DB
});

// ✅ Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL (bloodbank)");
  }
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// ✅ Add Donor API
app.post("/add-donor", (req, res) => {
  const { name, age, blood, phone, city, aadhaar } = req.body;

  const sql = `
    INSERT INTO donors (name, age, blood, phone, city, aadhaar)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, age, blood, phone, city, aadhaar], (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      res.status(500).send("❌ Error inserting data");
    } else {
      res.send("✅ Donor added successfully");
    }
  });
});

// ✅ Search Donor API
app.get("/search", (req, res) => {
  const { city, blood } = req.query;

  const sql = "SELECT * FROM donors WHERE city=? AND blood=?";

  db.query(sql, [city, blood], (err, result) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      res.status(500).send("❌ Error fetching data");
    } else {
      res.json(result);
    }
  });
});

// ✅ Request Blood API
app.post("/request-blood", (req, res) => {
  const { name, blood, phone, city } = req.body;

  const sql = `
    INSERT INTO requests (name, blood, phone, city)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, blood, phone, city], (err, result) => {
    if (err) {
      console.error("❌ Request Error:", err);
      res.status(500).send("❌ Error submitting request");
    } else {
      res.send("✅ Blood request submitted");
    }
  });
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});