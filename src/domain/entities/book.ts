export default class Book {
  private constructor(private readonly isbn: string, private readonly title: string, private readonly author: string, private readonly addedAt: number, private readonly coverImage?: string) { }

  static create(isbn: string, title: string, author: string, addedAt: number, coverImage?: string): Book {
    return new Book(isbn, title, author, addedAt, coverImage);
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
}
