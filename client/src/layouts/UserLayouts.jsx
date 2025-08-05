import React from "react";
import Header from "../components/layoutComponents/Header";
import Footer from "../components/layoutComponents/Footer";
import { Outlet, useLocation } from "react-router-dom";
import AudHeader from "../components/layoutComponents/AudHeader";
import AudFooter from "../components/layoutComponents/AudFooter";

const UserLayouts = () => {
  const location = useLocation();

  // Detect if route is related to auditorium (customize prefix as needed)
  const isAuditoriumRoute =
    location.pathname.startsWith("/auditoriums") || location.pathname === "/";

  return (
    <div className="flex  flex-col min-h-screen">
      {isAuditoriumRoute ? <AudHeader /> : <Header />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {isAuditoriumRoute ? <AudFooter /> : <Footer />}
    </div>
  );
};

export default UserLayouts;
