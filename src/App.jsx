
import React, { useState, useEffect } from 'react';
import Header from './components/Header'; 
import WhyCards from './components/WhyCards';
import ExploreData from './components/ExploreData';
import ContactForm from './components/ContactForm';
import DisasterAlerts from './components/DisasterAlerts';
import AuthModal from './components/AuthModal'; 
import { getAuthStatus, logoutMock } from './services/auth'; 

const LAND_POLLUTION_TYPES = [
    { key: 'All', label: 'Total Risk' },
    { key: 'Solid Waste', label: 'Solid Waste' },
    { key: 'Chemical', label: 'Chemical Pollution' },
];

export default function App() {
  const [selectedLayer, setSelectedLayer] = useState('air');
  const [mode, setMode] = useState('live');
  const [historicalYear, setHistoricalYear] = useState('2015');
  const [selectedLandType, setSelectedLandType] = useState('All');
  const [currentView, setCurrentView] = useState('map'); 
  const [disasterType, setDisasterType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(getAuthStatus());
  const [showAuthModal, setShowAuthModal] = useState(!getAuthStatus()); 


  const handleAuthSuccess = () => {
      setIsLoggedIn(true);
      setShowAuthModal(false);
  };

  const handleLogout = () => {
      logoutMock();
      setIsLoggedIn(false);
      setShowAuthModal(true);
  };

  const navigateTo = (view, type = null) => {
    setCurrentView(view);
    setDisasterType(type);
  };
  
  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
    if (layer !== 'land') {
      setSelectedLandType('All');
    }
    navigateTo('map');
  };


  const renderContent = () => {
    if (currentView === 'disaster') {
      return <DisasterAlerts disasterType={disasterType} />;
    }

    return (
      <>
        <section
          className="mb-12 relative rounded-xl overflow-hidden group transition-shadow duration-300 hover:shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(rgba(30,41,59,0.45), rgba(30,41,59,0.45)), url('/earth_image.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '3rem 2rem'
          }}
        >
          <h1
            className="text-3xl font-bold mb-2 text-white drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-110 group-active:scale-95 cursor-pointer"
          >
            Track Environmental Changes
          </h1>
          <p
            className="text-white max-w-2xl drop-shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 group-active:scale-95 cursor-pointer"
          >
            Ecomap visualizes air, water, and land pollution with real-time updates and historical comparisons, empowering proactive environmental stewardship.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Why Choose Ecomap</h2>
          <WhyCards />
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">Explore Data</h2>
          <div className="flex flex-wrap items-center space-x-4 mb-4">

            {/* Mode Switch (Live vs. Historical) */}
            <button
              onClick={() => setMode('live')}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${mode === 'live' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'}`}
            >
              Live Data
            </button>
            <button
              onClick={() => setMode('historical')}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${mode === 'historical' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'}`}
            >
              Historical
            </button>

            {/* Historical Year Selector */}
            {mode === 'historical' && (
              <select
                value={historicalYear}
                onChange={(e) => setHistoricalYear(e.target.value)}
                className="border border-gray-300 rounded-full p-2 text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="2015">2015 Data</option>
                <option value="2005">2005 Data</option>
              </select>
            )}

            {/* Land Pollution Type Filter */}
            {selectedLayer === 'land' && (
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {LAND_POLLUTION_TYPES.map(type => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedLandType(type.key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${
                      selectedLandType === type.key 
                        ? 'bg-blue-700 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}

          </div>
          {/* FIX: Simplified component usage to pass only necessary states */}
          <ExploreData 
            selectedLayer={selectedLayer} 
            mode={mode} 
            historicalYear={historicalYear} 
            selectedLandType={selectedLandType}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <ContactForm />
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      
      {/* 1. AUTHENTICATION MODAL */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />}
      
      {/* 2. HEADER: Passes auth state */}
      <Header 
        selectedLayer={selectedLayer} 
        setSelectedLayer={handleLayerChange} 
        navigateTo={navigateTo} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-6 flex-1">
        {renderContent()}
      </main>
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">© Ecomap</footer>
    </div>
  );
}