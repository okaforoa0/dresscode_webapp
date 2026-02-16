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
      className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Item name (e.g., Blue Hoodie)"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        <input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Color (e.g., Blue)"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Type (e.g., Hoodie)"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-slate-700 hover:shadow-md"
        >
          Add Item
        </button>
      </div>
    </form>
  );
}