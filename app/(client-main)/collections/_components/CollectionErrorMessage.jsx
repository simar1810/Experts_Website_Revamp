export default function CollectionErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
      {message}
    </div>
  );
}
