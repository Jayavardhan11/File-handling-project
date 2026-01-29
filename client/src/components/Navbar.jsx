import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar glass-card">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h2>📁 File Handler</h2>
          </div>

          <div className="navbar-menu">
            <div className="navbar-user">
              <FiUser />
              <span className="navbar-username">{user?.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              title="Logout"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="navbar-mobile">
            <div className="navbar-user">
              <FiUser />
              <span>{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm w-full"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
