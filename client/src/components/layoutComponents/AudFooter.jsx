import React from "react";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

const AudFooter = () => {
  return (
    <footer className="bg-gray-950 text-white py-10 px-6 mt-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-purple-500 mb-3">
            YUVO Auditoriums
          </h2>
          <p className="text-sm text-gray-300">
            Discover, compare, and book auditoriums across Kerala for your
            events. Powered by YUVO Event Management.
          </p>
        </div>

        {/* Auditorium Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Auditorium Types</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="hover:text-purple-400">
                Wedding Halls
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Conference Centres
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Banquet Halls
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Community Auditoriums
              </a>
            </li>
          </ul>
        </div>

        {/* Explore Auditoriums */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#" className="hover:text-purple-400">
                Nearby Auditoriums
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Top Rated Venues
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Add Your Auditorium
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Help & Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="text-sm text-gray-300 space-y-3">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-purple-400" />
              Malappuram, Kerala
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              +91 9898989898
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              auditoriums@yuvo.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 mt-10 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YUVO Auditorium Listings. All rights
        reserved.
      </div>
    </footer>
  );
};

export default AudFooter;
