export default class Book {
  private constructor(private readonly isbn: string, private readonly title: string, private readonly author: string, private readonly addedAt: number) { }

  static create(isbn: string, title: string, author: string, addedAt: number): Book {
    return new Book(isbn, title, author, addedAt);
  }

  toPrimitive() {
    return {
      isbn: this.isbn,
      title: this.title,
      author: this.author,
      addedAt: this.addedAt,
    };
  }

  equals(other: Book): boolean {
    return this.isbn === other.isbn;
  }
}
