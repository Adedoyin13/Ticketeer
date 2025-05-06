import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import { useCallback } from "react";
import TicketeerLogo from "./../../assets/Ticketeer-Logo.png";

const SplashScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6 }}
        >
          {/* Particle Background */}
          <Particles
            init={particlesInit}
            className="absolute inset-0 z-0"
            options={{
              fullScreen: false,
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              particles: {
                color: { value: "#f97316" },
                links: {
                  color: "#f97316",
                  distance: 100,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 1.5,
                  direction: "none",
                  outModes: { default: "bounce" },
                },
                number: {
                  value: 50,
                  density: { enable: true, area: 800 },
                },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 4 } },
              },
              detectRetina: true,
            }}
          />

          <motion.img
            src={TicketeerLogo}
            alt="Ticketeer Logo"
            className="w-[120px] h-auto object-contain mb-6 z-10"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.p
            className="text-orange-700 text-3xl font-bold mb-2 z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Welcome to Ticketeer
          </motion.p>

          <motion.p
            className="text-orange-600 text-lg font-medium z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Discover events. Book tickets. Simple.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;