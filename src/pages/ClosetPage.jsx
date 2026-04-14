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
      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-xl font-semibold text-earth-text">Clothing Stats</h2>
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
        <div className="rounded-xl bg-earth-card p-6 text-center text-earth-stone shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          No items found.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-earth-card p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-earth-text">Closet Cards</h3>
              <p className="text-sm text-earth-stone">
                On mobile, scroll sideways through your closet cards. On desktop, browse the full grid.
              </p>
            </div>
            <p className="hidden rounded-full bg-earth-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-moss sm:block">
              Card view
            </p>
          </div>

          <div className="sm:hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-earth-bg to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-earth-bg to-transparent" />

              <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 scrollbar-earth">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="w-[88vw] max-w-sm flex-none snap-center"
                  >
                    <div className="h-full">
                      <ClosetItem
                        item={item}
                        onToggle={onToggle}
                        isConnected={isConnected}
                        onRemove={onRemove}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-earth-card px-4 py-3 text-sm text-earth-stone shadow-sm">
              <p>Scroll to browse your closet</p>
              <p className="font-semibold text-earth-moss">{items.length} items</p>
            </div>
          </div>

          <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id}>
                <ClosetItem
                  item={item}
                  onToggle={onToggle}
                  isConnected={isConnected}
                  onRemove={onRemove}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
