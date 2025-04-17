import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { updateEvent } from "../../../redux/reducers/eventSlice";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER_URL = import.meta.env.SERVER_URL;

const EditEventModal = ({ onClose, eventId }) => {
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
  console.log(eventData);

  // Dropdown states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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

      console.log("Updating:", name, value);
      console.log("New Event Data:", newData);

      return newData;
    });
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value;
    setEventData((prev) => ({
      ...prev,
      eventType: value,
      location:
        value === "physical"
          ? prev.location
          : { address: "", country: "", city: "", venueName: "", state: "" },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateEvent({ eventData, eventId }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        navigate("/settings");
      })
      .catch((err) => {
        toast.error(err || "Update failed");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-zinc-900/60 flex justify-end items-start z-50 font-inter">
      <div className="flex flex-col w-[95%] sm:w-[90%] max-w-[500px] mt-6 mr-3 sm:mr-6 rounded-2xl shadow-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-gray-300 dark:border-zinc-700 max-h-[90vh] overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex gap-3 px-5 py-4 items-start border-b border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 sticky top-0 bg-white/90 dark:bg-zinc-800/90 z-10">
          <button
            className="hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer p-2 rounded-lg transition"
            onClick={onClose}
          >
            <IoArrowBackOutline size={22} />
          </button>
          <div className="flex flex-col text-left">
            <h2 className="font-semibold text-xl">Update Event</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Keep your event details fresh and relevant.
            </p>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-hide">
          <form className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block font-medium text-sm mb-1 dark:text-zinc-100"
              >
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Tech Conference"
                className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                onChange={handleInputChange}
                value={eventData.title}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categories"
                className="block font-medium text-sm mb-1 dark:text-zinc-100"
              >
                Category
              </label>
              <select
                id="categories"
                name="categories"
                onChange={handleInputChange}
                value={eventData.categories}
                className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
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

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Start Date", type: "date", name: "startDate" },
                { label: "Start Time", type: "time", name: "startTime" },
                { label: "End Date", type: "date", name: "endDate" },
                { label: "End Time", type: "time", name: "endTime" },
              ].map(({ label, type, name }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block font-medium text-sm mb-1 dark:text-zinc-100"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    onChange={handleInputChange}
                    value={eventData[name]}
                    className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Event Type */}
            <div>
              <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                Event Type
              </label>
              <select
                name="eventType"
                value={eventData.eventType}
                onChange={handleEventTypeChange}
                className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="virtual">Virtual</option>
                <option value="physical">Physical</option>
              </select>
            </div>

            {/* Conditional Inputs */}
            {eventData.eventType === "virtual" && (
              <div>
                <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meetLink"
                  value={eventData.meetLink}
                  onChange={handleInputChange}
                  placeholder="https://yourlink.com"
                  className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>
            )}

            {eventData.eventType === "physical" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Venue",
                      name: "venueName",
                      value: eventData.location.venueName,
                    },
                    {
                      label: "Address",
                      name: "address",
                      value: eventData.location.address,
                    },
                  ].map(({ label, name, value }) => (
                    <div key={name}>
                      <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                      Country
                    </label>
                    <select
                      name="country"
                      value={eventData.location.country}
                      onChange={handleInputChange}
                      className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                      State
                    </label>
                    <select
                      name="state"
                      value={eventData.location.state}
                      onChange={handleInputChange}
                      disabled={!eventData.location.country}
                      className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition disabled:opacity-50"
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                      City
                    </label>
                    <select
                      name="city"
                      value={eventData.location.city}
                      onChange={handleInputChange}
                      disabled={!eventData.location.state}
                      className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition disabled:opacity-50"
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Write a few lines about the event..."
                className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* Guest Limit */}
            <div>
              <label className="block font-medium text-sm mb-1 dark:text-zinc-100">
                Guest Limit
              </label>
              <input
                type="number"
                name="limit"
                value={eventData.limit}
                onChange={handleInputChange}
                placeholder="e.g. 50"
                className="bg-gray-100 dark:bg-zinc-700 dark:text-zinc-100 p-3 rounded-lg border border-gray-300 dark:border-zinc-600 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 w-full bg-white/90 dark:bg-zinc-800/90 border-t border-gray-300 dark:border-zinc-700 py-3 px-5">
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
          >
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
