import type Book from "@/domain/entities/book";
import type { BookProvider } from "@/domain/repositories/book.provider";

export default class MultiSourceProvider implements BookProvider {
  constructor(private readonly providers: BookProvider[]) { }

  async findBook(isbn: string, addedAt?: number): Promise<Book | null> {
    for (const provider of this.providers) {
      const book = await provider.findBook(isbn, addedAt);
      if (book) return book;
    }
    return null;
  }
}
