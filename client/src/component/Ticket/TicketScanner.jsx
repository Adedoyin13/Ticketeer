import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const TicketScanner = () => {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner("scanner", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          setResult({ status: "success", message: decodedText });
          stopScannerAfterDelay();
        },
        (error) => {
          console.log("Scan error:", error);
          // Only stop after first error to avoid multiple timeouts
          if (!result) {
            setResult({ status: "error", message: "QR code not recognized." });
            stopScannerAfterDelay();
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Clear error:", err));
      }
    };
  }, [scanning]);

  const stopScannerAfterDelay = () => {
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.clear().then(() => {
          setScanning(false);
        });
      }
    }, 5000);
  };

  const handleScanAgain = () => {
    setResult(null);
    setScanning(true);
  };

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Back Button */}
      <button
        onClick={handleBack}
        aria-label="Go Back"
        className="self-start mb-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <FaArrowLeft size={24} />
      </button>

      {/* Heading */}
      <h2 className="text-3xl font-extrabold mb-8 text-zinc-900 dark:text-zinc-100 text-center">
        Scan Your Ticket
      </h2>

      {/* Scanner Area */}
      {scanning ? (
        <div
          id="scanner"
          className="w-full max-w-md aspect-square border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-md dark:shadow-none"
        />
      ) : (
        <div className="w-full max-w-md text-center">
          {/* Result Message */}
          {result && (
            <div
              className={`p-5 rounded-lg mb-8 transition-colors duration-300 ${
                result.status === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              <p className="text-xl font-semibold">
                {result.status === "success"
                  ? "✅ Ticket Scanned!"
                  : "❌ Scan Failed"}
              </p>
              <p className="mt-2 text-sm break-words">{result.message}</p>
            </div>
          )}

          {/* Scan Again Button */}
          <button
            onClick={handleScanAgain}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 font-semibold hover:opacity-90 transition duration-200"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketScanner;
