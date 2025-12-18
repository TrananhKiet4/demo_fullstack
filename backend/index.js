import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();

// fix __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 👉 SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// 👉 nếu gõ / thì trả index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== DATABASE =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ===== CRUD =====

// READ
app.get("/api/students", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM students ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE
app.post("/api/students", async (req, res) => {
  const { name, age, email } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO students (name, age, email) VALUES ($1,$2,$3) RETURNING *",
    [name, age, email]
  );
  res.json(rows[0]);
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  await pool.query(
    "UPDATE students SET name=$1, age=$2, email=$3 WHERE id=$4",
    [name, age, email, id]
  );
  res.json({ message: "Updated" });
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM students WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
