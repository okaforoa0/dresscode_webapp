import { useCallback, useEffect, useRef, useState } from "react";
import ClosetPage from "./pages/ClosetPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { TbHanger } from "react-icons/tb";
import GettingStarted from "./pages/GettingStarted";
import OutfitSuggestions from "./pages/OutfitSuggestions";
import AuthPage from "./pages/AuthPage";

const API_URL = process.env.REACT_APP_API_URL || "http://184.73.245.154:5000";
const DEV_BYPASS_AUTH = process.env.REACT_APP_DEV_BYPASS_AUTH === "true";


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function isLikelyValidDeviceId(deviceId) {
  const trimmed = String(deviceId || "").trim();
  return /^[A-Za-z0-9]{12}$/.test(trimmed);
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => {
        const toneClasses =
          toast.type === "success"
            ? "border-[#bfd4c4] bg-[#edf5ef] text-[#335741]"
            : toast.type === "error"
              ? "border-[#e4c5b9] bg-[#fbf1ec] text-[#8b4e3d]"
              : "border-earth-sand/50 bg-earth-card text-earth-text";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-200 ${toneClasses}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md px-2 py-1 text-xs font-semibold opacity-70 transition-opacity hover:opacity-100"
              >
                Close
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("closetItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newType, setNewType] = useState("");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [deviceMessage, setDeviceMessage] = useState("");
  const [deviceError, setDeviceError] = useState("");
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [pendingRfidTag, setPendingRfidTag] = useState("");
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("dresscodeAuth");
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState([]);
  const toastTimeoutsRef = useRef(new Map());

  const isAuthenticated = Boolean(auth?.user?.email || auth?.user?.id);
  const canAccessProtected = isAuthenticated || DEV_BYPASS_AUTH;
  const currentUserId = auth?.user?.id != null ? String(auth.user.id) : "";
  const authToken = auth?.token || "";

  const authHeaders = useCallback(
    (extraHeaders = {}) => ({
      ...extraHeaders,
      ...(authToken ? { Authorization: authToken } : {}),
    }),
    [authToken]
  );

  const filterItemsForCurrentUser = useCallback(
    (list) => {
      if (!Array.isArray(list)) return [];

      if (!isAuthenticated || !currentUserId) {
        return list;
      }

      return list.filter((item) => {
        const ownerId = item?.user_id ?? item?.User_ID;
        return ownerId == null || String(ownerId) === currentUserId;
      });
    },
    [currentUserId, isAuthenticated]
  );

  const visibleItems = filterItemsForCurrentUser(items);

  const dismissToast = useCallback((id) => {
    const timeoutId = toastTimeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      toastTimeoutsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message = "", duration = 3500 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { id, type, title, message }]);

      const timeoutId = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        toastTimeoutsRef.current.delete(id);
      }, duration);

      toastTimeoutsRef.current.set(id, timeoutId);
    },
    []
  );

  const handleSessionExpired = useCallback((message) => {
    localStorage.setItem(
      "dresscodeAuthNotice",
      message || "Your session expired. Please sign in again."
    );
    setAuth(null);
    setItems([]);
    setDevices([]);
    setSelectedDeviceId("");
    setDeviceMessage("");
    setDeviceError("");
    setIsRegistrationMode(false);
    setPendingRfidTag("");
    localStorage.removeItem("dresscodeAuth");
    showToast({
      type: "error",
      title: "Session expired",
      message: message || "Please sign in again.",
      duration: 5000,
    });
  }, [showToast]);

  function handleAuthSuccess(payload) {
    setAuth(payload);
    localStorage.setItem("dresscodeAuth", JSON.stringify(payload));
    showToast({
      type: "success",
      title: "Signed in",
      message: `Welcome back${payload?.user?.name ? `, ${payload.user.name}` : ""}.`,
    });
  }

  function handleLogout() {
    setAuth(null);
    setItems([]);
    setIsConnected(false);
    setDevices([]);
    setSelectedDeviceId("");
    setDeviceMessage("");
    setDeviceError("");
    setIsRegistrationMode(false);
    setPendingRfidTag("");
    localStorage.removeItem("dresscodeAuth");
    showToast({
      type: "info",
      title: "Signed out",
      message: "Your session has been cleared on this device.",
    });
  }

  useEffect(() => () => {
    toastTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    toastTimeoutsRef.current.clear();
  }, []);

  useEffect(() => {
    if (!canAccessProtected) return;

    fetch(`${API_URL}/items`, {
      headers: authHeaders(),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          handleSessionExpired("Your session expired. Please sign in again.");
          return null;
        }
        if (res.ok) setIsConnected(true);
        return data;
      })
      .then((data) => {
        if (data && Array.isArray(data)) setItems(filterItemsForCurrentUser(data));
      })
      .catch(() => console.log("Backend not available - using local data"));
  }, [authHeaders, canAccessProtected, filterItemsForCurrentUser, handleSessionExpired]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/devices`, {
      headers: authHeaders(),
    })
      .then((res) =>
        res.json().then((data) => ({
          ok: res.ok,
          status: res.status,
          data,
        }))
      )
      .then(({ ok, status, data }) => {
        if (!ok) {
          if (status === 401) {
            handleSessionExpired("Your backend session expired. Please sign in again.");
            return;
          }
          setDeviceError(data?.error || "Unable to load devices right now.");
          return;
        }

        const nextDevices = Array.isArray(data?.devices) ? data.devices : [];
        setDevices(nextDevices);
        setSelectedDeviceId((current) => current || nextDevices[0] || "");

        if (nextDevices.length === 0) {
          setDeviceMessage("No device registered yet. Register a device before scanning items.");
        } else {
          setDeviceMessage("");
        }
      })
      .catch((err) => {
        console.log("Device fetch failed:", err);
        setDeviceError("Unable to load devices right now.");
      });
  }, [authHeaders, handleSessionExpired, isAuthenticated]);

  useEffect(() => {
    if (!canAccessProtected) return;

    if (!isConnected) {
      localStorage.setItem("closetItems", JSON.stringify(items));
    }
  }, [items, isConnected, canAccessProtected]);

  useEffect(() => {
    if (!isConnected || !canAccessProtected) return;

    const interval = setInterval(() => {
      fetch(`${API_URL}/items`, {
        headers: authHeaders(),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            handleSessionExpired("Your session expired. Please sign in again.");
            return null;
          }
          return data;
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setItems(filterItemsForCurrentUser(data));
          }
        })
        .catch((err) => {
          console.log("Polling failed:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [authHeaders, isConnected, canAccessProtected, filterItemsForCurrentUser, handleSessionExpired]);

  useEffect(() => {
    if (!isRegistrationMode || !selectedDeviceId || !isAuthenticated) return;

    let isCancelled = false;
    let nextPollTimeout = null;
    const controller = new AbortController();

    async function stopRegistrationSession() {
      try {
        await fetch(`${API_URL}/stop-registration`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ device_id: selectedDeviceId }),
        });
      } catch (err) {
        console.log("Stop registration after scan failed:", err);
      }
    }

    async function pollPendingScan() {
      if (isCancelled) return;

      try {
        const response = await fetch(
          `${API_URL}/pending-scan/${encodeURIComponent(selectedDeviceId)}`,
          {
            headers: authHeaders(),
            signal: controller.signal,
          }
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (!isCancelled) {
            setIsRegistrationMode(false);
            if (response.status === 401) {
              handleSessionExpired("Your session expired. Please sign in again to continue scanning.");
              return;
            }
            setDeviceError(data?.error || "Unable to check for pending scans.");
          }
          return;
        }

        if (data?.rfid_tag) {
          if (!isCancelled) {
            setPendingRfidTag(data.rfid_tag);
            setIsRegistrationMode(false);
            setDeviceMessage("RFID scan received. Add the item details below.");
          }

          await stopRegistrationSession();
          return;
        }

        if (!isCancelled) {
          nextPollTimeout = window.setTimeout(pollPendingScan, 2000);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.log("Pending scan polling failed:", err);

        if (!isCancelled) {
          nextPollTimeout = window.setTimeout(pollPendingScan, 2000);
        }
      }
    }

    pollPendingScan();

    return () => {
      isCancelled = true;
      controller.abort();
      if (nextPollTimeout) {
        window.clearTimeout(nextPollTimeout);
      }
    };
  }, [authHeaders, handleSessionExpired, isAuthenticated, isRegistrationMode, selectedDeviceId]);

  useEffect(() => {
    if (!isRegistrationMode) return;

    const timeout = window.setTimeout(() => {
      setIsRegistrationMode(false);
      setDeviceMessage("Registration mode timed out. Start it again when you are ready to scan.");

      if (selectedDeviceId && isAuthenticated) {
        fetch(`${API_URL}/stop-registration`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ device_id: selectedDeviceId }),
        }).catch(() => {});
      }
    }, 60000);

    return () => window.clearTimeout(timeout);
  }, [authHeaders, isAuthenticated, isRegistrationMode, selectedDeviceId]);

  async function refreshItems() {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_URL}/items`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (response.status === 401) {
        handleSessionExpired("Your session expired. Please sign in again.");
        return;
      }

      if (response.ok && Array.isArray(data)) {
        setIsConnected(true);
        setItems(filterItemsForCurrentUser(data));
      }
    } catch (err) {
      console.log("Item refresh failed:", err);
    }
  }

  async function refreshDevices({ preserveMessage = false } = {}) {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${API_URL}/devices`, {
        headers: authHeaders(),
      });
      const data = await response.json();
      if (response.status === 401) {
        handleSessionExpired("Your session expired. Please sign in again.");
        return;
      }
      const nextDevices = Array.isArray(data?.devices) ? data.devices : [];

      setDevices(nextDevices);
      setSelectedDeviceId((current) => current || nextDevices[0] || "");

      if (!preserveMessage) {
        setDeviceMessage(
          nextDevices.length === 0
            ? "No device registered yet. Register a device before scanning items."
            : ""
        );
      }
    } catch (err) {
      console.log("Device refresh failed:", err);
    }
  }

  async function handleRegisterDevice() {
    setDeviceError("");
    setDeviceMessage("");

    if (!authToken) {
      setDeviceError("Please sign in with a real account before registering a device.");
      return;
    }

      const deviceId = window.prompt(
        "Tap the pairing card, then enter the device ID shown on the LCD."
      );

      if (!deviceId?.trim()) return;

      if (!isLikelyValidDeviceId(deviceId)) {
        const invalidMessage =
          "That device ID does not look valid. Enter the exact 12-character ID shown on the LCD using only letters and numbers.";
        setDeviceError(invalidMessage);
        showToast({
          type: "error",
          title: "Invalid device ID",
          message: invalidMessage,
        });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/register-device`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ device_id: deviceId.trim() }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          handleSessionExpired("Your session expired. Please sign in again to register a device.");
          return;
        }
        setDeviceError(data?.error || "Unable to register device.");
        return;
      }

      const registeredDeviceId = data?.device_id || deviceId.trim();
      setSelectedDeviceId(registeredDeviceId);
      setDevices((currentDevices) =>
        currentDevices.includes(registeredDeviceId)
          ? currentDevices
          : [...currentDevices, registeredDeviceId]
      );
      setDeviceMessage(
        data?.status === "already_owned"
          ? "This device is already connected to your account."
          : "Device registered successfully."
      );
      showToast({
        type: "success",
        title: data?.status === "already_owned" ? "Device already connected" : "Device registered",
        message:
          data?.status === "already_owned"
            ? "This reader is already linked to your account."
            : `${registeredDeviceId} is ready to use.`,
      });
      await refreshDevices({ preserveMessage: true });
    } catch (err) {
      console.log("Device registration failed:", err);
      setDeviceError("Unable to register device right now.");
      showToast({
        type: "error",
        title: "Device registration failed",
        message: "Try again in a moment.",
      });
    }
  }

  async function handleToggleRegistrationMode() {
    setDeviceError("");
    setDeviceMessage("");

    if (!authToken) {
      setDeviceError("Please sign in with a real account before using RFID registration.");
      return;
    }

    if (!selectedDeviceId) {
      setDeviceError("Register or select a device before starting item registration.");
      return;
    }

    const nextIsActive = !isRegistrationMode;
    const endpoint = nextIsActive ? "/start-registration" : "/stop-registration";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ device_id: selectedDeviceId }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          handleSessionExpired("Your session expired. Please sign in again to use RFID registration.");
          return;
        }
        setDeviceError(data?.error || "Unable to update registration mode.");
        return;
      }

      setIsRegistrationMode(nextIsActive);
      if (nextIsActive) {
        setPendingRfidTag("");
      }
      setDeviceMessage(
        nextIsActive
          ? `Registration mode is on for ${selectedDeviceId}. Waiting for RFID scan...`
          : "Registration mode is off."
      );
      showToast({
        type: "info",
        title: nextIsActive ? "Registration mode on" : "Registration mode off",
        message: nextIsActive
          ? `Waiting for a scan from ${selectedDeviceId}.`
          : "RFID registration has been stopped.",
      });
    } catch (err) {
      console.log("Registration mode toggle failed:", err);
      setDeviceError("Unable to update registration mode right now.");
      showToast({
        type: "error",
        title: "Registration update failed",
        message: "The reader mode could not be changed right now.",
      });
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    if (isAuthenticated && !pendingRfidTag) {
      setDeviceError("Start registration and scan an RFID tag before adding this item.");
      return;
    }

    const newItem = {
      id: Date.now(),
      user_id: auth?.user?.id || null,
      item_name: newName,
      color: newColor || "-",
      type: newType || "-",
      is_checked_out: 0,
      rfid_tag: pendingRfidTag || `${Date.now()}`,
      image_url: newPhotoPreview || "",
    };

    if (isAuthenticated) {
      try {
        const formData = new FormData();
        formData.append("rfid_tag", pendingRfidTag);
        formData.append("item_name", newName);
        formData.append("color", newColor || "-");
        formData.append("type", newType || "-");
        formData.append("description", "");
        if (newPhotoFile) {
          formData.append("photo", newPhotoFile);
        }

        const response = await fetch(`${API_URL}/add-item`, {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            handleSessionExpired("Your session expired. Please sign in again to add items.");
            return;
          }
          setDeviceError(data?.error || "Unable to add item.");
          return;
        }

        setDeviceMessage("Item added successfully.");
        setPendingRfidTag("");
        showToast({
          type: "success",
          title: "Item added",
          message: `${newName.trim()} was saved to your closet.`,
        });
        await refreshItems();
      } catch (err) {
        console.warn("Couldn't reach backend, item saved locally.", err);
        setItems([newItem, ...items]);
        showToast({
          type: "info",
          title: "Saved locally",
          message: `${newName.trim()} was stored on this device for now.`,
        });
      }
    } else {
      setItems([newItem, ...items]);
      showToast({
        type: "success",
        title: "Item added",
        message: `${newName.trim()} was added to your closet.`,
      });
    }

    setNewName("");
    setNewColor("");
    setNewType("");
    setNewPhotoFile(null);
    setNewPhotoPreview("");
  }

  async function handleToggle(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_checked_out: !item.is_checked_out } : item
      )
    );

    if (isConnected) {
      const item = items.find((item) => item.id === id);

      try {
        await fetch(`${API_URL}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rfid_tag: item.rfid_tag || String(item.id),
          }),
        });
      } catch (err) {
        console.log("Backend unavailable, couldn't update item status:", err);
      }
    }
  }

  async function handleRemove(id) {
    setItems(items.filter((item) => item.id !== id));

    if (!isAuthenticated || !isConnected) return;

    try {
      const response = await fetch(`${API_URL}/delete-item/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          handleSessionExpired("Your session expired. Please sign in again to delete items.");
          return;
        }
        setDeviceError(data?.error || "Unable to delete item.");
        await refreshItems();
        return;
      }

      setDeviceMessage("Item deleted successfully.");
      showToast({
        type: "success",
        title: "Item removed",
        message: "The closet item was deleted successfully.",
      });
    } catch (err) {
      console.log("Delete item failed:", err);
      setDeviceError("Unable to delete item right now.");
      showToast({
        type: "error",
        title: "Delete failed",
        message: "The item could not be removed right now.",
      });
      await refreshItems();
    }
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <div className="flex min-h-screen flex-col bg-earth-bg text-earth-text">
        <header className="sticky top-0 z-50 border-b border-earth-sand/60 bg-earth-card/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <h2 className="group flex items-center gap-2 text-xl font-semibold tracking-tight text-earth-text">
              <TbHanger className="origin-top text-2xl text-earth-moss motion-safe:animate-hanger-intro motion-safe:group-hover:animate-hanger-swing" />
              <span>DressCode</span>
            </h2>

            <nav className="flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 sm:w-auto sm:gap-3 sm:overflow-visible sm:pb-0">
              <NavLink
                to="/"
                reloadDocument
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-earth-moss text-earth-card"
                      : "text-earth-stone hover:bg-earth-sand/30 hover:text-earth-text"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/onboarding"
                reloadDocument
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-earth-moss text-earth-card"
                      : "text-earth-stone hover:bg-earth-sand/30 hover:text-earth-text"
                  }`
                }
              >
                Getting Started
              </NavLink>

              {canAccessProtected ? (
                <>
                  <NavLink
                    to="/closet"
                    reloadDocument
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-earth-moss text-earth-card"
                          : "text-earth-stone hover:bg-earth-sand/30 hover:text-earth-text"
                      }`
                    }
                  >
                    Closet
                  </NavLink>

                  <NavLink
                    to="/outfits"
                    reloadDocument
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-earth-moss text-earth-card"
                          : "text-earth-stone hover:bg-earth-sand/30 hover:text-earth-text"
                      }`
                    }
                  >
                    Outfits
                  </NavLink>

                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="rounded-lg border border-earth-sand px-3 py-2 text-sm font-medium text-earth-stone transition-all duration-200 hover:bg-earth-sand/30 hover:text-earth-text"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <NavLink
                  to="/auth"
                  reloadDocument
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-earth-moss text-earth-card"
                        : "text-earth-stone hover:bg-earth-sand/30 hover:text-earth-text"
                    }`
                  }
                >
                  Login
                </NavLink>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<GettingStarted />} />
            <Route
              path="/auth"
              element={
                canAccessProtected ? (
                  <Navigate to="/closet" replace />
                ) : (
                  <AuthPage
                    isAuthenticated={isAuthenticated}
                    onAuthSuccess={handleAuthSuccess}
                    onToast={showToast}
                  />
                )
              }
            />

            <Route
              path="/closet"
              element={
                canAccessProtected ? (
                  <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                      <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-semibold tracking-tight text-earth-text">
                        <TbHanger className="text-3xl text-earth-moss" />
                        <span>Your Closet</span>
                      </h1>

                      {DEV_BYPASS_AUTH && (
                        <p
                          className={`mt-3 text-center text-sm font-medium ${
                            isConnected ? "text-earth-pine" : "text-earth-stone"
                          }`}
                        >
                          {isConnected
                            ? "Connected to backend"
                            : "Offline mode (local only)"}
                        </p>
                      )}
                    </div>

                    <ClosetPage
                      items={visibleItems}
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
                      onToggle={handleToggle}
                      onRemove={handleRemove}
                      isConnected={isConnected}
                      devices={devices}
                      selectedDeviceId={selectedDeviceId}
                      setSelectedDeviceId={setSelectedDeviceId}
                      deviceMessage={deviceMessage}
                      deviceError={deviceError}
                      isRegistrationMode={isRegistrationMode}
                      pendingRfidTag={pendingRfidTag}
                      onRegisterDevice={handleRegisterDevice}
                      onToggleRegistrationMode={handleToggleRegistrationMode}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            <Route
              path="/outfits"
              element={
                canAccessProtected ? (
                  <OutfitSuggestions items={visibleItems} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-earth-sand/60 bg-earth-card/90">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div>
              <h3 className="text-base font-semibold text-earth-text">DressCode</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">
                Smart closet management with clean, easy wardrobe tracking.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-earth-moss">
                Quick Links
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <NavLink
                  to="/"
                  reloadDocument
                  className="block text-earth-stone transition-colors hover:text-earth-text"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/onboarding"
                  reloadDocument
                  className="block text-earth-stone transition-colors hover:text-earth-text"
                >
                  Getting Started
                </NavLink>
                {canAccessProtected ? (
                  <>
                    <NavLink
                      to="/closet"
                      reloadDocument
                      className="block text-earth-stone transition-colors hover:text-earth-text"
                    >
                      Closet
                    </NavLink>
                    <NavLink
                      to="/outfits"
                      reloadDocument
                      className="block text-earth-stone transition-colors hover:text-earth-text"
                    >
                      Outfit Suggestions
                    </NavLink>
                  </>
                ) : (
                  <NavLink
                    to="/auth"
                    reloadDocument
                    className="block text-earth-stone transition-colors hover:text-earth-text"
                  >
                    Login / Sign Up
                  </NavLink>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-earth-moss">
                Account
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                {isAuthenticated ? (
                  <>
                    <p className="text-earth-stone">{auth?.user?.name || auth?.user?.email}</p>
                    <p className="text-earth-stone">Signed in</p>
                  </>
                ) : DEV_BYPASS_AUTH ? (
                  <p className="text-earth-stone">Dev bypass enabled (auth skipped).</p>
                ) : (
                  <p className="text-earth-stone">Sign in to access personalized closet data.</p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-earth-sand/50 px-4 py-4 text-center text-xs text-earth-stone sm:px-6 lg:px-8">
            Copyright © {new Date().getFullYear()} DressCode Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
