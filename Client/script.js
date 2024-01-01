// Funktion för att lägga till något i databasen när man klickar på
// en "Skicka"-knapp eller liknanade

const { userInfo } = require("os");

function handleData(e) {
  e.preventDefault();
  const objectToDb = {
    name: "",
    grafiskAspekt: "",
  };
  objectToDb.name = userForm.name.value;
  objectToDb.grafiskAspekt = userForm.grafiskAspekt.value;

  console.log(objectToDb);
}
