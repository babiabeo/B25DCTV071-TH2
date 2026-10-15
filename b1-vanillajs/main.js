const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");
const statusText = document.getElementById("status-text");
const favCountEl = document.getElementById("fav-count");

const form = document.getElementById("add-book-form");
const inputName = document.getElementById("book-name");
const inputAuthor = document.getElementById("book-author");
const inputGenre = document.getElementById("book-genre");
const inputYear = document.getElementById("book-year");
const btnSubmit = document.getElementById("btn-submit");

const FAV_KEY = "library_favorites";

let allBooks = [];
let favorites = getFavorites();

// API

const API_URL = "https://6ad0352e03feaa52b21f1c14.mockapi.io/books";

async function getBooks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Lỗi khi tải dữ liệu từ máy chủ!");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi getBooks:", error);
    throw error;
  }
}

async function addBook(bookData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) throw new Error("Thêm sách thất bại!");
    return await response.json();
  } catch (error) {
    console.error("Lỗi addBook:", error);
    throw error;
  }
}

async function deleteBook(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Xóa sách thất bại!");
    return await response.json();
  } catch (error) {
    console.error("Lỗi deleteBook:", error);
    throw error;
  }
}

// storage

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter((favId) => favId !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs;
}

// render

function renderLoading(container) {
  container.textContent = "Đang tải dữ liệu...";
}

function renderError(container, message) {
  container.textContent = `${message}`;
}

function createInfoLine(label, value) {
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  p.append(strong, value);
  return p;
}

function renderBooks(books, container, favorites) {
  container.textContent = "";

  if (books.length === 0) {
    container.textContent = "Không có sách nào phù hợp.";
    return;
  }

  books.forEach((book) => {
    const article = document.createElement("article");
    article.className = "book-card";
    article.dataset.id = book.id;

    const infoDiv = document.createElement("div");
    infoDiv.className = "book-info";

    const h3 = document.createElement("h3");
    h3.textContent = book.name;

    infoDiv.append(
      h3,
      createInfoLine("Tác giả", book.author),
      createInfoLine("Thể loại", book.genre),
      createInfoLine("Năm", book.year),
    );

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "card-actions";

    const favBtn = document.createElement("button");
    favBtn.className = "btn-fav";
    const isFav = favorites.includes(book.id);
    if (isFav) favBtn.classList.add("active");
    favBtn.textContent = isFav ? "Đã thích" : "Yêu thích";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Xóa";

    actionsDiv.append(favBtn, deleteBtn);
    article.append(infoDiv, actionsDiv);
    container.appendChild(article);
  });
}

function renderApp() {
  const keyword = searchInput.value.toLowerCase();
  const selectedGenre = genreSelect.value;

  const filteredBooks = allBooks.filter((book) => {
    const matchName = book.name.toLowerCase().includes(keyword);
    const matchGenre = selectedGenre === "" || book.genre === selectedGenre;
    return matchName && matchGenre;
  });

  statusText.textContent = `Đang hiển thị ${filteredBooks.length} / ${allBooks.length} cuốn`;
  renderBooks(filteredBooks, bookGrid, favorites);
}

function populateGenres(books) {
  const genres = [...new Set(books.map((b) => b.genre))];
  genres.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    genreSelect.appendChild(opt);
  });
}

function updateFavCount() {
  favCountEl.textContent = `Yêu thích: ${favorites.length}`;
}

// events

bookGrid.addEventListener("click", async (e) => {
  const btnDelete = e.target.closest(".btn-delete");
  const btnFav = e.target.closest(".btn-fav");

  if (btnDelete) {
    const card = btnDelete.closest(".book-card");
    const id = card.dataset.id;
    if (confirm("Bạn có chắc muốn xóa cuốn sách này?")) {
      try {
        await deleteBook(id);
        allBooks = allBooks.filter((b) => b.id !== id);
        renderApp();
      } catch (err) {
        alert(err.message);
      }
    }
    return;
  }

  if (btnFav) {
    const card = btnFav.closest(".book-card");
    const id = card.dataset.id;
    favorites = toggleFavorite(id);
    updateFavCount();
    renderApp();
  }
});

function validateName(val) {
  return val.trim().length >= 3 ? "" : "Tên sách phải từ 3 ký tự trở lên.";
}

function validateRequired(val, fieldName) {
  return val.trim().length > 0 ? "" : `${fieldName} không được để trống.`;
}

function validateYear(val) {
  const currentYear = new Date().getFullYear();
  const y = parseInt(val, 10);
  if (isNaN(y) || y < 1900 || y > currentYear) {
    return `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
  }
  return "";
}

function checkForm() {
  const errName = validateName(inputName.value);
  const errAuthor = validateRequired(inputAuthor.value, "Tác giả");
  const errGenre = validateRequired(inputGenre.value, "Thể loại");
  const errYear = validateYear(inputYear.value);

  document.getElementById("error-name").textContent = errName;
  document.getElementById("error-author").textContent = errAuthor;
  document.getElementById("error-genre").textContent = errGenre;
  document.getElementById("error-year").textContent = errYear;

  const isValid = !errName && !errAuthor && !errGenre && !errYear;
  btnSubmit.disabled = !isValid;
  return isValid;
}

inputName.addEventListener("input", checkForm);
inputAuthor.addEventListener("input", checkForm);
inputGenre.addEventListener("input", checkForm);
inputYear.addEventListener("input", checkForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkForm()) return;

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Đang thêm...";

  const newBook = {
    name: inputName.value.trim(),
    author: inputAuthor.value.trim(),
    genre: inputGenre.value.trim(),
    year: parseInt(inputYear.value, 10).toString(),
  };

  try {
    const addedBook = await addBook(newBook);
    allBooks.unshift(addedBook);
    if (
      ![...genreSelect.options].some((opt) => opt.value === addedBook.genre)
    ) {
      const opt = document.createElement("option");
      opt.value = addedBook.genre;
      opt.textContent = addedBook.genre;
      genreSelect.appendChild(opt);
    }
    form.reset();
    renderApp();
  } catch (err) {
    alert(err.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Thêm Sách";
  }
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
});

searchInput.addEventListener("input", renderApp);
genreSelect.addEventListener("change", renderApp);

// main

async function init() {
  renderLoading(bookGrid);
  updateFavCount();
  try {
    allBooks = await getBooks();
    populateGenres(allBooks);
    renderApp();
  } catch (error) {
    renderError(bookGrid, error.message);
  }
}

init();
