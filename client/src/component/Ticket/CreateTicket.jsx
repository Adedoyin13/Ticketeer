import React, { useEffect, useState } from "react";
import eventImage from "./../../assets/event-image.png";
import { IoIosAdd, IoIosArrowForward } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CreateTicket = () => {
  const { eventId } = useParams();
  console.log("Event ID from params:", eventId);
  const [ticketData, setTicketData] = useState({
    type: "",
    price: "",
    quantity: "",
  });
  const [ticket, setTicket] = useState([]);
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/event/getEvent/${eventId}`
        );
        if (!response.ok) {
          toast.error("Failed to fetch event data");
          throw new Error("Failed to fetch event data");
        }
        setEvent(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear the error when the user types
  };

  const createTicket = async () => {
    if (!ticketData.type || !ticketData.price || !ticketData.quantity) {
      console.log("Missing required fields");
      toast.error("Missing required fields");
      return; // Prevent further execution
    }
    try {
      const response = await axios.post(
        `${SERVER_URL}/event/create-ticket/${eventId}`,
        ticketData,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      if (response?.data) {
        setTicket(response.data);
        toast.success("Event Created Successfully");
        navigate("/dashboard");
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

  return (
    <section className="bg-orange-100 py-28 font-inter px-10">
      <div className="flex justify-between px-10 gap-8">
        <div className="flex flex-col gap-6 w-1/3 px-8 items-center">
          <div className="flex  flex-col gap-4 px-4 py-6 w-full bg-orange-300 shadow-md bg-opacity-50 rounded-xl">
            <div className="flex justify-between items-start">
              <div className="w-auto h-[75px]">
                <img
                  src={eventImage}
                  alt="User image"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <button className="hover:bg-orange-100 cursor-pointer p-2 rounded-lg">
                <MdOutlineModeEdit size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700 text-base">Conference</p>
              <p className="font-normal text-gray-500 text-xs">
                Sun Mar 10, 2024 10:00 - Mon Mar 11 , 2024 12:00
              </p>
              <p className="font-medium text-gray-700 text-base">
                Fun and cool
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-6 py-4 w-full bg-orange-300 shadow-md bg-opacity-50 rounded-xl">
            <p className="font-medium text-sm text-gray-700">Host</p>
            <p className="font-medium">User</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-8 items-center">
          <div className="bg-orange-300 shadow-md flex flex-col gap-6 bg-opacity-50 rounded-lg w-full p-10 text-gray-700">
            <div className="flex flex-col gap-2 ">
              <p className="font-semibold text-3xl">Tickets and payments</p>
              <p className="font-medium text-base">
                Set up your event tickets with debit/credit card & crypto
                payment options
              </p>
            </div>
            <form className="w-full flex flex-col gap-6 font-inter ">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="type" className="font-medium pl-1">
                  Ticket type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  placeholder="General admission"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={ticketData.type}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="price" className="font-medium pl-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="eg: 20"
                    className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    required
                    onChange={handleInputChange}
                    value={ticketData.price}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="quantity" className="font-medium pl-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="eg: 50"
                    className="bg-orange-50 p-2 rounded-lg border-b-2 w-full border-orange-400 focus:outline-none focus:border-orange-300"
                    required
                    onChange={handleInputChange}
                    value={ticketData.quantity}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="description" className="font-medium pl-1">
                  Description (optional)
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="description"
                  className="bg-orange-50 p-2 rounded-lg border-b-2 w-full min-h-[100px] max-h-[150px] border-orange-400 focus:outline-none focus:border-orange-300"
                  required
                  onChange={handleInputChange}
                  value={ticketData.description}
                />
              </div>

              <div className="py-2 px-8 bg-slate-500 flex gap-1 items-center text-white hover:bg-slate-600 rounded-md text-sm max-w-[250px]">
                <IoIosAdd size={30} />
                <button>Add another ticket</button>
              </div>
            </form>
          </div>
          <div className="flex justify-between w-full px-10 items-center">
            <div className="flex gap-2 items-center justify-center">
              <p>Create</p>
              <IoIosArrowForward />
              <p>Buy tickets</p>
              {/* <IoIosArrowForward />
              <p className="text-gray-500">Publish</p> */}
            </div>
            <button
              onClick={handleSubmit}
              className="py-3 px-8 bg-slate-500 text-white text-center hover:bg-slate-600 rounded-md text-sm max-w-[200px]"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateTicket;