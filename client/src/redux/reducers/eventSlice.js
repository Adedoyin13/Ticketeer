import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getUserEvents = createAsyncThunk(
  "events/getUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/getUserEvents", {withCredentials : true});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getEventDetails = createAsyncThunk(
  "events/getEventDetails",
  async (eventId, { rejectWithValue }) => {
    console.log("🔹 Redux Action: getEventDetails called with ID:", eventId);
    try {
      const response = await axios.get(`http://localhost:4000/event/getEvent/${eventId}`, {withCredentials : true});
      console.log("✅ Event details API response:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error fetching event:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch event");
    }
  }
);

export const getUpcomingEvents = createAsyncThunk(
  "events/getUpcomingEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_URL}/event/upcoming-events`, {withCredentials : true}); // No need to send user._id
      return response.data; // Backend should already return the authenticated user's events
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getUserUpcomingEvents = createAsyncThunk(
  "events/getUserUpcomingEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/my/upcoming-events", {withCredentials : true}); // No need to send user._id
      return response.data; // Backend should already return the authenticated user's events
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getUserPastEvents = createAsyncThunk(
  "events/getUserPastEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/my/past-events", {withCredentials : true}); // No need to send user._id
      return response.data; // Backend should already return the authenticated user's events
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const getUserFavouriteEvents = createAsyncThunk(
  "events/getUserFavouriteEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/liked-events", {withCredentials : true}); // No need to send user._id
      return response.data; // Backend should already return the authenticated user's events
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post("/event/createEvent", eventData); // ✅ Send event data
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const uploadEventImage = createAsyncThunk(
  "events/uploadEventImage",
  async ({ eventId, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post(
        `/event/${eventId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data; // Returns the updated event with the new image URL
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

const initialState = {
  events: [],
  userEvents: [],
  eventDetails: null,
  upcomingEvents: [],
  userUpcomingEvents: [],
  pastEvents: [],
  favouriteEvents: [],
  loading: {
    userEvents: false,
    eventDetails: false,
    upcomingEvents: false,
    userUpcomingEvents: false,
    pastEvents: false,
    favouriteEvents: false,
    createEvent: false,
    uploadImage: false,
  },
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserEvents.pending, (state) => {
        state.loading.userEvents = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading.userEvents = false;
        state.userEvents = action.payload;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading.userEvents = false;
        state.error = action.payload;
      })

      .addCase(getEventDetails.pending, (state) => {
        state.loading.eventDetails = true;
        state.error = null;
      })
      .addCase(getEventDetails.fulfilled, (state, action) => {
        console.log("Event fetched successfully:", action.payload);
        state.loading.eventDetails = false;
        state.eventDetails = action.payload;
      })
      .addCase(getEventDetails.rejected, (state, action) => {
        state.loading.eventDetails = false;
        state.error = action.payload;
        console.log("Error fetching event:", action.payload);
      })

      .addCase(getUpcomingEvents.pending, (state) => {
        state.loading.upcomingEvents = true;
        state.error = null;
      })
      .addCase(getUpcomingEvents.fulfilled, (state, action) => {
        state.loading.upcomingEvents = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(getUpcomingEvents.rejected, (state, action) => {
        state.loading.upcomingEvents = false;
        state.error = action.payload;
      })

      .addCase(getUserUpcomingEvents.pending, (state) => {
        state.loading.userUpcomingEvents = true;
        state.error = null;
      })
      .addCase(getUserUpcomingEvents.fulfilled, (state, action) => {
        state.loading.userUpcomingEvents = false;
        state.userUpcomingEvents = action.payload;
      })
      .addCase(getUserUpcomingEvents.rejected, (state, action) => {
        state.loading.userUpcomingEvents = false;
        state.error = action.payload;
      })

      .addCase(getUserPastEvents.pending, (state) => {
        state.loading.pastEvents = true;
        state.error = null;
      })
      .addCase(getUserPastEvents.fulfilled, (state, action) => {
        state.loading.pastEvents = false;
        state.pastEvents = action.payload;
      })
      .addCase(getUserPastEvents.rejected, (state, action) => {
        state.loading.pastEvents = false;
        state.error = action.payload;
      })

      .addCase(getUserFavouriteEvents.pending, (state) => {
        state.loading.favouriteEvents = true;
        state.error = null;
      })
      .addCase(getUserFavouriteEvents.fulfilled, (state, action) => {
        state.loading.favouriteEvents = false;
        state.favouriteEvents = action.payload;
      })
      .addCase(getUserFavouriteEvents.rejected, (state, action) => {
        state.loading.favouriteEvents = false;
        state.error = action.payload;
      })

      .addCase(createEvent.pending, (state) => {
        state.loading.createEvent = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading.createEvent = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading.createEvent = false;
        state.error = action.payload;
      })

      .addCase(uploadEventImage.pending, (state) => {
        state.loading.uploadImage = true;
        state.error = null;
      })
      .addCase(uploadEventImage.fulfilled, (state, action) => {
        state.loading.uploadImage = false;
        const { eventId, imageUrl } = action.payload;

        // Find the event and update its image
        const eventIndex = state.userEvents.findIndex(
          (event) => event._id === eventId
        );
        if (eventIndex !== -1) {
          state.userEvents[eventIndex].image = imageUrl;
        }
      })
      .addCase(uploadEventImage.rejected, (state, action) => {
        state.loading.uploadImage = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
