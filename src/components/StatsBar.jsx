export default function StatsBar({ items }) {
  const total = items.length;
  const checkedOut = items.filter((item) => item.is_checked_out).length;
  const inCloset = items.filter((item) => !item.is_checked_out).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{total}</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Checked Out</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{checkedOut}</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">In Closet</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{inCloset}</p>
      </div>
    </div>
  );
}