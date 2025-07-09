import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return null; // ProtectedRoute will handle redirection
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-500 rounded"
                : "block p-2 hover:bg-blue-500 rounded"
            }
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
          >
            Wage Config
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
