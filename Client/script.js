//sparar ner url till resursen (böckerna) i en variabel
const url = "http://localhost:3000/books";

//funktion som läser in samtliga böcker samt skapar strukturen för listan i html
function fetchBooks() {
  //meddelande i konsolen för att tala om att funktionen startats
  console.log("funktionen fetchBooks startas...");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //hämtar in body från html
      const body = document.getElementsByTagName("body")[0];

      //lägger till en rubrik överst på sidan, om det inte finns
      if (!document.querySelector(".books_heading")) {
        const heading = document.createElement("h2");
        heading.className = "books_heading";
        heading.textContent = "Bibliotekets böcker";
        body.insertAdjacentElement("afterbegin", heading);
      }

      let booksList = document.getElementById("bookList");
      //lägger till en div där böckerna ska synas, om den inte finns
      if (!booksList) {
        booksList = document.createElement("div");
        booksList.id = "bookList";
        booksList.className = "bookList";
        body.appendChild(booksList);
      } else {
        booksList.innerHTML = ""; // Rensar tidigare böcker
      }

      //kod som repeteras för varje resurs (bok) och lägger till nedanstående info för varje objekt
      data.forEach((book) => {
        const listItem = document.createElement("div");
        listItem.className = "col-4 list-books list-group-item";

        //html som läggs till för varje bok
        listItem.innerHTML = `
        <div class="list-card"><div class="list-img"><img src="book.png"></div>
        <div class="list-books-text">
        <div class="list-group-item change-color status-${book.status.toLowerCase()}">
        <span class="statusText">${book.status}</span>
        </div>${book.boktitel},  ${book.forfattare} (${book.genre})</div>
         <div class="btn-list">
          <button class="btn update-btn" data-id="${book.id}">Uppdatera</button>
          <button class="btn delete-btn" data-id="${
            book.id
          }">Ta bort</button></div></div>
        `;
        booksList.appendChild(listItem);

        const updateBtn = listItem.querySelector(".update-btn");
        const deleteBtn = listItem.querySelector(".delete-btn");

        //eventlyssnare för om användaren klickar på uppdatera/ta bort knappen, kopplat till funktioner
        updateBtn.addEventListener("click", () => handleUpdateBook(book.id));
        deleteBtn.addEventListener("click", () => handleDeleteBook(book.id));
      });
    });
  //meddelande i konsolen för att tala om att funktionen har genomförts
  console.log("funktionen fetchBooks har genomförts!");
}

//funktion för att uppdatera böcker i listan
function handleUpdateBook(id) {
  //meddelande i konsolen för att stämma av vilken bok som ändras (id)
  console.log("Updating book with id:", id + ".");
  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((book) => {
      //infon till samtliga fält i formuläret hämtas och skrivs ut i fälten
      bookForm.boktitel.value = book.boktitel;
      bookForm.forfattare.value = book.forfattare;
      bookForm.genre.value = book.genre;
      bookForm.status.value = book.status;

      //id sparas ner för att kunna användas senare och ändra infon om en bok (function handleBooks)
      localStorage.setItem("currentBook", book.id);
    });
}

//funktion för att ta bort böcker från listan
function handleDeleteBook(id) {
  fetch(`${url}/${id}`, { method: "delete" }).then((result) => {
    //meddelande visas för användaren, modal
    //
    //böckerna hämtas in igen när en bok har raderats
    fetchBooks();
  });
}

// Funktion för att lägga till en bok i databasen när man klickar på
// en "Skicka"-knapp samt uppdaterar en redan befintlig bok.

bookForm.addEventListener("submit", handleBooks);

function handleBooks(e) {
  e.preventDefault();
  const bookToDb = {
    boktitel: "",
    forfattare: "",
    genre: "",
    status: "",
  };

  bookToDb.boktitel = bookForm.boktitel.value;
  bookToDb.forfattare = bookForm.forfattare.value;
  bookToDb.genre = bookForm.genre.value;
  bookToDb.status = bookForm.status.value;

  const id = localStorage.getItem("currentBook");

  if (id) {
    bookToDb.id = id;
  }

  const request = new Request(url, {
    method: bookToDb.id ? "PUT" : "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookToDb),
  });

  fetch(request).then((response) => {
    fetchBooks();
    localStorage.removeItem("currentBook");
    bookForm.reset();
  });
}

//hämtar alla böcker när sidan laddas in
document.addEventListener("DOMContentLoaded", fetchBooks);
