import React from "react";
import NavBar from "../Reusables/NavBar";
import Footer from "../Reusables/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div style={{ minHeight: "80vh" }}>{children}</div>
      <Footer/>
    </>
  );
};

export default Layout;