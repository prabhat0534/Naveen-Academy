import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="navbar">
      <div>
        <h2>
          {user?.role === "admin"
            ? "👨‍💼 Admin Dashboard"
            : "👨‍🎓 Student Dashboard"}
        </h2>

        <p>Welcome to Naveen Academy</p>
      </div>

      <div className="navbar-user">
        <span>👋</span>
        <span>{user?.name}</span>
      </div>
    </div>
  );
}

export default Navbar;