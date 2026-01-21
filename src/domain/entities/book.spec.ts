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
});
