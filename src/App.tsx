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
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-800">📚 Kids Library</h1>
        <p className="text-slate-600 mt-1">Scan books to build your library</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-slate-700">
            {books.length} book{books.length !== 1 ? 's' : ''}
          </span>
          {books.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BookList
          books={books}
          onDelete={handleDeleteBook}
        />
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => supportedDetector && setScanning(true)}
          disabled={!supportedDetector}
          className={`
            w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl
            transition-all active:scale-95
            ${supportedDetector
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-label="Scan book"
        >
          📷
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
