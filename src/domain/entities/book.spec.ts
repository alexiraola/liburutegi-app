import { describe, it, expect } from 'vitest';
import Book from './book';

describe('Book Entity', () => {
  it('should create book with cover image', () => {
    const book = Book.create(
      '9780241705599',
      'Plantas de interior',
      'Fran Bailey',
      Date.now(),
      'https://example.com/cover.jpg'
    );

    const bookData = book.toPrimitive();
    expect(bookData.coverImage).toBe('https://example.com/cover.jpg');
  });

  it('should create book without cover image', () => {
    const book = Book.create(
      '9780241705599',
      'Plantas de interior',
      'Fran Bailey',
      Date.now()
    );

    const bookData = book.toPrimitive();
    expect(bookData.coverImage).toBeUndefined();
  });

  describe('Book Merge Functionality', () => {
    it('should merge books with different cover images', () => {
      const openLibraryBook = Book.create('123', 'Test Book', 'Author Name', 12345, 'https://covers.openlibrary.org/b/id/1-M.jpg');
      const googleBooksBook = Book.create('123', 'Test Book: Subtitle', 'Author Name', 12345, 'https://books.google.com/books/cover');

      const merged = openLibraryBook.merge(googleBooksBook);

      const result = merged.toPrimitive();

      // Should prefer Google Books cover (higher quality)
      expect(result.coverImage).toBe('https://books.google.com/books/cover');
      // Should prefer Google Books title (more detailed with subtitle)
      expect(result.title).toBe('Test Book: Subtitle');
      // Should prefer OpenLibrary author (cleaner formatting assumed)
      expect(result.author).toBe('Author Name');
    });

    it('should merge when only one has cover image', () => {
      const noCoverBook = Book.create('123', 'Test Book', 'Author Name', 12345);
      const withCoverBook = Book.create('123', 'Test Book', 'Author Name', 12345, 'https://covers.openlibrary.org/b/id/1-M.jpg');

      const merged = noCoverBook.merge(withCoverBook);

      const result = merged.toPrimitive();

      // Should prefer book with cover
      expect(result.coverImage).toBe('https://covers.openlibrary.org/b/id/1-M.jpg');
      expect(result.title).toBe('Test Book');
      expect(result.author).toBe('Author Name');
    });

    it('should preserve original timestamp', () => {
      const book1 = Book.create('123', 'Test Book', 'Author Name', 1000);
      const book2 = Book.create('123', 'Test Book', 'Author Name', 2000);

      const merged = book1.merge(book2);

      const result = merged.toPrimitive();

      // Should keep original timestamp from first book
      expect(result.addedAt).toBe(1000);
    });
  });
});
