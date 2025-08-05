import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// This component is now self-contained and reusable
const ImageModal = ({ images, initialIndex, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const modalRef = useRef(null);

  // Sync the initial index when the modal opens
  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex]);

  // Handle body scroll and focus trapping
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();

      const focusableElements = modalRef.current?.querySelectorAll(
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
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // Handle keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) {
    return null;
  }

  // Find the currently viewed image object to get its `alt` text
  const currentImage = images[currentImageIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm modal-container"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="relative flex items-center justify-center w-full h-full flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 cursor-pointer transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
          {currentImageIndex + 1} of {images.length}
        </div>

        {/* Main Image View */}
        <div className="relative flex-1 flex items-center justify-center p-8">
          <div className="relative max-h-[90vh] max-w-[90vw] rounded-lg overflow-hidden shadow-2xl">
            <img
              src={currentImage?.src || "placeholder.jpg"}
              className="max-h-full max-w-full object-contain rounded-lg"
              alt={currentImage?.alt || "Auditorium Image"}
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg cursor-pointer transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex justify-center items-center gap-3 p-4 w-full max-w-4xl">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-x-auto hide-scrollbar shadow-lg">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer ${
                    index === currentImageIndex
                      ? "ring-2 ring-white shadow-lg"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img?.src || "placeholder.jpg"}
                    className="w-full h-full object-cover"
                    alt={img?.alt || `Thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
