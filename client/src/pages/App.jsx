import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import Students from "./Students/Students";
import Fees from "./Fees/Fees";
import Notes from "./Notes/Notes";
import Notices from "./Notices/Notices";
import Login from "./pages/login";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("director_token");
    const user = localStorage.getItem("director_user");
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (err) {
        localStorage.removeItem("director_token");
        localStorage.removeItem("director_user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("director_token");
    localStorage.removeItem("director_user");
    setCurrentUser(null);
    window.location.pathname = "/";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          fontSize: "16px",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        Initializing Naveen Academy Portal...
      </div>
    );
  }

  // Agar user logged in nahi hai toh seedha Login Page load hoga
  if (!currentUser) {
    return (
      <Login
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  const navItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Students", icon: "👨‍🎓" },
    { name: "Fees Management", icon: "💰" },
    { name: "Notes & Material", icon: "📚" },
    { name: "Notices", icon: "📢" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 16px",
          boxSizing: "border-box",
        }}
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              🎓
            </div>
            <div>
              <h1
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  margin: 0,
                  color: "#f8fafc",
                }}
              >
                Naveen Academy
              </h1>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#64748b",
                padding: "0 10px 4px",
                textTransform: "uppercase",
              }}
            >
              Main Menu
            </span>
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "500",
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Status & Logout */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "700",
                color: "#cbd5e1",
              }}
            >
              NA
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                Director
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                admin@naveenacademy.com
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "9px 12px",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            🚪 Logout Portal
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          padding: "28px 36px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Students" && <Students />}
        {activeTab === "Fees Management" && <Fees />}
        {activeTab === "Notes & Material" && <Notes />}
        {activeTab === "Notices" && <Notices />}
      </main>
    </div>
  );
}