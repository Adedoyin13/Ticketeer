import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
