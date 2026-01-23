import Book from '@/domain/entities/book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onDelete: (isbn: string) => void;
}

export default function BookList({ books, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl sm:text-8xl mb-6 opacity-50">
          📚
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-3 text-center sm:text-xl">
          No books yet
        </h2>
        <p className="text-slate-500 mb-8 text-center text-sm sm:text-base max-w-sm">
          Scan your first book to get started!
        </p>
        <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base">
          <span>Tap the scan button below</span>
          <span className="text-xl sm:text-2xl">⬇️</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-3">
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
