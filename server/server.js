require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("./Config/db");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const userRoute = require("./Route/userRoute");
const eventRoute = require("./Route/eventRoute");
const locationRoute = require("./Route/location");
const notificationRoute = require("./Route/notificationRoute");
const passport = require("passport");
const cron = require('node-cron');

const http = require('http');
const socketIo = require('socket.io');
const { createEventReminderNotifications } = require("./Utils/cronJobs");
const { createEventReminderMail } = require("./Utils/sendEventEmail");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cron.schedule('0 0 * * *', () => {
//   console.log('Sending event reminder emails...');
//   createEventReminderMail();
// });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Routes
app.use("/user", userRoute);
app.use("/event", eventRoute);
app.use("/location", locationRoute);
app.use("/notification", notificationRoute);

app.get("/", (req, res) => {
  res.render("home");
});

// Socket.io Setup
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('notification', { message: 'You have a new event!' });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Error Middleware (should be last)
app.use(errorHandler);

// Start Server after DB connection
connectDb();
mongoose.connection.once("open", () => {
  console.log("Database connected");
  // Use only one listener (server.listen)
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  createEventReminderNotifications();
});