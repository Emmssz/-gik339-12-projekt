document.addEventListener("DOMContentLoaded", () => {
  //visar alla böcker när sidan laddas in
  fetchBooks();

  //eventlyssnare för uppdatering samt borttagning
  document.body.addEventListener("click", (e) => {
    //if (e.target.classList.contains("update-btn")) {
    //uppdatera
    // const bookId = }
    // Lagrar bort id:t lokalt för att uppdatera och inte skapa ny bok:
    //localStorage.setItem("currentBook", book.id);
    //else if (e.target.classList.contains("delete-btn")) { -- kod ---}
  });
});

//funktion som hämar in samtliga bcöker samt skapar strukturen i html
function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((data) => {
      const container = document.createElement("div");
      container.className = "container";
      document.body.appendChild(container);

      const heading = document.createElement("h3");
      heading.textContent = "Bibliotekets böcker";
      container.appendChild(heading);

      const booksList = document.createElement("div");
      booksList.id = "bookList";
      booksList.className = "bookList";
      container.appendChild(booksList);

      data.forEach((book) => {
        const listItem = document.createElement("div");
        listItem.className = "list-group-item";
        listItem.innerHTML = `
          <div class="list-books"><div class="list-books-text"><div class="list-group-item change-color status-${book.status.toLowerCase()}"><span class="statusText">${
          book.status
        }</span></div>${book.boktitel},  ${book.forfattare} (${
          book.genre
        })</div> <div class="btn-list">
          <button class="btn update-btn" data-id="${book.id}">Uppdatera</button>
          <button class="btn delete-btn" data-id="${
            book.id
          }">Ta bort</button></div></div>
        `;
        booksList.appendChild(listItem);
      });
    });
}

// Funktion för att lägga till en bok i databasen när man klickar på
// en "Skicka"-knapp samt uppdaterar en redan en redan befintlig bok.

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
    serverUserObject.id = id;
  }

  const request = new Request(url, {
    method: serverUserObject.id ? "PUT" : "POST",
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
