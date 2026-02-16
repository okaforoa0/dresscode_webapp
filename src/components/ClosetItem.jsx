export default function ClosetItem({ item, onToggle, isConnected, onRemove }) {
  return (
    <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-lg font-semibold text-earth-text">{item.item_name}</h3>

      <p className="mt-3 text-sm leading-6 text-earth-stone">
        <strong className="font-semibold text-earth-text">Color: </strong>
        {item.color || "-"}
        <br />
        <strong className="font-semibold text-earth-text">Type: </strong>
        {item.type || "-"}
        <br />
        <strong className="font-semibold text-earth-text">Status: </strong>
        {item.is_checked_out ? "Checked out" : "In closet"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {!isConnected && (
          <button
            className="rounded-lg bg-earth-pine px-4 py-2 text-sm font-medium text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-earth-moss hover:shadow-md"
            onClick={() => onToggle(item.id)}
          >
            {item.is_checked_out ? "Return to Closet" : "Check Out"}
          </button>
        )}

        <button
          className="rounded-lg bg-earth-clay px-4 py-2 text-sm font-medium text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-[#9f6b55] hover:shadow-md"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
