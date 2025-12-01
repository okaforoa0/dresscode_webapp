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
  isConnected
}) {
  return (
    <div className="fade-up">
      <h2> Clothing Stats</h2>

      <StatsBar items={items} />

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
        <p>No items found.</p>
      ) : (
        items.map((item) => (
          <ClosetItem 
          key={item.id} 
          item={item}
          onToggle={onToggle}
          isConnected={isConnected} 
          onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
    