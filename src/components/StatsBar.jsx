export default function StatsBar({ items }) {
  const total = items.length;
  const checkedOut = items.filter((item) => item.is_checked_out).length;
  const inCloset = items.filter((item) => !item.is_checked_out).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-earth-sand/30 bg-earth-bg p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-earth-stone">Total</p>
        <p className="mt-1 text-2xl font-semibold text-earth-text">{total}</p>
      </div>

      <div className="rounded-xl border border-earth-sand/30 bg-earth-bg p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-earth-stone">Checked Out</p>
        <p className="mt-1 text-2xl font-semibold text-earth-text">{checkedOut}</p>
      </div>

      <div className="rounded-xl border border-earth-sand/30 bg-earth-bg p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-earth-stone">In Closet</p>
        <p className="mt-1 text-2xl font-semibold text-earth-text">{inCloset}</p>
      </div>
    </div>
  );
}
