import { useEffect, useRef, useState } from "react";

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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to process image."));
    image.src = src;
  });
}

async function compressImage(file) {
  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image compression is not supported in this browser.");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const quality = mimeType === "image/png" ? undefined : 0.82;

  const compressedBlob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });

  const originalName = file.name.replace(/\.[^.]+$/, "");
  const extension = mimeType === "image/png" ? "png" : "jpg";

  return new File([compressedBlob], `${originalName}-optimized.${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
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
  isSubmittingItem = false,
  handleAdd,
  pendingRfidTag = "",
  isRegistrationMode = false,
  requiresRfid = false,
}) {
  const lastAutoColorRef = useRef("");
  const lastAutoTypeRef = useRef("");
  const [photoError, setPhotoError] = useState("");
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const isAddDisabled = isSubmittingItem || (requiresRfid && !pendingRfidTag);

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

  async function handlePhotoChange(file) {
    setPhotoError("");

    if (newPhotoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(newPhotoPreview);
    }

    if (!file) {
      setNewPhotoFile(null);
      setNewPhotoPreview("");
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const compressedFile = await compressImage(file);
      setNewPhotoFile(compressedFile);
      setNewPhotoPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Photo compression failed:", error);
      setNewPhotoFile(null);
      setNewPhotoPreview("");
      setPhotoError("We could not prepare that photo. Try a different image.");
    } finally {
      setIsProcessingPhoto(false);
    }
  }

  return (
    <form
      onSubmit={handleAdd}
      className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 rounded-xl bg-earth-bg p-4 text-sm text-earth-stone">
        {isProcessingPhoto ? (
          "Preparing your photo for upload. This helps the item save faster."
        ) : isSubmittingItem ? (
          "Uploading item and photo now. This can take a moment on mobile."
        ) : pendingRfidTag ? (
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
          disabled={isSubmittingItem || isProcessingPhoto}
          placeholder="Item name (e.g., Blue Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />

        <input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          disabled={isSubmittingItem || isProcessingPhoto}
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
          disabled={isSubmittingItem || isProcessingPhoto}
          list="item-type-options"
          placeholder="Type (e.g., Hoodie)"
          className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
        />
        <datalist id="item-type-options">
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>

        <label className={`flex flex-col justify-center rounded-lg border border-dashed border-earth-sand/60 bg-earth-bg px-4 py-3 text-sm text-earth-stone transition-all duration-200 sm:col-span-2 lg:col-span-3 ${isSubmittingItem || isProcessingPhoto ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-earth-moss hover:bg-earth-sand/20"}`}>
          <span className="font-medium text-earth-text">
            {isProcessingPhoto
              ? "Optimizing photo..."
              : newPhotoFile
                ? newPhotoFile.name
                : "Upload a clothing photo"}
          </span>
          <span className="mt-1 text-xs">
            JPG, PNG, or other image files up to 5 MB. Large images are compressed before upload.
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={isSubmittingItem || isProcessingPhoto}
            onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </label>

        <button
          type="submit"
          disabled={isAddDisabled || isProcessingPhoto}
          className="rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessingPhoto
            ? "Preparing Photo..."
            : isSubmittingItem
              ? "Uploading Item..."
              : isAddDisabled
                ? "Scan RFID First"
                : "Add Item"}
        </button>
      </div>

      {photoError && (
        <div className="mt-4 rounded-lg bg-[#f7ebe7] px-3 py-2 text-sm text-[#8b4e3d]">
          {photoError}
        </div>
      )}

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
              disabled={isSubmittingItem || isProcessingPhoto}
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
