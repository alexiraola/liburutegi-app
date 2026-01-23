import { useEffect, useState } from 'react';
import { useToast } from './useToast';
import Book from '@/domain/entities/book';
import MultiSourceProvider from '@/infrastructure/multisource.provider';
import OpenLibraryProvider from '@/infrastructure/openlibrary.provider';
import GoogleBooksProvider from '@/infrastructure/googlebooks.provider';
import IdbRepository from '@/infrastructure/idb.repository';

export function useAppViewModel() {
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

  return {
    // State
    scanning,
    setScanning,
    supportedDetector,
    repository,
    books,
    isSearching,
    isAddingBook,
    toasts,
    
    // Computed
    isLoading,
    bookCount,
    
    // Actions
    handleScanDetected,
    handleDeleteBook,
    handleClearAll,
    closeToast,
  };
}

export type UseAppViewModelReturn = ReturnType<typeof useAppViewModel>;