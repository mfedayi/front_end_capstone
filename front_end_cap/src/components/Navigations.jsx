import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../apiSlices/userSlice";
import "../styles/ball-theme.css";

export default function Navigations() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, profile } = useSelector((state) => state.userAuth);
  const userId = profile?.id;
  const isAdmin = profile?.isAdmin;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar custom-navbar justify-content-center">
      <ul className="nav d-flex align-items-center gap-4">
        <li className="nav-item">
          <Link
            className={`nav-link ${
              isActive("/home") || isActive("/")
                ? "active text-warning"
                : "text-white"
            }`}
            to="/"
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
              >
                Account Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link text-white"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
