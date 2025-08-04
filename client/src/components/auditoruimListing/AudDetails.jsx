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

const AudDetails = () => {
  const { id } = useParams();
  const [auditorium, setAuditorium] = useState(null);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(null);
  const modalRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupStartIndex, setPopupStartIndex] = useState(0);

  useEffect(() => {
    const fetchAuditorium = async () => {
      try {
        const response = await axiosInstance.get(`/auditoriums/${id}`);
        setAuditorium(response.data.auditorium);
        setPopupImages(response.data.auditorium.images.map((img) => img.src));
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

  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  useEffect(() => {
    if (isPopupOpen && modalRef.current) {
      modalRef.current.focus();
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleFocusTrap = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalRef.current.addEventListener("keydown", handleFocusTrap);
      return () => {
        modalRef.current?.removeEventListener("keydown", handleFocusTrap);
      };
    }
  }, [isPopupOpen]);

  const goToPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? popupImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === popupImages.length - 1 ? 0 : prev + 1
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

  const openImagePopup = (index) => {
    setPopupStartIndex(index);
    setIsPopupOpen(true);
  };

  const nextPopupImage = () => {
    setPopupStartIndex((prev) => (prev + 1) % popupImages.length);
  };

  const prevPopupImage = () => {
    setPopupStartIndex(
      (prev) => (prev - 1 + popupImages.length) % popupImages.length
    );
  };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!auditorium) return (
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{auditorium.name}</h1>
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
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {auditorium.images.map((img, index) => (
                  <img
                    key={index}
                    className="w-full h-full object-cover flex-shrink-0 cursor-pointer"
                    src={img.src}
                    alt={img.alt}
                    onClick={() => openImagePopup(index)}
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
                    onClick={() => openImagePopup(0)}
                  />
                </div>
                <div className="md:col-span-1 md:row-span-1">
                  <img
                    src={auditorium.images[1]?.src}
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition-all duration-300"
                    alt={auditorium.images[1]?.alt}
                    onClick={() => openImagePopup(1)}
                  />
                </div>
                <div className="md:col-span-1 md:row-span-1 relative">
                  <img
                    src={auditorium.images[2]?.src}
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:brightness-110 transition-all duration-300"
                    alt={auditorium.images[2]?.alt}
                    onClick={() => openImagePopup(2)}
                  />
                  {auditorium.images.length > 3 && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition-all duration-300"
                      onClick={() => openImagePopup(3)}
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
                <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{auditorium.description}</p>
            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Facilities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(auditorium.facilities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <div key={key} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Rules</h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg border border-gray-200">
                  {auditorium.rules.smokingAllowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  )}
                  <span className="text-gray-700">
                    Smoking: {auditorium.rules.smokingAllowed ? "Allowed" : "Not Allowed"}
                  </span>
                </div>
                <div className="flex items-center p-3 rounded-lg border border-gray-200">
                  {auditorium.rules.alcoholAllowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  )}
                  <span className="text-gray-700">
                    Alcohol: {auditorium.rules.alcoholAllowed ? "Allowed" : "Not Allowed"}
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
                  <span className="font-bold text-gray-900">{auditorium.capacity} guests</span>
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
                        <span className="text-gray-700">{auditorium.contact.phone}</span>
                      </a>
                    )}
                    {auditorium.contact.email && (
                      <a
                        href={`mailto:${auditorium.contact.email}`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-gray-700">{auditorium.contact.email}</span>
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
          <h2 className="font-semibold text-xl text-gray-900 mb-6">Location on Map</h2>
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

      {/* Fullscreen Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm modal-container"
          tabIndex={-1}
          ref={modalRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsPopupOpen(false);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              prevPopupImage();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              nextPopupImage();
            }
          }}
        >
          <div className="relative flex items-center justify-center w-full h-full flex-col">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 cursor-pointer transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
              {popupStartIndex + 1} of {popupImages.length}
            </div>
            <div className="relative flex-1 flex items-center justify-center p-8">
              <div className="relative max-h-[90vh] max-w-[90vw] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={popupImages[popupStartIndex]}
                  className="max-h-full max-w-full object-contain rounded-lg"
                  alt={
                    auditorium.images[popupStartIndex]?.alt ||
                    "Auditorium Image"
                  }
                />
              </div>
              {popupImages.length > 1 && (
                <>
                  <button
                    onClick={prevPopupImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPopupImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {popupImages.length > 1 && (
              <div className="flex justify-center items-center gap-3 p-4 w-full max-w-4xl">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-x-auto hide-scrollbar shadow-lg">
                  {popupImages.map((img, imgIndex) => (
                    <button
                      key={imgIndex}
                      onClick={() => setPopupStartIndex(imgIndex)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                        imgIndex === popupStartIndex
                          ? "ring-2 ring-white shadow-lg"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      ref={
                        imgIndex === popupStartIndex
                          ? (el) => {
                              if (el) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "nearest",
                                  inline: "center",
                                });
                              }
                            }
                          : null
                      }
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={
                          auditorium.images[imgIndex]?.alt ||
                          `Thumbnail ${imgIndex + 1}`
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudDetails;
