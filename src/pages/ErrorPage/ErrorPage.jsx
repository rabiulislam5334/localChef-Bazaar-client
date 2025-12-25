import React from "react";
import errorimg from "../../assets/error-404.png";
import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react"; // আইকন যোগ করা হয়েছে

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] px-6">
      <div className="max-w-3xl w-full text-center">
        {/* ইমেজের সাইজ এবং এনিমেশন */}
        <div className="relative mb-12 animate-bounce-slow">
          <img
            src={errorimg}
            alt="404 Error"
            className="mx-auto w-full max-w-md drop-shadow-2xl"
          />
        </div>

        {/* টেক্সট সেকশন */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-[#422ad5] font-serif">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* বাটন সেকশন */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
          <Link
            to="/"
            className="flex items-center gap-2 px-10 py-4 bg-[#422ad5] hover:bg-[#331eb3] text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto justify-center"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-10 py-4 bg-white border-2 border-gray-100 hover:border-[#422ad5]/20 text-gray-600 font-bold rounded-2xl transition-all w-full md:w-auto justify-center"
          >
            <ArrowLeft size={20} />
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
