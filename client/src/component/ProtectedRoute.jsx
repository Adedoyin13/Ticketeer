import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Spinners/Loader";

const ProtectedRoute = ({ children }) => {
  const {user, isAuthenticated, loading} = useSelector((state) => state.user);

  if(loading) {
    return <Loader/>
  }

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;