import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    auditorium: '',
    eventType: '',
    dateTime: '',
    location: { address: '', coordinates: { lat: '', lng: '' } },
  });
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchEvent = async () => {
        try {
          const response = await axiosInstance.get(`/events/${id}`);
          const { event } = response.data;
          setFormData({
            eventName: event.eventName,
            auditorium: event.auditorium,
            eventType: event.eventType,
            dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
            location: {
              address: event.location.address,
              coordinates: {
                lat: event.location.coordinates.lat,
                lng: event.location.coordinates.lng,
              },
            },
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch event');
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const [_, field] = name.split('.');
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value },
      });
    } else if (name.includes('coordinates.')) {
      const [__, field] = name.split('.');
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: { ...formData.location.coordinates, [field]: value },
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosInstance.put(`/events/${id}`, formData);
        alert('Event updated successfully!');
      } else {
        await axiosInstance.post('/events', formData);
        alert('Event created successfully!');
      }
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosInstance.delete(`/events/${id}`);
        alert('Event deleted successfully!');
        navigate('/admin/events');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{isEdit ? 'Edit Event' : 'Create Event'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Auditorium</label>
          <input
            type="text"
            name="auditorium"
            value={formData.auditorium}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Type</label>
          <input
            type="text"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Latitude</label>
          <input
            type="number"
            name="coordinates.lat"
            value={formData.location.coordinates.lat}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitude</label>
          <input
            type="number"
            name="coordinates.lng"
            value={formData.location.coordinates.lng}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {isEdit ? 'Update Event' : 'Create Event'}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;