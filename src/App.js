import { useEffect, useState } from "react";
import ClosetPage from "./pages/ClosetPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { TbHanger } from "react-icons/tb";
import GettingStarted from "./pages/GettingStarted";
import OutfitSuggestions from "./pages/OutfitSuggestions";

const API_URL = "http://184.73.245.154:5000";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("closetItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newType, setNewType] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then((res) => {
        if (res.ok) setIsConnected(true);
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) setItems(data);
      })
      .catch(() => console.log("Backend not available - using local data"));
  }, []);

  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem("closetItems", JSON.stringify(items));
    }
  }, [items, isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      fetch(`${API_URL}/items`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setItems(data);
          }
        })
        .catch((err) => {
          console.log("Polling failed:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem = {
      id: Date.now(),
      item_name: newName,
      color: newColor || "-",
      type: newType || "-",
      is_checked_out: 0,
    };

    setItems([newItem, ...items]);
    setNewName("");
    setNewColor("");
    setNewType("");

    if (isConnected) {
      try {
        await fetch(`${API_URL}/add-item`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "",
            rfid_tag: `${newItem.id}`,
            item_name: newName,
            color: newColor || "-",
            type: newType || "-",
            description: "",
            image_url: "",
            is_checked_out: 0,
            last_updated: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn("Couldn't reach backend - data saved locally.");
      }
    }
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

  function handleRemove(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900">
              <TbHanger className="text-2xl text-slate-700" />
              <span>DressCode</span>
            </h2>

            <nav className="flex items-center gap-2 sm:gap-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/onboarding"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                Getting Started
              </NavLink>

              <NavLink
                to="/closet"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                Closet
              </NavLink>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<GettingStarted />} />

          <Route
            path="/closet"
            element={
              <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-semibold tracking-tight text-gray-900">
                    <TbHanger className="text-3xl text-slate-700" />
                    <span>Your Closet</span>
                  </h1>

                  <p
                    className={`mt-3 text-center text-sm font-medium ${
                      isConnected ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {isConnected
                      ? "Connected to backend"
                      : "Offline mode (local only)"}
                  </p>
                </div>

                <ClosetPage
                  items={items}
                  newName={newName}
                  setNewName={setNewName}
                  newColor={newColor}
                  setNewColor={setNewColor}
                  newType={newType}
                  setNewType={setNewType}
                  handleAdd={handleAdd}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                  isConnected={isConnected}
                />
              </div>
            }
          />

          <Route path="/outfits" element={<OutfitSuggestions items={items} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;