// Importerar sqlite-modulen
const sql = require("sqlite3").verbose();

// Databasobjektet:
const db = new sql.Database("./library.db");

// Testar databasen (tas bort sen):
db.all("SELECT * FROM books", (err, rows) => console.log(rows));

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

// Simulerad databas för exempeländamål
let books = [
  { id: 1, boktitel: "book 1" },
  { id: 2, boktitel: "book 2" },
  // Lägg till fler booker om det behövs
];

// Hämta alla booker
app.get("/books", (req, res) => {
  // Callback-funktion för GET /book
  // Hämtar alla ur databasen
  const sql = "SELECT * FROM books";
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

// Hämta en book (ej obligatorisk)
/* app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE id=${id}`;

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows[0]);
    }
  });
}); */

app.get("/books/search/:query", (req, res) => {
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
  // Logik för att uppdatera en befintlig book
  const bodyData = req.body;
  const id = bodyData.id;
  const book = {
    boktitel: bodyData.boktitel,
    forfattare: bodyData.forfattare,
    genre: bodyData.genre,
    status: bodyData.status,
  }; //mappar ihop

  let updateString = "";
  const columns = Object.keys(book);
  columns.forEach((column, i) => {
    updateString += `${column}="${book[column]}"`;
    if (i !== columns.length - 1) updateString += ",";
  });
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

  // Logik för att skapa en ny book
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
      // Logik för att ta bort en book med det angivna ID:t
      res.send(`Ta bort bok med ID ${resourceId}`);
    }
  });
});

// Starta servern på valfri port (t.ex. 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jamming on ${PORT}`);
});
