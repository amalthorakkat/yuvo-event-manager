import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import Img1 from "../../assets/2025-01-17.webp";
import Img2 from "../../assets/2025-01-21.webp";
import Img3 from "../../assets/2025-02-03.webp";
import Img4 from "../../assets/2025-03-10.webp";

const AudView = () => {
  // State to track current image index for each feature
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Modal popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupStartIndex, setPopupStartIndex] = useState(0);

  // Feature data: list of auditoriums
  const features = [
    {
      name: "Marhoom Komban Auditorium",
      image: [
        Img1,
        Img2,
        Img3,
        Img4,
        Img1,
        Img2,
        Img3,
        Img4,
        Img1,
        Img2,
        Img3,
        Img4,
      ],
      ratings: "3.9/5",
      place: "Valambur, Malappuram, Kerala",
      description:
        "A well-known local auditorium in Valambur, suitable for various events from intimate celebrations to moderate-sized gatherings...",
    },
    {
      name: "Zahara Convention Centere",
      image: [Img1, Img2, Img3, Img4],
      ratings: "4.1/5",
      place: "Valamboor, Eranthode, Malappuram, Kerala",
      description:
        "A popular choice in the Valamboor region for events like weddings and gatherings...",
    },
    {
      name: "Nakshathra Auditorium",
      image: [Img1, Img2, Img3, Img4],
      ratings: "3.9/5",
      place: "Kondiparamba, Malappuram, Kerala",
      description:
        "Located a short distance from Valamboor, Nakshathra Auditorium is a local venue...",
    },
  ];

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  // Move to next image in carousel
  const nextImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) + 1) % features[featureIndex].image.length,
    }));
  };

  // Move to previous image in carousel
  const prevImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) - 1 + features[featureIndex].image.length) %
        features[featureIndex].image.length,
    }));
  };

  // Open popup with selected images
  const openImagePopup = (images, index) => {
    setPopupImages(images);
    setPopupStartIndex(index);
    setIsPopupOpen(true);
  };

  // Navigate to next image in popup
  const nextPopupImage = () => {
    setPopupStartIndex((prev) => (prev + 1) % popupImages.length);
  };

  // Navigate to previous image in popup
  const prevPopupImage = () => {
    setPopupStartIndex(
      (prev) => (prev - 1 + popupImages.length) % popupImages.length
    );
  };

  return (
    <div className="p-7 sm:p-5 flex flex-col gap-4 lg:px-30 xl:px-78 lg:mt-10 min-h-screen">
      {/* Page Title */}
      <h1 className="text-center font-bold text-2xl md:text-[30px]">
        Event Venues & Auditoriums
      </h1>

      {/* Loop through all auditoriums */}
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-5 bg-white rounded-3xl shadow-xl border border-gray-200"
        >
          {/* ---------- Mobile Layout ---------- */}
          <div className="block sm:hidden">
            {/* Horizontal Scrollable Image List */}
            <div className="w-full gap-2 flex overflow-x-auto pb-2 mb-4">
              {feature.image.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className="w-32 h-32 flex-shrink-0 aspect-square"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover rounded-lg"
                    alt={`${feature.name} ${imgIndex + 1}`}
                    onClick={() => openImagePopup(feature.image, imgIndex)}
                  />
                </div>
              ))}
            </div>

            {/* Auditorium Info */}
            <div className="mb-3">
              <h1 className="font-semibold text-lg text-gray-900 mb-2">
                {feature.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {feature.ratings}
              </p>
              <p className="text-sm text-gray-700 font-medium line-clamp-1">
                {feature.place}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 border-t pt-2">
              {feature.description}
            </p>

            {/* View Details Button */}
            <div className="flex w-full items-center justify-center">
              <button className="bg-black w-full text-white px-4 py-2 text-[13px] rounded-[30px] cursor-pointer mt-5 transition-all duration-300 ease-in-out active:scale-90 shadow-md active:shadow-inner">
                View Details
              </button>
            </div>
          </div>

          {/* ---------- Desktop Layout ---------- */}
          <div className="hidden sm:flex gap-6">
            {/* Image Carousel */}
            <div className="flex-shrink-0 w-80 relative">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img
                  src={feature.image[currentImageIndex[index] || 0]}
                  className="w-full h-full object-cover cursor-pointer"
                  alt={`${feature.name} ${currentImageIndex[index] + 1}`}
                  onClick={() =>
                    openImagePopup(feature.image, currentImageIndex[index] || 0)
                  }
                />
                {/* Prev Button */}
                <button
                  onClick={() => prevImage(index)}
                  className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                {/* Next Button */}
                <button
                  onClick={() => nextImage(index)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Like Icon */}
                <button className="absolute cursor-pointer top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {feature.image.map((_, dotIndex) => (
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

            {/* Auditorium Info + Description */}
            <div className="flex-1 flex justify-center flex-col ">
              <h1 className="font-semibold text-xl text-gray-900 mb-2">
                {feature.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                {feature.ratings}
              </p>
              <p className="text-base text-gray-700 font-medium mb-3">
                {feature.place}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* View Details Button */}
              <div>
                <button className="bg-black cursor-pointer text-white px-6 py-2 rounded-[30px] mt-5 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md hover:shadow-lg active:shadow-inner">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ---------- Fullscreen Image Modal Popup ---------- */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-full h-full flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
              {popupStartIndex + 1} of {popupImages.length}
            </div>

            {/* Main Image Display */}
            <div className="relative flex-1 flex items-center justify-center p-8">
              <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={popupImages[popupStartIndex]}
                  className="max-h-full max-w-full object-contain rounded-lg"
                  alt={`Image ${popupStartIndex + 1}`}
                />
              </div>

              {/* Navigation Buttons */}
              {popupImages.length > 1 && (
                <>
                  <button
                    onClick={prevPopupImage}
                    className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPopupImage}
                    className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {popupImages.length > 1 && (
              <div className="flex justify-center items-center gap-3 p-4 w-full max-w-4xl">
                <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-x-auto hide-scrollbar shadow-lg">
                  {popupImages.map((img, imgIndex) => (
                    <button
                      key={imgIndex}
                      onClick={() => setPopupStartIndex(imgIndex)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg cursor-pointer overflow-hidden ${
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
