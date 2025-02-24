const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const client = require("./db");
const app = express();
const port = 4000;

const corsOptions = {
  origin: "http://localhost:5173", //(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// // Dapatkan semua data dari tabel
app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const result = await client.query(`SELECT username FROM users WHERE  email = '${email}' AND  password = '${password}'`);
    if (result.rows.length === 1) {
      await client.query(`SELECT username FROM users where email = '${email}' and password = '${password}'`);
      response.status(201).json({
        data: result.rows[0],
        message: "Login Success!",
        status: 201,
      });
      return response.status;
    } else {
      response.status(200).json({
        message: "Username or password incorrect!s",
        status: 200,
      });
    }
  } catch (err) {
    response.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: err.message,
    });
  }
});

app.post("/registrasi", async (request, response) => {
  const { username, password, email, role } = request.body;

  try {
    const result = await client.query(`SELECT * FROM users WHERE email = '${email}' or username = '${username}'`);
    if (result.rows.length === 0) {
      await client.query("INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, role]);
      response.status(201).json({
        status: 201,
        message: "Registrasi Success!",
      });
      return response.status;
    } else {
      response.status(200).json({
        status: 200,
        message: "Username atau email  already exists",
      });
    }
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});

app.get("/books", async (request, response) => {
  try {
    const result = await client.query("SELECT * FROM books");
    console.log(response.status(200).json(result.rows));
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});
// // Dapatkan data berdasarkan ID
// app.get("/api/items:id", async (req, res) => {
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
