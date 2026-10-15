import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { addBook, deleteBook, getBooks, type BookData } from "./lib/api";
import BookList from "./components/BookList";
import Form from "./components/Form";

const FAV_KEY = "library_favorites";

function readFavorites(): string[] {
  try {
    const saved = localStorage.getItem(FAV_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    getBooks()
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không thể tải dữ liệu.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const genres = useMemo(
    () => [...new Set(books.map((book) => book.genre))],
    [books],
  );
  const filteredBooks = useMemo(() => {
    const keyword = search.toLowerCase();
    return books.filter(
      (book) =>
        book.name.toLowerCase().includes(keyword) &&
        (genre === "" || book.genre === genre),
    );
  }, [books, genre, search]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  };

  const removeBook = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa cuốn sách này?")) return;
    try {
      await deleteBook(id);
      setBooks((current) => current.filter((book) => book.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xóa sách thất bại!");
    }
  };

  const handleAddBook = async (book: Omit<BookData, "id">) => {
    const addedBook = await addBook(book);
    setBooks((current) => [addedBook, ...current]);
  };

  return (
    <>
      <header className="app-header">
        <h1>Thư Viện Lớp Học</h1>
        <div className="header-actions">
          <span>Yêu thích: {favorites.length}</span>
          <button
            className="btn-icon"
            type="button"
            aria-label="Đổi giao diện"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="toolbar">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">Tất cả thể loại</option>
            {genres.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </section>

        <section id="status-bar">
          <p id="status-text">
            {loading ? "Đang tải dữ liệu..." : `Đang hiển thị ${filteredBooks.length} / ${books.length} cuốn`}
          </p>
        </section>

        {error ? <p role="alert">{error}</p> : (
          <BookList
            books={filteredBooks}
            favorites={favorites}
            loading={loading}
            onToggleFavorite={toggleFavorite}
            onDelete={removeBook}
          />
        )}

        <hr />
        <section id="add-book-section">
          <h2>Thêm Sách Mới</h2>
          <Form onSubmit={handleAddBook} />
        </section>
      </main>
    </>
  );
}
