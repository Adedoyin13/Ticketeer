import React, { useEffect, useState } from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";

const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFadingOut(true), 2200);
    const completeTimer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2700);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-opacity duration-500 z-50 bg-gradient-to-br from-orange-100 to-white ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <img
          src={TicketeerLogo}
          alt="Ticketeer Logo"
          className="w-[120px] h-auto object-contain animate-zoom-fade-in opacity-90"
        />
        <div className="text-center space-y-2">
          <p className="text-orange-700 text-3xl font-bold animate-text-slide-up">
            Welcome to Ticketeer
          </p>
          <p className="text-orange-600 text-lg font-medium animate-text-slide-up [animation-delay:0.2s]">
            Discover events. Book tickets. Simple.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;