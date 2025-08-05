import React from "react";
import { MapPin, CalendarCheck, Users } from "lucide-react";

const AudHero = () => {
  const features = [
    {
      title: "Find Nearby",
      description:
        "Discover auditoriums and event spaces in your area with detailed location information.",
      icon: <MapPin size={32} />, 
    },
    {
      title: "Book Instantly",
      description:
        "Check availability and book your preferred venue with our seamless booking system.",
      icon: <CalendarCheck size={32} />,
    },
    {
      title: "Perfect Capacity",
      description:
        "Easily find venues that fit your guest list without compromise on comfort or space.",
      icon: <Users size={32} />,
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="text-2xl md:text-[40px] items-center justify-center text-center p-6 mt-20 mb-10">
        <h1>
          Tired of Searching for the <br />{" "}
          <span className="font-bold ">Perfect Event Centre?</span>
          <p className="text-[15px] md:text-[20px] mt-1">
            We're here for you. Find and book premium auditoriums, conference
            halls, and event spaces in minutes.
          </p>
        </h1>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 pb-10 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white backdrop-blur-lg rounded-3xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl shadow-lg"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center md:mt-6 ">
                  <div
                    className={`inline-flex  items-center justify-center  rounded-2xl  mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-[20px] font-bold text-gray-900 mb-2 md:mb-4 md:text-2xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-[15px] md:text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover arrow */}
                  <div className="mt-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-black md:text-purple-400 font-semibold">
                      Learn more
                      <svg
                        className="w-5 h-5 ml-2 transform md:group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudHero;
