import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookedEmployees, setBookedEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  // Booking form states
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventQuery: "",
    eventId: "",
    employeeEmail: "",
  });
  const [eventSuggestions, setEventSuggestions] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const eventRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await axiosInstance.get("/events");
        console.log("Fetched events:", eventsResponse.data.events);
        setEvents(eventsResponse.data.events || []);
        setEventSuggestions(eventsResponse.data.events || []);
        // Fetch users for employee suggestions
        const usersResponse = await axiosInstance.get("/users");
        console.log("Fetched users:", usersResponse.data.users);
        const employees =
          usersResponse.data.users.filter((u) => u.role === "employee") || [];
        setUserSuggestions(employees);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        console.error("Fetch data error:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (eventRef.current && !eventRef.current.contains(event.target)) {
        setShowEventDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axiosInstance.delete(`/events/${id}`);
        alert("Event deleted successfully!");
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete event");
        console.error("Delete event error:", err.response?.data || err.message);
      }
    }
  };

  const handleViewEmployees = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/bookings/event/${eventId}`);
      console.log("Booked employees:", response.data.bookings);
      setBookedEmployees(response.data.bookings || []);
      setSelectedEvent(eventId);
      setIsModalOpen(true);
    } catch (err) {
      console.error("View employees error:", err.response?.data || err.message);
      setError(
        err.response?.status === 404
          ? "Event not found. It may have been deleted or the ID is invalid."
          : err.response?.data?.message || "Failed to fetch booked employees"
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
        console.error(
          "Remove employee error:",
          err.response?.data || err.message
        );
        setError(
          err.response?.status === 404
            ? "Event not found. It may have been deleted or the ID is invalid."
            : err.response?.data?.message || "Failed to remove employee"
        );
      }
    }
  };

  const handleMarkAttendance = async (bookingId, attendance) => {
    try {
      await axiosInstance.post(`/bookings/event/${selectedEvent}/attendance`, {
        bookingId,
        attendance,
      });
      alert("Attendance marked successfully!");
      const updatedResponse = await axiosInstance.get(
        `/bookings/event/${selectedEvent}`
      );
      setBookedEmployees(updatedResponse.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
      console.error(
        "Mark attendance error:",
        err.response?.data || err.message
      );
    }
  };

  const handleAssignFine = async (bookingId, fine) => {
    try {
      await axiosInstance.post(`/bookings/event/${selectedEvent}/fines`, {
        bookingId,
        fine: parseFloat(fine),
      });
      alert("Fine assigned successfully!");
      const updatedResponse = await axiosInstance.get(
        `/bookings/event/${selectedEvent}`
      );
      setBookedEmployees(updatedResponse.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign fine");
      console.error("Assign fine error:", err.response?.data || err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
    console.log("Search query updated:", e.target.value);
  };

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
    console.log("Suggestion selected:", value);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
    if (name === "eventQuery") {
      const filteredEvents = events.filter(
        (event) =>
          event.eventName.toLowerCase().includes(value.toLowerCase()) ||
          event.auditorium.toLowerCase().includes(value.toLowerCase())
      );
      setEventSuggestions(filteredEvents);
      setShowEventDropdown(value.length > 0);
    } else if (name === "employeeEmail") {
      const filteredUsers = userSuggestions.filter(
        (user) =>
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.name.toLowerCase().includes(value.toLowerCase())
      );
      setUserSuggestions(filteredUsers);
      setShowUserDropdown(value.length > 0);
    }
    console.log("Booking form updated:", { ...bookingForm, [name]: value });
  };

  const handleEventSuggestionClick = (event) => {
    setBookingForm((prev) => ({
      ...prev,
      eventQuery: event.eventName,
      eventId: event._id,
    }));
    setShowEventDropdown(false);
    console.log("Event suggestion selected:", event._id);
  };

  const handleUserSuggestionClick = (user) => {
    setBookingForm((prev) => ({ ...prev, employeeEmail: user.email }));
    setShowUserDropdown(false);
    console.log("User suggestion selected:", user.email);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs
      const event = events.find((e) => e._id === bookingForm.eventId);
      const user = userSuggestions.find(
        (u) => u.email === bookingForm.employeeEmail
      );
      if (!event) {
        throw new Error("Please select a valid event");
      }
      if (!user || user.role !== "employee") {
        throw new Error("Please select a valid employee email");
      }
      // Create booking
      const response = await axiosInstance.post("/bookings/admin", {
        eventId: bookingForm.eventId,
        email: bookingForm.employeeEmail,
      });
      alert("Booking created successfully!");
      console.log("Booking created:", response.data.booking);
      setBookingForm({ eventQuery: "", eventId: "", employeeEmail: "" });
      setIsBookingFormOpen(false);
      // Refresh booked employees if viewing the event
      if (selectedEvent === bookingForm.eventId) {
        const updatedResponse = await axiosInstance.get(
          `/bookings/event/${selectedEvent}`
        );
        setBookedEmployees(updatedResponse.data.bookings || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create booking"
      );
      console.error("Booking error:", err.response?.data || err.message);
    }
  };

  const toggleBookingForm = () => {
    setIsBookingFormOpen((prev) => !prev);
    console.log("Booking form toggled:", !isBookingFormOpen);
  };

  const filteredEvents = events.filter((event) =>
    searchQuery
      ? event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.auditorium.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const uniqueEvents = [
    ...new Map(
      events.map((event) => [
        event._id,
        { eventName: event.eventName, auditorium: event.auditorium },
      ])
    ).values(),
  ].filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.auditorium.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setBookedEmployees([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Events</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-4 mb-6">
        <Link
          to="/admin/events/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Event
        </Link>
        <button
          onClick={toggleBookingForm}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isBookingFormOpen ? "Close Booking Form" : "Book Event"}
        </button>
      </div>
      {/* Book Event for Employee Form */}
      {isBookingFormOpen && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Book Event for Employee
          </h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-4 relative" ref={eventRef}>
              <label className="block text-gray-700 mb-1">
                Event Name or Auditorium
              </label>
              <input
                type="text"
                name="eventQuery"
                value={bookingForm.eventQuery}
                onChange={handleBookingChange}
                placeholder="Search by event name or auditorium"
                className="w-full p-2 border rounded"
                required
                onFocus={() =>
                  setShowEventDropdown(bookingForm.eventQuery.length > 0)
                }
              />
              {showEventDropdown && eventSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
                  {eventSuggestions.map((event) => (
                    <li
                      key={event._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEventSuggestionClick(event)}
                    >
                      {event.eventName} ({event.auditorium})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-4 relative" ref={userRef}>
              <label className="block text-gray-700 mb-1">Employee Email</label>
              <input
                type="email"
                name="employeeEmail"
                value={bookingForm.employeeEmail}
                onChange={handleBookingChange}
                placeholder="Enter employee email"
                className="w-full p-2 border rounded"
                required
                onFocus={() =>
                  setShowUserDropdown(bookingForm.employeeEmail.length > 0)
                }
              />
              {showUserDropdown && userSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
                  {userSuggestions.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUserSuggestionClick(user)}
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Book Event
            </button>
          </form>
        </div>
      )}
      <div className="mb-4 relative" ref={searchRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search events by name or auditorium"
          className="p-2 border rounded w-full"
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
        />
        {showSuggestions && uniqueEvents.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
            {uniqueEvents.map((event, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  handleSuggestionClick(event.eventName || event.auditorium)
                }
              >
                {event.eventName} ({event.auditorium})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid gap-4">
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
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
                  Manage Employees
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Employee Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Manage Employees</h3>
            {bookedEmployees.length === 0 ? (
              <p>No employees booked for this event.</p>
            ) : (
              <div className="grid gap-4">
                {bookedEmployees.map((booking) => (
                  <div key={booking._id} className="p-4 bg-gray-100 rounded-lg">
                    <p>Name: {booking.user.name}</p>
                    <p>Email: {booking.user.email}</p>
                    <p>Status: {booking.status}</p>
                    <p>Attendance: {booking.attendance}</p>
                    <p>Fine: ₹{booking.fine.toFixed(2)}</p>
                    {booking.cancellationRequested && (
                      <p className="text-red-600">Cancellation Requested</p>
                    )}
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() =>
                          handleMarkAttendance(booking._id, "attended")
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={booking.attendance === "attended"}
                      >
                        Mark Attended
                      </button>
                      <button
                        onClick={() =>
                          handleMarkAttendance(booking._id, "absent")
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        disabled={booking.attendance === "absent"}
                      >
                        Mark Absent
                      </button>
                      <button
                        onClick={() => handleRemoveEmployee(booking._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="Enter fine amount"
                        onChange={(e) => {
                          const fine = e.target.value;
                          if (fine >= 0) {
                            handleAssignFine(booking._id, fine);
                          }
                        }}
                        className="border p-2 rounded mr-2"
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleAssignFine(booking._id, 0)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Clear Fine
                      </button>
                    </div>
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
