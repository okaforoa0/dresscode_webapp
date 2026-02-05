export default function ClosetItem({ item, onToggle, isConnected, onRemove}) {
    return (
        <div className="item">
            <h3>{item.item_name}</h3>

            <p>
                <strong>Color: </strong> {item.color || "—"}<br />
                <strong>Type: </strong> {item.type || "—"}<br />
                <strong>Status: </strong> {item.is_checked_out ? "Checked out" : "In closet"}
            </p>

            {!isConnected && (
                <button className="btn-check" onClick={() => onToggle(item.id)}>
                    {item.is_checked_out ? "Return to Closet" : "Check Out"}
                </button>
            )}

            <button className="btn-remove" onClick={() => onRemove(item.id)}>
                Remove
            </button>
        </div>
    )
}