//sparar ner url till resursen (böckerna) i en variabel
const url = "http://localhost:3000/books";

//funktion som läser in samtliga böcker samt skapar strukturen för listan i html
function fetchBooks() {
  //meddelande i konsolen för att tala om att funktionen startats
  console.log("funktionen fetchBooks startas...");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //hämtar in div från html
      const list = document.getElementById("books-list");
      let booksList = document.getElementById("bookList");
      //lägger till en div där böckerna ska synas, om den inte finns
      if (!booksList) {
        booksList = document.createElement("div");
        booksList.id = "bookList";
        booksList.className = "row";
        list.appendChild(booksList);
      } else {
        //rensar tidigare böcker
        booksList.innerHTML = "";
      }

      //kod som repeteras för varje resurs (bok) och lägger till nedanstående info för varje objekt
      data.forEach((book) => {
        const listItem = document.createElement("div");
        listItem.className = "col-4 list-books list-group-item";

        //html som läggs till för varje bok
        listItem.innerHTML = `
        <div class="col-12 list-card"><div class="col-12 list-img"><img src="img/book.png"></div>
        <div class="row"><div class="col-7 list-books-text"><p>${
          book.boktitel
        }</p><p>${book.forfattare}</p><p>(${book.genre})</p></div>
         <div class="col-5 btn-list">
         <div class="col-5 list-group-item change-color status-${book.status.toLowerCase()} mb-2">
        <span class="status-text">${book.status}</span>
        </div>
          <button class="col-10 btn update-btn mb-2" data-id="${
            book.id
          }">Uppdatera</button>
          <button class="col-10 btn delete-btn" data-id="${
            book.id
          }">Ta bort</button></div></div></div>
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
    showModal("Boken har tagits bort");
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
  // Nytt request-objekt skapas
  const request = new Request(url, {
    // Om id finns så används PUT annars används POST
    method: bookToDb.id ? "PUT" : "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookToDb),
  });

  fetch(request).then((response) => {
    // Olika modal-meddelande visas beroende på om boken är uppdaterad eller ny
    showModal(
      bookToDb.id ? "Boken har uppdaterats" : "En ny bok har lagts till"
    );
    fetchBooks();
    localStorage.removeItem("currentBook");
    bookForm.reset();
  });
}

// Visa en vald bok i en modal:
searchForm.addEventListener("submit", searchBooks);

function searchBooks(e) {
  e.preventDefault();
  // Sökt bok eller författare sparas i variabeln searchTerm
  const searchTerm = document.getElementById("bok_id").value;
  fetch(`${url}/query/${searchTerm}`)
    .then((response) => response.json())
    .then((books) => {
      if (books.length > 0) {
        showModal(
          `Bok hittad: ${books[0].boktitel}, av ${books[0].forfattare}`
        );
      } else {
        showModal("Ingen bok hittades");
      }
    });
}

// Visa Modal
function showModal(message) {
  // Sätter själva texten till modalens "kropp"
  const modalBody = document.querySelector("#modalTarget .modal-body");
  modalBody.textContent = message;
  const modalEl = document.getElementById("modalTarget");
  // En ny modal skapas:
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

//hämtar alla böcker när sidan laddas in
document.addEventListener("DOMContentLoaded", fetchBooks);
