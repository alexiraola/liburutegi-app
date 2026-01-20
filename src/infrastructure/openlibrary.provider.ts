import Book from "@/domain/entities/book";
import type { BookProvider } from "@/domain/repositories/book.provider";

export default class OpenLibraryProvider implements BookProvider {
  async findBook(isbn: string): Promise<Book | null> {
    const res = await fetch(
      `https://openlibrary.org/search.json?isbn=${isbn}`
    );
    const data = await res.json();

    if (data.docs?.length) {
      return Book.create(
        isbn,
        data.docs[0].title,
        data.docs[0].author_name?.[0] ?? "Unknown author",
        Date.now()
      );
    }
    return null;
  } catch(error: any) {
    console.error(error);
    return null;
  }
}
