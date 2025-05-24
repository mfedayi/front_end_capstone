import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../apiSlices/userSlice";
import "../styles/ball-theme.css";
import { useState } from 'react'; // Import useState

export default function Navigations() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, profile } = useSelector((state) => state.userAuth);
  const userId = profile?.id;
  const isAdmin = profile?.isAdmin;
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // State for toggler visibility

  const isActive = (path) => location.pathname === path;

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true); // Function to close the nav, e.g., on link click

  const handleLogout = () => {
    dispatch(logout());
    closeNav(); // Close the navbar after logout
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar navbar-dark">
      <div className="container-fluid">
        {/* You can add a Navbar brand here if you like */}
        {/* <Link className="navbar-brand text-white" to="/" onClick={closeNav}>Brand</Link> */}
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* ms-auto pushes items to the right */}
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  isActive("/home") || isActive("/")
                    ? "active text-warning"
                    : "text-white"
                }`}
                to="/"
                onClick={closeNav}
              >
                Home Page
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  isActive("/chat") ? "active text-warning" : "text-white"
                }`}
                to="/chat"
                onClick={closeNav}
              >
                Talk Sports
              </Link>
            </li>

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/login") ? "active text-warning" : "text-white"
                    }`}
                    to="/login"
                    onClick={closeNav}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive("/register") ? "active text-warning" : "text-white"
                    }`}
                    to="/register"
                    onClick={closeNav}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && isAdmin && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/admin") ? "active text-warning" : "text-white"
                  }`}
                  to="/admin"
                  onClick={closeNav}
                >
                  Admin Account
                </Link>
              </li>
            )}

            {isLoggedIn && userId && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      isActive(`/user/${userId}`)
                        ? "active text-warning"
                        : "text-white"
                    }`}
                    to={`/user/${userId}`}
                    onClick={closeNav}
                  >
                    Account Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/" 
                    className="nav-link text-white"
                    onClick={handleLogout} // handleLogout now also calls closeNav
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
