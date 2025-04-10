import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../../../redux/reducers/userSlice";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(getUser()); // get user info from backend
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return <p>Logging you in via Google...</p>;
};

export default AuthSuccess;