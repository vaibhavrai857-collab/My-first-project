const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "bloodbank"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected ✅");
});

// =====================
// ADD DONOR
// =====================
app.post("/add-donor", (req, res) => {
  const { name, age, blood, phone, city, aadhaar } = req.body;

  if (!name || !age || !blood || !phone || !city || !aadhaar) {
    return res.json({ message: "All fields required ❌" });
  }

  db.query("SELECT donation_date FROM donors WHERE aadhaar=?", [aadhaar], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (result.length > 0) {
      let lastDate = result[0].donation_date;

      if (lastDate) {
        let diff = Math.floor((new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24));

        if (diff < 90) {
          return res.json({ message: `Donate again after ${90 - diff} days ❌` });
        }
      }

      return res.json({ message: "Aadhaar already registered ❌" });
    }

    const sql = `
      INSERT INTO donors (name, age, blood, phone, city, aadhaar, donation_date)
      VALUES (?, ?, ?, ?, ?, ?, CURDATE())
    `;

    db.query(sql, [name, age, blood, phone, city, aadhaar], (err) => {
      if (err) return res.status(500).json({ message: "Insert Error" });

      res.json({ message: "Registered Successfully ✅" });
    });
  });
});

// =====================
// GET DONORS
// =====================
app.get("/donors", (req, res) => {
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.status(500).send("Error");
    res.json(result);
  });
});

// =====================
// DELETE DONOR
// =====================
app.delete("/delete-donor/:id", (req, res) => {
  db.query("DELETE FROM donors WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Error");
    res.send("Deleted");
  });
});

// =====================
// SEARCH DONORS
// =====================
app.get("/search", (req, res) => {
  let city = (req.query.city || "").trim();
  let blood = (req.query.blood || "").trim();

  const sql = `
    SELECT * FROM donors
    WHERE LOWER(city) LIKE LOWER(?)
    AND LOWER(blood) = LOWER(?)
  `;

  db.query(sql, [`%${city}%`, blood], (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
});

// =====================
// REQUEST BLOOD
// =====================
app.post("/request-blood", (req, res) => {
  const { name, blood, phone, city } = req.body;

  const sql = `
    INSERT INTO requests (name, blood, phone, city)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, blood, phone, city], (err) => {
    if (err) return res.status(500).send("Error");
    res.json({ message: "Request Submitted ✅" });
  });
});

// =====================
// COUNTS
// =====================
app.get("/count-donors", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM donors", (err, r) => {
    res.json(r[0]);
  });
});

app.get("/count-requests", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM requests", (err, r) => {
    res.json(r[0]);
  });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});