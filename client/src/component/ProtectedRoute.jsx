import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Spinners/Loader";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const loading = useSelector((state) => state.user.loading);

  if(loading) {
    return <Loader/>
  }

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;