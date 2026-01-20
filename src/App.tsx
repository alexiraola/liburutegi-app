import { useEffect, useState } from 'react'
import Scanner from './components/Scanner';
import MultiSourceProvider from './infrastructure/multisource.provider';
import OpenLibraryProvider from './infrastructure/openlibrary.provider';
import GoogleBooksProvider from './infrastructure/googlebooks.provider';

function App() {
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState("");
  const [supportedDetector, setSupportedDetector] = useState(false);

  useEffect(() => {
    if ("BarcodeDetector" in window) {
      setSupportedDetector(true);
    }
  }, []);

  const renderScanButton = () => {
    if (supportedDetector) {
      return <button className="bg-[#4CAF50] text-white" onClick={() => setScanning(true)}>📷 Scan Book</button>;
    }
    return <p>BarcodeDetector not supported</p>;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📚 Kids Library</h1>
      <p>Scan a book to add it to your library</p>
      {renderScanButton()}
      <button className="bg-[#f44336] text-white">🧹 Clear Library</button>
      {scanning && (
        <Scanner
          onDetected={async (isbn) => {
            console.log("Detected ISBN:", isbn);
            setScanning(false);
            setCode(isbn);
            const multiSourceProvider = new MultiSourceProvider([
              new OpenLibraryProvider(),
              new GoogleBooksProvider(),
            ]);

            const book = await multiSourceProvider.findBook(isbn, Date.now());
            if (book) {
              console.log("Found book:", book);
              setCode(JSON.stringify(book.toPrimitive()));
            }
          }}
          onClose={() => setScanning(false)}
        />
      )}
      <div>{code}</div>
      <h2>Your Books</h2>
      <ul id="bookList"></ul>
    </div>
  )
}

export default App
