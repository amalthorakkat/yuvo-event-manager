import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../config/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const SupervisorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookedEmployees, setBookedEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        console.log('Fetched events:', response.data.events);
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      }
    };
    fetchEvents();
  }, []);

  const handleViewEmployees = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/bookings/event/${eventId}`);
      console.log('Booked employees:', response.data.bookings);
      setBookedEmployees(response.data.bookings || []);
      setSelectedEvent(eventId);
      setIsModalOpen(true);
    } catch (err) {
      console.error('View employees error:', err.response?.data || err.message);
      setError(
        err.response?.status === 404
          ? 'Event not found. It may have been deleted or the ID is invalid.'
          : err.response?.data?.message || 'Failed to fetch booked employees'
      );
    }
  };

  const handleMarkAttendance = async (bookingId, attendance) => {
    try {
      const response = await axiosInstance.post(`/bookings/event/${selectedEvent}/attendance`, {
        bookingId,
        attendance,
      });
      alert('Attendance marked successfully!');
      const updatedResponse = await axiosInstance.get(`/bookings/event/${selectedEvent}`);
      setBookedEmployees(updatedResponse.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleAssignFine = async (bookingId, fine) => {
    try {
      const response = await axiosInstance.post(`/bookings/event/${selectedEvent}/fines`, {
        bookingId,
        fine: parseFloat(fine),
      });
      alert('Fine assigned successfully!');
      const updatedResponse = await axiosInstance.get(`/bookings/event/${selectedEvent}`);
      setBookedEmployees(updatedResponse.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign fine');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setBookedEmployees([]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Supervisor Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p>Auditorium: {event.auditorium}</p>
            <p>Type: {event.eventType}</p>
            <p>Date: {new Date(event.dateTime).toLocaleString()}</p>
            <p>Location: {event.location.address}</p>
            <button
              onClick={() => handleViewEmployees(event._id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              Manage Attendance & Fines
            </button>
          </div>
        ))}
      </div>

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
                      <p className="text-red-500">Cancellation Requested</p>
                    )}
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleMarkAttendance(booking._id, 'attended')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={booking.attendance === 'attended'}
                      >
                        Mark Attended
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(booking._id, 'absent')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        disabled={booking.attendance === 'absent'}
                      >
                        Mark Absent
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

export default SupervisorDashboard;