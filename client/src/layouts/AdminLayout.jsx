import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// Fixed-dimension SVGs so they never stretch
const Icons = {
  Dashboard: () => (
    <svg style={{ width: "20px", height: "20px", minWidth: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Users: () => (
    <svg style={{ width: "20px", height: "20px", minWidth: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  CreditCard: () => (
    <svg style={{ width: "20px", height: "20px", minWidth: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  FileText: () => (
    <svg style={{ width: "20px", height: "20px", minWidth: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Bell: () => (
    <svg style={{ width: "20px", height: "20px", minWidth: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  GraduationCap: () => (
    <svg style={{ width: "24px", height: "24px", minWidth: "24px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  LogOut: () => (
    <svg style={{ width: "16px", height: "16px", minWidth: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: Icons.Dashboard },
    { name: "Students", path: "/admin/students", icon: Icons.Users },
    { name: "Fees Management", path: "/admin/fees", icon: Icons.CreditCard },
    { name: "Notes & Material", path: "/admin/notes", icon: Icons.FileText },
    { name: "Notices", path: "/admin/notices", icon: Icons.Bell },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          minWidth: "260px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
        className={`fixed inset-y-0 left-0 z-50 transform md:static md:translate-x-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div style={{ height: "64px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
            <Link to="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Icons.GraduationCap />
              </div>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff", display: "block" }}>Naveen Academy</span>
                <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "500" }}>Admin Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <Icons.X />
            </button>
          </div>

          {/* Nav Items */}
          <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", fontWeight: "600", padding: "0 10px", marginBottom: "8px" }}>
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: isActive ? "600" : "500",
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    color: isActive ? "#ffffff" : "#94a3b8"
                  }}
                  className="hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icon />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <Icons.ChevronRight />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", backgroundColor: "#1e293b", marginBottom: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(37, 99, 235, 0.3)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" }}>
              A
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Administrator</p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>admin@naveenacademy.com</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: "500", color: "#f87171", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
            className="hover:bg-rose-500/10 transition-colors"
          >
            <Icons.LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "64px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "#475569" }}
              className="md:hidden"
            >
              <Icons.Menu />
            </button>
            <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: 0 }}>Admin Management Dashboard</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "9999px", backgroundColor: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
              Live Session
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: "24px", maxWidth: "1280px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}