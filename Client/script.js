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
  const request = new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(objectToDb),
  });

  fetch(request).then((response) => {
    console.log(response);
    //fetchData(); Läggs till sen när en sådan funktion finns
    userForm.reset();
  });
}
