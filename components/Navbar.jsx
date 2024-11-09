"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-lg h-16">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center pt-4">
        <div className="text-white text-2xl font-semibold">CP Club</div>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-white hover:text-teal-300 transition duration-300"
          >
            Leaderboard
          </Link>
          <Link
            href="/contest"
            className="text-white hover:text-teal-300 transition duration-300"
          >
            Contest
          </Link>
          <Link
            href="/resources"
            className="text-white hover:text-teal-300 transition duration-300"
          >
            Resources
          </Link>
        </div>

        <div className="md:hidden flex items-center" onClick={toggleMenu}>
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"} bg-gray-800 p-4`}
      >
        <Link
          href="/"
          className="block text-white hover:text-teal-300 transition duration-300 py-2"
        >
          Leaderboard
        </Link>
        <Link
          href="/contest"
          className="block text-white hover:text-teal-300 transition duration-300 py-2"
        >
          Contest
        </Link>
        <Link
          href="/resources"
          className="block text-white hover:text-teal-300 transition duration-300 py-2"
        >
          Resources
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
