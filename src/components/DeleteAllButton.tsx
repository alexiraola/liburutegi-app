export default function DeleteAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-600 rounded-full transition-colors"
    >
      Ezabatu denak
    </button>
  );
}
