require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("./Config/db");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./Middleware/errorMiddleware");
const userRoute = require("./Route/userRoute");
const eventRoute = require("./Route/eventRoute");
const locationRoute = require("./Route/location");
const notificationRoute = require("./Route/notificationRoute");
const paymentRoute = require("./Route/paymentRoute");
const passport = require("passport");
const cron = require("node-cron");

const http = require("http");
const socketIo = require("socket.io");
const { createEventReminderNotifications } = require("./Utils/cronJobs");
const { createEventReminderMail } = require("./Utils/sendEventEmail");
const { stripeWebhookHandler } = require("./Controller/paymentController");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://js.stripe.com https://checkout.stripe.com; frame-src https://js.stripe.com https://checkout.stripe.com; connect-src 'self' https://api.stripe.com"
  );
  next();
});

// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allows your inline theme script
          "https://js.stripe.com",
          "https://checkout.stripe.com",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://js.stripe.com",
          "https://checkout.stripe.com",
        ],
        frameSrc: ["https://js.stripe.com", "https://checkout.stripe.com"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        imgSrc: ["'self'", "data:", "https://*.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'"], // For Tailwind CSS and custom styles
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

// cron.schedule('0 0 * * *', () => {
//   console.log('Sending event reminder emails...');
//   createEventReminderMail();
// });

// CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://ticketeer-event.vercel.app'],
    credentials: true,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// Routes

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use("/user", userRoute);
app.use("/event", eventRoute);
app.use("/location", locationRoute);
app.use("/notification", notificationRoute);
app.use("/payments", paymentRoute);

app.get("/", (req, res) => {
  res.render("home");
});

// Socket.io Setup
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("notification", { message: "You have a new event!" });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Error Middleware (should be last)
app.use(errorHandler);

// Start Server after DB connection
connectDb();
mongoose.connection.once("open", () => {
  console.log("Database connected");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  createEventReminderNotifications();
});
