import { useState } from "react";
import { TbHanger } from "react-icons/tb";

const API_URL = process.env.REACT_APP_API_URL || "http://184.73.245.154:5000";

function resolveImageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("blob:") || value.startsWith("data:")) {
    return value;
  }
  return `${API_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export default function ClosetItem({ item, onToggle, isConnected, onRemove }) {
  const imageUrl = resolveImageUrl(item.image_url || item.Image_URL || "");
  const [hasImageError, setHasImageError] = useState(false);
  const statusLabel = item.is_checked_out ? "Checked out" : "In closet";
  const statusClasses = item.is_checked_out
    ? "bg-[#f3e4de] text-earth-clay"
    : "bg-[#e7efe8] text-earth-pine";

  return (
    <div className="h-full rounded-[1.5rem] border border-earth-sand/40 bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 overflow-hidden rounded-2xl bg-earth-bg">
        {imageUrl && !hasImageError ? (
          <img
            src={imageUrl}
            alt={item.item_name || "Closet item"}
            className="h-48 w-full object-cover"
            onError={(event) => {
              setHasImageError(true);
            }}
          />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(154,170,138,0.2),_transparent_55%),linear-gradient(180deg,_rgba(243,239,232,0.95),_rgba(233,225,211,0.95))] px-6 text-center">
            <div className="rounded-full bg-earth-card/80 p-3 shadow-sm">
              <TbHanger className="text-3xl text-earth-moss" />
            </div>
            <div>
              <p className="text-sm font-semibold text-earth-text">No image added</p>
              <p className="mt-1 text-xs text-earth-stone">
                Upload a photo when saving this item.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-moss">
            Wardrobe Item
          </p>
          <h3 className="mt-2 text-xl font-semibold text-earth-text">{item.item_name}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl bg-earth-bg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-earth-stone">
            Color
          </p>
          <p className="mt-1 text-base font-medium text-earth-text">{item.color || "-"}</p>
        </div>

        <div className="rounded-2xl bg-earth-bg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-earth-stone">
            Type
          </p>
          <p className="mt-1 text-base font-medium text-earth-text">{item.type || "-"}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
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
