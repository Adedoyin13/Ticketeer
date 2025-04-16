import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Layout from "./component/Layouts/Layout";
import Home from "./component/Pages/Home";
import About from "./component/Pages/About";
import Blog from "./component/Pages/Blog";
import Events from "./component/Event/Events";
import Organizer from "./component/Pages/Organizer";
import Login from "./component/User/Authentication/Login";
import Register from "./component/User/Authentication/Register";
import Reviews from "./component/User/Reviews/Reviews";
import FAQ from "./component/Pages/FAQ";
import UserLayout from "./component/Layouts/UserLayout";
import Dashboard from "./component/Event/Dashboard";
import CreateEvent from "./component/Event/CreateEvent";
import CreateTicket from "./component/Ticket/CreateTicket";
import Settings from "./component/User/Setting/Settings";
import ProfileUpdate from "./component/User/Setting/ProfileUpdate";
import EventListLayout from "./component/Event/EventListLayout";
import UserProfile from "./component/User/UserProfile";
import ProtectedRoute from "./component/ProtectedRoute";
import EventDetails from "./component/Event/EventDetails";
import AuthSuccess from "./component/User/Authentication/AuthSuccess";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { setupInterceptors } from "./utils/api";
import { getUser } from "./redux/reducers/userSlice";
import { getUserEvents } from "./redux/reducers/eventSlice";
import NotFound from "./component/Pages/NotFound";
import Ticket from "./component/Ticket/Ticket";
import MyEvents from "./component/Event/MyEvents";
import ScrollToTop from "./component/Layouts/ScrollToTop";
import EventView from "./component/Event/EventView";
import MyTickets from "./component/Ticket/MyTickets";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  const {user, isAuthenticated} = useSelector((state) => state.user);

  useEffect(() => {
    // setupInterceptors(dispatch);

    // Avoid calling getUser on login/register pages
    const isAuthPage = ["/logiin", "/register"].includes(location.pathname);
    if (!isAuthPage) {
      dispatch(getUser());
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getUserEvents());
    }
  }, [isAuthenticated, user, dispatch]);

  // useEffect(() => {
  //   setupInterceptors(dispatch);
  //   dispatch(getUser())
  // }, [dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // }, [user, navigate]);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(getUser());
  //   }
  // }, [dispatch]);


  // useEffect(() => {
  //   if (user) {
  //     dispatch(getUserEvents());
  //   }
  // }, [dispatch]);

  const RenderRoutes = () => (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/create" element={<Layout><Organizer /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
  
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
          path="/userProfile"
          element={
            <ProtectedRoute>
              <UserLayout>
                <UserProfile />
              </UserLayout>
            </ProtectedRoute>
          }
        />
  
        <Route path="/page-not-found" element={<NotFound />} />
  
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </>
  );

  return <>{RenderRoutes()}</>;
}

export default App;