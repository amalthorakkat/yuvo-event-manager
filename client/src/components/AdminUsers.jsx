import { useState, useEffect, useRef } from "react";
import axiosInstance from "../config/axiosInstance";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "employee",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data.users || []);
        console.log("Users fetched:", response.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        console.error("Fetch users error:", err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await axiosInstance.put(`/users/${editUserId}`, formData);
        alert("User updated successfully!");
      } else {
        await axiosInstance.post("/auth/register", formData);
        alert("User registered successfully!");
      }
      setFormData({ email: "", password: "", name: "", role: "employee" });
      setEditUserId(null);
      const response = await axiosInstance.get("/users");
      setUsers(response.data.users || []);
      console.log("Users updated:", response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
      console.error("Save user error:", err.response?.data || err.message);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
    });
    console.log("Editing user:", user);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        alert("User deleted successfully!");
        const response = await axiosInstance.get("/users");
        setUsers(response.data.users || []);
        console.log("User deleted, updated users:", response.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
        console.error("Delete user error:", err.response?.data || err.message);
      }
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

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    searchQuery
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Get unique users for suggestions
  const uniqueUsers = [
    ...new Map(
      users.map((user) => [
        user._id,
        {
          name: user.name,
          email: user.email,
        },
      ])
    ).values(),
  ].filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editUserId ? "Edit User" : "Register New User"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Password {editUserId && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={!editUserId}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="employee">Employee</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editUserId ? "Update User" : "Register User"}
          </button>
        </form>
      </div>
      <h3 className="text-xl font-semibold mb-4">User List</h3>
      <div className="mb-4 relative" ref={searchRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search users by name or email"
          className="p-2 border rounded w-full"
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
        />
        {showSuggestions && uniqueUsers.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-60 overflow-y-auto">
            {uniqueUsers.map((user, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(user.name || user.email)}
              >
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="p-4 bg-white rounded-lg shadow-md">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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

export default AdminUsers;
