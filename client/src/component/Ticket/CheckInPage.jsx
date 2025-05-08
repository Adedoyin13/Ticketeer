import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CheckInPage = () => {
  const { ticketId } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL 

  useEffect(() => {
    const checkIn = async () => {
      try {
        const { data } = await axios.put(`${SERVER_URL}/event/check-in/${ticketId}`);
        console.log({data})
        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "An error occurred during check-in"
        );
      }
    };

    if (ticketId) checkIn();
  }, [ticketId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-zinc-900 px-4 font-inter">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Ticket Check-In
        </h1>

        {status === "loading" && <p className="text-slate-500">Checking ticket...</p>}

        {status === "success" && (
          <p className="text-green-600 dark:text-green-400 font-semibold">
            ✅ {message}
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 dark:text-red-400 font-semibold">
            ❌ {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;