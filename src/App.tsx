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

  return (
    <div className="min-h-screen bg-slate-100 pb-24 sm:pb-20">
      <header className="container mx-auto px-4 py-6 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-2xl">Kids Library</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Scan books to build your library</p>

          <div className="mt-4 flex items-center justify-between sm:gap-4">
            <span className="text-slate-700 font-medium px-4">
              {books.length} book{books.length !== 1 ? 's' : ''}
            </span>
            {books.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-4">
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
            w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-2xl
            transition-all active:scale-95 sm:w-16 sm:h-16 sm:text-3xl
            ${supportedDetector
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/25'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-label="Scan book"
        >
          <svg className="w-8 h-8 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2L7 4m0 0h4M5 8v8m0 0v4m0-4h4m8 0h4m-4 0v4m0-4h-4" />
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
