import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const AudView = () => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupStartIndex, setPopupStartIndex] = useState(0);
  const navigate = useNavigate();
  const modalRef = useRef();

  // Fetch all auditoriums
  useEffect(() => {
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

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  // Focus modal and handle focus trapping
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

  // Carousel navigation
  const nextImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) + 1) %
        auditoriums[featureIndex].images.length,
    }));
  };

  const prevImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) -
          1 +
          auditoriums[featureIndex].images.length) %
        auditoriums[featureIndex].images.length,
    }));
  };

  // Open modal popup
  const openImagePopup = (images, index) => {
    setPopupImages(images.map((img) => img.src));
    setPopupStartIndex(index);
    setIsPopupOpen(true);
  };

  // Navigate popup images
  const nextPopupImage = () => {
    setPopupStartIndex((prev) => (prev + 1) % popupImages.length);
  };

  const prevPopupImage = () => {
    setPopupStartIndex(
      (prev) => (prev - 1 + popupImages.length) % popupImages.length
    );
  };

  // Navigate to details page
  const handleViewDetails = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/auditoriums/details/${id}`);
  };

  // Navigate to full auditorium list
  const handleViewMore = () => {
    navigate("/auditoriums");
  };

  return (
    <div className="p-7 sm:p-5 flex flex-col gap-4 lg:px-30 xl:px-78 lg:mt-10 min-h-screen">
      {/* Page Title */}
      <h1 className="text-center font-bold text-2xl md:text-[30px]">
        Event Venues & Auditoriums
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Auditoriums */}
      {auditoriums.slice(0, 4).map((feature, index) => (
        <div
          key={index}
          className="p-5 bg-white rounded-3xl shadow-xl border border-gray-200"
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="w-full gap-2 flex overflow-x-auto pb-2 mb-4">
              {feature.images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className="w-32 h-32 flex-shrink-0 aspect-square"
                >
                  <img
                    src={img.src || "placeholder.jpg"}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    alt={img.alt || "No image"}
                    onClick={() => openImagePopup(feature.images, imgIndex)}
                  />
                </div>
              ))}
            </div>
            <div className="mb-3">
              <h1 className="font-semibold text-lg text-gray-900 mb-2">
                {feature.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {feature.capacity
                  ? `${feature.capacity}+ guests`
                  : "Capacity N/A"}
              </p>
              <p className="text-sm mt-2 text-gray-700 font-medium line-clamp-1">
                {feature.location.address}, {feature.location.city}
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 border-t pt-2">
              {feature.description}
            </p>
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => handleViewDetails(feature._id)}
                className="bg-black w-full text-white px-4 py-2 text-[13px] rounded-[30px] cursor-pointer mt-5 transition-all duration-300 ease-in-out active:scale-90 shadow-md active:shadow-inner"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex gap-6">
            <div className="flex-shrink-0 w-80 relative">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img
                  src={
                    feature.images[currentImageIndex[index] || 0]?.src ||
                    "placeholder.jpg"
                  }
                  className="w-full h-full object-cover cursor-pointer"
                  alt={
                    feature.images[currentImageIndex[index] || 0]?.alt ||
                    "No image"
                  }
                  onClick={() =>
                    openImagePopup(
                      feature.images,
                      currentImageIndex[index] || 0
                    )
                  }
                />
                <button
                  onClick={() => prevImage(index)}
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => nextImage(index)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                <button className="absolute cursor-pointer top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {feature.images.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() =>
                      setCurrentImageIndex((prev) => ({
                        ...prev,
                        [index]: dotIndex,
                      }))
                    }
                    className={`w-2 h-2 rounded-full ${
                      (currentImageIndex[index] || 0) === dotIndex
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center flex-col">
              <h1 className="font-semibold text-xl text-gray-900 mb-2">
                {feature.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {feature.capacity
                  ? `${feature.capacity}+ guests`
                  : "Capacity N/A"}
              </p>
              <p className="text-base mt-2 text-gray-700 font-medium mb-3">
                {feature.location.address}, {feature.location.city}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div>
                <button
                  onClick={() => handleViewDetails(feature._id)}
                  className="bg-black cursor-pointer text-white px-6 py-2 rounded-[30px] mt-5 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md hover:shadow-lg active:shadow-inner"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div>
        <div className=" flex items-center justify-center  ">
          <button
            onClick={handleViewMore}
            className="bg-black cursor-pointer text-white px-8 py-3  sm:px-20 sm:py-4 rounded-[30px] mt-5 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md hover:shadow-lg active:shadow-inner"
          >
            View More
          </button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
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
              className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
              {popupStartIndex + 1} of {popupImages.length}
            </div>
            <div className="relative flex-1 flex items-center justify-center p-8">
              <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={popupImages[popupStartIndex] || "placeholder.jpg"}
                  className="max-h-full max-w-full object-contain rounded-lg"
                  alt={`Image ${popupStartIndex + 1}`}
                />
              </div>
              {popupImages.length > 1 && (
                <>
                  <button
                    onClick={prevPopupImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPopupImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer"
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
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer ${
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
                        src={img || "placeholder.jpg"}
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${imgIndex + 1}`}
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

export default AudView;
