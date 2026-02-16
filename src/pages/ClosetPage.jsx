import ClosetItem from "../components/ClosetItem";
import AddItemForm from "../components/AddItemForm";
import StatsBar from "../components/StatsBar";

export default function ClosetPage({
  items,
  newName,
  setNewName,
  newColor,
  setNewColor,
  newType,
  setNewType,
  handleAdd,
  onToggle,
  onRemove,
  isConnected,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">Clothing Stats</h2>
        <div className="mt-4">
          <StatsBar items={items} />
        </div>
      </div>

      <AddItemForm
        newName={newName}
        setNewName={setNewName}
        newColor={newColor}
        setNewColor={setNewColor}
        newType={newType}
        setNewType={setNewType}
        handleAdd={handleAdd}
      />

      {items.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          No items found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <ClosetItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              isConnected={isConnected}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}