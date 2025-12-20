import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#F9F3F1] py-16 px-6 md:px-12 lg:px-24 text-[#300E16]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo and App Download Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Logo */}
          <h2 className="text-5xl font-serif font-bold text-[#E91E63]">Shef</h2>

          <div className="max-w-sm">
            <h3 className="text-2xl md:text-3xl font-black leading-tight uppercase mb-6">
              Download our app and <br /> leave the rest to the shefs
            </h3>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <a href="#" className="transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-12"
                />
              </a>
              <a href="#" className="transition-transform hover:scale-105">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-12"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Learn Links */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest mb-6 opacity-60">
            Learn
          </h4>
          <ul className="space-y-4 font-semibold text-lg">
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Food Safety
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Customer Support
              </a>
            </li>
          </ul>
        </div>

        {/* Resources & Social Links */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-[#300E16] text-white rounded-full hover:bg-[#E91E63] transition-all"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-[#300E16] text-white rounded-full hover:bg-[#E91E63] transition-all"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-[#300E16] text-white rounded-full hover:bg-[#E91E63] transition-all"
            >
              <FaTiktok size={18} />
            </a>
          </div>

          <h4 className="font-bold text-xs uppercase tracking-widest mb-6 opacity-60">
            Resources
          </h4>
          <ul className="space-y-4 font-semibold text-lg">
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Become a shef
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Gift cards
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Homemade food delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E91E63] transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5">
        <p className="text-sm font-medium opacity-60">
          Shef, Inc. 2025. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
