import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const AdminAuditoriums = () => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch all auditoriums
    const fetchAuditoriums = async () => {
      try {
        const response = await axiosInstance.get("/auditoriums");
        setAuditoriums(response.data.auditoriums || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch auditoriums");
      }
    };
    fetchAuditoriums();
  }, []);

  // Handle auditorium deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this auditorium?")) {
      try {
        await axiosInstance.delete(`/auditoriums/${id}`);
        setAuditoriums(auditoriums.filter((aud) => aud._id !== id));
        alert("Auditorium deleted successfully!");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete auditorium");
      }
    }
  };

  // Filter auditoriums based on search query
  const filteredAuditoriums = auditoriums.filter(
    (aud) =>
      aud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <h2 className="text-2xl font-bold mb-4">Manage Auditoriums</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Create New Auditorium Button */}
      <div className="mb-6">
        <Link
          to="/admin/auditoriums/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Auditorium
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search auditoriums by name or city"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Auditorium List */}
      <div className="grid gap-4">
        {filteredAuditoriums.length === 0 ? (
          <p>No auditoriums found.</p>
        ) : (
          filteredAuditoriums.map((aud) => (
            <div key={aud._id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{aud.name}</h3>
              <p>City: {aud.location.city}</p>
              <p>Capacity: {aud.capacity} guests</p>
              <p>Price: ₹{aud.pricePerDay}/day</p>
              <div className="flex space-x-2 mt-2">
                <Link
                  to={`/admin/auditoriums/edit/${aud._id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(aud._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAuditoriums;
