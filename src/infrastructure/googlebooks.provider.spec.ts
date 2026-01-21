import { describe, it, expect, vi } from 'vitest';
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

  it('should parse title and author correctly for known book', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('9780241705599');

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.title).toBe('Plantas de interior');
    expect(bookData.author).toBe('Fran Bailey');
  });

  it('should handle malformed ISBN gracefully', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('invalid-isbn');

    expect(book).toBeNull();
  });

  it('should use "Unknown author" when author is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          totalItems: 1,
          items: [{
            volumeInfo: {
              title: 'Test Book',
            }
          }]
        })
      })
    ));

    const provider = new GoogleBooksProvider();
    const book = await provider.findBook('1234567890');

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.author).toBe('Unknown author');

    vi.unstubAllGlobals();
  });

  it('should extract cover image from Google Books response', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('9780596004977');

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.coverImage).toBeDefined();
    expect(bookData.coverImage).toContain('books.google.com/books/content');
    expect(bookData.coverImage).toContain('img=1');
  });

  it('should have undefined cover when Google Books has no cover', async () => {
    const provider = new GoogleBooksProvider();

    const book = await provider.findBook('9780241705599');

    expect(book).not.toBeNull();
    const bookData = book!.toPrimitive();
    expect(bookData.coverImage).toBeUndefined();
  });
});
