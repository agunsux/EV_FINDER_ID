import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold tracking-tight text-white">
            EV Finder
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/explore" className="text-gray-400 hover:text-white transition-colors duration-200">
            Explore
          </Link>
          <Link to="/calculator" className="text-gray-400 hover:text-white transition-colors duration-200">
            Calculator
          </Link>
          <a href="#compare" className="text-gray-400 hover:text-white transition-colors duration-200">
            Compare
          </a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">
            About
          </a>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <button className="text-gray-400 hover:text-white focus:outline-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
