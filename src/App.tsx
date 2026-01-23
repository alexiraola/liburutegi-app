import { useEffect, useState } from 'react'
import Scanner from './components/Scanner';
import BookList from './components/BookList';
import Book from './domain/entities/book';
import MultiSourceProvider from './infrastructure/multisource.provider';
import OpenLibraryProvider from './infrastructure/openlibrary.provider';
import GoogleBooksProvider from './infrastructure/googlebooks.provider';
import IdbRepository from './infrastructure/idb.repository';

function App() {
  const [scanning, setScanning] = useState(false);
  const [supportedDetector] = useState("BarcodeDetector" in window);
  const [repository, setRepository] = useState<IdbRepository | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  async function loadBooks(repo: IdbRepository) {
    const loadedBooks = await repo.getBooks();
    const sorted = loadedBooks.sort((a, b) =>
      b.toPrimitive().addedAt - a.toPrimitive().addedAt
    );
    setBooks(sorted);
  }

  useEffect(() => {
    IdbRepository.create().then(repo => {
      setRepository(repo);
      loadBooks(repo);
    });
  }, []);

  async function handleScanDetected(isbn: string) {
    console.log("Detected ISBN:", isbn);
    setScanning(false);

    if (!repository) return;

    const multiSourceProvider = new MultiSourceProvider([
      new OpenLibraryProvider(),
      new GoogleBooksProvider(),
    ]);

    const book = await multiSourceProvider.findBook(isbn, Date.now());
    if (book) {
      console.log("Found book:", book);
      await repository.addBook(book);
      loadBooks(repository);
    }
  }

  async function handleDeleteBook(isbn: string) {
    if (repository) {
      await repository.deleteBook(isbn);
      const updated = books.filter(b => b.toPrimitive().isbn !== isbn);
      setBooks(updated);
    }
  }

  async function handleClearAll() {
    if (repository) {
      await repository.clearBooks();
      setBooks([]);
    }
  }

  const bookCount = () => {
    if (books.length === 0) return "Ez dago libururik";
    if (books.length === 1) return "Liburu bat";
    return `${books.length} liburu`;
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 sm:pb-20">
      <header className="container mx-auto px-4 py-6 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800">Nire liburutegia</h1>
          <p className="text-slate-600 mt-1 text-base sm:text-base">Harrapatu zure liburuen kodeak eta zerrendan azalduko dira</p>

          <div className="mt-4 flex items-center justify-between sm:gap-4">
            <span className="text-slate-700 font-medium px-2">
              {bookCount()}
            </span>
            {books.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              >
                Ezabatu denak
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-4">
        <div className="max-w-2xl mx-auto">
          <BookList
            books={books}
            onDelete={handleDeleteBook}
          />
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => supportedDetector && setScanning(true)}
          disabled={!supportedDetector}
          className={`
            w-20 h-20 rounded-full shadow-xl bg-white
            flex items-center justify-center text-slate-700
            transition-all active:scale-95
            sm:w-16 sm:h-16
            ${supportedDetector
              ? 'hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
              : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
          aria-label="Scan book barcode"
        >
          <svg className="w-8 h-8 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
            <rect x="6" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
            <rect x="8" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
            <rect x="11" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
            <rect x="13" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
            <rect x="17" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
            <rect x="19" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {scanning && (
        <Scanner
          onDetected={handleScanDetected}
          onClose={() => setScanning(false)}
        />
      )}
    </div>
  )
}

export default App
