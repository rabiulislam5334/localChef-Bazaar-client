import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import { Mail, Phone, MapPin, ArrowRight, UtensilsCrossed } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FDFCFB] pt-24 pb-12 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* --- Top Section: Branding & Newsletter --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 space-y-8">
            {/* Logo */}
            <div className="flex gap-2 items-center">
              <div className="bg-[#422ad5] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#422ad5]/20">
                <UtensilsCrossed size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 italic">
                LocalChef<span className="text-[#422ad5]">Bazaar</span>
              </span>
            </div>

            <p className="text-gray-500 text-lg max-w-md leading-relaxed">
              Connecting you with the best local chefs in your neighborhood.
              Authentic flavors, delivered with love and care.
            </p>

            {/* App Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#" className="transition-transform hover:-translate-y-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a href="#" className="transition-transform hover:-translate-y-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Explore Links */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
                Explore
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Safety First
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Chef Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
                Support
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Become a Chef
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#422ad5] transition-colors"
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
                Contact
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-[#422ad5]" /> +1 (555)
                  000-111
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-[#422ad5]" />{" "}
                  hello@chef-bazaar.com
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#422ad5]" /> Dhaka,
                  Bangladesh
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Section: Socials & Copyright --- */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <SocialBtn icon={<FaFacebookF size={18} />} />
            <SocialBtn icon={<FaInstagram size={18} />} />
            <SocialBtn icon={<FaTwitter size={18} />} />
            <SocialBtn icon={<FaTiktok size={18} />} />
          </div>

          {/* Newsletter (Compact) */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1.5 w-full max-w-sm">
            <input
              type="email"
              placeholder="Join our newsletter"
              className="bg-transparent pl-4 pr-2 py-2 outline-none w-full text-sm font-medium"
            />
            <button className="bg-[#422ad5] text-white p-2.5 rounded-full hover:bg-black transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Copyright */}
          <p className="text-sm font-bold text-gray-400">
            © 2025 LocalChefBazaar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Social Button Helper
const SocialBtn = ({ icon }) => (
  <a
    href="#"
    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[#422ad5] hover:border-[#422ad5] hover:shadow-lg transition-all"
  >
    {icon}
  </a>
);

export default Footer;
