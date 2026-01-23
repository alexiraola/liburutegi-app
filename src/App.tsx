import { useAppViewModel } from './hooks/useAppViewModel';
import Scanner from './components/Scanner';
import BookList from './components/BookList';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const viewModel = useAppViewModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 sm:pb-20">
      <header className="container mx-auto px-4 py-6 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl text-center font-bold text-slate-800">Nire liburutegia</h1>
          <p className="text-slate-600 text-center mt-1 text-base sm:text-base">Harrapatu zure liburuen kodeak eta zerrendan azalduko dira</p>

          <div className="mt-4 flex items-center justify-between sm:gap-4">
            <span className="text-slate-700 font-medium px-2">
              {viewModel.bookCount()}
            </span>
            {viewModel.books.length > 0 && (
              <button
                onClick={viewModel.handleClearAll}
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
            books={viewModel.books}
            onDelete={viewModel.handleDeleteBook}
          />
        </div>
      </main>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => viewModel.supportedDetector && viewModel.setScanning(true)}
          disabled={!viewModel.supportedDetector || viewModel.isLoading}
          className={`
            w-20 h-20 rounded-full shadow-xl bg-white
            flex items-center justify-center text-slate-700
            transition-all active:scale-95
            sm:w-16 sm:h-16
            ${(viewModel.supportedDetector && !viewModel.isLoading)
              ? 'hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
              : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
          aria-label="Scan book barcode"
        >
          {viewModel.isLoading ? (
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