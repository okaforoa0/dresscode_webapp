import { useRef } from "react";

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Green",
  "Gray",
  "Brown",
  "Beige",
  "Red",
  "Navy",
  "Purple",
  "Pink",
  "Yellow",
  "Grey",
];

const TYPE_OPTIONS = [
  "T-Shirt",
  "Shirt",
  "Hoodie",
  "Sweater",
  "Jacket",
  "Jeans",
  "Pants",
  "Shorts",
  "Dress",
  "Skirt",
  "Shoes",
  "Sneakers",
  "Tank Top",
  "Crop Top",
];

function inferDetailsFromName(value) {
  const normalized = value.trim().toLowerCase();

  const inferredColor = COLOR_OPTIONS.find((color) =>
    normalized.includes(color.toLowerCase())
  );

  const inferredType = TYPE_OPTIONS.find((type) =>
    normalized.includes(type.toLowerCase())
  );

  return {
    color: inferredColor || "",
    type: inferredType || "",
  };
}

export default function AddItemForm({
  newName,
  setNewName,
  newColor,
  setNewColor,
  newType,
  setNewType,
  handleAdd,
}) {
  const lastAutoColorRef = useRef("");
  const lastAutoTypeRef = useRef("");

  function handleNameChange(value) {
    setNewName(value);

    const inferred = inferDetailsFromName(value);
    const normalizedName = value.trim();

    const shouldUpdateColor =
      !newColor.trim() || newColor === lastAutoColorRef.current;
    const shouldUpdateType =
      !newType.trim() || newType === lastAutoTypeRef.current;

    if (shouldUpdateColor) {
      const nextColor = normalizedName ? inferred.color : "";
      setNewColor(nextColor);
      lastAutoColorRef.current = nextColor;
    }

    if (shouldUpdateType) {
      const nextType = normalizedName ? inferred.type : "";
      setNewType(nextType);
      lastAutoTypeRef.current = nextType;
    }
  }

  return (
    <form
      onSubmit={handleAdd}
      className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={newName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Item name (e.g., Blue Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />

        <input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          list="item-color-options"
          placeholder="Color (e.g., Blue)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />
        <datalist id="item-color-options">
          {COLOR_OPTIONS.map((color) => (
            <option key={color} value={color} />
          ))}
        </datalist>

        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          list="item-type-options"
          placeholder="Type (e.g., Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />
        <datalist id="item-type-options">
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>

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
