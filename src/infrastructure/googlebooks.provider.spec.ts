import { describe, it, expect } from 'vitest';
import GoogleBooksProvider from './googlebooks.provider';

describe('GoogleBooksProvider Integration Tests', () => {
  it('should find book with valid ISBN', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('9780241705599');

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.isbn).toBe('9780241705599');
    expect(bookData.title).toBeTruthy();
    expect(bookData.author).toBeTruthy();
    expect(bookData.addedAt).toBeTypeOf('number');
  });

  it('should return null for non-existent ISBN', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('000000000');

    expect(book).toBeNull();
  });

  it('should find book with timestamp parameter', async () => {
    const provider = new GoogleBooksProvider();
    const timestamp = Date.now();

    const book = await provider.findBook('9780241705599', timestamp);

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.addedAt).toBe(timestamp);
  });

  it('should handle malformed ISBN gracefully', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('invalid-isbn');

    expect(book).toBeNull();
  });
});
