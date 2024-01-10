// Importerar sqlite-modulen
const sql = require("sqlite3").verbose();

// Databasobjektet:
const db = new sql.Database("./library.db");

// Skapar servern:
const express = require("express");
const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

// Middleware för att hantera JSON-data
app.use(express.json());

// Hämta alla böcker ur databasen
app.get("/books", (req, res) => {
  // Callback-funktion för GET /book
  const sql = "SELECT * FROM books";
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

// Hämta en book efter id
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE id=${id}`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows[0]);
    }
  });
});

// Hämta bok efter titel eller författare

app.get("/books/query/:query", (req, res) => {
  const query = req.params.query;
  const sql = `SELECT * FROM books WHERE boktitel LIKE '%${query}%' OR forfattare LIKE '%${query}%'`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

// Uppdatera en book
app.put("/books", (req, res) => {
  // Callback-funktion för PUT /book
  // Hämtar först data från förfrågan:
  const bodyData = req.body;
  const id = bodyData.id;
  // I objektet book läggs datan från bodyData
  const book = {
    boktitel: bodyData.boktitel,
    forfattare: bodyData.forfattare,
    genre: bodyData.genre,
    status: bodyData.status,
  };

  let updateString = "";
  // Här skapas en lista av kolumn-namnen i book-objektet och kolumnnamn samt värde läggs i updateString
  const columns = Object.keys(book);
  columns.forEach((column, i) => {
    updateString += `${column}="${book[column]}"`;
    if (i !== columns.length - 1) updateString += ",";
  });
  // SQL-sats för att uppdatera tabellen beroende på id.
  const sql = `UPDATE books SET ${updateString} WHERE id=${id}`;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Uppdaterat en book");
    }
  });
});

// Skapa en ny book
app.post("/books", (req, res) => {
  // Callback-funktion för POST /book
  const book = req.body;
  const sql = `INSERT INTO books(boktitel, forfattare, genre, status) VALUES (?,?,?,?)`;

  db.run(sql, Object.values(book), (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Skapat en ny bok");
    }
  });
});

// Ta bort en specifik book med ID
app.delete("/books/:id", (req, res) => {
  // Callback-funktion för DELETE /book/:id
  const resourceId = req.params.id;
  const sql = `DELETE FROM books WHERE id = ${resourceId}`;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(`Ta bort bok med ID ${resourceId}`);
    }
  });
});

// Starta servern på valfri port (t.ex. 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jamming on ${PORT}`);
});
