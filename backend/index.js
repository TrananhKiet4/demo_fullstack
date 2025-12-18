import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Render + Supabase BẮT BUỘC dùng Transaction Pooler
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ========== TEST ========== */
app.get("/", (req, res) => {
  res.send("API OK 🚀");
});

/* ========== CRUD ========== */

// READ
app.get("/api/students", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM students ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE
app.post("/api/students", async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO students (name, age, email) VALUES ($1,$2,$3) RETURNING *",
      [name, age, email]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  }
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email } = req.body;

    await pool.query(
      "UPDATE students SET name=$1, age=$2, email=$3 WHERE id=$4",
      [name, age, email, id]
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM students WHERE id=$1", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ========== START ========== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
