import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const RouteChangeLoader = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);

    // Animation: Let it show until the new route renders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(false);
      });
    });
  }, [location]);

  return isAnimating ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900 transition-opacity duration-300 animate-fade">
      <Loader />
    </div>
  ) : null;
};

export default RouteChangeLoader;