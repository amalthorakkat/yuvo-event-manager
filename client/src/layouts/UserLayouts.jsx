import React from "react";
import Header from "../components/layoutComponents/Header";
import Footer from "../components/layoutComponents/Footer";
import { Outlet } from "react-router-dom";

const UserLayouts = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayouts;
