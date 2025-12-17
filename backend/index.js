const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 CONFIG DB TỪ ENV (KHÔNG HARD CODE)
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

/* ================= MESSAGES ================= */

app.get("/api/messages", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM Messages");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  const { content } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("content", sql.NVarChar, content)
      .query("INSERT INTO Messages(Content) VALUES (@content)");

    res.json({ message: "Inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= STUDENTS ================= */

app.post("/api/students", async (req, res) => {
  const { hoTen, mssv, lop } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("HoTen", sql.NVarChar, hoTen)
      .input("MSSV", sql.VarChar, mssv)
      .input("Lop", sql.VarChar, lop)
      .query(`
        INSERT INTO Students (HoTen, MSSV, Lop)
        VALUES (@HoTen, @MSSV, @Lop)
      `);

    res.json({ message: "Thêm sinh viên thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM Students");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
