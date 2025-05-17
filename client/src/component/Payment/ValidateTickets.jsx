import api from "../../utils/api";

export const validateTickets = async ({ eventId, selectedTickets }) => {
  const res = await api.post(
    `/payments/validate`,
    {
      eventId,
      selectedTickets,
    },
    {
     withCredentials: true
    }
  );

  console.log('Response: ', res)

  return res.data;
};
