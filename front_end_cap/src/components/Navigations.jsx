import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../apiSlices/userSlice";

export default function Navigations() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.userAuth);
  const isLoggedIn = !!profile;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar bg-light justify-content-center">
      <ul className="nav d-flex align-items-center gap-4">
        <li className="nav-item">
          <Link
            className={`nav-link ${
              isActive("/home") || isActive("/")
                ? "active text-primary"
                : "text-dark"
            }`}
            to="/"
          >
            Home Page
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${
              isActive("/chat") ? "active text-primary" : "text-dark"
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
                  isActive("/login") ? "active text-primary" : "text-dark"
                }`}
                to="/login"
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  isActive("/register") ? "active text-primary" : "text-dark"
                }`}
                to="/register"
              >
                Register
              </Link>
            </li>
          </>
        )}

        {isLoggedIn && (
          <>
            {/* <li className="nav-item">
              <Link className={`nav-link ${isActive("/account") ? "active text-primary" : "text-dark"}`}
          to="/account">
                Account
              </Link>
            </li> */}
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link text-dark"
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
