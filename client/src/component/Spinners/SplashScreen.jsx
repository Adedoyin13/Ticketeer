import React, { useEffect, useState } from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";

const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-orange-100 z-50">
      <div className="flex flex-col items-center gap-4 animate-fade-in-out">
        <img
          src={TicketeerLogo}
          alt="Ticketeer Logo"
          className="w-[120px] h-[120px] object-contain animate-bounce-in opacity-90"
        />
        <p className="text-orange-700 text-2xl font-bold animate-pulse">
          Welcome to Ticketeer!
        </p>
        <p className="text-orange-700 text-2xl font-bold animate-pulse">
          Discover events. Book tickets. Simple.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;