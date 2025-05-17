import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const TicketCheckIn = () => {
  const { ticketId } = useParams();
  const [status, setStatus] = useState('Checking ticket...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkInTicket = async () => {
      try {
        const res = await api.post('/event/checkin', {ticketId});

        const data = await res.data

        console.log(res)
        console.log(data)

        setStatus(data.ticket.status);
      } catch (err) {
        setError(err.message);
        setStatus(null);
      }
    };

    if (ticketId) checkInTicket();
  }, [ticketId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {status && <p className="text-green-600 text-lg font-semibold">{status}</p>}
      {error && <p className="text-red-600 text-lg font-semibold">{error}</p>}
    </div>
  );
};

export default TicketCheckIn;