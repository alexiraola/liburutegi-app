export default class Book {
  private constructor(private readonly isbn: string, private readonly title: string, private readonly author: string, private readonly addedAt: number, private readonly coverImage?: string) { }

  static create(isbn: string, title: string, author: string, addedAt: number, coverImage?: string): Book {
    return new Book(isbn, title, author, addedAt, coverImage);
  }

  merge(other: Book): Book {
    return Book.create(
      this.isbn,
      this.selectBestTitle(this.title, other.title),
      this.selectBestAuthor(this.author, other.author),
      this.addedAt,
      this.selectBestCover(this.coverImage, other.coverImage)
    );
  }

  toPrimitive() {
    return {
      isbn: this.isbn,
      title: this.title,
      author: this.author,
      addedAt: this.addedAt,
      coverImage: this.coverImage,
    };
  }

  equals(other: Book): boolean {
    return this.isbn === other.isbn;
  }

  private selectBestTitle(current: string, other: string): string {
    return other.length > current.length ? other : current;
  }

  private selectBestAuthor(current: string, other: string): string {
    return other.length > current.length ? other : current;
  }

  private selectBestCover(current?: string, other?: string): string | undefined {
    if (!current && other) return other;
    if (current && !other) return current;

    // Prefer Google Books covers (higher quality)
    const otherIsGoogleBooks = this.isGoogleBooks(other);
    const currentIsGoogleBooks = this.isGoogleBooks(current);

    if (otherIsGoogleBooks && !currentIsGoogleBooks) return other;
    if (!otherIsGoogleBooks && currentIsGoogleBooks) return current;

    // If both are same type or both have covers, prefer the other (better source)
    return other || current;
  }

  private isGoogleBooks(coverUrl?: string): boolean {
    return coverUrl?.includes('google') ?? false;
  }
}
