
import React, { useState, useEffect } from 'react';
import Header from './components/Header'; 
import WhyCards from './components/WhyCards';
import ExploreData from './components/ExploreData';
import ContactForm from './components/ContactForm';
import DisasterAlerts from './components/DisasterAlerts';
import AuthModal from './components/AuthModal'; 
import LearnMore from './components/LearnMore';
import ContactPage from './components/ContactPage';
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
    if (currentView === 'learn') {
      return <LearnMore onBack={() => navigateTo('map')} />
    }
    if (currentView === 'contact') {
      return <ContactPage onBack={() => navigateTo('map')} />
    }

    return (
      <>
        <section className="mb-12 relative rounded-2xl overflow-hidden group shadow-xl">
          {/* Parallax/animated hero background */}
          <div 
            className="absolute inset-0 bg-[url('/earth_image.jpg')] bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60" aria-hidden="true" />
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-emerald-400/30 blur-3xl animate-float-slow" aria-hidden="true" />
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl animate-float-fast" aria-hidden="true" />

          <div className="relative p-10 md:p-14 min-h-[340px] flex flex-col items-start justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white drop-shadow-xl">
              Track Environmental Changes
            </h1>
            <p className="text-white/90 max-w-2xl text-lg">
              Ecomap visualizes air, water, and land pollution with real-time updates and historical comparisons, empowering proactive environmental stewardship.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => navigateTo('learn')} className="px-5 py-3 rounded-xl bg-[#5ca189b3] backdrop-blur text-white font-semibold border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all">Learn more</button>
            </div>
          </div>
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

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <ContactForm />
        </section>
      </>
    );
  };

  // Gate entire app: if not logged in, show only the login experience
  if (showAuthModal) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-50">
        <AuthModal onClose={() => {}} onAuthSuccess={handleAuthSuccess} canClose={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Header and main content only after login */}
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