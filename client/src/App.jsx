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
import { useContext } from "react";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/events" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<UserLayouts />}>
          <Route index element={<Navigate to="/events" />} />
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
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
