// import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, ChevronRight, Heart, X, Filter } from "lucide-react";
// import axiosInstance from "../../config/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
// import { debounce } from "lodash";
// import Select from "react-select";
// import ImageModal from "../modal/ImageModal";

// const AuditoriumList = () => {
//   const [auditoriums, setAuditoriums] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
//   const [currentImageIndex, setCurrentImageIndex] = useState({});
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     priceRange: [0, 100000],
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
//   const filterRef = useRef();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalImages, setModalImages] = useState([]);
//   const [modalInitialIndex, setModalInitialIndex] = useState(0);

//   useEffect(() => {
//     const fetchCitiesAndPriceLimit = async () => {
//       try {
//         const response = await axiosInstance.get("/auditoriums");
//         const uniqueCities = [
//           ...new Set(response.data.auditoriums.map((a) => a.location.city)),
//         ].sort();
//         setCities(uniqueCities);

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
//       } catch (err) {
//         console.error("Failed to fetch cities or price limit:", err);
//       }
//     };
//     fetchCitiesAndPriceLimit();
//   }, []);

//   const fetchAuditoriums = debounce(async () => {
//     setIsLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.priceRange[0] > 0)
//         queryParams.append("minPrice", filters.priceRange[0]);
//       if (filters.priceRange[1] < maxPriceLimit)
//         queryParams.append("maxPrice", filters.priceRange[1]);
//       if (filters.city) queryParams.append("city", filters.city);
//       const selectedFacilities = Object.keys(filters.facilities)
//         .filter((key) => filters.facilities[key])
//         .join(",");
//       if (selectedFacilities)
//         queryParams.append("facilities", selectedFacilities);

//       const response = await axiosInstance.get(
//         `/auditoriums?${queryParams.toString()}`
//       );
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

//   useEffect(() => {
//     document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isFilterOpen]);

//   useEffect(() => {
//     if (isFilterOpen && filterRef.current) {
//       filterRef.current.focus();
//     }
//   }, [isFilterOpen]);

//   const nextImage = (featureIndex) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [featureIndex]:
//         ((prev[featureIndex] || 0) + 1) %
//         auditoriums[featureIndex].images.length,
//     }));
//   };

//   const prevImage = (featureIndex) => {
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [featureIndex]:
//         ((prev[featureIndex] || 0) -
//           1 +
//           auditoriums[featureIndex].images.length) %
//         auditoriums[featureIndex].images.length,
//     }));
//   };

//   const openImagePopup = (images, index) => {
//     setModalImages(images);
//     setModalInitialIndex(index);
//     setIsModalOpen(true);
//   };

//   const handleViewDetails = (id) => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     navigate(`/auditoriums/details/${id}`);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value, type, checked } = e.target || {};
//     if (name?.includes("facilities.")) {
//       const facility = name.split(".")[1];
//       setFilters({
//         ...filters,
//         facilities: { ...filters.facilities, [facility]: checked },
//       });
//     } else if (name === "minPrice" || name === "maxPrice") {
//       const newValue =
//         value === ""
//           ? name === "minPrice"
//             ? 0
//             : maxPriceLimit
//           : Number(value);
//       const newPriceRange = [...filters.priceRange];
//       if (name === "minPrice") {
//         newPriceRange[0] = Math.max(
//           0,
//           Math.min(newValue, filters.priceRange[1])
//         );
//       } else {
//         newPriceRange[1] = Math.max(newValue, filters.priceRange[0]);
//         if (newValue > maxPriceLimit) {
//           setMaxPriceLimit(newValue);
//         }
//       }
//       setFilters({ ...filters, priceRange: newPriceRange });
//     }
//   };

//   const handlePriceRangeChange = (value) => {
//     setFilters({ ...filters, priceRange: value });
//   };

//   const handleCityChange = (selectedOption) => {
//     const city = selectedOption ? selectedOption.value : "";
//     setFilters({ ...filters, city });
//   };

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

//   const cityOptions = [
//     { value: "", label: "All Cities" },
//     ...cities.map((city) => ({ value: city, label: city })),
//   ];

//   return (
//     <div className="bg-white min-h-screen pt-[72px]">
//       <div className="container mx-auto px-4 py-8">
//         {/* Page Title */}
//         <h1 className="text-center font-bold text-2xl md:text-3xl mb-8 text-gray-900">
//           All Auditoriums
//         </h1>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         {isLoading && (
//           <div className="flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-8 relative">
//           {/* Mobile Filter Button */}
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="lg:hidden flex items-center justify-center w-full bg-black text-white px-4 py-3 rounded-lg mb-4 font-medium"
//           >
//             <Filter className="w-5 h-5 mr-2" />
//             Filters
//           </button>

//           {/* Filter Overlay and Panel */}
//           {isFilterOpen && (
//             <div
//               className="lg:hidden fixed inset-0 z-40 bg-black/50"
//               onClick={() => setIsFilterOpen(false)}
//             ></div>
//           )}

//           <div
//             className={`
//               lg:sticky lg:top-[85px]  lg:overflow-y-auto
//               fixed inset-y-0 left-0 z-50 md:z-40
//               bg-white w-72 h-full p-6 shadow-xl
//               transition-transform duration-300 ease-in-out
//               ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
//               lg:static lg:translate-x-0 lg:w-1/4 lg:p-0 lg:shadow-none
//               lg:border lg:border-gray-200 lg:rounded-lg
//             `}
//             ref={filterRef}
//             tabIndex={-1}
//           >
//             {/* Filter Panel Content */}
//             <div className="h-full flex flex-col">
//               <div className="flex justify-between items-center mb-6 lg:hidden">
//                 <h2 className="text-xl font-bold">Filters</h2>
//                 <button
//                   onClick={() => setIsFilterOpen(false)}
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-8 flex-1 overflow-y-auto p-4">
//                 {/* Price Range */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                     Price Range (₹)
//                   </h3>
//                   <Slider
//                     range
//                     min={0}
//                     max={maxPriceLimit}
//                     value={filters.priceRange}
//                     onChange={handlePriceRangeChange}
//                     trackStyle={[{ backgroundColor: "#000" }]}
//                     handleStyle={[
//                       { borderColor: "#000", backgroundColor: "#000" },
//                       { borderColor: "#000", backgroundColor: "#000" },
//                     ]}
//                     railStyle={{ backgroundColor: "#e5e7eb" }}
//                   />
//                   <div className="flex justify-between mt-3 text-gray-700">
//                     <span>₹{filters.priceRange[0].toLocaleString()}</span>
//                     <span>₹{filters.priceRange[1].toLocaleString()}</span>
//                   </div>
//                   <div className="flex gap-3 mt-3">
//                     <input
//                       type="number"
//                       name="minPrice"
//                       value={
//                         filters.priceRange[0] === 0 ? "" : filters.priceRange[0]
//                       }
//                       onChange={handleFilterChange}
//                       placeholder="Min"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
//                       min="0"
//                       max={filters.priceRange[1]}
//                     />
//                     <input
//                       type="number"
//                       name="maxPrice"
//                       value={
//                         filters.priceRange[1] === maxPriceLimit
//                           ? ""
//                           : filters.priceRange[1]
//                       }
//                       onChange={handleFilterChange}
//                       placeholder="Max"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
//                       min={filters.priceRange[0]}
//                     />
//                   </div>
//                 </div>

//                 {/* City */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3 text-gray-900">
//                     City
//                   </h3>
//                   <Select
//                     options={cityOptions}
//                     value={
//                       cityOptions.find(
//                         (option) => option.value === filters.city
//                       ) || null
//                     }
//                     onChange={handleCityChange}
//                     placeholder="Search or select a city"
//                     isClearable
//                     className="w-full"
//                     classNamePrefix="react-select"
//                     styles={{
//                       control: (base) => ({
//                         ...base,
//                         borderColor: "#e5e7eb",
//                         "&:hover": {
//                           borderColor: "#9ca3af",
//                         },
//                         boxShadow: "none",
//                         minHeight: "42px",
//                       }),
//                       option: (base, { isSelected }) => ({
//                         ...base,
//                         backgroundColor: isSelected ? "#000" : "#fff",
//                         color: isSelected ? "#fff" : "#000",
//                         "&:hover": {
//                           backgroundColor: isSelected ? "#000" : "#f3f4f6",
//                           color: isSelected ? "#fff" : "#000",
//                         },
//                       }),
//                       singleValue: (base) => ({
//                         ...base,
//                         color: "#000",
//                       }),
//                     }}
//                   />
//                 </div>

//                 {/* Facilities */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3 text-gray-900">
//                     Facilities
//                   </h3>
//                   <div className="space-y-2">
//                     {[
//                       { key: "ac", label: "Air Conditioning" },
//                       { key: "stageAvailable", label: "Stage Available" },
//                       { key: "projector", label: "Projector" },
//                       { key: "soundSystem", label: "Sound System" },
//                       { key: "wifi", label: "WiFi" },
//                       { key: "parking", label: "Parking" },
//                     ].map((facility) => (
//                       <label key={facility.key} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           name={`facilities.${facility.key}`}
//                           checked={filters.facilities[facility.key]}
//                           onChange={handleFilterChange}
//                           className="mr-3 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
//                         />
//                         <span className="text-gray-700">{facility.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Clear Filters */}
//                 <button
//                   onClick={clearFilters}
//                   className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Auditorium Grid */}
//           <div className="lg:w-3/4">
//             {auditoriums.length === 0 && !isLoading ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-600 text-lg">
//                   No auditoriums found matching your criteria.
//                 </p>
//                 <button
//                   onClick={clearFilters}
//                   className="mt-4 bg-black text-white px-6 py-2 rounded-lg font-medium"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {auditoriums.map((feature, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//                   >
//                     <div className="relative group">
//                       <div className="aspect-square overflow-hidden">
//                         <img
//                           src={
//                             feature.images[currentImageIndex[index] || 0]
//                               ?.src || "placeholder.jpg"
//                           }
//                           className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
//                           alt={
//                             feature.images[currentImageIndex[index] || 0]
//                               ?.alt || "No image"
//                           }
//                           onClick={() =>
//                             openImagePopup(
//                               feature.images,
//                               currentImageIndex[index] || 0
//                             )
//                           }
//                         />
//                       </div>
//                       <button
//                         onClick={() => prevImage(index)}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md
//                                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
//                       >
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => nextImage(index)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md
//                                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
//                       >
//                         <ChevronRight className="w-5 h-5" />
//                       </button>
//                       <button className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md">
//                         <Heart className="w-5 h-5 text-gray-700" />
//                       </button>
//                       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
//                         {feature.images.map((_, dotIndex) => (
//                           <button
//                             key={dotIndex}
//                             onClick={() =>
//                               setCurrentImageIndex((prev) => ({
//                                 ...prev,
//                                 [index]: dotIndex,
//                               }))
//                             }
//                             className={`w-2 h-2 rounded-full transition-all ${
//                               (currentImageIndex[index] || 0) === dotIndex
//                                 ? "bg-black w-3"
//                                 : "bg-white/70"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
//                         {feature.name}
//                       </h2>
//                       <div className="flex items-center text-gray-600 text-sm mb-2">
//                         <span>{feature.location.city}</span>
//                       </div>
//                       <div className="flex justify-between items-center mb-3">
//                         <span className="font-medium text-gray-900">
//                           {feature.pricePerDay
//                             ? `₹${feature.pricePerDay.toLocaleString()}/day`
//                             : "Price N/A"}
//                         </span>
//                         <span className="text-sm text-gray-600">
//                           {feature.capacity
//                             ? `${feature.capacity}+ guests`
//                             : "Capacity N/A"}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 line-clamp-2 mb-4">
//                         {feature.description}
//                       </p>
//                       <button
//                         onClick={() => handleViewDetails(feature._id)}
//                         className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
//                       >
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <ImageModal
//         isOpen={isModalOpen}
//         images={modalImages}
//         initialIndex={modalInitialIndex}
//         onClose={() => setIsModalOpen(false)}
//       />
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
import ImageModal from "../modal/ImageModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

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

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (isFilterOpen && filterRef.current) {
      filterRef.current.focus();
    }
  }, [isFilterOpen]);

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

  const openImagePopup = (images, index) => {
    setModalImages(images);
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  const handleViewDetails = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/auditoriums/details/${id}`);
  };

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

  const handlePriceRangeChange = (value) => {
    setFilters({ ...filters, priceRange: value });
  };

  const handleCityChange = (selectedOption) => {
    const city = selectedOption ? selectedOption.value : "";
    setFilters({ ...filters, city });
  };

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

  const cityOptions = [
    { value: "", label: "All Cities" },
    ...cities.map((city) => ({ value: city, label: city })),
  ];

  return (
    <div className="bg-white min-h-screen pt-[72px]">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-center font-bold text-2xl md:text-3xl mb-8 text-gray-900">
          All Auditoriums
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center justify-center w-full bg-black text-white px-4 py-3 rounded-lg mb-4 font-medium"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>

          {/* Filter Overlay and Panel */}
          {isFilterOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsFilterOpen(false)}
            ></div>
          )}

          <div
            className={`
              lg:sticky lg:top-[85px]  lg:overflow-y-auto
              fixed inset-y-0 left-0 z-50 md:z-40
              bg-white w-72 h-full p-6 shadow-xl
              transition-transform duration-300 ease-in-out
              ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
              lg:static lg:translate-x-0 lg:w-1/4 lg:p-0 lg:shadow-none
              lg:border lg:border-gray-200 lg:rounded-lg
            `}
            ref={filterRef}
            tabIndex={-1}
          >
            {/* Filter Panel Content */}
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto p-4">
                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
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
                      { borderColor: "#000", backgroundColor: "#000" },
                      { borderColor: "#000", backgroundColor: "#000" },
                    ]}
                    railStyle={{ backgroundColor: "#e5e7eb" }}
                  />
                  <div className="flex justify-between mt-3 text-gray-700">
                    <span>₹{filters.priceRange[0].toLocaleString()}</span>
                    <span>₹{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                      min={filters.priceRange[0]}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">City</h3>
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
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#e5e7eb',
                        '&:hover': {
                          borderColor: '#9ca3af'
                        },
                        boxShadow: 'none',
                        minHeight: '42px'
                      }),
                      option: (base, { isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#000' : '#fff',
                        color: isSelected ? '#fff' : '#000',
                        '&:hover': {
                          backgroundColor: isSelected ? '#000' : '#f3f4f6',
                          color: isSelected ? '#fff' : '#000'
                        }
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#000'
                      })
                    }}
                  />
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Facilities</h3>
                  <div className="space-y-2">
                    {[
                      { key: "ac", label: "Air Conditioning" },
                      { key: "stageAvailable", label: "Stage Available" },
                      { key: "projector", label: "Projector" },
                      { key: "soundSystem", label: "Sound System" },
                      { key: "wifi", label: "WiFi" },
                      { key: "parking", label: "Parking" },
                    ].map((facility) => (
                      <label key={facility.key} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`facilities.${facility.key}`}
                          checked={filters.facilities[facility.key]}
                          onChange={handleFilterChange}
                          className="mr-3 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-gray-700">{facility.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Auditorium Grid */}
          <div className="lg:w-3/4">
            {auditoriums.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No auditoriums found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-black text-white px-6 py-2 rounded-lg font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {auditoriums.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    <div className="relative group">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={
                            feature.images[currentImageIndex[index] || 0]?.src ||
                            "placeholder.jpg"
                          }
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md
                                   opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => nextImage(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 text-white rounded-full p-2 shadow-md
                                   opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md">
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
                            className={`w-2 h-2 rounded-full transition-all ${
                              (currentImageIndex[index] || 0) === dotIndex
                                ? "bg-black w-3"
                                : "bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                        {feature.name}
                      </h2>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <span>{feature.location.city}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-900">
                          {feature.pricePerDay
                            ? `₹${feature.pricePerDay.toLocaleString()}/day`
                            : "Price N/A"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {feature.capacity ? `${feature.capacity}+ guests` : "Capacity N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {feature.description}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={() => handleViewDetails(feature._id)}
                          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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