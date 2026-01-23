import { useEffect, useState } from 'react'
import Scanner from './components/Scanner';
import BookList from './components/BookList';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import Book from './domain/entities/book';
import MultiSourceProvider from './infrastructure/multisource.provider';
import OpenLibraryProvider from './infrastructure/openlibrary.provider';
import GoogleBooksProvider from './infrastructure/googlebooks.provider';
import IdbRepository from './infrastructure/idb.repository';
import { useToast } from './hooks/useToast';

function App() {
  const [scanning, setScanning] = useState(false);
  const [supportedDetector] = useState("BarcodeDetector" in window);
  const [repository, setRepository] = useState<IdbRepository | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const { toasts, showSuccess, showError, closeToast } = useToast();

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
    setIsSearching(true);

    if (!repository) {
      showError("Datu-basea ez dago prest. Saiatu berriro segundu batzuk.");
      setIsSearching(false);
      return;
    }

    try {
      const multiSourceProvider = new MultiSourceProvider([
        new OpenLibraryProvider(),
        new GoogleBooksProvider(),
      ]);

      // Add timeout to prevent infinite waiting
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 15000); // 15 second timeout
      });

      const bookPromise = multiSourceProvider.findBook(isbn, Date.now());

      const book = await Promise.race([bookPromise, timeoutPromise]);

      if (book) {
        console.log("Found book:", book);
        setIsSearching(false);
        setIsAddingBook(true);

        try {
          await repository.addBook(book);
          const bookTitle = book.toPrimitive().title;
          showSuccess(`"${bookTitle}" liburua gehitu da!`);
          loadBooks(repository);
        } catch (dbError) {
          console.error("Error adding book to database:", dbError);
          showError(`Errorea liburua gordetzean: "${book.toPrimitive().title}"`);
        }
      } else {
        // Book not found - provide more helpful error
        const isbnShort = isbn.length > 10 ? isbn.substring(0, 10) + '...' : isbn;
        showError(`Ez dago libururik honako ISBNarekin: ${isbnShort}. Egiaztatu kodea eta saiatu berriro.`);
      }
    } catch (error) {
      console.error("Error during book lookup:", error);

      if (error instanceof Error && error.message === 'Timeout') {
        showError("Denbora agortu da liburua bilatzen. Konexioa gelditu da? Saiatu berriro.");
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        showError("Interneteko konexio errorea. Egiaztatu konekzioa eta saiatu berriro.");
      } else {
        showError("Errorea gertatu da liburua bilatzean. Saiatu berriro geroago.");
      }
    } finally {
      setIsSearching(false);
      setIsAddingBook(false);
    }
  }

  async function handleDeleteBook(isbn: string) {
    if (!repository) {
      showError("Ezin da liburua ezabatu datu-basea ez dagoelako prest.");
      return;
    }

    const bookToDelete = books.find(b => b.toPrimitive().isbn === isbn);
    const bookTitle = bookToDelete?.toPrimitive().title || "Liburua";

    try {
      await repository.deleteBook(isbn);
      const updated = books.filter(b => b.toPrimitive().isbn !== isbn);
      setBooks(updated);
      showSuccess(`"${bookTitle}" liburua ezabatu da.`);
    } catch (error) {
      console.error("Error deleting book:", error);
      showError(`Errorea "${bookTitle}" liburua ezabatzean.`);
    }
  }

  async function handleClearAll() {
    if (!repository) {
      showError("Ezin da libururik ezabatu datu-basea ez dagoelako prest.");
      return;
    }

    if (books.length === 0) {
      showError("Ez dago libururik ezabatzeko.");
      return;
    }

    try {
      await repository.clearBooks();
      setBooks([]);
      showSuccess(`Liburutegia hustu da. ${books.length} liburu ezabatu dira.`);
    } catch (error) {
      console.error("Error clearing books:", error);
      showError("Errorea liburutegia hustean.");
    }
  }

  const bookCount = () => {
    if (books.length === 0) return null;
    if (books.length === 1) return "Liburu bat";
    return `${books.length} liburu`;
  };

  const isLoading = isSearching || isAddingBook;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 sm:pb-20">
      <header className="container mx-auto px-4 py-6 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl text-center font-bold text-slate-800">Nire liburutegia</h1>
          <p className="text-slate-600 text-center mt-1 text-base sm:text-base">Harrapatu zure liburuen kodeak eta zerrendan azalduko dira</p>

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
          disabled={!supportedDetector || isLoading}
          className={`
            w-20 h-20 rounded-full shadow-xl bg-white
            flex items-center justify-center text-slate-700
            transition-all active:scale-95
            sm:w-16 sm:h-16
            ${(supportedDetector && !isLoading)
              ? 'hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
              : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
          aria-label="Scan book barcode"
        >
          {isLoading ? (
            <div className="w-6 h-6 sm:w-5 sm:h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-8 h-8 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
              <rect x="6" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
              <rect x="8" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
              <rect x="11" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
              <rect x="13" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
              <rect x="17" y="4" width="1" height="16" rx="0.5" fill="currentColor" />
              <rect x="19" y="4" width="2" height="16" rx="0.5" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {scanning && (
        <Scanner
          onDetected={handleScanDetected}
          onClose={() => setScanning(false)}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <LoadingSpinner
              size="lg"
              message={
                isSearching
                  ? "Liburua bilatzen..."
                  : "Liburua gordetzen..."
              }
            />
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer
        toasts={toasts}
        onClose={closeToast}
      />
    </div>
  )
}

export default App
