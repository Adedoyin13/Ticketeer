import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getUserEvents = createAsyncThunk(
  "events/getUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/event/getUserEvents", {
        withCredentials: true,
      });
      console.log(response.data);
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
      const response = await api.get(`/event/getEvent/${eventId}`, {
        withCredentials: true,
      });
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
      const response = await api.get(`/event/upcoming-events`, {
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
      console.log(response.data);
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
      console.log(response.data);
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

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notification/get-notifications", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

export const getTicket = createAsyncThunk(
  "events/getTicket",
  async (ticketId, { rejectWithValue }) => {
    console.log("🔹 Redux Action: get ticket called with ID:", ticketId);
    try {
      const response = await api.get(`/event/getTicket/${ticketId}`, {
        withCredentials: true,
      });
      console.log({ data: response.data });
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

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/event/updateEvent/${eventId}`,
        updatedData
      );
      return response.data; // ✅ This should be the updated event
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicketType = createAsyncThunk(
  "events/updateTicketType",
  async ({ ticketId, updatedTicketData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/event/updateTicketType/${ticketId}`,
        updatedTicketData,
        // eventId,
        { withCredentials: true }
      );
      console.log(response.data);
      return response.data; // ✅ This should be the updated event
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  "event/deleteEvent",
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

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notifications/delete-notification/${notificationId}`, {
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

export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notifications/delete-all-notifications`, {
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

export const purchaseTicketThunk = createAsyncThunk(
  "ticket/purchase",
  async ({ ticketTypeId, eventId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post("/ticket/purchase", {
        ticketTypeId,
        eventId,
        quantity,
      });

      const session = response.data?.session;

      if (session?.url) {
        window.location.href = session.url; // 🔁 Redirect to Stripe in same tab
      } else {
        throw new Error("Stripe session URL not found.");
      }
    } catch (err) {
      console.error("Purchase Ticket Error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "events/toggleLike",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/event/like/${eventId}`);
      console.log(response.data);
      return response.data.event; // return the updated event
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  events: [],
  userEvents: [],
  eventDetails: {},
  ticket: {},
  notifications: [],
  upcomingEvents: [],
  cancelledEvents: [],
  userTickets: [],
  currentEvent: null,
  attendees: [],
  userUpcomingEvents: [],
  pastEvents: [],
  favouriteEvents: [],
  loading: {
    userEvents: false,
    eventDetails: false,
    userTickets: false,
    updateEvent: false,
    notifications: false,
    updateTicketType: false,
    deleteNotification: false,
    deleteNotifications: false,
    ticket: false,
    upcomingEvents: false,
    userUpcomingEvents: false,
    deleteEvent: false,
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
    setCurrentEvent(state, action) {
      state.currentEvent = action.payload;
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

      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        console.log("Action payload", action.payload);
        const index = state.upcomingEvents.findIndex(
          (e) => e._id === updatedEvent._id
        );
        if (index !== -1) {
          state.upcomingEvents[index] = updatedEvent;
        }
        console.log("Index", index);
        // Optionally also update currentEvent if it's the same one
        if (state.currentEvent && state.currentEvent._id === updatedEvent._id) {
          state.currentEvent = updatedEvent;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
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

      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
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

      .addCase(getTicket.pending, (state) => {
        state.loading.ticket = true;
        state.error = null;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        console.log("Event fetched successfully:", action.payload);
        state.loading.ticket = false;
        state.ticket = action.payload;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.loading.ticket = false;
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
        const updatedEvent = action.payload;

        const eventIndex = state.userEvents.findIndex(
          (event) => event._id === updatedEvent._id
        );

        if (eventIndex !== -1) {
          state.userEvents[eventIndex] = updatedEvent;
        }

        // If you're using selectedEvent elsewhere, update that too
        if (state.eventDetails && state.eventDetails._id === updatedEvent._id) {
          state.eventDetails = updatedEvent;
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

        const index = state.events.findIndex(
          (event) => event._id === updatedEvent._id
        );
        if (index !== -1) {
          state.events[index] = updatedEvent;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading.updateEvent = false;
        state.error = action.payload;
      })

      .addCase(updateTicketType.pending, (state) => {
        state.loading.updateTicketType = true;
        state.error = null;
      })
      .addCase(updateTicketType.fulfilled, (state, action) => {
        state.loading.updateTicketType = false;

        const updatedTicket = action.payload;

        const index = state.events.findIndex(
          (ticket) => ticket._id === updatedTicket._id
        );
        if (index !== -1) {
          state.events[index] = updatedTicket;
        }
      })
      .addCase(updateTicketType.rejected, (state, action) => {
        state.loading.updateTicketType = false;
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
      })

      .addCase(deleteNotification.pending, (state, action) => {
        state.loading.deleteNotification = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading.deleteNotification = false;
        state.notifications = state.notifications.filter(
          (event) => event._id !== action.payload.eventId
        );
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading.deleteEvent = true;
        state.error = action.payload;
      })

      .addCase(deleteAllNotifications.pending, (state, action) => {
        state.loading.deleteNotifications = true;
        state.error = null;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.loading.deleteNotifications = false;
        state.notifications = [];
        state.error = null;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.loading.deleteNotifications = true;
        state.error = action.payload;
      })
  },
});

export const { setCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
