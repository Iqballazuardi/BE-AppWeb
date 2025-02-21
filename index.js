const express = require("express");
const bodyParser = require("body-parser");

const client = require("./db");
const app = express();

const port = 5432;
app.use(bodyParser.json());

// // Dapatkan semua data dari tabel
app.get("/books", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // Dapatkan data berdasarkan ID
// app.get("/api/items/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Tambahkan data baru
// app.post("/api/items", async (req, res) => {
//   const { name, description } = req.body;
//   try {
//     const result = await pool.query("INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *", [name, description]);
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Update data
// app.put("/api/items/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, description } = req.body;
//   try {
//     const result = await pool.query("UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *", [name, description, id]);
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Hapus data
// app.delete("/api/items/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query("DELETE FROM items WHERE id = $1", [id]);
//     res.json({ message: "Item deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.listen(port, () => {
  console.log(`udah jalan di sini :${port}`);
});

client.connect((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected");
  }
});
