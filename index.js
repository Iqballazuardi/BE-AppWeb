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
  const { username, password, email } = request.body;

  try {
    const result = await client.query(`SELECT * FROM users WHERE email = '${email}' or username = '${username}'`);
    if (result.rows.length === 0) {
      await client.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3  ) RETURNING *", [username, password, email]);
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

    response.status(201).json(result.rows);
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});

app.get("/books/search", async (request, response) => {
  const { title } = request.query;
  if (!title) {
    return response.status(400).send("Query parameter q is missing");
  }
  try {
    const result = await client.query(`SELECT * FROM books WHERE title ILIKE '%${title}%'`);
    if (result.rows.length !== 0) {
      response.status(201).json({
        data: result.rows,
        message: "Get Search Books Success!",
        status: 201,
      });
    } else {
      response.status(200).json({
        message: "No books found!",
        status: 200,
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

app.get("/books/books/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const result = await client.query(`SELECT * FROM books where id =${id}`);
    if (result.rows.length === 1) {
      response.status(201).json(result.rows[0]);
    } else {
      response.status(200).json({ message: "Book not found" });
    }
    // return result.rows;
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});

// Tambahkan data baru
app.post("/books/addBooks", async (request, response) => {
  const { title, description, author } = request.body;
  try {
    const result = await client.query("SELECT * FROM books");
    if (result.rows.length === 0) {
      await client.query(`INSERT INTO books (title, description, author) VALUES ('${title}', '${description}', '${author}')`);
      response.status(200).json(result.rows[0]);
    }
  } catch (err) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// Update data
app.put("/books/booksUpdate/:id", async (request, response) => {
  const { id } = request.params;
  const { title, description, author } = request.body;
  try {
    const result = await client.query(`UPDATE books SET title ='${title}', description ='${description}', author = '${author}' WHERE id = ${id} RETURNING *`);
    console.log(result);
    response.json(result.rows[0]);
  } catch (err) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// Hapus data
app.delete("/books/delete/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await client.query(`DELETE FROM books WHERE id = ${id}`);
    response.json({ message: "Item deleted" });
  } catch (err) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

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
