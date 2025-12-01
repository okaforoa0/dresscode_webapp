export default function AddItemForm({ 
    newName, 
    setNewName, 
    newColor,
    setNewColor,
    newType,
    setNewType,
    handleAdd

}) {
    return (
        <form onSubmit={handleAdd} className="add-item-form">
            <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Item name (e.g., 'Blue Hoodie')"
            />

            <input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Color (e.g., 'Blue')"
            />

            <input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Type (e.g., 'Hoodie')"
            />

            <button type="submit">Add Item</button>
        </form>
    );
}