import { useEffect, useRef } from "react";

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
  newPhotoFile,
  setNewPhotoFile,
  newPhotoPreview,
  setNewPhotoPreview,
  handleAdd,
  pendingRfidTag = "",
  isRegistrationMode = false,
  requiresRfid = false,
}) {
  const lastAutoColorRef = useRef("");
  const lastAutoTypeRef = useRef("");
  const isAddDisabled = requiresRfid && !pendingRfidTag;

  useEffect(() => {
    return () => {
      if (newPhotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(newPhotoPreview);
      }
    };
  }, [newPhotoPreview]);

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

  function handlePhotoChange(file) {
    if (newPhotoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(newPhotoPreview);
    }

    if (!file) {
      setNewPhotoFile(null);
      setNewPhotoPreview("");
      return;
    }

    setNewPhotoFile(file);
    setNewPhotoPreview(URL.createObjectURL(file));
  }

  return (
    <form
      onSubmit={handleAdd}
      className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 rounded-xl bg-earth-bg p-4 text-sm text-earth-stone">
        {pendingRfidTag ? (
          <span>
            RFID captured: <strong className="text-earth-text">{pendingRfidTag}</strong>. Add the
            item details below.
          </span>
        ) : isRegistrationMode ? (
          "Waiting for an RFID scan. Once the tag is captured, you can save the item details here."
        ) : requiresRfid ? (
          "Start registration mode and scan an RFID tag before adding a new item."
        ) : (
          "Add a clothing item manually while you are developing or offline."
        )}
      </div>

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

        <label className="flex cursor-pointer flex-col justify-center rounded-lg border border-dashed border-earth-sand/60 bg-earth-bg px-4 py-3 text-sm text-earth-stone transition-all duration-200 hover:border-earth-moss hover:bg-earth-sand/20 sm:col-span-2 lg:col-span-3">
          <span className="font-medium text-earth-text">
            {newPhotoFile ? newPhotoFile.name : "Upload a clothing photo"}
          </span>
          <span className="mt-1 text-xs">
            JPG, PNG, or other image files up to 5 MB.
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </label>

        <button
          type="submit"
          disabled={isAddDisabled}
          className="rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAddDisabled ? "Scan RFID First" : "Add Item"}
        </button>
      </div>

      {newPhotoPreview && (
        <div className="mt-4 rounded-2xl bg-earth-bg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-stone">
                Photo Preview
              </p>
              <p className="mt-1 text-sm text-earth-stone">
                This image will be uploaded with the item.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handlePhotoChange(null)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-earth-moss transition-colors hover:text-earth-pine"
            >
              Remove
            </button>
          </div>
          <img
            src={newPhotoPreview}
            alt="New item preview"
            className="mt-4 h-48 w-full rounded-2xl object-cover sm:h-56"
          />
        </div>
      )}
    </form>
  );
}
