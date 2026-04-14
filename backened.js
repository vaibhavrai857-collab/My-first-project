const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection (Railway)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

// ✅ Sample Route (test)
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// ✅ Example API (adjust as per your project)
app.post("/add-donor", (req, res) => {
  const { name, age, blood_group } = req.body;

  const sql = "INSERT INTO donors (name, age, blood_group) VALUES (?, ?, ?)";
  
  db.query(sql, [name, age, blood_group], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting data");
    } else {
      res.send("✅ Donor added successfully");
    }
  });
});

// ✅ PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});