import type { BookData } from "../lib/api";

type Props = {
  books: BookData[];
  favorites: string[];
  loading: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function BookList({
  books,
  favorites,
  loading,
  onToggleFavorite,
  onDelete,
}: Props) {
  if (loading) return <section className="book-grid">Đang tải dữ liệu...</section>;
  if (books.length === 0) {
    return <section className="book-grid">Không có sách nào phù hợp.</section>;
  }

  return (
    <section className="book-grid">
      {books.map((book) => {
        const isFavorite = favorites.includes(book.id);
        return (
          <article key={book.id} className="book-card">
            <div className="book-info">
              <h3>{book.name}</h3>
              <p><strong>Tác giả:</strong> {book.author}</p>
              <p><strong>Thể loại:</strong> {book.genre}</p>
              <p><strong>Năm:</strong> {book.year}</p>
            </div>
            <div className="card-actions">
              <button
                className={`btn-fav ${isFavorite ? "active" : ""}`}
                type="button"
                onClick={() => onToggleFavorite(book.id)}
              >
                {isFavorite ? "Đã thích" : "Yêu thích"}
              </button>
              <button className="btn-delete" type="button" onClick={() => onDelete(book.id)}>
                Xóa
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
