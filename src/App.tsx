import { useState } from 'react'
import Scanner from './components/Scanner';

function App() {
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📚 Kids Library</h1>
      <p>Scan a book to add it to your library</p>
      <button className="bg-[#4CAF50] text-white" onClick={() => setScanning(true)}>📷 Scan Book</button>
      <button className="bg-[#f44336] text-white">🧹 Clear Library</button>
      {scanning && (
        <Scanner
          onDetected={(isbn) => {
            console.log("Detected ISBN:", isbn);
            setScanning(false);
            setCode(isbn);
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
