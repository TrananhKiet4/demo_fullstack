import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,                 // 🔴 quan trọng
  idleTimeoutMillis: 0,   // 🔴 quan trọng
  connectionTimeoutMillis: 0
});

app.get("/", (req, res) => {
  res.send("API running OK 🚀");
});

app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("select * from students");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
