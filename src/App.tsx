import { useAppViewModel } from './hooks/useAppViewModel';
import Scanner from './components/Scanner';
import BookList from './components/BookList';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import BookCount from './components/BookCount';
import DeleteAllButton from './components/DeleteAllButton';
import ScanButton from './components/ScanButton';

function App() {
  const viewModel = useAppViewModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 sm:pb-20">
      <header className="container mx-auto px-4 py-6 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl text-center font-bold text-slate-800">Nire liburutegia</h1>
          <p className="text-slate-600 text-center mt-1 text-base sm:text-base">Harrapatu zure liburuen kodeak eta zerrendan azalduko dira</p>

          <div className="mt-4 flex items-center justify-between sm:gap-4">
            <BookCount count={viewModel.books.length} />
            {viewModel.books.length > 0 && <DeleteAllButton onClick={viewModel.handleClearAll} />}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-4">
        <div className="max-w-2xl mx-auto">
          <BookList
            books={viewModel.books}
            onDelete={viewModel.handleDeleteBook}
          />
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <ScanButton onClick={() => viewModel.supportedDetector && viewModel.setScanning(true)} supportedDetector={viewModel.supportedDetector} isLoading={viewModel.isLoading} />
      </div>

      {viewModel.scanning && (
        <Scanner
          onDetected={viewModel.handleScanDetected}
          onClose={() => viewModel.setScanning(false)}
        />
      )}

      {/* Loading overlay */}
      {viewModel.isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <LoadingSpinner
              size="lg"
              message={
                viewModel.isSearching
                  ? "Liburua bilatzen..."
                  : "Liburua gordetzen..."
              }
            />
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer
        toasts={viewModel.toasts}
        onClose={viewModel.closeToast}
      />
    </div>
  )
}

export default App
