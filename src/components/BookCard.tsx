import Book from '@/domain/entities/book';

interface BookCardProps {
  book: Book;
  onDelete: () => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const bookData = book.toPrimitive();

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-20 h-28 bg-gray-200 rounded overflow-hidden">
        {bookData.coverImage ? (
          <img src={bookData.coverImage} alt={bookData.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
            📚
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-slate-800 truncate">
          {bookData.title}
        </h3>
        <p className="text-slate-600 truncate">
          {bookData.author}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {new Date(bookData.addedAt).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
        aria-label="Delete book"
      >
        ×
      </button>
    </div>
  );
}
