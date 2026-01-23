import Book from '@/domain/entities/book';

interface BookCardProps {
  book: Book;
  onDelete: () => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const bookData = book.toPrimitive();

  return (
    <div className="flex gap-3 bg-white rounded-xl shadow-sm p-2 hover:shadow-md transition-all sm:flex-col gap-2">
      <div className="flex-shrink-0 w-24 h-36 sm:w-32 sm:h-44 bg-gray-200 rounded-lg overflow-hidden mx-auto sm:mx-0">
        {bookData.coverImage ? (
          <img
            src={bookData.coverImage}
            alt={bookData.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl sm:text-3xl">
            📚
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between sm:gap-2">
        <div>
          <h3 className="w-full font-semibold text-left text-xl sm:text-xl text-slate-800 sm:mb-1">
            {bookData.title}
          </h3>
          <p className="text-lg text-left sm:text-base text-slate-600">
            {bookData.author}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center justify-between sm:gap-2">
        <button
          onClick={onDelete}
          className="flex-shrink-0 w-10 h-10 rounded-md bg-slate-100 text-slate-600 text-lg flex items-center justify-center transition-colors ml-auto active:scale-95"
          aria-label="Delete book"
        >
          x
        </button>
      </div>
    </div>
  );
}
