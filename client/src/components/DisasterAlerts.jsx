// src/components/DisasterAlertsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, AlertTriangle, Waves, Droplet, Wind, Thermometer, User, Home, Shield, BookOpen } from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 
const USGS_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const OWM_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const OWM_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather'; 
const CITY_NAME = 'Ahmedabad,in';
const INDIA_BBOX = {
    minlatitude: 5, maxlatitude: 40, minlongitude: 60, maxlongitude: 100 
};
const MIN_MAGNITUDE = 4.5;

// Static/Simulated Alerts for Context
const NON_SEISMIC_ALERTS_STATIC = [
    { 
        id: 'Tsunami', type: 'Tsunami', risk: 'Low', location: 'Arabian Sea Coast', icon: '🌊', color: 'bg-green-50', border: 'border-green-600', 
        alert_text: 'Tsunami Watch: Low probability of impact. Localized risk remains for coastal areas (INCOIS advisory).',
        preparedness: [
            { group: 'Public', icon: <User className="w-4 h-4" />, text: "Know your evacuation routes and move immediately to higher ground if ground shaking occurs near the coast." },
            { group: 'Government', icon: <Shield className="w-4 h-4" />, text: "Ensure early warning sirens are tested and evacuation orders are clearly disseminated." },
            { group: 'Researcher', icon: <BookOpen className="w-4 h-4" />, text: "Monitor seismic data and tidal fluctuations for immediate impact assessment." }
        ]
    },
    { 
        id: 'Earthquake', type: 'Earthquake Zone', risk: 'Low', location: 'Kutch Region', icon: '💥', color: 'bg-gray-50', border: 'border-gray-500', 
        alert_text: 'Gujarat falls in a high seismic zone. No immediate alert, but preparedness is mandatory.',
        preparedness: [ 
            { group: 'Public', icon: <User className="w-4 h-4" />, text: "Practice DROP, COVER, AND HOLD ON drills. Secure heavy furniture." },
            { group: 'Government', icon: <Shield className="w-4 h-4" />, text: "Enforce strict adherence to seismic building codes in all construction projects." },
            { group: 'NGOs', icon: <Home className="w-4 h-4" />, text: "Conduct community disaster drill training in high-risk zones." }
        ]
    }
];

// Helper to determine severity status based on Magnitude (M) value
const getSeismicStatus = (mag) => {
    if (mag >= 6.0) return { risk: 'CRITICAL', color: 'bg-red-600', text: 'text-white', border: 'border-red-600' };
    if (mag >= 5.0) return { risk: 'HIGH', color: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' };
    if (mag >= 4.5) return { risk: 'CAUTION', color: 'bg-yellow-400', text: 'text-black', border: 'border-yellow-400' };
    return { risk: 'NONE', color: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-200' };
};


export default function DisasterAlertsPage({ disasterType }) {
    const [seismicData, setSeismicData] = useState([]);
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [openAlertId, setOpenAlertId] = useState(null);

    useEffect(() => {
        const fetchAlertData = async () => {
            try {
                const fetchCurrentWeather = axios.get(OWM_CURRENT_URL, {
                    params: { q: CITY_NAME, appid: API_KEY, units: 'metric' }
                }).catch(e => { return { data: null }; });

                const fetchWeatherForecast = axios.get(OWM_FORECAST_URL, {
                    params: { q: CITY_NAME, appid: API_KEY, units: 'metric' }
                }).catch(e => { return { data: null }; });
                
                const fetchSeismicData = axios.get(USGS_API_URL, {
                    params: { format: 'geojson', minmagnitude: MIN_MAGNITUDE, eventtype: 'earthquake', starttime: 'NOW - 7 days', ...INDIA_BBOX, orderby: 'time' }
                }).catch(e => { return { data: { features: [] } }; });


                const [currentRes, forecastRes, seismicRes] = await Promise.all([fetchCurrentWeather, fetchWeatherForecast, fetchSeismicData]);
                
                // --- Process Current Weather ---
                setCurrentWeather(currentRes.data);
                
                // --- Process Seismic Data ---
                setSeismicData(seismicRes.data?.features || []);

                // --- Process Weather Forecast into Alerts ---
                const alerts = [];
                const forecastList = forecastRes.data?.list || [];
                let maxTemp = -99, minTemp = 99, heavyRain = false;
                
                forecastList.forEach(item => {
                    const temp = item.main.temp;
                    const rain = item.rain?.['3h'] || 0; 
                    
                    if (temp > maxTemp) maxTemp = temp;
                    if (temp < minTemp) minTemp = temp;
                    if (rain >= 5) heavyRain = true;
                });

                // Generate Heatwave/Coldwave Alert
                if (maxTemp >= 42) {
                    alerts.push({ 
                        id: 'Heatwave', type: 'Heatwave Alert', risk: 'CRITICAL', icon: '🔥', color: 'bg-red-50', border: 'border-red-600', 
                        alert_text: `Extreme heat (${Math.round(maxTemp)}°C) forecasted for Central Gujarat.`, 
                        preparedness: [
                            { group: 'Public', icon: <User className="w-4 h-4" />, text: "Stay indoors, avoid sun exposure between 11 AM - 4 PM." },
                            { group: 'Gov/NGOs', icon: <Shield className="w-4 h-4" />, text: "Set up public cooling centers and check on the elderly." },
                            { group: 'Researcher', icon: <BookOpen className="w-4 h-4" />, text: "Monitor Urban Heat Island effect and localized temperature spikes." }
                        ] 
                    });
                } else if (minTemp <= 10) {
                     alerts.push({ 
                        id: 'Coldwave', type: 'Coldwave Alert', risk: 'CAUTION', icon: '🥶', color: 'bg-blue-50', border: 'border-blue-600', 
                        alert_text: `Cold wave conditions approaching. Temperatures may drop to ${Math.round(minTemp)}°C.`, 
                        preparedness: [
                            { group: 'Public', icon: <User className="w-4 h-4" />, text: "Wear multiple layers of clothing and insulate homes." },
                            { group: 'NGOs', icon: <Home className="w-4 h-4" />, text: "Distribute warm blankets and food to the homeless." }
                        ] 
                    });
                }

                // Generate Heavy Rain Alert
                if (heavyRain) {
                    alerts.push({ 
                        id: 'Rain', type: 'Heavy Rain/Flood', risk: 'HIGH', icon: '⛈️', color: 'bg-orange-50', border: 'border-orange-600', 
                        alert_text: `Heavy precipitation detected in 5-day forecast. Localized flooding possible.`, 
                        preparedness: [
                            { group: 'Public', icon: <User className="w-4 h-4" />, text: "Never drive through flood water; secure loose outdoor objects." },
                            { group: 'Government', icon: <Shield className="w-4 h-4" />, text: "Pre-deploy flood response teams and inspect drainage systems." }
                        ]
                    });
                }
                
                setWeatherAlerts(alerts);
            } catch (error) {
                console.error("General error during alert processing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlertData();
    }, [disasterType]);

    // Process live seismic data into alert objects (M4.5+ events)
    const liveAlerts = seismicData.slice(0, 3).map((feature, index) => {
        const mag = feature.properties.mag;
        const place = feature.properties.place;
        const time = new Date(feature.properties.time).toLocaleString();
        const status = getSeismicStatus(mag);

        return {
            id: `eq-${index}`,
            type: 'Earthquake Alert',
            risk: status.risk,
            icon: '💥',
            color: status.color,
            border: status.border,
            alert_text: `M ${mag.toFixed(1)} detected near ${place} at ${time}.`,
            preparedness: [
                { group: 'Public', icon: <User className="w-4 h-4" />, text: "DROP, COVER, AND HOLD ON immediately." },
                { group: 'Gov/NGOs', icon: <Shield className="w-4 h-4" />, text: "Prepare rescue teams and verify infrastructure stability." }
            ]
        };
    });

    // Combine all alert types for display
    const allAlerts = [...liveAlerts, ...weatherAlerts, ...NON_SEISMIC_ALERTS_STATIC];

    // Filtering logic
    const filteredAlerts = allAlerts.filter(alert => {
        if (!disasterType || disasterType === 'All') return true; 

        const alertTypeLower = alert.type.toLowerCase();
        const filterTypeLower = disasterType.toLowerCase();

        if (filterTypeLower === 'flood' || filterTypeLower === 'heavy rain') {
            return alertTypeLower.includes('rain') || alertTypeLower.includes('flood');
        }
        if (filterTypeLower === 'heatwave' || filterTypeLower === 'coldwave') {
            return alertTypeLower.includes('heatwave') || alertTypeLower.includes('coldwave');
        }
        
        return alertTypeLower.includes(filterTypeLower);
    });

    const toggleAlert = (id) => {
        setOpenAlertId(openAlertId === id ? null : id);
    };

    const mostSignificantSeismic = seismicData.length > 0 ? seismicData[0].properties : null;
    const bannerStatus = mostSignificantSeismic ? getSeismicStatus(mostSignificantSeismic.mag) : { risk: 'NONE', color: 'bg-gray-200', text: 'text-gray-800' };

    return (
        <div className="space-y-6 max-w-6xl py-4">
            
            {/* Real-time Notification Banner for Most Significant Event */}
            {mostSignificantSeismic && mostSignificantSeismic.mag >= 4.5 && (
                <div className={`p-4 rounded-xl shadow-2xl flex items-center justify-between ${bannerStatus.color}`}>
                    <div className={`font-extrabold text-2xl flex items-center ${bannerStatus.text}`}>
                        <AlertTriangle className='w-7 h-7 mr-3' /> 
                        LIVE SEISMIC ALERT: M{mostSignificantSeismic.mag.toFixed(1)}
                    </div>
                    <div className={`text-sm font-semibold ${bannerStatus.text}`}>
                        {mostSignificantSeismic.place} ({new Date(mostSignificantSeismic.time).toLocaleTimeString()})
                    </div>
                </div>
            )}
            
            <h1 className="text-3xl font-bold text-red-700">
                {disasterType ? `${disasterType} Alerts & Preparedness` : `All Natural Disaster Alerts`}
            </h1>

            {/* Local Weather Conditions Section */}
            {currentWeather && (
                <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-3 text-blue-700">Current Weather in {currentWeather.name}</h2>
                    <div className="flex justify-around items-center text-gray-700">
                        <div className="text-center">
                            <Thermometer className="w-6 h-6 mx-auto text-red-500" />
                            <p className="text-3xl font-bold mt-1">{Math.round(currentWeather.main.temp)}°C</p>
                            <p className="text-sm">{currentWeather.weather[0].main}</p>
                        </div>
                        <div className="text-center">
                            <Wind className="w-6 h-6 mx-auto text-green-500" />
                            <p className="text-lg font-bold mt-1">{Math.round(currentWeather.wind.speed * 3.6)} km/h</p>
                            <p className="text-sm">Wind Speed</p>
                        </div>
                        <div className="text-center">
                            <Droplet className="w-6 h-6 mx-auto text-blue-500" />
                            <p className="text-lg font-bold mt-1">{currentWeather.main.humidity}%</p>
                            <p className="text-sm">Humidity</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <p className="text-lg text-gray-600 md:col-span-2">Fetching live seismic and weather alerts...</p>
                ) : (
                    filteredAlerts.map(alert => (
                        <div 
                            key={alert.id} 
                            className={`rounded-xl shadow-lg transition-all duration-100 overflow-hidden ${alert.color} border-l-8 ${alert.border}`}
                        >
                            {/* Alert Status Header */}
                            <div 
                                className="p-4 cursor-pointer flex justify-between items-center" 
                                onClick={() => toggleAlert(alert.id)}
                            >
                                <div>
                                    <div className="font-bold text-lg flex items-center">
                                        <span className="text-3xl mr-2">{alert.icon}</span>
                                        {alert.type} 
                                        <span className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            alert.risk === 'CRITICAL' ? 'bg-red-200 text-red-800' : 
                                            alert.risk === 'HIGH' ? 'bg-orange-200 text-orange-800' :
                                            'bg-gray-200 text-gray-700'
                                        }`}>
                                            {alert.risk}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1 text-gray-600">{alert.alert_text}</p>
                                </div>
                                <ChevronDown 
                                    className={`w-5 h-5 ml-4 text-gray-700 transform transition-transform duration-300 ${openAlertId === alert.id ? 'rotate-180' : ''}`} 
                                />
                            </div>

                            {/* Preparedness Content (Accordion) */}
                            {openAlertId === alert.id && (
                                <div className="p-4 pt-0 border-t border-gray-200 bg-white">
                                    <h4 className="font-bold text-md mb-2 pt-2 text-gray-900">Action Plan for Stakeholders:</h4>
                                    <ul className="space-y-2">
                                        {alert.preparedness.map((step, index) => (
                                            <li key={index} className="flex items-start text-sm text-gray-700">
                                                {/* Visual icons for different stakeholders */}
                                                <span className="mr-2 mt-0.5">{step.icon}</span>
                                                <div className='flex-1'>
                                                    <span className='font-semibold'>{step.group}:</span> {step.text}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            
            <div className="mt-8 p-4 bg-blue-100 rounded-lg text-blue-800 text-sm">
                *Data Source: **LIVE** alerts for earthquakes (M{MIN_MAGNITUDE}+) are provided by the USGS. Weather alerts are derived from **OpenWeatherMap forecasts** (illustrative of IMD warnings). Tsunami alerts are simulated.
            </div>
        </div>
    );
}