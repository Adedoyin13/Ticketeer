import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import Loader from "../../Spinners/Loader";

const AddTicketModal = ({ isOpen, onClose, event }) => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState({
    type: "",
    price: "",
    totalQuantity: "",
  });
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear the error when the user types
  };

  const createTicket = async () => {
    if (event?.ticketTypes.length >= 5) {
      toast.error("You can only add up to 5 ticket types per event.");
      return;
    }

    if (!ticketData.type || !ticketData.price || !ticketData.totalQuantity) {
      console.log("Missing required fields");
      toast.error("Missing required fields");
      return;
    }
    try {
      const response = await api.post(
        `/event/create-ticket/${eventId}`,
        ticketData,
        {
          withCredentials: true,
        }
      );

      console.log(response?.data);
      if (response?.data) {
        setTicket(response?.data);
        toast.success("Ticket Created Successfully");
        onClose();
        // navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Internal server error";
      setError(errorMessage); // Set error message
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createTicket();
  };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <Transition appear show={isOpen} as={Fragment} className="font-inter">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1a1a] p-6 shadow-xl transition-all">
                {/* Back Button */}
                <div className="mb-2">
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition"
                    onClick={onClose}
                  >
                    <IoArrowBackOutline
                      size={22}
                      className="text-gray-700 dark:text-zinc-200"
                    />
                  </button>
                </div>

                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Ticket Type
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      name="type"
                      required
                      value={ticketData.type}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={ticketData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="totalQuantity"
                      required
                      value={ticketData.totalQuantity}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Create Ticket
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTicketModal;
