import type Book from "@/domain/entities/book";

export interface BookProvider {
  findBook(isbn: string): Promise<Book | null>;
}
