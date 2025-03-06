const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const port = 4000;
const app = express();
const client = require("./db");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const SECRET_KEY = "appweb";
app.use(cors(corsOptions));
app.use(bodyParser.json());

const authenticateToken = (request, response, next) => {
  const token = request.header("Authorization");
  if (!token) return response.status(401).send("Access denied. No token provided.");

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return response.status(403).send("Forbidden : Invalid Token");
    request.user = user;
    next();
  });
};

app.post("/auth/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const result = await client.query(`SELECT username FROM users WHERE  email = '${email}' AND  password = '${password}' limit 1`);

    if (result.rows.length === 1) {
      response.status(201).json({
        data: result.rows[0],
        token: jwt.sign({ username: result.rows[0].username }, SECRET_KEY, { expiresIn: "15m" }),
        message: "Login Success!",
        status: 201,
      });
    } else {
      response.status(200).json({
        message: "Username or password incorrects!",
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

app.post("/auth/registrasi", async (request, response) => {
  const { username, password, email } = request.body;

  try {
    const result = await client.query(`SELECT * FROM users WHERE email = '${email}' or username = '${username}'`);
    if (result.rows.length === 0) {
      await client.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3  ) RETURNING *", [username, password, email]);
      response.status(201).json({
        status: 201,
        message: "Registrasi Success!",
      });
    } else {
      response.status(200).json({
        status: 200,
        message: "Username atau email already exists",
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

app.get("/books", authenticateToken, async (request, response) => {
  try {
    const result = await client.query("SELECT * FROM books");
    response.status(201).json({
      status: 201,
      data: result.rows,
      message: "Get All Books Success!",
    });
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});

app.get("/books/search", authenticateToken, async (request, response) => {
  const { title } = request.query;
  if (!title) {
    response.status(400).send("Query parameter is missing");
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
        message: "No book found!",
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
app.get("/books/genre", authenticateToken, async (request, response) => {
  const { genre } = request.query;
  try {
    const result = await client.query(`SELECT * FROM books WHERE genre ILIKE '%${genre}%'`);
    if (result.rows.length !== 0) {
      response.status(201).json({
        data: result.rows,
        status: 201,
        message: "Get Books by Genre Success!",
      });
    } else {
      response.status(200).json({ message: "No books found by this genre" });
    }
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});

app.get("/books/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  try {
    const result = await client.query(`SELECT * FROM books where id =${id}`);
    if (result.rows.length === 1) {
      response.status(201).json({
        status: 201,
        data: result.rows,
        message: "Get Book Success!",
      });
    } else {
      response.status(200).json({ message: "Book not found" });
    }
  } catch (err) {
    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err,
    });
  }
});
app.post("/books/add", authenticateToken, async (request, response) => {
  const { title, description, author, genre } = request.body;
  try {
    const result = await client.query(`SELECT * FROM books WHERE title = '${title}'`);
    if (result.rowCount === 0) {
      await client.query(`INSERT INTO books (title, description, author,genre) VALUES ('${title}', '${description}', '${author}', '${genre}')`);
      response.status(201).json({
        data: result.rows[0],
        status: 201,
        message: "Book added successfully",
      });
    } else {
      response.status(200).json({ message: "Book already exists!" });
    }
  } catch (err) {
    response.status(500).json({
      error: "Internal Server Error!!!",
      message: err.message,
    });
  }
});
app.post("/books/borrow", async (request, response) => {
  // const { id } = req.params;
  const { userId, bookId } = req.body;

  try {
    await client.query(`SELECT * from books where id=${bookId}`);
    if (result.rows.length === 0) {
      return response.status(404).send("Buku yang dipinjamkan tidak ditemukan.");
    } else if (result.rows.length === 1 && result.rows[0].isBorrowed === false) {
      await client.query(`insert into books (isBorrowed, borrowedBy) VALUES ('true', ${userId}) where id = ${bookId}`);
      response.status(201).json({
        message: "Buku berhasil dipinjam.",
        status: 201,
      });
    } else if (result.rows[0].isBorrowed === true) {
      response.status(200).json({
        message: "Buku sedang dipinjam.",
        status: 200,
      });
    }
  } catch (e) {
    response.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }

  // const book = book.find((b) => b.id === id);
  // if (!book) return response.status(404).send("Buku tidak ditemukan.");
  // if (book.isBorrowed) return response.status(400).send("Buku sudah dipinjam.");

  // book.isBorrowed = true;
  // book.borrowedBy = userId;

  // res.send("Buku berhasil dipinjam.");
});

// Update data
app.put("/books/update/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { title, description, author, genre } = request.body;
  try {
    const result = await client.query(`UPDATE books SET title ='${title}', description ='${description}', author = '${author}',genre = '${genre}' WHERE id = ${id} RETURNING *`);
    response.json({
      data: result.rows,
      status: 200,
      message: "Book updated successfully",
    });
  } catch (err) {
    response.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
});

// Hapus data
app.delete("/books/delete/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  try {
    await client.query(`DELETE FROM books WHERE id = ${id}`);
    response.json({ message: "Item deleted", status: 200 });
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
