const Auditorium = require("../models/auditoriumModel");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "yuvo_auditoriums" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Parse comma-formatted number (e.g., "1,234.56" or "1234,56" to 1234.56)
const parseNumber = (value) => {
  if (!value || value.trim() === "") return undefined;
  const cleanedValue = value.replace(/,/g, "");
  const number = Number(cleanedValue);
  return isNaN(number) ? undefined : number;
};

exports.getAllAuditoriums = async (req, res) => {
  try {
    const { city, capacity, facilities, minPrice, maxPrice } = req.query;
    let query = {};
    if (city) query["location.city"] = new RegExp(`^${city}$`, "i");
    if (capacity) query.capacity = capacity; // Now a string
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice && !isNaN(Number(minPrice)))
        query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice)))
        query.pricePerDay.$lte = Number(maxPrice);
    }
    if (facilities) {
      const facilityList = facilities.split(",");
      facilityList.forEach((facility) => {
        if (
          [
            "ac",
            "stageAvailable",
            "projector",
            "soundSystem",
            "wifi",
            "parking",
          ].includes(facility)
        ) {
          query[`facilities.${facility}`] = true;
        }
      });
    }
    console.log("MongoDB Query:", query);
    const auditoriums = await Auditorium.find(query);
    res.status(200).json({ auditoriums });
  } catch (error) {
    console.error("Error in getAllAuditoriums:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAuditoriumById = async (req, res) => {
  try {
    const auditorium = await Auditorium.findById(req.params.id);
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }
    res.status(200).json({ auditorium });
  } catch (error) {
    console.error("Error in getAuditoriumById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createAuditorium = async (req, res) => {
  try {
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push({
          src: url,
          alt: req.body.imageAlts
            ? req.body.imageAlts[imageUrls.length] || ""
            : "",
        });
      }
    }

    const auditoriumData = {
      ...req.body,
      location: {
        ...req.body.location,
        coordinates: {
          lat: req.body.location?.coordinates?.lat
            ? parseNumber(req.body.location.coordinates.lat)
            : undefined,
          lng: req.body.location?.coordinates?.lng
            ? parseNumber(req.body.location.coordinates.lng)
            : undefined,
        },
      },
      capacity: req.body.capacity || undefined,
      pricePerDay: req.body.pricePerDay
        ? parseNumber(req.body.pricePerDay)
        : undefined,
      images:
        imageUrls.length > 0
          ? imageUrls
          : req.body.images
          ? JSON.parse(req.body.images)
          : [],
    };

    const auditorium = new Auditorium(auditoriumData);
    await auditorium.save();
    res.status(201).json({ auditorium });
  } catch (error) {
    console.error("Error in createAuditorium:", error);
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

exports.updateAuditorium = async (req, res) => {
  try {
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push({
          src: url,
          alt: req.body.imageAlts
            ? req.body.imageAlts[imageUrls.length] || ""
            : "",
        });
      }
    }

    const auditoriumData = {
      ...req.body,
      location: {
        ...req.body.location,
        coordinates: {
          lat: req.body.location?.coordinates?.lat
            ? parseNumber(req.body.location.coordinates.lat)
            : undefined,
          lng: req.body.location?.coordinates?.lng
            ? parseNumber(req.body.location.coordinates.lng)
            : undefined,
        },
      },
      capacity: req.body.capacity || undefined,
      pricePerDay: req.body.pricePerDay
        ? parseNumber(req.body.pricePerDay)
        : undefined,
      images:
        imageUrls.length > 0
          ? imageUrls
          : req.body.images
          ? JSON.parse(req.body.images)
          : [],
    };

    const auditorium = await Auditorium.findByIdAndUpdate(
      req.params.id,
      auditoriumData,
      { new: true, runValidators: true }
    );
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }
    res.status(200).json({ auditorium });
  } catch (error) {
    console.error("Error in updateAuditorium:", error);
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

exports.deleteAuditorium = async (req, res) => {
  try {
    const auditorium = await Auditorium.findByIdAndDelete(req.params.id);
    if (!auditorium) {
      return res.status(404).json({ message: "Auditorium not found" });
    }
    res.status(200).json({ message: "Auditorium deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAuditorium:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
