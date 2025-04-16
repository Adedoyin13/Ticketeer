import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getUserEvents = createAsyncThunk(
  "events/getUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/getUserEvents", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      // Only reject with toast if it's not an auth issue
      if (message === "Unauthorized" || error.response?.status === 401) {
        console.warn("Skipping error toast: not authenticated yet.");
        return rejectWithValue(null); // or a custom flag
      }

      return rejectWithValue(message || "Failed to fetch events");
    }
  }
);

export const getEventDetails = createAsyncThunk(
  "events/getEventDetails",
  async (eventId, { rejectWithValue }) => {
    console.log("🔹 Redux Action: getEventDetails called with ID:", eventId);
    try {
      const response = await axios.get(
        `${SERVER_URL}/event/getEvent/${eventId}`,
        { withCredentials: true }
      );
      console.log("✅ Event details API response:", response.data);
      return response.data;
    } catch (error) {
      console.log(
        "❌ Error fetching event:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to fetch event");
    }
  }
);

export const getUpcomingEvents = createAsyncThunk(
  "events/getUpcomingEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_URL}/event/upcoming-events`, {
        withCredentials: true,
      }); // No need to send user._id
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
      const response = await api.get("/event/my/upcoming-events", {
        withCredentials: true,
      }); // No need to send user._id
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
      const response = await api.get("/event/my/past-events", {
        withCredentials: true,
      }); // No need to send user._id
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
      const response = await api.get("/event/liked-events", {
        withCredentials: true,
      }); // No need to send user._id
      return response.data; // Backend should already return the authenticated user's events
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const likeEvent = createAsyncThunk(
  "events/likeEvent",
  async (eventId, { getState, rejectWithValue }) => {
    const userId = getState().user.userId; // assuming userId is stored in the user slice
    try {
      const response = await api.put(`/event/like/${eventId}`, { userId }, {withCredentials: true});
      return response.data; // returns the updated event
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unlikeEvent = createAsyncThunk(
  "events/unlikeEvent",
  async (eventId, { getState, rejectWithValue }) => {
    const userId = getState().user.userId;
    try {
      const response = await api.put(`/event/unlike/${eventId}`, { userId }, {withCredentials: true});
      return response.data; // returns the updated event
    } catch (error) {
      return rejectWithValue(error.response.data);
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
          withCredentials: true,
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

export const getUserTickets = createAsyncThunk(
  "tickets/getUserTickets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/event/my-tickets");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "user/update-event",
  async ({ eventData, eventId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(
        `/event/update-event/${eventId}`,
        eventData,
        { withCredentials: true }
      );
      dispatch(getUserEvents());
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Update failed"
      );
    }
  }
);

export const cancelEvent = createAsyncThunk(
  "events/cancelEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/event/cancelEvent/${eventId}`, null, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel event"
      );
    }
  }
);

export const uncancelEvent = createAsyncThunk(
  "events/uncancelEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/event/uncancel/${eventId}`, null, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to uncancel event"
      );
    }
  }
);

export const getUserCancelledEvents = createAsyncThunk(
  "events/getUserCancelledEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/my/cancelled-events", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cancelled events"
      );
    }
  }
);

// attendeeSlice.js (or eventSlice.js if it's in there)
export const getAttendeesForEvent = createAsyncThunk(
  "attendees/getAttendeesForEvent",
  async (eventId, thunkAPI) => {
    try {
      const { data } = await api.get(`/event/attendees/${eventId}`);
      return data; // this should be the array of attendees
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendees"
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "user/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/event/deleteEvent/${eventId}`, {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Delete failed"
      );
    }
  }
);

const initialState = {
  events: [],
  userEvents: [],
  eventDetails: null,
  upcomingEvents: [],
  cancelledEvents: [],
  userTickets: [],
  attendees: [],
  userUpcomingEvents: [],
  likedEvents: [],
  pastEvents: [],
  favouriteEvents: [],
  loading: {
    userEvents: false,
    eventDetails: false,
    userTickets: false,
    updateEvent: false,
    upcomingEvents: false,
    userUpcomingEvents: false,
    deleteEvent: false,
    likedEvents: false,
    likeEvent: false,
    unlikeEvent: false,
    pastEvents: false,
    favouriteEvents: false,
    cancelEvent: false,
    cancelledEvents: false,
    attendees: false,
    createEvent: false,
    uploadImage: false,
  },
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // toggleLike: (state, action) => {
    //   const eventId = action.payload;
    //   if (state.likedEvents.includes(eventId)) {
    //     state.likedEvents = state.likedEvents.filter((id) => id !== eventId);
    //   } else {
    //     state.likedEvents.push(eventId);
    //   }
    //   // Persist liked events to localStorage
    //   localStorage.setItem('likedEvents', JSON.stringify(state.likedEvents));
    // },

    setLikedEvents: (state, action) => {
      state.likedEvents = action.payload;
    },
  },
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

      .addCase(getUserTickets.pending, (state) => {
        state.loading.userTickets = true;
        state.error = null;
      })
      .addCase(getUserTickets.fulfilled, (state, action) => {
        state.loading.userTickets = false;
        state.userTickets = action.payload;
      })
      .addCase(getUserTickets.rejected, (state, action) => {
        state.loading.userTickets = false;
        state.error = action.payload;
      })

      // Cancel Event
      .addCase(cancelEvent.pending, (state) => {
        state.loading.cancelEvent = true;
        state.error = null;
      })
      .addCase(cancelEvent.fulfilled, (state, action) => {
        state.loading.cancelEvent = false;

        // Optionally update userEvents or cancelledEvents directly
        const index = state.userEvents.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.userEvents[index] = action.payload;
        }

        // Push to cancelledEvents if not already there
        const alreadyExists = state.cancelledEvents.some(
          (e) => e._id === action.payload._id
        );
        if (!alreadyExists) {
          state.cancelledEvents.push(action.payload);
        }
      })
      .addCase(cancelEvent.rejected, (state, action) => {
        state.loading.cancelEvent = false;
        state.error = action.payload;
      })

      .addCase(uncancelEvent.pending, (state) => {
        state.loading.cancelEvent = true;
        state.error = null;
      })
      .addCase(uncancelEvent.fulfilled, (state, action) => {
        state.loading.cancelEvent = false;

        const updated = action.payload;

        // Update in userEvents
        const idx = state.userEvents.findIndex((e) => e._id === updated._id);
        if (idx !== -1) state.userEvents[idx] = updated;

        // Remove from cancelledEvents
        state.cancelledEvents = state.cancelledEvents.filter(
          (e) => e._id !== updated._id
        );
      })
      .addCase(uncancelEvent.rejected, (state, action) => {
        state.loading.cancelEvent = false;
        state.error = action.payload;
      })

      // Get Cancelled Events
      .addCase(getUserCancelledEvents.pending, (state) => {
        state.loading.cancelledEvents = true;
        state.error = null;
      })
      .addCase(getUserCancelledEvents.fulfilled, (state, action) => {
        state.loading.cancelledEvents = false;
        state.cancelledEvents = action.payload;
      })
      .addCase(getUserCancelledEvents.rejected, (state, action) => {
        state.loading.cancelledEvents = false;
        state.error = action.payload;
      })

      .addCase(likeEvent.pending, (state) => {
        state.loading.likeEvent = true;
      })
      .addCase(likeEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        state.loading.likeEvent = false;
        state.likedEvents.push(updatedEvent._id);
        state.upcomingEvents = state.upcomingEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        );
      })
      .addCase(likeEvent.rejected, (state, action) => {
        state.loading.likeEvent = false;
        state.error = action.payload || "Failed to like event";
      })

      // Handling unlikeEvent
      .addCase(unlikeEvent.pending, (state) => {
        state.loading.unlikeEvent = true;
      })
      .addCase(unlikeEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        state.loading.unlikeEvent = false;
        state.likedEvents = state.likedEvents.filter(
          (id) => id !== updatedEvent._id
        );
        state.upcomingEvents = state.upcomingEvents.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        );
      })
      .addCase(unlikeEvent.rejected, (state, action) => {
        state.loading.unlikeEvent = false;
        state.error = action.payload || "Failed to unlike event";
      })

      .addCase(getAttendeesForEvent.pending, (state) => {
        state.loading.attendees = true;
        state.error = null;
      })
      .addCase(getAttendeesForEvent.fulfilled, (state, action) => {
        state.loading.attendees = false;
        state.attendees = action.payload;
      })
      .addCase(getAttendeesForEvent.rejected, (state, action) => {
        state.loading.attendees = false;
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
      })

      .addCase(updateEvent.pending, (state) => {
        state.loading.updateEvent = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading.updateEvent = false;
        const updatedEvent = action.payload;
        const index = state.userEvents.findIndex(
          (e) => e._id === updatedEvent._id
        );
        if (index !== -1) {
          state.userEvents[index] = updatedEvent;
        }
        state.userEvents.push(action.payload);
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading.updateEvent = false;
        state.error = action.payload;
      })

      .addCase(deleteEvent.pending, (state, action) => {
        state.loading.deleteEvent = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading.deleteEvent = false;
        state.userEvents = state.userEvents.filter(
          (event) => event._id !== action.payload.eventId
        );
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading.deleteEvent = true;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
