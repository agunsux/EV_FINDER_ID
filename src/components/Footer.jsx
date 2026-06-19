import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 bg-dark-bg">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-base font-medium tracking-tight text-white mb-2">
            EV Finder
          </span>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EV Finder Indonesia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
