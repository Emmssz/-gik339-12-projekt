// Importerar sqlite-modulen
const sql = require("sqlite3").verbose();

//Databasobjektet:
const db = new sql.Database("./databasen.db");

// Testar databasen tas bort sen:
db.all("SELECT * FROM resources", (err, rows) => console.log(rows));

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
let resources = [
  { id: 1, name: "Resurs 1" },
  { id: 2, name: "Resurs 2" },
  // Lägg till fler resurser om det behövs
];

// Hämta alla resurser
app.get("/resurs", (req, res) => {
  // Callback-funktion för GET /resurs
  res.json(resources);
});

// Uppdatera en resurs
app.put("/resurs", (req, res) => {
  // Callback-funktion för PUT /resurs
  // Logik för att uppdatera en befintlig resurs
  res.send("Uppdatera en resurs");
});

// Skapa en ny resurs
app.post("/resurs", (req, res) => {
  const resurs = req.body;
  const sql = `INSERT INTO resources(name, grafiskAspekt) VALUES (?,?)`;

  db.run(sql, Object.values(resurs), (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Skapa en ny resurs");
    }
  });
  // Callback-funktion för POST /resurs
  // Logik för att skapa en ny resurs
});

// Ta bort en specifik resurs med ID
app.delete("/resurs/:id", (req, res) => {
  // Callback-funktion för DELETE /resurs/:id
  const resourceId = req.params.id;
  // Logik för att ta bort en resurs med det angivna ID:t
  res.send(`Ta bort resurs med ID ${resourceId}`);
});

// Starta servern på valfri port (t.ex. 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jamming on ${PORT}`);
});
