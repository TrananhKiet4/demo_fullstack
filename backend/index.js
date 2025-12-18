import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/api/students", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM students ORDER BY id");
  res.json(rows);
});

app.post("/api/students", async (req, res) => {
  const { name, age, email } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO students (name, age, email) VALUES ($1,$2,$3) RETURNING *",
    [name, age, email]
  );
  res.json(rows[0]);
});

app.delete("/api/students/:id", async (req, res) => {
  await pool.query("DELETE FROM students WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Backend running on 3000"));
