import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookedEmployees, setBookedEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axiosInstance.delete(`/events/${id}`);
        alert("Event deleted successfully!");
        const response = await axiosInstance.get("/events");
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleViewEmployees = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/bookings/event/${eventId}`);
      console.log("Booked employees:", response.data.bookings); // Debug log
      setBookedEmployees(response.data.bookings || []);
      setSelectedEvent(eventId);
      setIsModalOpen(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch booked employees"
      );
    }
  };

  const handleRemoveEmployee = async (bookingId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this employee from the event?"
      )
    ) {
      try {
        await axiosInstance.delete(`/bookings/${bookingId}`);
        alert("Employee removed successfully!");
        const response = await axiosInstance.get(
          `/bookings/event/${selectedEvent}`
        );
        setBookedEmployees(response.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to remove employee");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setBookedEmployees([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Link
        to="/admin/events/new"
        className="mb-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Event
      </Link>
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p>Auditorium: {event.auditorium}</p>
            <p>Type: {event.eventType}</p>
            <p>Date: {new Date(event.dateTime).toLocaleString()}</p>
            <p>Location: {event.location.address}</p>
            <div className="flex space-x-2 mt-2">
              <Link
                to={`/admin/events/edit/${event._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewEmployees(event._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                View Booked Employees
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Booked Employees</h3>
            {bookedEmployees.length === 0 ? (
              <p>No employees booked for this event.</p>
            ) : (
              <div className="grid gap-4">
                {bookedEmployees.map((booking) => (
                  <div key={booking._id} className="p-4 bg-gray-100 rounded-lg">
                    <p>Name: {booking.user.name}</p>
                    <p>Email: {booking.user.email}</p>
                    <p>Status: {booking.status}</p>
                    {booking.cancellationRequested && (
                      <p className="text-red-500">Cancellation Requested</p>
                    )}
                    <button
                      onClick={() => handleRemoveEmployee(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
