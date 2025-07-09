import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("Menu toggled:", !isMenuOpen);
  };

  if (!user || user.role !== "admin") {
    return null; // ProtectedRoute will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar/Top Navigation */}
      <aside className="bg-gray-800 text-white lg:w-64 lg:p-4">
        {/* Hamburger Menu for Mobile/Tablet */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:block space-y-2 p-4 lg:p-0`}
        >
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-500 rounded"
                : "block p-2 hover:bg-blue-500 rounded"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Manage Events
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-500 rounded"
                : "block p-2 hover:bg-blue-500 rounded"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/cancellations"
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-500 rounded"
                : "block p-2 hover:bg-blue-500 rounded"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Cancellation Requests
          </NavLink>
          <NavLink
            to="/admin/wages"
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-500 rounded"
                : "block p-2 hover:bg-blue-500 rounded"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Wage Config
          </NavLink>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main> 
    </div>
  );
};

export default AdminDashboard;