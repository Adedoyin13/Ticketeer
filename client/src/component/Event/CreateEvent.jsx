import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EventDescriptionEditor from "./EventDescripionInput";
import Loader from "../Spinners/Loader";
import PreviewDescription from "../Modals/EventModal/PreviewDescription";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const initialLocation = {
  address: "",
  country: "",
  state: "",
  city: "",
  venueName: "",
};

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: initialLocation,
    meetLink: "",
    categories: "",
    limit: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  /* ---------- country / state / city dropdown helpers ---------- */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/location/countries`)
      .then((res) => setCountries(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!eventData.location.country) return;
    axios
      .get(`${SERVER_URL}/location/states/${eventData.location.country}`)
      .then((res) => setStates(res.data))
      .catch((err) => console.error(err));
  }, [eventData.location.country]);

  useEffect(() => {
    if (!eventData.location.state) return;
    axios
      .get(
        `${SERVER_URL}/location/cities/${eventData.location.country}/${eventData.location.state}`
      )
      .then((res) => setCities(res.data))
      .catch((err) => console.error(err));
  }, [eventData.location.state]);

  /* ---------- generic change handlers ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) =>
      ["address", "country", "state", "city", "venueName"].includes(name)
        ? { ...prev, location: { ...prev.location, [name]: value } }
        : { ...prev, [name]: value }
    );
  };

  const handleDescriptionChange = (val) =>
    setEventData((p) => ({ ...p, description: val }));

  /* ---------- util helpers ---------- */
  const locationIsComplete = (loc) =>
    Object.values(loc).every((v) => v.trim() !== "");

  const urlIsValid = (url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url.trim());

  const buildPayload = (data) => ({
    ...data,
    location: locationIsComplete(data.location)
      ? [
          data.location.address,
          data.location.country,
          data.location.state,
          data.location.city,
          data.location.venueName,
        ]
      : [], // empty if not provided
    meetLink: data.meetLink.trim() || "", // empty string if not provided
  });

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1️⃣ Front‑end validation ------------------------------------
    const hasLocation = locationIsComplete(eventData.location);
    const hasMeetLink =
      eventData.meetLink.trim() !== "" && urlIsValid(eventData.meetLink);

    if (!hasLocation && !hasMeetLink) {
      toast.error(
        "Please provide either a full location or a valid meet link."
      );
      return;
    }
    if (!hasLocation && eventData.meetLink.trim() !== "" && !hasMeetLink) {
      toast.error("Meet link is not a valid URL.");
      return;
    }
    if (hasLocation && !locationIsComplete(eventData.location)) {
      toast.error("Please complete all 5 location fields.");
      return;
    }
    if (!eventData.description || eventData.description === "<p><br></p>") {
      toast.error("Description is required");
      return;
    }

    const payload = buildPayload(eventData);

    setIsSubmitting(true);
    setLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/event/createEvent`, payload, {
        withCredentials: true,
      });

      toast.success("Event Created Successfully");
      navigate(`/create-ticket/${res.data.event._id}`);
    } catch (err) {
      const msg = err?.response?.data?.message || "Internal server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  /* ---------- JSX ---------- */
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Venue */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    placeholder="Venue"
                    onChange={handleInputChange}
                    value={eventData.location.venueName}
                    className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                  />
                </div>

                {/* Country / State / City */}
                {["country", "state", "city"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">
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
                      className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
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
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Street Name"
                  value={eventData.location.address}
                  onChange={handleInputChange}
                  className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3"
                />
              </div>
            </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Meeting Link <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="url"
                name="meetLink"
                value={eventData.meetLink}
                onChange={handleInputChange}
                placeholder="https://your-link.com"
                className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {showPreview && (
              <PreviewDescription
                description={eventData.description}
                onClose={() => setShowPreview(false)}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Description
              </label>
              <EventDescriptionEditor
                value={eventData.description}
                onChange={handleDescriptionChange}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="mb-2 text-sm font-medium text-orange-600 hover:underline dark:text-orange-400"
            >
              Preview Description
            </button>

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
                {loading || isSubmitting ? (
                  <>
                    Creating Event...
                    <Loader loading={loading || isSubmitting} />
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
