import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Spinners/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading.getUser) {
    return <Loader loading={loading.getUser} />;
  }

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;