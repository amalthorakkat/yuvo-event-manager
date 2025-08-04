import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import UserLayouts from "./layouts/UserLayouts";
import Login from "./components/Login";
import EventList from "./components/EventList";
import AdminDashboard from "./components/AdminDashboard";
import AdminEvents from "./components/AdminEvents";
import AdminEventForm from "./components/AdminEventForm";
import AdminUsers from "./components/AdminUsers";
import CancellationRequests from "./components/CancellationRequests";
import SupervisorDashboard from "./components/SupervisorDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import WageConfig from "./components/WageConfig";
import AuditoruimListing from "./components/auditoruimListing/AuditoruimListing.jsx";
import { useContext } from "react";
import AudDetails from "./components/auditoruimListing/AudDetails.jsx";
import AdminAuditoriums from "./components/auditoruimListing/AdminAuditoriums.jsx";
import AdminAuditoriumForm from "./components/auditoruimListing/AdminAuditoriumForm.jsx";
import AuditoriumList from "./components/auditoruimListing/AuditoriumList.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (
    role &&
    (Array.isArray(role) ? !role.includes(user.role) : user.role !== role)
  ) {
    return <Navigate to="/events" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<UserLayouts />}>
          <Route index element={<AuditoruimListing />} />
          <Route path="/auditoriums" element={<AuditoriumList/>} />
          <Route path="/auditoriums/details/:id" element={<AudDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="events" element={<EventList />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminEvents />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/new" element={<AdminEventForm />} />
            <Route path="events/edit/:id" element={<AdminEventForm />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="cancellations" element={<CancellationRequests />} />
            <Route path="wages" element={<WageConfig />} />
            {/* auditorium  */}
            <Route path="auditoriums" element={<AdminAuditoriums />} />
            <Route path="auditoriums/new" element={<AdminAuditoriumForm />} />
            <Route
              path="auditoriums/edit/:id"
              element={<AdminAuditoriumForm />}
            />
          </Route>
          <Route
            path="supervisor"
            element={
              <ProtectedRoute role="supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute role={["employee", "supervisor"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
