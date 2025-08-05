import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Phone,
  Mail,
  Users,
  IndianRupee,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import { useParams } from "react-router-dom";
import ImageModal from "../modal/ImageModal"; // Import the ImageModal component

const AudDetails = () => {
  const { id } = useParams();
  const [auditorium, setAuditorium] = useState(null);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(null);

  // State variables for the ImageModal component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  useEffect(() => {
    const fetchAuditorium = async () => {
      try {
        const response = await axiosInstance.get(`/auditoriums/${id}`);
        const fetchedAuditorium = response.data.auditorium;
        setAuditorium(fetchedAuditorium);
        // Pass the full image objects to the modal
        setModalImages(fetchedAuditorium.images);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch auditorium");
      }
    };
    fetchAuditorium();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? auditorium.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === auditorium.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) goToNext();
    else if (diff < -50) goToPrev();
  };

  // Function to open the ImageModal
  const openImageModal = (index) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!auditorium)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 mt-20 ">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {auditorium.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">Premium Venue</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-2xl font-bold text-gray-900 mb-1">
                <IndianRupee className="w-6 h-6" />
                <span>{auditorium.pricePerDay}</span>
              </div>
              <p className="text-sm text-gray-500">per day</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {isMobile ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-80 overflow-hidden"
            >
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {auditorium.images.map((img, index) => (
                  <img
                    key={index}
                    className="w-full h-full object-cover flex-shrink-0 cursor-pointer"
                    src={img.src}
                    alt={img.alt}
                    onClick={() => openImageModal(index)}
                  />
                ))}
              </div>
              <div
                onClick={goToPrev}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </div>
              <div
                onClick={goToNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {auditorium.images.length}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Grid Layout */}
              <div className="grid md:grid-cols-2 md:grid-rows-2 gap-2 h-[500px] p-2">
                <div className="md:col-span-1 md:row-span-2">
                  <img
                    src={auditorium.images[0]?.src}
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition-all duration-300"
                    alt={auditorium.images[0]?.alt}
                    onClick={() => openImageModal(0)}
                  />
                </div>
                <div className="md:col-span-1 md:row-span-1">
                  <img
                    src={auditorium.images[1]?.src}
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition-all duration-300"
                    alt={auditorium.images[1]?.alt}
                    onClick={() => openImageModal(1)}
                  />
                </div>
                <div className="md:col-span-1 md:row-span-1 relative">
                  <img
                    src={auditorium.images[2]?.src}
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition-all duration-300"
                    alt={auditorium.images[2]?.alt}
                    onClick={() => openImageModal(2)}
                  />
                  {auditorium.images.length > 3 && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition-all duration-300"
                      onClick={() => openImageModal(3)}
                    >
                      <span className="text-white text-xl font-semibold">
                        +{auditorium.images.length - 3} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Description
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {auditorium.description}
              </p>
            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Facilities
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(auditorium.facilities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <div
                      key={key}
                      className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Rules
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg border border-gray-200">
                  {auditorium.rules.smokingAllowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  )}
                  <span className="text-gray-700">
                    Smoking:{" "}
                    {auditorium.rules.smokingAllowed
                      ? "Allowed"
                      : "Not Allowed"}
                  </span>
                </div>
                <div className="flex items-center p-3 rounded-lg border border-gray-200">
                  {auditorium.rules.alcoholAllowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  )}
                  <span className="text-gray-700">
                    Alcohol:{" "}
                    {auditorium.rules.alcoholAllowed
                      ? "Allowed"
                      : "Not Allowed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700">Capacity</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {auditorium.capacity} guests
                  </span>
                </div>

                {/* Contact Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    {auditorium.contact.phone && (
                      <a
                        href={`tel:${auditorium.contact.phone}`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700">
                          {auditorium.contact.phone}
                        </span>
                      </a>
                    )}
                    {auditorium.contact.email && (
                      <a
                        href={`mailto:${auditorium.contact.email}`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700">
                          {auditorium.contact.email}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="font-semibold text-xl text-gray-900 mb-6">
            Location on Map
          </h2>
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src={auditorium.location.mapUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${auditorium.name} Location`}
            ></iframe>
          </div>
          <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            Click on the map to open in Google Maps for directions.
          </p>
        </div>
      </div>

      {/* The new ImageModal component replaces the old JSX modal block */}
      <ImageModal
        isOpen={isModalOpen}
        images={modalImages}
        initialIndex={modalInitialIndex}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AudDetails;
