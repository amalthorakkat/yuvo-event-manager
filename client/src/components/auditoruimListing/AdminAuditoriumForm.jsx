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
    existingImages: [],
    newImages: [],
    newImageAlts: [],
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
            name: auditorium.name || "",
            description: auditorium.description || "",
            location: {
              address: auditorium.location?.address || "",
              city: auditorium.location?.city || "",
              district: auditorium.location?.district || "",
              coordinates: {
                lat:
                  auditorium.location?.coordinates?.lat != null
                    ? String(auditorium.location.coordinates.lat)
                    : "",
                lng:
                  auditorium.location?.coordinates?.lng != null
                    ? String(auditorium.location.coordinates.lng)
                    : "",
              },
              mapUrl: auditorium.location?.mapUrl || "",
            },
            capacity: auditorium.capacity || "",
            pricePerDay:
              auditorium.pricePerDay != null
                ? String(auditorium.pricePerDay)
                : "",
            facilities: {
              ac: auditorium.facilities?.ac || false,
              stageAvailable: auditorium.facilities?.stageAvailable || false,
              projector: auditorium.facilities?.projector || false,
              soundSystem: auditorium.facilities?.soundSystem || false,
              wifi: auditorium.facilities?.wifi || false,
              parking: auditorium.facilities?.parking || false,
            },
            contact: {
              phone: auditorium.contact?.phone || "",
              email: auditorium.contact?.email || "",
            },
            rules: {
              smokingAllowed: auditorium.rules?.smokingAllowed || false,
              alcoholAllowed: auditorium.rules?.alcoholAllowed || false,
            },
            existingImages: auditorium.images || [],
            newImages: [],
            newImageAlts: [],
          });
          setIsEdit(true);
          console.log("Fetched auditorium:", {
            ...auditorium,
            coordinates: auditorium.location?.coordinates,
            pricePerDay: auditorium.pricePerDay,
          });
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch auditorium");
          console.error("Fetch error:", err);
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

  // Handle new image file changes
  const handleNewImageChange = (e, index) => {
    const files = e.target.files;
    const newImages = [...formData.newImages];
    newImages[index] = files[0];
    setFormData({ ...formData, newImages });
    console.log("New images updated:", newImages);
  };

  // Handle alt text changes for existing images
  const handleExistingImageAltChange = (index, value) => {
    const existingImages = [...formData.existingImages];
    existingImages[index] = { ...existingImages[index], alt: value };
    setFormData({ ...formData, existingImages });
    console.log("Existing images alt updated:", existingImages);
  };

  // Handle alt text changes for new images
  const handleNewImageAltChange = (index, value) => {
    const newImageAlts = [...formData.newImageAlts];
    newImageAlts[index] = value;
    setFormData({ ...formData, newImageAlts });
    console.log("New image alts updated:", newImageAlts);
  };

  // Add new image input
  const addNewImage = () => {
    setFormData({
      ...formData,
      newImages: [...formData.newImages, null],
      newImageAlts: [...formData.newImageAlts, ""],
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter((_, i) => i !== index),
    });
    console.log("Removed existing image at index:", index);
  };

  // Remove new image input
  const removeNewImage = (index) => {
    setFormData({
      ...formData,
      newImages: formData.newImages.filter((_, i) => i !== index),
      newImageAlts: formData.newImageAlts.filter((_, i) => i !== index),
    });
    console.log("Removed new image at index:", index);
  };

  // Parse comma-formatted number (e.g., "1,234.56" or "1234,56" to 1234.56)
  const parseNumber = (value) => {
    if (value == null || value === "") return undefined;
    const cleanedValue = String(value).replace(/,/g, "");
    const number = Number(cleanedValue);
    return isNaN(number) ? undefined : number;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Log input values for debugging
    console.log("Input values:", {
      lat: formData.location.coordinates.lat,
      lng: formData.location.coordinates.lng,
      pricePerDay: formData.pricePerDay,
    });
    // Parse numeric fields
    const lat = parseNumber(formData.location.coordinates.lat);
    const lng = parseNumber(formData.location.coordinates.lng);
    const pricePerDay = parseNumber(formData.pricePerDay);
    // Validate coordinates if provided
    if (
      (lat !== undefined && (lat < -90 || lat > 90)) ||
      (lng !== undefined && (lng < -180 || lng > 180))
    ) {
      setError(
        "Latitude must be between -90 and 90, Longitude between -180 and 180."
      );
      return;
    }
    if (pricePerDay !== undefined && pricePerDay < 0) {
      setError("Price per day cannot be negative.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location[address]", formData.location.address);
      formDataToSend.append("location[city]", formData.location.city);
      formDataToSend.append("location[district]", formData.location.district);
      if (lat !== undefined) {
        formDataToSend.append("location[coordinates][lat]", lat);
      }
      if (lng !== undefined) {
        formDataToSend.append("location[coordinates][lng]", lng);
      }
      formDataToSend.append("location[mapUrl]", formData.location.mapUrl);
      formDataToSend.append("capacity", formData.capacity);
      if (pricePerDay !== undefined) {
        formDataToSend.append("pricePerDay", pricePerDay);
      }
      Object.keys(formData.facilities).forEach((key) => {
        formDataToSend.append(`facilities[${key}]`, formData.facilities[key]);
      });
      formDataToSend.append("contact[phone]", formData.contact.phone);
      formDataToSend.append("contact[email]", formData.contact.email);
      formDataToSend.append(
        "rules[smokingAllowed]",
        formData.rules.smokingAllowed
      );
      formDataToSend.append(
        "rules[alcoholAllowed]",
        formData.rules.alcoholAllowed
      );
      if (formData.existingImages.length > 0) {
        formDataToSend.append(
          "images",
          JSON.stringify(formData.existingImages)
        );
      }
      formData.newImages.forEach((file, index) => {
        if (file) {
          formDataToSend.append("images", file);
          formDataToSend.append(
            `imageAlts[${index}]`,
            formData.newImageAlts[index] || ""
          );
        }
      });

      console.log("Form data to send:", Object.fromEntries(formDataToSend));
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
      console.error("Submission error:", err);
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
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Auditorium" : "Create Auditorium"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
        </div>

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
          <label className="block text-gray-700">Latitude (optional)</label>
          <input
            type="text"
            name="location.coordinates.lat"
            value={formData.location.coordinates.lat}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            placeholder="e.g., 9.9312 or 9,9312"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitude (optional)</label>
          <input
            type="text"
            name="location.coordinates.lng"
            value={formData.location.coordinates.lng}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            placeholder="e.g., 76.2673 or 76,2673"
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

        <div className="mb-4">
          <label className="block text-gray-700">Capacity</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            placeholder="e.g., 500 or Large"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price per Day (₹)</label>
          <input
            type="text"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            placeholder="e.g., 80000 or 80,000"
          />
        </div>

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

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Images</h3>
          {formData.existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold">Existing Images</h4>
              {formData.existingImages.map((image, index) => (
                <div key={index} className="flex items-center mb-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-20 h-20 object-cover mr-2"
                  />
                  <input
                    type="text"
                    placeholder="Alt Text (optional)"
                    value={image.alt || ""}
                    onChange={(e) =>
                      handleExistingImageAltChange(index, e.target.value)
                    }
                    className="w-full p-3 border rounded-md mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {formData.newImages.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleNewImageChange(e, index)}
                className="w-full p-3 border rounded-md mr-2"
              />
              <input
                type="text"
                placeholder="Alt Text (optional)"
                value={formData.newImageAlts[index] || ""}
                onChange={(e) => handleNewImageAltChange(index, e.target.value)}
                className="w-full p-3 border rounded-md mr-2"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addNewImage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Image
          </button>
        </div>

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
