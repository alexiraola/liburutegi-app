import Book from "@/domain/entities/book";
import type { BookProvider } from "@/domain/repositories/book.provider";

export default class OpenLibraryProvider implements BookProvider {
  async findBook(isbn: string, addedAt?: number): Promise<Book | null> {
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?isbn=${isbn}`
      );
      const data = await res.json();

      if (data.docs?.length) {
        const doc = data.docs[0];
        const coverImage = doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
          : undefined;

        return Book.create(
          isbn,
          doc.title,
          doc.author_name?.[0] ?? "Unknown author",
          addedAt ?? Date.now(),
          coverImage
        );
      }
      return null;
    } catch(error) {
      console.error(error);
      return null;
    }
  }
}
