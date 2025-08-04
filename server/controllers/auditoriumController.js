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

exports.getAllAuditoriums = async (req, res) => {
  try {
    const { city, capacity, facilities, minPrice, maxPrice } = req.query;
    let query = {};
    if (city) query["location.city"] = new RegExp(`^${city}$`, "i"); // Exact case-insensitive match
    if (capacity) query.capacity = { $gte: Number(capacity) };
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
    console.log("MongoDB Query:", query); // Debug log
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
      images: imageUrls.length > 0 ? imageUrls : req.body.images || [],
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
      images: imageUrls.length > 0 ? imageUrls : req.body.images || [],
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
