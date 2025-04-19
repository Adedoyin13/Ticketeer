import React, { useEffect, useState } from "react";
import eventImage from "./../../assets/event-image.png";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: {
      address: "",
      country: "",
      city: "",
      venueName: "",
      state: "",
    },
    eventType: "",
    meetLink: "",
    categories: "",
    limit: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Image upload states
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/location/countries`)
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (!eventData.location.country) return;
    axios
      .get(`${SERVER_URL}/location/states/${eventData.location.country}`)
      .then((response) => setStates(response.data))
      .catch((error) => console.error("Error fetching states:", error));
  }, [eventData.location.country]);

  useEffect(() => {
    if (!eventData.location.state) return;
    axios
      .get(
        `${SERVER_URL}/location/cities/${eventData.location.country}/${eventData.location.state}`
      )
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, [eventData.location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEventData((prev) => {
      const newData = [
        "address",
        "country",
        "city",
        "venueName",
        "state",
      ].includes(name)
        ? { ...prev, location: { ...prev.location, [name]: value } }
        : { ...prev, [name]: value };

      console.log("Updating:", name, value); // Debugging: See what field is updating
      console.log("New Event Data:", newData); // Debugging: Check updated state

      return newData;
    });
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value; // "virtual" or "physical"
    setEventData((prev) => ({
      ...prev,
      eventType: value,
      location:
        value === "physical"
          ? prev.location // Retain existing location if event is physical
          : { address: "", country: "", city: "", venueName: "", state: "" }, // Reset location if event is virtual
    }));
  };

  const onImageSelect = (file) => {
    console.log("Selected image file:", file);
    // you can store it in state or send to backend
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPreviewImage(URL.createObjectURL(file));

      // Call the parent function to pass the selected file
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const handleEditClick = () => {
    document.getElementById("eventImageInput").click();
  };

  const cleanEventData = (data) => {
    return {
      ...data,
      location:
        data.eventType === "physical"
          ? [
              data.location.address,
              data.location.country,
              data.location.state,
              data.location.city,
              data.location.venueName,
            ] // Convert object to array
          : [], // Empty array for virtual events
      meetLink: data.eventType === "virtual" ? data.meetLink : undefined, // Remove meetLink for physical events
    };
  };

  // const handleSubit = async (e) => {
  //   e.preventDefault();

  //   const finalData = cleanEventData(eventData);
  //   console.log("Submitting cleaned data:", finalData); // Debugging

  //   try {
  //     const response = await fetch("/api/events", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(finalData),
  //     });

  //     const data = await response.json();
  //     console.log("Response:", data);

  //     if (!response.ok) {
  //       throw new Error(data.message || "Something went wrong");
  //     }

  //     alert("Event created successfully!");
  //   } catch (error) {
  //     console.error("Error submitting form:", error.message);
  //   }
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalData = cleanEventData(eventData); // Ensure location is an array
    console.log("Submitting cleaned data:", finalData);

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${SERVER_URL}/event/createEvent`,
        finalData, // Use finalData instead of eventData
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log("Response:", data);

      if (response.status !== 201) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Event Created Successfully");
      navigate(`/create-ticket/${data.event._id}`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Internal server error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-orange-50 dark:bg-zinc-900 py-20 px-4 sm:px-8 md:px-12 md:py-24 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-zinc-950 shadow-lg rounded-3xl border border-orange-200 dark:border-zinc-700 overflow-hidden">
          <form className="p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              Create a New Event
            </h2>

            {/* Title and Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full bg-orange-50 dark:bg-zinc-800 border dark:text-zinc-300 border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Conference"
                  onChange={handleInputChange}
                  value={eventData.title}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  name="categories"
                  onChange={handleInputChange}
                  value={eventData.categories}
                  className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="" disabled>
                    Choose category
                  </option>
                  <option value="business and networking">
                    Business and Networking
                  </option>
                  <option value="music and concert">Music and Concert</option>
                  <option value="sport and fitness">Sport and Fitness</option>
                  <option value="arts and culture">Arts and Culture</option>
                  <option value="festival and fairs">Festival and Fairs</option>
                  <option value="fun and hangout">Fun and Hangout</option>
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Date & Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Start
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    name="startDate"
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                    onChange={handleInputChange}
                    value={eventData.startDate}
                    required
                  />
                  <input
                    type="time"
                    name="startTime"
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                    onChange={handleInputChange}
                    value={eventData.startTime}
                    required
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  End
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    name="endDate"
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                    onChange={handleInputChange}
                    value={eventData.endDate}
                    required
                  />
                  <input
                    type="time"
                    name="endTime"
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                    onChange={handleInputChange}
                    value={eventData.endTime}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                value={eventData.eventType}
                onChange={handleEventTypeChange}
                className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              >
                <option value="" disabled>
                  Select event type
                </option>
                <option value="virtual">Virtual</option>
                <option value="physical">Physical</option>
              </select>
            </div>

            {/* Conditional Fields (Virtual/Physical) */}
            {eventData.eventType === "virtual" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meetLink"
                  value={eventData.meetLink}
                  onChange={handleInputChange}
                  placeholder="https://your-link.com"
                  className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
            )}

            {eventData.eventType === "physical" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venueName"
                      placeholder="venue"
                      className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                      onChange={handleInputChange}
                      value={eventData.location.venueName}
                    />
                  </div>

                  {/* Country, State, City */}
                  {["country", "state", "city"].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <select
                        name={field}
                        value={eventData.location[field]}
                        onChange={handleInputChange}
                        disabled={
                          (field === "state" && !eventData.location.country) ||
                          (field === "city" && !eventData.location.state)
                        }
                        className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="">Select {field}</option>
                        {(field === "country"
                          ? countries
                          : field === "state"
                          ? states
                          : cities
                        ).map((item) => (
                          <option
                            key={item.isoCode || item.name}
                            value={item.isoCode || item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={eventData.location.address}
                    onChange={handleInputChange}
                    placeholder="123 Street Name"
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>
            )}

            {/* Description & Guest Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="What is this event about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Guest Limit
              </label>
              <input
                type="number"
                name="limit"
                value={eventData.limit}
                onChange={handleInputChange}
                className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. 50"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
