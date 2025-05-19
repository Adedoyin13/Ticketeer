import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./redux/reducers/userSlice";
import { fetchNotifications, getUserEvents, getUserTickets } from "./redux/reducers/eventSlice";

// Layouts
import Layout from "./component/Layouts/Layout";
import UserLayout from "./component/Layouts/UserLayout";
import ScrollToTop from "./component/Layouts/ScrollToTop";

// Pages
import Home from "./component/Pages/Home";
import About from "./component/Pages/About";
import Blog from "./component/Pages/Blog";
import Events from "./component/Event/Events";
import Organizer from "./component/Pages/Organizer";
import FAQ from "./component/Pages/FAQ";
import NotFound from "./component/Pages/NotFound";
import Reviews from "./component/User/Reviews/Reviews";

// Auth
import Login from "./component/User/Authentication/Login";
import Register from "./component/User/Authentication/Register";
import ProtectedRoute from "./component/ProtectedRoute";

// User Pages
import Dashboard from "./component/Event/Dashboard";
import CreateEvent from "./component/Event/CreateEvent";
import MyEvents from "./component/Event/MyEvents";
import EventView from "./component/Event/EventView";
import EventDetails from "./component/Event/EventDetails";
import EventListLayout from "./component/Event/EventListLayout";
import CreateTicket from "./component/Ticket/CreateTicket";
import MyTickets from "./component/Ticket/MyTickets";
import Ticket from "./component/Modals/TicketModal/Ticket";
import PurchaseTicketModal from "./component/Modals/TicketModal/PurchaseTicketModal";
import Settings from "./component/User/Setting/Settings";
import ProfileUpdate from "./component/User/Setting/ProfileUpdate";
import UserProfile from "./component/User/UserProfile";

// Spinners
import Loader from "./component/Spinners/Loader";
import RouteChangeLoader from "./component/Spinners/RouteChangeLoader";
import PaymentSuccess from "./component/Modals/TicketModal/PaymentSuccess";
import PaymentCancel from "./component/Modals/TicketModal/PaymentCancel";
import ConnectWallet from "./component/Wallet/ConnectWallet";
import UsingHooks from "./component/Payment/UsingHooks";
import EventDescriptionInput from "./component/Event/EventDescripionInput";
import PaystackCheckout from "./component/Payment/PaystackCheckout";
import TicketPage from "./component/Ticket/TicketPage";
import CheckInPage from "./component/Ticket/CheckInPage";
import ProfilePage from "./component/User/Profile/ProfilePage";
import PreviewDescription from "./component/Modals/EventModal/PreviewDescription";
import TicketScanner from "./component/Ticket/TicketScanner";
import TicketCheckIn from "./component/Ticket/TicketCheckIn";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, themeMode } = useSelector((state) => state.user);
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  // Sync theme on mount and when themeMode changes
  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", themeMode === "dark");
  // }, [themeMode]);
  useEffect(() => {
    const currentTheme = themeMode === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, [themeMode]);

  // Fetch user on app load
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getUserTickets());
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!isAuthPage && !user) {
      dispatch(getUser());
    }
  }, [dispatch, location.pathname, user]);

  useEffect(() => {
    if (user) {
      dispatch(getUserEvents());
    }
  }, [user, dispatch]);

  return (
    <>
      <RouteChangeLoader />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/create"
          element={
            <Layout>
              <Organizer />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/reviews"
          element={
            <Layout>
              <Reviews />
            </Layout>
          }
        />
        <Route
          path="/check-in/:ticketId"
          element={
            <Layout>
              <CheckInPage />
            </Layout>
          }
        />
        <Route path="/hooks" element={<UsingHooks />} />
        {/* <Route path="/component" element={<UsingComponent />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/paystack-checkout" element={<PaystackCheckout />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Dashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <UserLayout>
                <PreviewDescription />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-ticket"
          element={
            <ProtectedRoute>
              <UserLayout>
                <TicketScanner />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-page/:ticketId"
          element={
            <ProtectedRoute>
              <UserLayout>
                <TicketPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/description"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EventDescriptionInput />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserLayout>
                <ProfilePage />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <UserLayout>
                <PaymentSuccess />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkin/:ticketId"
          element={
            <ProtectedRoute>
              <UserLayout>
                <TicketCheckIn />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-failed"
          element={
            <ProtectedRoute>
              <UserLayout>
                <PaymentCancel />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Ticket />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase-ticket"
          element={
            <ProtectedRoute>
              <UserLayout>
                <PurchaseTicketModal />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <UserLayout>
                <CreateEvent />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <UserLayout>
                <MyEvents />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <UserLayout>
                <MyTickets />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loader"
          element={
            <UserLayout>
              <Loader />
            </UserLayout>
          }
        />
        <Route
          path="/view-event/:eventId"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EventView />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-ticket/:eventId"
          element={
            <ProtectedRoute>
              <UserLayout>
                <CreateTicket />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-details/:eventId"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EventDetails />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-list"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EventListLayout />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Settings />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile-update"
          element={
            <ProtectedRoute>
              <UserLayout>
                <ProfileUpdate />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute>
              <UserLayout>
                <UserProfile />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Not Found & Fallback */}
        <Route path="/page-not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </>
  );
}

export default App;
