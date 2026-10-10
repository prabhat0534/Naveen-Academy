import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logout Successful");

    navigate("/login");
  };

  // Role ke according dashboard open hoga
  const goDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="sidebar">
      <h2>🎓 Naveen Academy</h2>

      <ul>
        {/* Dashboard */}
        <li onClick={goDashboard}>🏠 Dashboard</li>

        {/* ================= ADMIN MENU ================= */}
        {user?.role === "admin" && (
          <>
            <li onClick={() => navigate("/classes")}>
              🏫 Classes
            </li>

            <li onClick={() => navigate("/students")}>
              👨‍🎓 Students
            </li>

            <li>
              👨‍🏫 Teachers
            </li>

            <li>
              💰 Fees
            </li>

            <li>
              📅 Attendance
            </li>

            <li>
              📝 Results
            </li>

            <li>
              📢 Notices
            </li>

            <li>
              ⚙️ Settings
            </li>
          </>
        )}

        {/* ================= STUDENT MENU ================= */}
        {user?.role === "student" && (
          <>
            <li>
              👤 My Profile
            </li>

            <li>
              🏫 My Class
            </li>

            <li>
              📅 Attendance
            </li>

            <li>
              💰 Fees
            </li>

            <li>
              📝 Results
            </li>

            <li>
              📢 Notices
            </li>
          </>
        )}

        {/* Logout */}
        <li onClick={handleLogout}>
          🚪 Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;