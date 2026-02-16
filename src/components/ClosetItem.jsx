export default function ClosetItem({ item, onToggle, isConnected, onRemove }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900">{item.item_name}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        <strong className="font-semibold text-gray-800">Color: </strong>
        {item.color || "-"}
        <br />
        <strong className="font-semibold text-gray-800">Type: </strong>
        {item.type || "-"}
        <br />
        <strong className="font-semibold text-gray-800">Status: </strong>
        {item.is_checked_out ? "Checked out" : "In closet"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {!isConnected && (
          <button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-md"
            onClick={() => onToggle(item.id)}
          >
            {item.is_checked_out ? "Return to Closet" : "Check Out"}
          </button>
        )}

        <button
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-1 hover:bg-rose-500 hover:shadow-md"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}