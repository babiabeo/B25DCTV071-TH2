const API_URL = "https://6ad0352e03feaa52b21f1c14.mockapi.io/books";

export interface BookData {
  id: string;
  name: string;
  author: string;
  genre: string;
  year: string;
}

export async function getBooks(): Promise<BookData[]> {
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

export async function addBook(bookData: Omit<BookData, "id">): Promise<BookData> {
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

export async function deleteBook(id: string) {
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
