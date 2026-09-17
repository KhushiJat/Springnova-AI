import React, { useState } from "react";
import ChatComponent from "./components/ChatComponent";
import ImageGenerator from "./components/ImageGenerator";
import RecipeGenerator from "./components/RecipeGenerator";
import AudioTranslator from "./components/AudioTranslator";
import WeatherView from "./components/WeatherView"; 
import MapView from "./components/MapView"; // NEW: Import your Map component
import HistoryView from "./components/HistoryView"; 
import { Sparkles, Image as ImageIcon, Utensils, Mic, CloudSun, MapPin, History, Menu, LogOut, User } from "lucide-react"; // NEW: Added MapPin icon
import { Toaster, toast } from "react-hot-toast";

function App() {
  // 1. State declarations
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("springnova_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [menuOpen, setMenuOpen] = useState(true);

  // 2. Handle Login pointing to your Spring Boot backend
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: usernameInput, 
          password: passwordInput 
        })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem("springnova_user", JSON.stringify(data));
      toast.success(`Welcome back, ${data.username}!`);
    } catch (err) {
      toast.error("Login failed: Check your username or password.");
    }
  };

  // 3. Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("springnova_user");
    setUsernameInput("");
    setPasswordInput("");
    toast.success("Logged out successfully");
  };

  // If NOT logged in, show the Login Screen
  if (!user) {
    return (
      <div style={styles.authWrapper}>
        <Toaster position="top-center" />
        <div style={styles.authCard}>
          <div style={styles.authHeader}>
            <Sparkles size={28} color="#3b82f6" />
            <h1 style={styles.authAppTitle}>Springnova-AI</h1>
          </div>
          <p style={styles.authSubtitle}>Sign in to continue to your AI workspace</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter your username"
                style={styles.inputField}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                style={styles.inputField}
              />
            </div>
            <button type="submit" style={styles.loginBtn}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show the main application interface
  return (
    <div style={styles.mainWrapper}>
      <Toaster position="top-center" />
      
      {/* Top Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <Sparkles size={22} color="#3b82f6" />
          <span style={styles.brandText}>Springnova-AI</span>
        </div>

        <div style={styles.navRight}>
          <div style={styles.userBadge}>
            <User size={14} style={{ marginRight: '6px' }} />
            {user.username}
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={14} style={{ marginRight: '4px' }} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Container Layout */}
      <div style={styles.layoutBody}>
        {/* Sidebar */}
        <div style={{ ...styles.sidebar, width: menuOpen ? '240px' : '70px' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtnBelow}>
            <Menu size={20} color="#ececec" />
            {menuOpen && <span style={{ fontSize: '14px', fontWeight: '500' }}>Main Menu</span>}
          </button>

          <div style={styles.sidebarDivider} />

          <button 
            onClick={() => setActiveTab("chat")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'chat' ? '#2f2f2f' : 'transparent' }}
          >
            <Sparkles size={18} color="#3b82f6" /> {menuOpen && "Ask AI"}
          </button>
          <button 
            onClick={() => setActiveTab("image")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'image' ? '#2f2f2f' : 'transparent' }}
          >
            <ImageIcon size={18} color="#ec4899" /> {menuOpen && "Image Generator"}
          </button>
          <button 
            onClick={() => setActiveTab("recipe")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'recipe' ? '#2f2f2f' : 'transparent' }}
          >
            <Utensils size={18} color="#f59e0b" /> {menuOpen && "Recipe Generator"}
          </button>
          <button 
            onClick={() => setActiveTab("audio")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'audio' ? '#2f2f2f' : 'transparent' }}
          >
            <Mic size={18} color="#06b6d4" /> {menuOpen && "Audio Transcription"}
          </button>

          {/* Weather Forecast Sidebar Button */}
          <button 
            onClick={() => setActiveTab("weather")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'weather' ? '#2f2f2f' : 'transparent' }}
          >
            <CloudSun size={18} color="#10b981" /> {menuOpen && "Weather Forecast"}
          </button>

          {/* NEW: Live Map Tracker Sidebar Button */}
          <button 
            onClick={() => setActiveTab("map")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'map' ? '#2f2f2f' : 'transparent' }}
          >
            <MapPin size={18} color="#ef4444" /> {menuOpen && "Live Map Tracker"}
          </button>

          {/* Activity History Sidebar Button */}
          <button 
            onClick={() => setActiveTab("history")} 
            style={{ ...styles.sidebarItem, backgroundColor: activeTab === 'history' ? '#2f2f2f' : 'transparent' }}
          >
            <History size={18} color="#8b5cf6" /> {menuOpen && "Activity History"}
          </button>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {activeTab === "chat" && <ChatComponent />}
          {activeTab === "image" && <ImageGenerator />}
          {activeTab === "recipe" && <RecipeGenerator />}
          {activeTab === "audio" && <AudioTranslator />}
          {activeTab === "weather" && <WeatherView username={user.username} />}
          {activeTab === "map" && <MapView username={user.username} />} {/* NEW: Render Map component */}
          {activeTab === "history" && <HistoryView username={user.username} />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #171717 0%, #111827 100%)',
    fontFamily: 'Söhne, ui-sans-serif, system-ui, sans-serif',
  },
  authCard: {
    backgroundColor: '#171717',
    border: '1px solid #2f2f2f',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  authHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  authAppTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#ececec',
    margin: 0,
  },
  authSubtitle: {
    fontSize: '14px',
    color: '#8e8e8e',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    color: '#b4b4b4',
    fontWeight: '500',
  },
  inputField: {
    backgroundColor: '#212121',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  loginBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  mainWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #171717 0%, #111827 100%)',
    fontFamily: 'Söhne, ui-sans-serif, system-ui, sans-serif',
  },
  navbar: {
    height: '56px',
    backgroundColor: '#171717',
    borderBottom: '1px solid #2f2f2f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    color: '#ececec',
    zIndex: 10,
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandText: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#fff',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userBadge: {
    fontSize: '13px',
    color: '#8e8e8e',
    display: 'flex',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #333',
    color: '#ececec',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  layoutBody: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    backgroundColor: '#171717',
    borderRight: '1px solid #2f2f2f',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '6px',
    zIndex: 5,
    transition: 'width 0.2s ease',
  },
  menuBtnBelow: {
    backgroundColor: '#212121',
    border: '1px solid #333',
    color: '#ececec',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
    width: '100%',
    textAlign: 'left',
  },
  sidebarDivider: {
    height: '1px',
    backgroundColor: '#2f2f2f',
    margin: '6px 0',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    color: '#ececec',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  contentArea: {
    padding: '30px',
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'transparent',
  }
};

export default App;