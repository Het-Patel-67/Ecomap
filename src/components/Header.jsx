// src/components/MenuHeader.jsx

import React, { useState } from 'react';
// FIX: Ensure Menu and X icons are imported
import { ChevronDown, LogOut, Menu, X } from 'lucide-react'; 

export default function Header({ selectedLayer, setSelectedLayer, navigateTo, isLoggedIn, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLayerClick = (layer) => {
    setSelectedLayer(layer);
    navigateTo('map'); 
    setIsMenuOpen(false); 
  };

  const handleDisasterClick = (type) => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false); 
    navigateTo('disaster', type);
  };

  const DisasterDropdownContent = (
      <div className="relative ">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors w-full justify-center md:w-auto"
        >
          🚨 Disaster Alerts 
          <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute md:right-0 mt-2 w-full md:w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-[101]">
            <a href="#alerts" onClick={() => handleDisasterClick('Heatwave')} className="block px-4 py-2 text-gray-800 hover:bg-red-50">
              🌡️ Heatwave / Coldwave
            </a>
            <a href="#alerts" onClick={() => handleDisasterClick('Flood')} className="block px-4 py-2 text-gray-800 hover:bg-red-50">
              🌧️ Heavy Rain / Flood
            </a>
            <a href="#alerts" onClick={() => handleDisasterClick('Tsunami')} className="block px-4 py-2 text-gray-800 hover:bg-red-50">
              🌊 Tsunami / Cyclone
            </a>
            <a href="#alerts" onClick={() => handleDisasterClick('Earthquake')} className="block px-4 py-2 text-gray-800 hover:bg-red-50">
              💥 Earthquake Zones
            </a>
          </div>
        )}
      </div>
  );


  return (
    <header className="bg-[#d0e1f8d1] shadow-md sticky top-0 z-[100]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="font-extrabold text-xl text-blue-700 flex items-center cursor-pointer" onClick={() => navigateTo('map', 'air')}>
          <span className="text-3xl mr-2">🌍</span> Ecomap
        </div>
        
        {/* Mobile Menu Button (Visible on small screens) */}
        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {/* Desktop Navigation (Hidden on small screens) */}
        <div className="hidden md:flex space-x-6 items-center">
          
          {/* Pollution Layer Buttons (Desktop) */}
          <div className="flex space-x-2 sm:space-x-4">
            {['air', 'water', 'land'].map(layer => (
              <button
                key={layer}
                onClick={() => handleLayerClick(layer)} 
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedLayer === layer && window.location.pathname === '/' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {layer.charAt(0).toUpperCase() + layer.slice(1)}
              </button>
            ))}
          </div>

          {/* Disaster Dropdown (Desktop) */}
          {DisasterDropdownContent}

          {/* Logout Button (Conditional) */}
          {isLoggedIn && (
            <button
                onClick={onLogout}
                className="px-4 py-2 rounded-full text-sm font-bold bg-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center"
            >
                <LogOut className='w-4 h-4 mr-1' /> Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Menu Overlay (Conditionally rendered) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4 px-4 border-t border-gray-200">
          
          {/* Pollution Layer Buttons (Mobile - Stacked) */}
          <div className="flex flex-col space-y-2 mt-2">
            {['air', 'water', 'land'].map(layer => (
              <button
                key={layer}
                onClick={() => handleLayerClick(layer)} 
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedLayer === layer 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {layer.charAt(0).toUpperCase() + layer.slice(1)} Pollution
              </button>
            ))}
          </div>
          
          <div className="mt-4 border-t pt-4">
            {DisasterDropdownContent}
            {isLoggedIn && (
                 <button
                    onClick={onLogout}
                    className="w-full mt-2 text-left px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 flex items-center space-x-2"
                >
                    <LogOut className='w-4 h-4' /> <span>Logout</span>
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}