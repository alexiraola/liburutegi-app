import Book from '@/domain/entities/book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onDelete: (isbn: string) => void;
}

export default function BookList({ books, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-8xl mb-4 opacity-50">
          📚
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          No books yet
        </h2>
        <p className="text-slate-500 mb-8 text-center">
          Scan your first book to get started!
        </p>
        <div className="flex items-center gap-2 text-slate-400">
          <span>Tap the scan button below</span>
          <span className="text-2xl">⬇️</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {books.map((book) => (
        <BookCard
          key={book.toPrimitive().isbn}
          book={book}
          onDelete={() => onDelete(book.toPrimitive().isbn)}
        />
      ))}
    </div>
  );
}
