// Funktion för att lägga till något i databasen när man klickar på
// en "Skicka"-knapp eller liknanade

const { userInfo } = require("os");

function handleBooks(e) {
  e.preventDefault();
  const bookToDb = {
    boktitel: "",
    grafiskAspekt: "",
  };
  bookToDb.boktitel = userForm.boktitel.value;
  bookToDb.grafiskAspekt = userForm.grafiskAspekt.value;

  console.log(bookToDb);
  const request = new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookToDb),
  });

  fetch(request).then((response) => {
    console.log(response);
    //fetchData(); Läggs till sen när en sådan funktion finns
    userForm.reset();
  });
}
