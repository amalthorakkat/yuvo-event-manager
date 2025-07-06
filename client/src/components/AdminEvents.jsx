import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/events/edit/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
      <button
        onClick={() => navigate('/admin/events/new')}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Event
      </button>
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
              onClick={() => handleEdit(event._id)}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;