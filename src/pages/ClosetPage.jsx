import { useEffect, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex > items.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  function beginDrag(clientX, target) {
    if (target?.closest("button")) return;
    setDragStartX(clientX);
    setSwipeDirection(0);
  }

  function updateDrag(clientX) {
    if (dragStartX == null) return;
    setDragOffset(clientX - dragStartX);
  }

  function endDrag() {
    if (dragStartX == null) return;

    if (Math.abs(dragOffset) > 90) {
      const direction = dragOffset > 0 ? 1 : -1;
      setSwipeDirection(direction);
      setDragOffset(direction * 420);

      window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
        setDragOffset(0);
        setSwipeDirection(0);
      }, 220);
    } else {
      setDragOffset(0);
    }

    setDragStartX(null);
  }

  const mobileCards = items.slice(activeIndex, activeIndex + 3);
  if (mobileCards.length < 3 && items.length > 0) {
    mobileCards.push(...items.slice(0, 3 - mobileCards.length));
  }

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
                On mobile, swipe cards left or right like a deck. On desktop, browse the full grid.
              </p>
            </div>
            <p className="hidden rounded-full bg-earth-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-moss sm:block">
              Card view
            </p>
          </div>

          <div className="sm:hidden">
            <div className="relative mx-auto h-[27rem] w-full max-w-sm">
              {mobileCards.map((item, index) => {
                const isTopCard = index === 0;
                const baseTranslateY = index * 12;
                const scale = 1 - index * 0.04;
                const topCardTransform = isTopCard
                  ? `translateX(${dragOffset}px) translateY(${baseTranslateY}px) rotate(${dragOffset / 18}deg) scale(${scale})`
                  : `translateX(0px) translateY(${baseTranslateY}px) rotate(0deg) scale(${scale})`;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`absolute inset-0 transition-all duration-200 ${
                      isTopCard && swipeDirection !== 0 ? "duration-200" : ""
                    }`}
                    style={{
                      transform: topCardTransform,
                      zIndex: 30 - index,
                      opacity: index === 2 ? 0.72 : 1,
                    }}
                    onTouchStart={(event) =>
                      isTopCard &&
                      beginDrag(event.touches[0].clientX, event.target)
                    }
                    onTouchMove={(event) =>
                      isTopCard && updateDrag(event.touches[0].clientX)
                    }
                    onTouchEnd={() => isTopCard && endDrag()}
                    onMouseDown={(event) =>
                      isTopCard && beginDrag(event.clientX, event.target)
                    }
                    onMouseMove={(event) =>
                      isTopCard && dragStartX != null && updateDrag(event.clientX)
                    }
                    onMouseUp={() => isTopCard && endDrag()}
                    onMouseLeave={() => isTopCard && dragStartX != null && endDrag()}
                  >
                    <ClosetItem
                      item={item}
                      onToggle={onToggle}
                      isConnected={isConnected}
                      onRemove={onRemove}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-earth-card px-4 py-3 text-sm text-earth-stone shadow-sm">
              <p>Swipe to move through your closet</p>
              <p className="font-semibold text-earth-moss">
                {activeIndex + 1} / {items.length}
              </p>
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
