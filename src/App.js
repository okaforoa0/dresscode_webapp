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
      <div className="flex min-h-screen flex-col bg-earth-bg text-earth-text">
        <header className="sticky top-0 z-50 border-b border-earth-sand/60 bg-earth-card/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h2 className="group flex items-center gap-2 text-xl font-semibold tracking-tight text-earth-text">
              <TbHanger className="origin-top motion-safe:animate-hanger-intro motion-safe:group-hover:animate-hanger-swing text-2xl text-earth-moss" />
              <span>DressCode</span>
            </h2>

            <nav className="flex items-center gap-2 sm:gap-3">
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
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<GettingStarted />} />

            <Route
              path="/closet"
              element={
                <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                  <div className="mb-6 rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-semibold tracking-tight text-earth-text">
                      <TbHanger className="text-3xl text-earth-moss" />
                      <span>Your Closet</span>
                    </h1>

                    <p
                      className={`mt-3 text-center text-sm font-medium ${
                        isConnected ? "text-earth-pine" : "text-earth-stone"
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
                <NavLink to="/" className="block text-earth-stone transition-colors hover:text-earth-text">
                  Home
                </NavLink>
                <NavLink
                  to="/onboarding"
                  className="block text-earth-stone transition-colors hover:text-earth-text"
                >
                  Getting Started
                </NavLink>
                <NavLink
                  to="/closet"
                  className="block text-earth-stone transition-colors hover:text-earth-text"
                >
                  Closet
                </NavLink>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-earth-moss">
                More
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <NavLink
                  to="/outfits"
                  className="block text-earth-stone transition-colors hover:text-earth-text"
                >
                  Outfit Suggestions
                </NavLink>
                <p className="text-earth-stone">Support</p>
                <p className="text-earth-stone">Privacy</p>
              </div>
            </div>
          </div>
          <div className="border-t border-earth-sand/50 px-4 py-4 text-center text-xs text-earth-stone sm:px-6 lg:px-8">
            Copyright ©  {new Date().getFullYear()} DressCode Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
