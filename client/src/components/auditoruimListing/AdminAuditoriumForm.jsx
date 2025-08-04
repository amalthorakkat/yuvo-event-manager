import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const AdminAuditoriumForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(!!id);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      address: "",
      city: "",
      district: "",
      coordinates: { lat: "", lng: "" },
      mapUrl: "",
    },
    capacity: "",
    pricePerDay: "",
    facilities: {
      ac: false,
      stageAvailable: false,
      projector: false,
      soundSystem: false,
      wifi: false,
      parking: false,
    },
    contact: {
      phone: "",
      email: "",
    },
    rules: {
      smokingAllowed: false,
      alcoholAllowed: false,
    },
    images: [], // Array of files for upload
    imageAlts: [], // Array for alt texts
  });

  // Fetch auditorium data for editing
  useEffect(() => {
    if (id) {
      const fetchAuditorium = async () => {
        try {
          const response = await axiosInstance.get(`/auditoriums/${id}`);
          const auditorium = response.data.auditorium;
          setFormData({
            ...auditorium,
            images: auditorium.images || [], // Keep existing images
            imageAlts: auditorium.images.map((img) => img.alt) || [], // Extract alt texts
          });
          setIsEdit(true);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch auditorium");
        }
      };
      fetchAuditorium();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child, subChild] = name.split(".");
      if (subChild) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [subChild]: type === "checkbox" ? checked : value,
            },
          },
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle file input changes
  const handleImageChange = (e, index) => {
    const files = e.target.files;
    const newImages = [...formData.images];
    newImages[index] = files[0]; // Store file object
    setFormData({ ...formData, images: newImages });
  };

  // Handle alt text changes
  const handleAltChange = (index, value) => {
    const newImageAlts = [...formData.imageAlts];
    newImageAlts[index] = value;
    setFormData({ ...formData, imageAlts: newImageAlts });
  };

  // Add new image input
  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, null], // Add placeholder for new file
      imageAlts: [...formData.imageAlts, ""], // Add empty alt text
    });
  };

  // Remove image input
  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
      imageAlts: formData.imageAlts.filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location[address]", formData.location.address);
      formDataToSend.append("location[city]", formData.location.city);
      formDataToSend.append("location[district]", formData.location.district);
      formDataToSend.append("location[coordinates][lat]", formData.location.coordinates.lat);
      formDataToSend.append("location[coordinates][lng]", formData.location.coordinates.lng);
      formDataToSend.append("location[mapUrl]", formData.location.mapUrl);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("pricePerDay", formData.pricePerDay);
      Object.keys(formData.facilities).forEach((key) => {
        formDataToSend.append(`facilities[${key}]`, formData.facilities[key]);
      });
      formDataToSend.append("contact[phone]", formData.contact.phone);
      formDataToSend.append("contact[email]", formData.contact.email);
      formDataToSend.append("rules[smokingAllowed]", formData.rules.smokingAllowed);
      formDataToSend.append("rules[alcoholAllowed]", formData.rules.alcoholAllowed);
      // Append images and alt texts
      formData.images.forEach((file, index) => {
        if (file) {
          formDataToSend.append("images", file);
          formDataToSend.append(`imageAlts[${index}]`, formData.imageAlts[index] || "");
        }
      });

      if (isEdit) {
        await axiosInstance.put(`/auditoriums/${id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Auditorium updated successfully!");
      } else {
        await axiosInstance.post("/auditoriums", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Auditorium created successfully!");
      }
      navigate("/admin/auditoriums");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save auditorium");
    }
  };

  // Handle auditorium deletion
  const handleDelete = async () => {
    if (!isEdit) return;
    if (window.confirm("Are you sure you want to delete this auditorium?")) {
      try {
        await axiosInstance.delete(`/auditoriums/${id}`);
        alert("Auditorium deleted successfully!");
        navigate("/admin/auditoriums");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete auditorium");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Form Header */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Auditorium" : "Create Auditorium"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* General Info */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Location</h3>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">District</label>
          <input
            type="text"
            name="location.district"
            value={formData.location.district}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Latitude</label>
          <input
            type="number"
            name="location.coordinates.lat"
            value={formData.location.coordinates.lat}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitude</label>
          <input
            type="number"
            name="location.coordinates.lng"
            value={formData.location.coordinates.lng}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Google Maps Embed URL</label>
          <input
            type="text"
            name="location.mapUrl"
            value={formData.location.mapUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            placeholder="Paste Google Maps embed URL"
          />
        </div>

        {/* Capacity & Price */}
        <div className="mb-4">
          <label className="block text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price per Day (₹)</label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Facilities</h3>
          {[
            { key: "ac", label: "Air Conditioning" },
            { key: "stageAvailable", label: "Stage Available" },
            { key: "projector", label: "Projector" },
            { key: "soundSystem", label: "Sound System" },
            { key: "wifi", label: "WiFi" },
            { key: "parking", label: "Parking" },
          ].map((facility) => (
            <label key={facility.key} className="flex items-center mb-2">
              <input
                type="checkbox"
                name={`facilities.${facility.key}`}
                checked={formData.facilities[facility.key]}
                onChange={handleChange}
                className="mr-2"
              />
              {facility.label}
            </label>
          ))}
        </div>

        {/* Contact */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <label className="block text-gray-700 mt-2">Email</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Rules */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Rules</h3>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="rules.smokingAllowed"
              checked={formData.rules.smokingAllowed}
              onChange={handleChange}
              className="mr-2"
            />
            Smoking Allowed
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rules.alcoholAllowed"
              checked={formData.rules.alcoholAllowed}
              onChange={handleChange}
              className="mr-2"
            />
            Alcohol Allowed
          </label>
        </div>

        {/* Images */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Images</h3>
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp" // Added image/webp
                onChange={(e) => handleImageChange(e, index)}
                className="w-full p-3 border rounded-md mr-2"
              />
              <input
                type="text"
                placeholder="Alt Text"
                value={formData.imageAlts[index] || ""}
                onChange={(e) => handleAltChange(index, e.target.value)}
                className="w-full p-3 border rounded-md mr-2"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          {isEdit && formData.images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold">Existing Images</h4>
              {formData.images.map((image, index) => (
                image.src && (
                  <div key={index} className="flex items-center mb-2">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-20 h-20 object-cover mr-2"
                    />
                    <span>{image.alt}</span>
                  </div>
                )
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addImage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Image
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            {isEdit ? "Update Auditorium" : "Create Auditorium"}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white p-3 rounded hover:bg-red-600"
            >
              Delete Auditorium
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminAuditoriumForm;