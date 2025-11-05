import React from 'react';
import logo from '@/assets/dylkxxi7zp9g8gwingsz.png';
import Logout from './Logout';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50 flex items-center justify-between px-6 py-3">
      {/* 🖼️ Logo */}
      <div className="flex items-center">
        <div className="bg-gray-100 rounded-xl p-2 flex items-center justify-center shadow-sm">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>

      {/* 🔴 Bouton Déconnexion */}
      <div className="flex items-center">
        <Logout />
      </div>
    </nav>
  );
};

export default Navbar;
