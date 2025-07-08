import { useState, useEffect, useContext } from "react";
import axiosInstance from "../config/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [totalWages, setTotalWages] = useState(0);
  const [error, setError] = useState("");
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchWorkHistory = async () => {
      if (!user?._id) {
        setError("User not authenticated. Please log in.");
        return;
      }
      try {
        const response = await axiosInstance.get(
          `/bookings/user/${user._id}/work-history`
        );
        console.log("Work history response:", response.data);
        setWorkHistory(response.data.user.workHistory || []);
        setTotalWages(response.data.user.totalWages || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch work history");
        console.error(
          "Fetch work history error:",
          err.response?.data || err.message
        );
      }
    };
    if (user && user._id) {
      fetchWorkHistory();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user || !user._id) return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Work History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <p className="text-lg mb-4">
        Total Wages (after fines): ₹{totalWages.toFixed(2)}
      </p>
      <div className="grid gap-4">
        {workHistory.length === 0 ? (
          <p>No work history available.</p>
        ) : (
          workHistory.map((entry, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <p>
                <strong>Event:</strong> {entry.eventName}
              </p>
              <p>
                <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
              </p>
              <p>
                <strong>Attendance:</strong> {entry.attendance}
              </p>
              <p>
                <strong>Wage:</strong> ₹{entry.wage.toFixed(2)}
              </p>
              <p>
                <strong>Fine:</strong> ₹{entry.fine.toFixed(2)}
              </p>
              <p>
                <strong>Net Wage:</strong> ₹
                {(entry.wage - entry.fine).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
