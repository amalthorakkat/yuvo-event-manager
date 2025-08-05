// import React from "react";
// import { MapPin, Phone, Mail, Building2 } from "lucide-react";

// const AudFooter = () => {
//   return (
//     <footer className="bg-gray-950 text-white py-10 px-6 mt-14">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//         {/* Brand */}
//         <div>
//           <h2 className="text-2xl font-bold text-purple-500 mb-3">
//             YUVO Auditoriums
//           </h2>
//           <p className="text-sm text-gray-300">
//             Discover, compare, and book auditoriums across Kerala for your
//             events. Powered by YUVO Event Management.
//           </p>
//         </div>

//         {/* Auditorium Categories */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Auditorium Types</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Wedding Halls
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Conference Centres
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Banquet Halls
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Community Auditoriums
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Explore Auditoriums */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Explore</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Nearby Auditoriums
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Top Rated Venues
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Add Your Auditorium
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-purple-400">
//                 Help & Support
//               </a>
//             </li>
//           </ul>
//         </div>

//         {/* Contact */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Contact</h3>
//           <ul className="text-sm text-gray-300 space-y-3">
//             <li className="flex items-start gap-2">
//               <MapPin className="w-4 h-4 mt-1 text-purple-400" />
//               Malappuram, Kerala
//             </li>
//             <li className="flex items-center gap-2">
//               <Phone className="w-4 h-4 text-purple-400" />
//               +91 9898989898
//             </li>
//             <li className="flex items-center gap-2">
//               <Mail className="w-4 h-4 text-purple-400" />
//               auditoriums@yuvo.com
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="border-t border-gray-800 mt-10 pt-5 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()} YUVO Auditorium Listings. All rights
//         reserved.
//       </div>
//     </footer>
//   );
// };

// export default AudFooter;


import React, { useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import gsap from "gsap";

const AudFooter = () => {
  // Number of stars to generate
  const numStars = 200;
  const glitterRef = useRef(null);

  // Generate star elements with unique keys
  const stars = Array.from({ length: numStars }, (_, index) => (
    <div key={`star-${index}`} className="star" data-star-id={index}></div>
  ));

  // GSAP animation for stars
  useEffect(() => {
    const glitterContainer = glitterRef.current;
    if (!glitterContainer) {
      console.error("Glitter container not found.");
      return;
    }

    const { width, height } = glitterContainer.getBoundingClientRect();
    console.log(`Glitter container size: ${width}x${height}`);

    const starElements = glitterContainer.querySelectorAll(".star");
    console.log(`Found ${starElements.length} stars`);

    if (starElements.length === 0) {
      console.error("No star elements found.");
      return;
    }

    starElements.forEach((star, index) => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5 + 0.5; // 0.5px to 2px
      const opacity = Math.random() * 0.3 + 0.4; // 0.4 to 0.7
      const duration = Math.random() * 3 + 6; // 6s to 9s
      const delay = Math.random() * 2; // 0s to 2s

      gsap.set(star, {
        x: x,
        y: y,
        width: size,
        height: size,
        opacity: opacity,
      });

      gsap.to(star, {
        x: `+=${Math.random() * 30 - 15}`,
        y: `+=${Math.random() * 30 - 15}`,
        scale: Math.random() * 0.3 + 0.85,
        opacity: opacity * 0.6,
        duration: duration,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onStart: () => console.log(`Animating star ${index}`),
      });

      gsap.to(star, {
        opacity: opacity * 0.3,
        duration: Math.random() * 0.8 + 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 1.5,
      });
    });
  }, []);

  return (
    <footer className="relative bg-black text-white pt-10 pb-6 px-6 overflow-hidden">
      {/* Glitter Animation Background */}
      <div className="absolute inset-0 pointer-events-none" ref={glitterRef}>
        <div className="glitter">{stars}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black opacity-80"></div>
      </div>

      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Social Media */}
          <div className="md:col-span-2 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3 group">
                <span className="text-xl font-bold text-white transform group-hover:scale-110 transition-transform duration-200">
                  Y
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white">YUVO Auditoriums</h2>
            </div>
            <p className="text-sm bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent max-w-sm">
              The perfect venue for your events in Kerala with ease and style.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="p-2 rounded-full text-gray-200 hover:bg-indigo-500/30 hover:text-white transform hover:scale-110 transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full text-gray-200 hover:bg-indigo-500/30 hover:text-white transform hover:scale-110 transition-all duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full text-gray-200 hover:bg-indigo-500/30 hover:text-white transform hover:scale-110 transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links and Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Links */}
            <div>
              <h3 className="text-base font-medium text-indigo-300 mb-3">Links</h3>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Wedding Halls
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Conference Centers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Banquet Halls
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Community Auditoriums
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Nearby Auditoriums
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Top-Rated Venues
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Add Your Auditorium
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    Help & Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-base font-medium text-indigo-300 mb-3">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-200 hover:bg-indigo-500 hover:text-white transition-all duration-200"
                    title="Malappuram, Kerala, India"
                  >
                    <MapPin className="w-4 h-4" />
                    Location
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919898989898"
                    className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-200 hover:bg-indigo-500 hover:text-white transition-all duration-200"
                    title="+91 9898989898"
                  >
                    <Phone className="w-4 h-4" />
                    Phone
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:auditoriums@yuvo.com"
                    className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-md text-sm text-gray-200 hover:bg-indigo-500 hover:text-white transition-all duration-200"
                    title="auditoriums@yuvo.com"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-gray-400/80">
          <p>© {new Date().getFullYear()} YUVO Auditorium Listings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AudFooter;