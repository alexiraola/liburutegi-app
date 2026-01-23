export default function BookCount({ count }: { count: number }) {
  const bookCount = () => {
    if (count === 0) return null;
    if (count === 1) return "Liburu bat";
    return `${count} liburu`;
  };
  return <span className="text-slate-700 border border-slate-200 rounded-full font-medium px-3 py-2 bg-slate-50">
    {bookCount()}
  </span>
}
