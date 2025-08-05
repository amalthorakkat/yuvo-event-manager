
// import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, ChevronRight, Heart, X, Filter } from "lucide-react";
// import axiosInstance from "../../config/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import { debounce } from "lodash";
// import Select from "react-select";

// const AuditoriumList = () => {
//   const [auditoriums, setAuditoriums] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [maxPriceLimit, setMaxPriceLimit] = useState(100000); // Default max
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [popupImages, setPopupImages] = useState([]);
//   const [popupStartIndex, setPopupStartIndex] = useState(0);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     priceRange: [0, 100000], // Default range: 0 to 1,00,000
//     city: "",
//     facilities: {
//       ac: false,
//       stageAvailable: false,
//       projector: false,
//       soundSystem: false,
//       wifi: false,
//       parking: false,
//     },
//   });
//   const navigate = useNavigate();
//   const modalRef = useRef();
//   const filterRef = useRef();

//   // Fetch unique cities and max price
//   useEffect(() => {
//     const fetchCitiesAndPriceLimit = async () => {
//       try {
//         const response = await axiosInstance.get("/auditoriums");
//         const uniqueCities = [...new Set(response.data.auditoriums.map((a) => a.location.city))].sort();
//         setCities(uniqueCities);
//         console.log("Fetched cities:", uniqueCities); // Debug log

//         const prices = response.data.auditoriums
//           .map((a) => a.pricePerDay)
//           .filter((p) => p != null && !isNaN(p));
//         const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;
//         const newMaxPriceLimit = Math.max(100000, maxPrice);
//         setMaxPriceLimit(newMaxPriceLimit);
//         setFilters((prev) => ({
//           ...prev,
//           priceRange: [0, newMaxPriceLimit],
//         }));
//         console.log("Initial max price limit:", newMaxPriceLimit); // Debug log
//       } catch (err) {
//         console.error("Failed to fetch cities or price limit:", err);
//       }
//     };
//     fetchCitiesAndPriceLimit();
//   }, []);

//   // Fetch auditoriums with filters (debounced)
//   const fetchAuditoriums = debounce(async () => {
//     setIsLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.priceRange[0] > 0) queryParams.append("minPrice", filters.priceRange[0]);
//       if (filters.priceRange[1] < maxPriceLimit) queryParams.append("maxPrice", filters.priceRange[1]);
//       if (filters.city) queryParams.append("city", filters.city);
//       const selectedFacilities = Object.keys(filters.facilities)
//         .filter((key) => filters.facilities[key])
//         .join(",");
//       if (selectedFacilities) queryParams.append("facilities", selectedFacilities);

//       console.log("Query Params:", queryParams.toString()); // Debug log
//       const response = await axiosInstance.get(`/auditoriums?${queryParams.toString()}`);
//       console.log("API Response:", response.data); // Debug log
//       setAuditoriums(response.data.auditoriums || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch auditoriums");
//       console.error("Fetch error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, 500);

//   useEffect(() => {
//     fetchAuditoriums();
//     return () => fetchAuditoriums.cancel();
//   }, [filters, maxPriceLimit]);

//   // Prevent body scroll when popup or filter is open
//   useEffect(() => {
//     document.body.style.overflow = isPopupOpen || isFilterOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isPopupOpen, isFilterOpen]);

//   // Focus modal and handle focus trapping
//   useEffect(() => {
//     if (isPopupOpen && modalRef.current) {
//       modalRef.current.focus();
//       const focusableElements = modalRef.current.querySelectorAll(
//         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//       );
//       const firstElement = focusableElements[0];
//       const lastElement = focusableElements[focusableElements.length - 1];

//       const handleFocusTrap = (e) => {
//         if (e.key === "Tab") {
//           if (e.shiftKey && document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement.focus();
//           } else if (!e.shiftKey && document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement.focus();
//           }
//         }
//       };

//       modalRef.current.addEventListener("keydown", handleFocusTrap);
//       return () => modalRef.current?.removeEventListener("keydown", handleFocusTrap);
//     }
//   }, [isPopupOpen]);

//   // Focus filter panel on mobile
//   useEffect(() => {
//     if (isFilterOpen && filterRef.current) {
//       filterRef.current.focus();
//     }
//   }, [isFilterOpen]);

//   // Carousel navigation
//   const nextImage = (featureIndex) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [featureIndex]:
//         ((prev[featureIndex] || 0) + 1) % auditoriums[featureIndex].images.length,
//     }));
//   };

//   const prevImage = (featureIndex) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [featureIndex]:
//         ((prev[featureIndex] || 0) - 1 + auditoriums[featureIndex].images.length) %
//         auditoriums[featureIndex].images.length,
//     }));
//   };

//   // Open modal popup
//   const openImagePopup = (images, index) => {
//     setPopupImages(images.map((img) => img.src));
//     setPopupStartIndex(index);
//     setIsPopupOpen(true);
//   };

//   // Navigate popup images
//   const nextPopupImage = () => {
//     setPopupStartIndex((prev) => (prev + 1) % popupImages.length);
//   };

//   const prevPopupImage = () => {
//     setPopupStartIndex((prev) => (prev - 1 + popupImages.length) % popupImages.length);
//   };

//   // Navigate to details page
//   const handleViewDetails = (id) => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     navigate(`/auditoriums/details/${id}`);
//   };

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value, type, checked } = e.target || {};
//     if (name?.includes("facilities.")) {
//       const facility = name.split(".")[1];
//       setFilters({
//         ...filters,
//         facilities: { ...filters.facilities, [facility]: checked },
//       });
//     } else if (name === "minPrice" || name === "maxPrice") {
//       const newValue = value === "" ? (name === "minPrice" ? 0 : maxPriceLimit) : Number(value);
//       const newPriceRange = [...filters.priceRange];
//       if (name === "minPrice") {
//         newPriceRange[0] = Math.max(0, Math.min(newValue, filters.priceRange[1]));
//       } else {
//         newPriceRange[1] = Math.max(newValue, filters.priceRange[0]);
//         if (newValue > maxPriceLimit) {
//           setMaxPriceLimit(newValue); // Update maxPriceLimit if input exceeds it
//           console.log("Updated maxPriceLimit:", newValue); // Debug log
//         }
//       }
//       console.log("Updated price range (inputs):", newPriceRange); // Debug log
//       setFilters({ ...filters, priceRange: newPriceRange });
//     }
//   };

//   // Handle price range slider
//   const handlePriceRangeChange = (value) => {
//     console.log("Updated price range (slider):", value); // Debug log
//     setFilters({ ...filters, priceRange: value });
//   };

//   // Handle city selection
//   const handleCityChange = (selectedOption) => {
//     const city = selectedOption ? selectedOption.value : "";
//     console.log("Selected city:", city); // Debug log
//     setFilters({ ...filters, city });
//   };

//   // Clear filters
//   const clearFilters = () => {
//     setFilters({
//       priceRange: [0, maxPriceLimit],
//       city: "",
//       facilities: {
//         ac: false,
//         stageAvailable: false,
//         projector: false,
//         soundSystem: false,
//         wifi: false,
//         parking: false,
//       },
//     });
//   };

//   // City options for react-select
//   const cityOptions = [
//     { value: "", label: "All Cities" },
//     ...cities.map((city) => ({ value: city, label: city })),
//   ];

//   return (
//     <div className="p-7 sm:p-5 lg:px-30 xl:px-78 lg:mt-10 min-h-screen flex flex-col">
//       {/* Page Title */}
//       <h1 className="text-center font-bold text-2xl md:text-[30px] mb-6">
//         All Auditoriums
//       </h1>
//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       {isLoading && <p className="text-center text-gray-600">Loading...</p>}

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Filter Panel - Desktop Sidebar, Mobile Drawer */}
//         <div className="lg:w-1/4">
//           {/* Mobile Filter Button */}
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="lg:hidden flex items-center justify-center w-full bg-black text-white px-4 py-2 rounded-[30px] mb-4"
//           >
//             <Filter className="w-5 h-5 mr-2" />
//             Filters
//           </button>

//           {/* Filter Panel */}
//           <div
//             className={`fixed inset-0 z-40 bg-black/50 lg:bg-transparent lg:static lg:block transition-transform duration-300 ${
//               isFilterOpen ? "translate-x-0" : "translate-x-full"
//             } lg:translate-x-0`}
//             ref={filterRef}
//             tabIndex={-1}
//           >
//             <div className="bg-white w-3/4 sm:w-1/2 max-w-xs h-full p-6 shadow-lg lg:shadow-none lg:p-0">
//               <div className="flex justify-between items-center mb-4 lg:hidden">
//                 <h2 className="text-lg font-semibold">Filters</h2>
//                 <button
//                   onClick={() => setIsFilterOpen(false)}
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="space-y-6">
//                 {/* Price Range */}
//                 <div>
//                   <h3 className="text-md font-semibold mb-2">Price Range (₹)</h3>
//                   <Slider
//                     range
//                     min={0}
//                     max={maxPriceLimit}
//                     value={filters.priceRange}
//                     onChange={handlePriceRangeChange}
//                     trackStyle={[{ backgroundColor: "#000" }]}
//                     handleStyle={[{ borderColor: "#000" }, { borderColor: "#000" }]}
//                     railStyle={{ backgroundColor: "#e5e7eb" }}
//                   />
//                   <div className="flex justify-between mt-2">
//                     <span>₹{filters.priceRange[0].toLocaleString()}</span>
//                     <span>₹{filters.priceRange[1].toLocaleString()}</span>
//                   </div>
//                   <div className="flex gap-2 mt-2">
//                     <input
//                       type="number"
//                       name="minPrice"
//                       value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
//                       onChange={handleFilterChange}
//                       placeholder="Min"
//                       className="w-full p-2 border rounded-md"
//                       min="0"
//                       max={filters.priceRange[1]}
//                     />
//                     <input
//                       type="number"
//                       name="maxPrice"
//                       value={filters.priceRange[1] === maxPriceLimit ? "" : filters.priceRange[1]}
//                       onChange={handleFilterChange}
//                       placeholder="Max"
//                       className="w-full p-2 border rounded-md"
//                       min={filters.priceRange[0]}
//                     />
//                   </div>
//                 </div>

//                 {/* City */}
//                 <div>
//                   <h3 className="text-md font-semibold mb-2">City</h3>
//                   <Select
//                     options={cityOptions}
//                     value={cityOptions.find((option) => option.value === filters.city) || null}
//                     onChange={handleCityChange}
//                     placeholder="Search or select a city"
//                     isClearable
//                     className="w-full"
//                     classNamePrefix="react-select"
//                   />
//                 </div>

//                 {/* Facilities */}
//                 <div>
//                   <h3 className="text-md font-semibold mb-2">Facilities</h3>
//                   {[
//                     { key: "ac", label: "Air Conditioning" },
//                     { key: "stageAvailable", label: "Stage Available" },
//                     { key: "projector", label: "Projector" },
//                     { key: "soundSystem", label: "Sound System" },
//                     { key: "wifi", label: "WiFi" },
//                     { key: "parking", label: "Parking" },
//                   ].map((facility) => (
//                     <label key={facility.key} className="flex items-center mb-2">
//                       <input
//                         type="checkbox"
//                         name={`facilities.${facility.key}`}
//                         checked={filters.facilities[facility.key]}
//                         onChange={handleFilterChange}
//                         className="mr-2"
//                       />
//                       {facility.label}
//                     </label>
//                   ))}
//                 </div>

//                 {/* Clear Filters */}
//                 <button
//                   onClick={clearFilters}
//                   className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Auditorium Grid */}
//         <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {auditoriums.length === 0 && !isLoading && (
//             <p className="text-center text-gray-600 col-span-full">No auditoriums found.</p>
//           )}
//           {auditoriums.map((feature, index) => (
//             <div
//               key={index}
//               className="p-5 bg-white rounded-3xl shadow-xl border border-gray-200"
//             >
//               <div className="relative">
//                 <div className="aspect-square rounded-lg overflow-hidden">
//                   <img
//                     src={feature.images[currentImageIndex[index] || 0]?.src || "placeholder.jpg"}
//                     className="w-full h-full object-cover cursor-pointer"
//                     alt={feature.images[currentImageIndex[index] || 0]?.alt || "No image"}
//                     onClick={() => openImagePopup(feature.images, currentImageIndex[index] || 0)}
//                   />
//                 </div>
//                 <button
//                   onClick={() => prevImage(index)}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//                 >
//                   <ChevronLeft className="w-5 h-5 text-gray-700" />
//                 </button>
//                 <button
//                   onClick={() => nextImage(index)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
//                 >
//                   <ChevronRight className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
//                   <Heart className="w-5 h-5 text-gray-700" />
//                 </button>
//                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
//                   {feature.images.map((_, dotIndex) => (
//                     <button
//                       key={dotIndex}
//                       onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [index]: dotIndex }))}
//                       className={`w-2 h-2 rounded-full ${(currentImageIndex[index] || 0) === dotIndex ? "bg-white" : "bg-white/50"}`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-3">
//                 <h1 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 ">{feature.name}</h1>
//                 <p className="text-sm text-gray-600 font-medium">
//                   {feature.capacity ? `${feature.capacity}+ guests` : "Capacity N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600 font-medium">
//                   {feature.pricePerDay ? `₹${feature.pricePerDay.toLocaleString()}/day` : "Price N/A"}
//                 </p>
//                 <p className="text-sm mt-2 text-gray-700 font-medium line-clamp-1">
//                   {feature.location.address}, {feature.location.city}
//                 </p>
//                 <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mt-2">
//                   {feature.description}
//                 </p>
//                 <button
//                   onClick={() => handleViewDetails(feature._id)}
//                   className="w-full bg-black text-white px-4 py-2 rounded-[30px] mt-4 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Fullscreen Image Modal */}
//       {isPopupOpen && (
//         <div
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
//           tabIndex={-1}
//           ref={modalRef}
//           onKeyDown={(e) => {
//             if (e.key === "Escape") {
//               setIsPopupOpen(false);
//             } else if (e.key === "ArrowLeft") {
//               e.preventDefault();
//               prevPopupImage();
//             } else if (e.key === "ArrowRight") {
//               e.preventDefault();
//               nextPopupImage();
//             }
//           }}
//         >
//           <div className="relative flex items-center justify-center w-full h-full flex-col">
//             <button
//               onClick={() => setIsPopupOpen(false)}
//               className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
//               {popupStartIndex + 1} of {popupImages.length}
//             </div>
//             <div className="relative flex-1 flex items-center justify-center p-8">
//               <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-2xl">
//                 <img
//                   src={popupImages[popupStartIndex] || "placeholder.jpg"}
//                   className="max-h-full max-w-full object-contain rounded-lg"
//                   alt={`Image ${popupStartIndex + 1}`}
//                 />
//               </div>
//               {popupImages.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevPopupImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg"
//                   >
//                     <ChevronLeft className="w-6 h-6" />
//                   </button>
//                   <button
//                     onClick={nextPopupImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full border border-white/20 shadow-lg"
//                   >
//                     <ChevronRight className="w-6 h-6" />
//                   </button>
//                 </>
//               )}
//             </div>
//             {popupImages.length > 1 && (
//               <div className="flex justify-center items-center gap-3 p-4 w-full max-w-4xl">
//                 <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-x-auto hide-scrollbar shadow-lg">
//                   {popupImages.map((img, imgIndex) => (
//                     <button
//                       key={imgIndex}
//                       onClick={() => setPopupStartIndex(imgIndex)}
//                       className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer ${
//                         imgIndex === popupStartIndex ? "ring-2 ring-white shadow-lg" : "opacity-70 hover:opacity-100"
//                       }`}
//                       ref={
//                         imgIndex === popupStartIndex
//                           ? (el) => {
//                               if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
//                             }
//                           : null
//                       }
//                     >
//                       <img
//                         src={img || "placeholder.jpg"}
//                         className="w-full h-full object-cover"
//                         alt={`Thumbnail ${imgIndex + 1}`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuditoriumList;


import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart, X, Filter } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { debounce } from "lodash";
import Select from "react-select";
import ImageModal from "../modal/ImageModal"; // Import the ImageModal component

const AuditoriumList = () => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [cities, setCities] = useState([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    city: "",
    facilities: {
      ac: false,
      stageAvailable: false,
      projector: false,
      soundSystem: false,
      wifi: false,
      parking: false,
    },
  });
  const navigate = useNavigate();
  const filterRef = useRef();

  // State variables for the ImageModal component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // Fetch unique cities and max price
  useEffect(() => {
    const fetchCitiesAndPriceLimit = async () => {
      try {
        const response = await axiosInstance.get("/auditoriums");
        const uniqueCities = [
          ...new Set(response.data.auditoriums.map((a) => a.location.city)),
        ].sort();
        setCities(uniqueCities);

        const prices = response.data.auditoriums
          .map((a) => a.pricePerDay)
          .filter((p) => p != null && !isNaN(p));
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;
        const newMaxPriceLimit = Math.max(100000, maxPrice);
        setMaxPriceLimit(newMaxPriceLimit);
        setFilters((prev) => ({
          ...prev,
          priceRange: [0, newMaxPriceLimit],
        }));
      } catch (err) {
        console.error("Failed to fetch cities or price limit:", err);
      }
    };
    fetchCitiesAndPriceLimit();
  }, []);

  // Fetch auditoriums with filters (debounced)
  const fetchAuditoriums = debounce(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.priceRange[0] > 0)
        queryParams.append("minPrice", filters.priceRange[0]);
      if (filters.priceRange[1] < maxPriceLimit)
        queryParams.append("maxPrice", filters.priceRange[1]);
      if (filters.city) queryParams.append("city", filters.city);
      const selectedFacilities = Object.keys(filters.facilities)
        .filter((key) => filters.facilities[key])
        .join(",");
      if (selectedFacilities) queryParams.append("facilities", selectedFacilities);

      const response = await axiosInstance.get(
        `/auditoriums?${queryParams.toString()}`
      );
      setAuditoriums(response.data.auditoriums || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch auditoriums");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchAuditoriums();
    return () => fetchAuditoriums.cancel();
  }, [filters, maxPriceLimit]);

  // Prevent body scroll when filter is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  // Focus filter panel on mobile
  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      filterRef.current.focus();
    }
  }, [isFilterOpen]);

  // Carousel navigation
  const nextImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) + 1) % auditoriums[featureIndex].images.length,
    }));
  };

  const prevImage = (featureIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [featureIndex]:
        ((prev[featureIndex] || 0) - 1 + auditoriums[featureIndex].images.length) %
        auditoriums[featureIndex].images.length,
    }));
  };

  // Open modal popup
  const openImagePopup = (images, index) => {
    // Pass the entire image object to the modal
    setModalImages(images);
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  // Navigate to details page
  const handleViewDetails = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/auditoriums/details/${id}`);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    if (name?.includes("facilities.")) {
      const facility = name.split(".")[1];
      setFilters({
        ...filters,
        facilities: { ...filters.facilities, [facility]: checked },
      });
    } else if (name === "minPrice" || name === "maxPrice") {
      const newValue =
        value === "" ? (name === "minPrice" ? 0 : maxPriceLimit) : Number(value);
      const newPriceRange = [...filters.priceRange];
      if (name === "minPrice") {
        newPriceRange[0] = Math.max(0, Math.min(newValue, filters.priceRange[1]));
      } else {
        newPriceRange[1] = Math.max(newValue, filters.priceRange[0]);
        if (newValue > maxPriceLimit) {
          setMaxPriceLimit(newValue);
        }
      }
      setFilters({ ...filters, priceRange: newPriceRange });
    }
  };

  // Handle price range slider
  const handlePriceRangeChange = (value) => {
    setFilters({ ...filters, priceRange: value });
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    const city = selectedOption ? selectedOption.value : "";
    setFilters({ ...filters, city });
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, maxPriceLimit],
      city: "",
      facilities: {
        ac: false,
        stageAvailable: false,
        projector: false,
        soundSystem: false,
        wifi: false,
        parking: false,
      },
    });
  };

  // City options for react-select
  const cityOptions = [
    { value: "", label: "All Cities" },
    ...cities.map((city) => ({ value: city, label: city })),
  ];

  return (
    <div className="p-7 sm:p-5 lg:px-30 xl:px-78 lg:mt-10 min-h-screen flex flex-col">
      {/* Page Title */}
      <h1 className="text-center font-bold text-2xl md:text-[30px] mb-6">
        All Auditoriums
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {isLoading && <p className="text-center text-gray-600">Loading...</p>}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel - Desktop Sidebar, Mobile Drawer */}
        <div className="lg:w-1/4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center justify-center w-full bg-black text-white px-4 py-2 rounded-[30px] mb-4"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>

          {/* Filter Panel */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 lg:bg-transparent lg:static lg:block transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "translate-x-full"
            } lg:translate-x-0`}
            ref={filterRef}
            tabIndex={-1}
          >
            <div className="bg-white w-3/4 sm:w-1/2 max-w-xs h-full p-6 shadow-lg lg:shadow-none lg:p-0">
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-md font-semibold mb-2">
                    Price Range (₹)
                  </h3>
                  <Slider
                    range
                    min={0}
                    max={maxPriceLimit}
                    value={filters.priceRange}
                    onChange={handlePriceRangeChange}
                    trackStyle={[{ backgroundColor: "#000" }]}
                    handleStyle={[
                      { borderColor: "#000" },
                      { borderColor: "#000" },
                    ]}
                    railStyle={{ backgroundColor: "#e5e7eb" }}
                  />
                  <div className="flex justify-between mt-2">
                    <span>₹{filters.priceRange[0].toLocaleString()}</span>
                    <span>₹{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full p-2 border rounded-md"
                      min="0"
                      max={filters.priceRange[1]}
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={
                        filters.priceRange[1] === maxPriceLimit
                          ? ""
                          : filters.priceRange[1]
                      }
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full p-2 border rounded-md"
                      min={filters.priceRange[0]}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <h3 className="text-md font-semibold mb-2">City</h3>
                  <Select
                    options={cityOptions}
                    value={
                      cityOptions.find((option) => option.value === filters.city) ||
                      null
                    }
                    onChange={handleCityChange}
                    placeholder="Search or select a city"
                    isClearable
                    className="w-full"
                    classNamePrefix="react-select"
                  />
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-md font-semibold mb-2">Facilities</h3>
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
                        checked={filters.facilities[facility.key]}
                        onChange={handleFilterChange}
                        className="mr-2"
                      />
                      {facility.label}
                    </label>
                  ))}
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auditorium Grid */}
        <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditoriums.length === 0 && !isLoading && (
            <p className="text-center text-gray-600 col-span-full">
              No auditoriums found.
            </p>
          )}
          {auditoriums.map((feature, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-3xl shadow-xl border border-gray-200"
            >
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden">
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
                      openImagePopup(feature.images, currentImageIndex[index] || 0)
                    }
                  />
                </div>
                <button
                  onClick={() => prevImage(index)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => nextImage(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                <button className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
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
              <div className="mt-3">
                <h1 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 ">
                  {feature.name}
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  {feature.capacity ? `${feature.capacity}+ guests` : "Capacity N/A"}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {feature.pricePerDay
                    ? `₹${feature.pricePerDay.toLocaleString()}/day`
                    : "Price N/A"}
                </p>
                <p className="text-sm mt-2 text-gray-700 font-medium line-clamp-1">
                  {feature.location.address}, {feature.location.city}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mt-2">
                  {feature.description}
                </p>
                <button
                  onClick={() => handleViewDetails(feature._id)}
                  className="w-full bg-black text-white px-4 py-2 rounded-[30px] mt-4 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
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

export default AuditoriumList;