import Book from "@/domain/entities/book";
import type { BookProvider } from "@/domain/repositories/book.provider";

export default class GoogleBooksProvider implements BookProvider {
  async findBook(isbn: string): Promise<Book | null> {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const data = await res.json();

    if (data.totalItems > 0) {
      const info = data.items[0].volumeInfo;
      return Book.create(
        info.isbn,
        info.title,
        info.authors?.[0] ?? "Unknown author",
        Date.now()
      );
    }
    return null;
  } catch(error: any) {
    console.error(error);
    return null;
  }
}
