import type Book from "@/domain/entities/book";
import type { BookProvider } from "@/domain/repositories/book.provider";

export default class MultiSourceProvider implements BookProvider {
  constructor(private readonly providers: BookProvider[]) { }

  async findBook(isbn: string, addedAt?: number): Promise<Book | null> {
    const promises = this.providers.map(p => p.findBook(isbn, addedAt));
    const results = await Promise.allSettled(promises);

    const books = results
      .filter((r): r is PromiseFulfilledResult<Book> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    if (books.length === 0) return null;

    return books.reduce((merged, book) => merged.merge(book));
  }
}
