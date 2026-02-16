export default function AddItemForm({
  newName,
  setNewName,
  newColor,
  setNewColor,
  newType,
  setNewType,
  handleAdd,
}) {
  return (
    <form
      onSubmit={handleAdd}
      className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Item name (e.g., Blue Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />

        <input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Color (e.g., Blue)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />

        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Type (e.g., Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />

        <button
          type="submit"
          className="rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
        >
          Add Item
        </button>
      </div>
    </form>
  );
}
