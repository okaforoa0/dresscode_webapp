import { useMemo, useState } from "react";
import ClosetItem from "../components/ClosetItem";
import AddItemForm from "../components/AddItemForm";
import StatsBar from "../components/StatsBar";

function normalizeFilterValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getUniqueOptions(items, key) {
  return Array.from(
    new Set(
      items
        .map((item) => String(item[key] || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

export default function ClosetPage({
  items,
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
  onToggle,
  onRemove,
  isConnected,
  devices,
  selectedDeviceId,
  setSelectedDeviceId,
  deviceMessage,
  deviceError,
  isRegistrationMode,
  pendingRfidTag,
  onRegisterDevice,
  onToggleRegistrationMode,
  isAuthenticated,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  const colorOptions = useMemo(() => getUniqueOptions(items, "color"), [items]);
  const typeOptions = useMemo(() => getUniqueOptions(items, "type"), [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeFilterValue(searchFilter);

    return items.filter((item) => {
      const itemName = normalizeFilterValue(item.item_name);
      const itemColor = normalizeFilterValue(item.color);
      const itemType = normalizeFilterValue(item.type);
      const isCheckedOut = Boolean(item.is_checked_out);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in-closet" && !isCheckedOut) ||
        (statusFilter === "checked-out" && isCheckedOut);
      const matchesColor =
        colorFilter === "all" || itemColor === normalizeFilterValue(colorFilter);
      const matchesType =
        typeFilter === "all" || itemType === normalizeFilterValue(typeFilter);
      const matchesSearch =
        !normalizedSearch ||
        itemName.includes(normalizedSearch) ||
        itemColor.includes(normalizedSearch) ||
        itemType.includes(normalizedSearch);

      return matchesStatus && matchesColor && matchesType && matchesSearch;
    });
  }, [colorFilter, items, searchFilter, statusFilter, typeFilter]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    colorFilter !== "all" ||
    typeFilter !== "all" ||
    searchFilter.trim() !== "";

  function clearFilters() {
    setStatusFilter("all");
    setColorFilter("all");
    setTypeFilter("all");
    setSearchFilter("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <h2 className="text-xl font-semibold text-earth-text">Clothing Stats</h2>
        <div className="mt-4">
          <StatsBar items={items} />
        </div>
      </div>

      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-earth-text">RFID Device</h2>
            <p className="mt-1 text-sm leading-6 text-earth-stone">
              Connect your DressCode reader, then start registration mode before scanning a new item.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {devices.length > 0 && (
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              >
                {devices.map((deviceId) => (
                  <option key={deviceId} value={deviceId}>
                    {deviceId}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={onRegisterDevice}
              disabled={!isAuthenticated}
              className="rounded-lg border border-earth-sand px-4 py-2 text-sm font-semibold text-earth-moss transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sand/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Register Device
            </button>

            <button
              type="button"
              onClick={onToggleRegistrationMode}
              disabled={!isAuthenticated || !selectedDeviceId}
              className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${
                isRegistrationMode
                  ? "bg-[#8b4e3d] text-earth-card hover:bg-[#754131]"
                  : "bg-earth-moss text-earth-card hover:bg-earth-sage"
              }`}
            >
              {isRegistrationMode ? "Stop Registration" : "Start Registration"}
            </button>
          </div>
        </div>

        {!isAuthenticated && (
          <p className="mt-4 rounded-lg bg-[#f7ebe7] px-3 py-2 text-sm text-[#8b4e3d]">
            Device registration requires a real sign-in. Dev bypass lets you view the page, but it does not create a backend token.
          </p>
        )}

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-earth-bg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-earth-stone">
              Registration Status
            </p>
            <p className="mt-1 font-medium text-earth-text">
              {isRegistrationMode ? "Waiting for RFID scan..." : "Registration mode off"}
            </p>
          </div>

          <div className="rounded-xl bg-earth-bg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-earth-stone">
              Pending RFID
            </p>
            <p className="mt-1 font-medium text-earth-text">
              {pendingRfidTag || "No scan captured yet"}
            </p>
          </div>
        </div>

      </div>

      <AddItemForm
        newName={newName}
        setNewName={setNewName}
        newColor={newColor}
        setNewColor={setNewColor}
        newType={newType}
        setNewType={setNewType}
        newPhotoFile={newPhotoFile}
        setNewPhotoFile={setNewPhotoFile}
        newPhotoPreview={newPhotoPreview}
        setNewPhotoPreview={setNewPhotoPreview}
        handleAdd={handleAdd}
        pendingRfidTag={pendingRfidTag}
        isRegistrationMode={isRegistrationMode}
        requiresRfid={isAuthenticated}
      />

      {items.length === 0 ? (
        <div className="rounded-[1.5rem] bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-moss">
              Closet Empty
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-earth-text">
              Your wardrobe is ready for its first item
            </h3>
            <p className="mt-3 text-sm leading-6 text-earth-stone">
              Register your device, start RFID registration mode, scan a tag, then save the item details here.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRegisterDevice}
                disabled={!isAuthenticated}
                className="rounded-lg border border-earth-sand px-4 py-2 text-sm font-semibold text-earth-moss transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sand/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                Register Device
              </button>
              <button
                type="button"
                onClick={onToggleRegistrationMode}
                disabled={!isAuthenticated || !selectedDeviceId}
                className="rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRegistrationMode ? "Stop Registration" : "Start Registration"}
              </button>
            </div>

            {!isAuthenticated && (
              <p className="mt-4 text-sm text-earth-stone">
                Dev mode can preview the page, but real item registration still needs a signed-in account.
              </p>
            )}

            <div className="mt-6 rounded-2xl bg-earth-bg p-4 text-left">
              <p className="text-sm font-semibold text-earth-text">Quick flow</p>
              <p className="mt-2 text-sm leading-6 text-earth-stone">
                1. Register the device.
                <br />
                2. Start registration mode.
                <br />
                3. Scan the RFID tag.
                <br />
                4. Fill in the item details and save.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-earth-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-earth-text">Filter Closet</h3>
                <p className="text-sm text-earth-stone">
                  Narrow your cards by status, color, type, or item name.
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-earth-sand px-3 py-2 text-sm font-semibold text-earth-moss transition-all duration-200 hover:bg-earth-sand/30"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search items..."
                className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              >
                <option value="all">All statuses</option>
                <option value="in-closet">In closet</option>
                <option value="checked-out">Checked out</option>
              </select>

              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              >
                <option value="all">All colors</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-earth-sand/40 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              >
                <option value="all">All types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-earth-card p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-earth-text">Closet Cards</h3>
              <p className="text-sm text-earth-stone">
                On mobile, scroll sideways through your closet cards. On desktop, browse the full grid.
              </p>
            </div>
            <p className="hidden rounded-full bg-earth-bg px-3 py-1 text-xs font-semibold uppercase tracking-wide text-earth-moss sm:block">
              {filteredItems.length} / {items.length} shown
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-[1.5rem] bg-earth-card p-6 text-center shadow-sm">
              <p className="text-lg font-semibold text-earth-text">No items match these filters</p>
              <p className="mt-2 text-sm text-earth-stone">
                Try a broader search or clear the filters to see your full closet again.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg bg-earth-moss px-4 py-2 text-sm font-semibold text-earth-card transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
          <div className="sm:hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-earth-bg to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-earth-bg to-transparent" />

              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[6vw] pb-2 scrollbar-earth">
                {filteredItems.map((item) => (
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
              <p className="font-semibold text-earth-moss">
                {filteredItems.length} / {items.length} items
              </p>
            </div>
          </div>

          <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
