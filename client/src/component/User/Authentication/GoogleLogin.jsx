import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../../redux/reducers/userSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-btn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    const token = response.credential;
    dispatch(loginWithGoogle(token));
    toast.success("Login Successful");
    const redirectPath = location.state?.from?.pathname || "/dashboard";
    navigate(redirectPath, { replace: true });
  };

  return <div id="google-login-btn"></div>;
};

export default GoogleLogin;
