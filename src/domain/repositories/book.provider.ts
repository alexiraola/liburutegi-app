import type Book from "@/domain/entities/book";

export interface BookProvider {
  findBook(isbn: string, addedAt?: number): Promise<Book | null>;
}
