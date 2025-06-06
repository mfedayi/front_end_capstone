import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


// PrivateRoute component to protect routes based on authentication and admin status.
const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { isLoggedIn, profile } = useSelector((state) => state.userAuth);
  const isAdmin = profile?.isAdmin;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if(requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  
  return children;
};

export default PrivateRoute;
