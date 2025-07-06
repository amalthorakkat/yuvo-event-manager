import { useState, useEffect, useContext } from "react";
import axiosInstance from "../config/axiosInstance";
import { AuthContext } from "../context/AuthContext.jsx";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events");
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      }
    };
    fetchEvents();
  }, [token]);

  const handleBook = async (eventId) => {
    try {
      await axiosInstance.post("/bookings", { eventId });
      alert("Event booked successfully!");
      const response = await axiosInstance.get("/events");
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book event");
    }
  };

  const handleRequestCancel = async (bookingId) => {
    try {
      await axiosInstance.post("/bookings/cancel", { bookingId });
      alert("Cancellation requested successfully!");
      const response = await axiosInstance.get("/events");
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request cancellation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Events</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p>Auditorium: {event.auditorium}</p>
            <p>Type: {event.eventType}</p>
            <p>Date: {new Date(event.dateTime).toLocaleString()}</p>
            <p>Location: {event.location.address}</p>
            {user && user.role === "employee" && (
              <div className="mt-4">
                {event.isBooked ? (
                  <button
                    onClick={() => handleRequestCancel(event.bookingId)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Request Cancellation
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(event._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Book Event
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
