export default function StatsBar({ items }) {
    const total = items.length;
    const checkedOut = items.filter(item => item.is_checked_out).length;
    const inCloset = items.filter(item => !item.is_checked_out).length;

    return (
        <div className="stats-bar">
            <p><strong>Total: </strong> {total}</p>
            <p><strong>Checked out: </strong> {checkedOut}</p>
            <p><strong>In closet: </strong> {inCloset}</p>
        </div>
    );
}