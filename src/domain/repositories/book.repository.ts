import type Book from "@/domain/entities/book";

export interface BookRepository {
  addBook(book: Book): Promise<void>;
  getBooks(): Promise<Book[]>;
  clearBooks(): Promise<void>;
  deleteBook(isbn: string): Promise<void>;
}
