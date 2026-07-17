// src/components/MenuHeader.jsx

import React, { useState } from 'react';
// FIX: Ensure Menu and X icons are imported
import { ChevronDown, LogOut, LogIn, Menu, X, AlertTriangle, Mail, ThermometerSun, CloudRain, Waves, Activity } from 'lucide-react'; 

export default function Header({ selectedLayer, setSelectedLayer, navigateTo, isLoggedIn, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDisasterSubOpen, setIsDisasterSubOpen] = useState(false);
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

  const MenuDropdown = (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-900 text-white shadow-md hover:bg-black transition-colors"
      >
        Menu
        <ChevronDown className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-[101]">
          {/* Disaster Alerts parent with nested submenu */}
          <div className="relative">
            <button 
              onMouseEnter={() => setIsDisasterSubOpen(true)}
              onMouseLeave={() => setIsDisasterSubOpen(false)}
              onClick={() => setIsDisasterSubOpen(!isDisasterSubOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-gray-50"
            >
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /> Disaster Alerts</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDisasterSubOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDisasterSubOpen && (
              <div 
                className="absolute left-0 top-full mt-2 w-full md:w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2"
                onMouseEnter={() => setIsDisasterSubOpen(true)}
                onMouseLeave={() => setIsDisasterSubOpen(false)}
              >
                <button onClick={() => { handleDisasterClick('Heatwave'); setIsDropdownOpen(false); setIsDisasterSubOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
                  <ThermometerSun className="w-4 h-4 text-orange-600" /> <span>Heatwave / Coldwave</span>
                </button>
                <button onClick={() => { handleDisasterClick('Flood'); setIsDropdownOpen(false); setIsDisasterSubOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
                  <CloudRain className="w-4 h-4 text-blue-600" /> <span>Gujarat Flood & Weather</span>
                </button>
                <button onClick={() => { handleDisasterClick('Tsunami'); setIsDropdownOpen(false); setIsDisasterSubOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
                  <Waves className="w-4 h-4 text-cyan-600" /> <span>Tsunami Alerts</span>
                </button>
                <button onClick={() => { handleDisasterClick('Earthquake'); setIsDropdownOpen(false); setIsDisasterSubOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
                  <Activity className="w-4 h-4 text-red-700" /> <span>Earthquake Zones</span>
                </button>
              </div>
            )}
          </div>
          <button onClick={() => { setIsDropdownOpen(false); navigateTo('contact'); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
            <Mail className="w-4 h-4 text-emerald-600" /> Contact Us
          </button>
          {isLoggedIn ? (
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50">
              <LogOut className="w-4 h-4 text-gray-700" /> Logout
            </button>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Open login'); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
              <LogIn className="w-4 h-4 text-gray-700" /> Login
            </a>
          )}
        </div>
      )}
    </div>
  );


  return (
    <header className="sticky top-0 z-[100] backdrop-blur-xl border-b border-white/50 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)]" style={{ backgroundColor: '#d0e1f8d1' }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="font-extrabold text-xl flex items-center cursor-pointer group" onClick={() => navigateTo('map', 'air')}>
          <span className="text-3xl mr-2">🌍</span>
          <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-cyan-700 transition-colors">Ecomap</span>
        </div>
        
        {/* Mobile Menu Button (Visible on small screens) */}
        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 items-center">
          {/* Only Air, Water, Land */}
          <div className="flex space-x-2 sm:space-x-3">
            {['air', 'water', 'land'].map(layer => (
              <button
                key={layer}
                onClick={() => handleLayerClick(layer)} 
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedLayer === layer && window.location.pathname === '/' 
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } hover:scale-[1.02] active:scale-[0.98]`}
              >
                {layer.charAt(0).toUpperCase() + layer.slice(1)}
              </button>
            ))}
          </div>
          {/* Single Menu Dropdown */}
          {MenuDropdown}
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
          <div className="mt-4 border-t pt-4 space-y-2">
            <div className="text-xs font-semibold text-gray-500 px-1">Disaster Alerts</div>
            <button onClick={() => handleDisasterClick('Heatwave')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 border">
              <ThermometerSun className='w-4 h-4 text-orange-600' /> Heatwave / Coldwave
            </button>
            <button onClick={() => handleDisasterClick('Flood')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 border">
              <CloudRain className='w-4 h-4 text-blue-600' /> Gujarat Flood & Weather
            </button>
            <button onClick={() => handleDisasterClick('Tsunami')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 border">
              <Waves className='w-4 h-4 text-cyan-600' /> Tsunami Alerts
            </button>
            <button onClick={() => handleDisasterClick('Earthquake')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 border">
              <Activity className='w-4 h-4 text-red-700' /> Earthquake Zones
            </button>
            <button onClick={() => navigateTo('contact')} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <Mail className='w-4 h-4' /> Contact Us
            </button>
            {isLoggedIn ? (
              <button onClick={onLogout} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 flex items-center gap-2">
                <LogOut className='w-4 h-4' /> Logout
              </button>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Open login'); }} className=" w-full px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <LogIn className='w-4 h-4' /> Login
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
