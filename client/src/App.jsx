import { Routes, Route } from "react-router-dom";
import NavBar from "./component/Layout/NavBar";
import Footer from "./component/Layout/Footer";
import Login from "./component/Register/Login";
import Register from "./component/Register/Register";
import Contact from "./component/Pages/Contact";
import About from "./component/Pages/About";
import Home from "./component/Pages/Home";
import Blog from "./component/Pages/Blog";
import FAQ from "./component/Pages/FAQ";
import TandC from "./component/Pages/TandC";
import PrivacyPolicy from "./component/Pages/PrivacyPolicy";
import Events from "./component/Pages/Events";
import Layout from "./component/Layout/Layout";
import NavModal from "./component/Modal/NavModal";
import Reviews from "./component/Pages/Reviews";
import CreateEvent from "./component/Pages/CreateEvent";

function App() {
  const RenderRoute = () => (
    <Routes>
      <Route path='/' element={
          <Layout>
            <Home/>
          </Layout>
        }/>
      <Route path="/nav-bar" element={<NavBar />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/nav-modal" element={<NavModal />} />
      <Route path='/faq' element={
          <Layout>
            <FAQ/>
          </Layout>
        }/>
      <Route path='/about' element={
          <Layout>
            <About/>
          </Layout>
        }/>
      <Route path='/blog' element={
          <Layout>
            <Blog/>
          </Layout>
        }/>
      <Route path='/contact' element={
          <Layout>
            <Contact/>
          </Layout>
        }/>
      <Route path='/events' element={
          <Layout>
            <Events/>
          </Layout>
        }/>
      <Route path='/sell' element={
          <Layout>
            <CreateEvent/>
          </Layout>
        }/>
      <Route path='/privacy-policy' element={
          <Layout>
            <PrivacyPolicy/>
          </Layout>
        }/>
      <Route path='/terms-and-conditions' element={
          <Layout>
            <TandC/>
          </Layout>
        }/>
      <Route path='/reviews' element={
          <Layout>
            <Reviews/>
          </Layout>
        }/>
    </Routes>
  );
  return <> {RenderRoute()}</>;
}

export default App;
