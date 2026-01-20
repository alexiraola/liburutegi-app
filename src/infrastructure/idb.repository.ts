import Book from "@/domain/entities/book";
import type { BookRepository } from "@/domain/repositories/book.repository";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface Liburutegia extends DBSchema {
  books: {
    value: {
      isbn: string;
      title: string;
      author: string;
      addedAt: number;
    };
    key: string;
  };
}

export default class IdbRepository implements BookRepository {
  private constructor(private readonly db: IDBPDatabase<Liburutegia>) { }

  static async create(): Promise<IdbRepository> {
    const db = await openDB<Liburutegia>("liburutegia", 1, {
      upgrade(db) {
        db.createObjectStore("books", { keyPath: "isbn" });
      },
    });

    return new IdbRepository(db);
  }

  async addBook(book: Book): Promise<void> {
    await this.db.put("books", book.toPrimitive());
  }

  async getBooks(): Promise<Book[]> {
    const books = await this.db.getAll("books");
    return books.map((book) => Book.create(book.isbn, book.title, book.author, book.addedAt));
  }

  async clearBooks(): Promise<void> {
    await this.db.clear("books");
  }
}
