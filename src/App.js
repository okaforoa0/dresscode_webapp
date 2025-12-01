import './App.css';
import { useEffect, useState } from "react";
import ClosetPage from './pages/ClosetPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { TbHanger } from "react-icons/tb";
import GettingStarted from './pages/GettingStarted';



const API_URL = "http://184.73.245.154:5000";

//this is the main app component
function App() {

  //state to hold the list of closet items
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("closetItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newType, setNewType] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // backend connection check and initial data fetch

  // Check if backend is running
  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then((res) => {
        if (res.ok) setIsConnected(true);
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) setItems(data);
      })
      .catch(() => console.log("Backend not available — using local data"));
  }, []);

  // Save locally if backend not connected
  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem("closetItems", JSON.stringify(items));
    }
  }, [items, isConnected]);

  // Polling: automatically refresh items every 3 seconds
  useEffect(() => {
    if (!isConnected) return;  // Only poll if backend is online

    const interval = setInterval(() => {
      fetch(`${API_URL}/items`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);  // Update items with fresh data
          }
        })
        .catch((err) => {
          console.log("Polling failed:", err);
        });
    }, 3000);  // Poll every 3 seconds

    // Cleanup if component unmounts or isConnected changes
    return () => clearInterval(interval);

  }, [isConnected]);

  // this function handles adding a new item to the closet
  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem = {
      id: Date.now(),
      item_name: newName,
      color: newColor || "—",
      type: newType || "—",
      is_checked_out: 0
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
            color: newColor || "—",
            type: newType || "—",
            description: "",
            image_url: "",
            is_checked_out: 0,
            last_updated: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn("Couldn't reach backend — data saved locally.");
      }
    }
  }

  // FUNCTIONS FOR TOGGLING AND REMOVING ITEMS

  // this function handles toggling the check-in/check-out status of an item
  async function handleToggle(id) {
    //update frontend immediately
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, is_checked_out: !item.is_checked_out}
        : item
      )
    );

    //if backend is connected, notify backend
    if (isConnected) {
      const item = items.find(item => item.id === id);

      try {
        await fetch(`${API_URL}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rfid_tag: item.rfid_tag || String(item.id)
          }),
        });
      } catch (err) {
        console.log("Backend unavailable, couldn't update item status:", err);
      }
    }
  }

  // this function handles removing an item from the closet
  function handleRemove(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <Router>

      {/*Navigation Bar */}
      <header className="nav-header">
        <div className="nav-content">

          {/* App Title */}
          <h2 className="nav-logo">
            <TbHanger className="logo-icon" />
            <span className="nav-logo-text">
            DressCode
            </span>
          </h2>

        {/* linking home changes URL to / -> show <HomePage /> 
            linking closet changes URL to /closet -> show <ClosetPage/> */}
          <nav className="nav-links">

            <NavLink 
            to="/" 
            className={({isActive}) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>

            <NavLink 
            to="/onboarding" 
            className={({ isActive }) => (isActive ? "active" : "")}
            >
              Getting Started
            </NavLink>

            <NavLink 
            to="/closet" 
            className={({ isActive }) => (isActive ? "active" : "")}
            >
              Closet
            </NavLink>
          
          </nav>
        </div>
      </header>

      {/*Router Pages */}
      <Routes>
        <Route 
        path="/" 
        element={<HomePage />} 
        />
        <Route 
          path="/onboarding" 
          element={<GettingStarted />} 
          />

        {/* Title */}
        <Route 
          path="/closet" 
          element={
            <div className="container">
              <h1 className="page-title">
                <TbHanger className="closet-title-icon" />
                Your Closet
              </h1>

              {/* connection status */}
              <p style={{ color: isConnected ? "green" : "gray", textAlign: "center" }}>
                {isConnected
                  ? "✅ Connected to backend"
                  : "⚙️ Offline mode (local only)"}
              </p>

            {/* Closet Page content */}
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
    </Routes>
</Router>
); 

}

export default App;
