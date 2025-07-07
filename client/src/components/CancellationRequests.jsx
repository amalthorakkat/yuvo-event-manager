import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

const CancellationRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCancellationRequests = async () => {
      try {
        const response = await axiosInstance.get("/bookings");
        const cancellationRequests = response.data.bookings.filter(
          (b) => b.cancellationRequested
        );
        setBookings(cancellationRequests);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch cancellation requests"
        );
      }
    };
    fetchCancellationRequests();
  }, []);

  const handleApproveCancel = async (bookingId) => {
    try {
      await axiosInstance.put(`/bookings/${bookingId}/approve-cancel`);
      alert("Cancellation approved successfully!");
      const response = await axiosInstance.get("/bookings");
      const cancellationRequests = response.data.bookings.filter(
        (b) => b.cancellationRequested
      );
      setBookings(cancellationRequests);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve cancellation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cancellation Requests</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="p-4 bg-white rounded-lg shadow-md">
            <p>Event ID: {booking.event}</p>
            <p>User ID: {booking.user}</p>
            <p>Status: {booking.status}</p>
            <button
              onClick={() => handleApproveCancel(booking._id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              Approve Cancellation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancellationRequests;
