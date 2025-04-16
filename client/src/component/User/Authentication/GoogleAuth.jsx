import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginWithGoogle } from "../../../redux/reducers/userSlice";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Needed for redirecting after login

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log("🪙 Token:", token);

    try {
      const result = await dispatch(loginWithGoogle(token)).unwrap(); // ✅ pass token here
      console.log("✅ User data:", result);
      toast.success("Login successful!");

      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error(err || "Login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.error("❌ Google login failed");
        toast.error("Google login failed");
      }}
    />
  );
};

export default GoogleAuth;