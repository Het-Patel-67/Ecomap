import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion'; 
import pollutionData from '../../pollutionData.json'; 
import historicalData from '../../historicalData.json'; 
import indiaDistricts from '../../india_districts.json'; 
import sabarmatiRiver from '../../sabarmati_river.json'; 
import axios from 'axios';

// --- Configuration ---
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
// Use the STABLE v1 endpoint
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

// Helper for name normalization
const normalize = (str) => (str ? str.toLowerCase().replace(/\s+/g, '') : ''); 

// --- Data Lists & Constants ---
// Full 33 districts list is assumed to be fully present here for functionality.
const monitorLocations = [
  { name: "Ahmedabad City", district: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Surat City", district: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Vadodara City", district: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot City", district: "Rajkot", lat: 22.3094, lng: 70.7911 },
  { name: "Bhavnagar City", district: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
  { name: "Jamnagar City", district: "Jamnagar", lat: 22.4707, lng: 70.0577 },
  { name: "Gandhinagar City", district: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { name: "Anand City", district: "Anand", lat: 22.5645, lng: 72.9568 },
  { name: "Kutch District", district: "Kutch", lat: 23.7337, lng: 70.2227 },
  { name: "Valsad City", district: "Valsad", lat: 20.6033, lng: 72.9840 },
  { name: "Amreli", district: "Amreli", lat: 21.6000, lng: 71.2500 },
  { name: "Aravalli", district: "Aravalli", lat: 23.5937, lng: 73.3074 },
  { name: "Banaskantha", district: "Banaskantha", lat: 24.1600, lng: 72.3300 },
  { name: "Bharuch", district: "Bharuch", lat: 21.7000, lng: 72.9800 },
  { name: "Botad", district: "Botad", lat: 22.1740, lng: 71.6660 },
  { name: "Chhota Udaipur", district: "Chhota Udaipur", lat: 22.3060, lng: 73.7430 },
  { name: "Dahod", district: "Dahod", lat: 22.8300, lng: 74.2600 },
  { name: "Dang", district: "Dang", lat: 20.7500, lng: 73.8500 },
  { name: "Devbhoomi Dwarka", district: "Devbhoomi Dwarka", lat: 22.3700, lng: 69.0000 },
  { name: "Gir Somnath", district: "Gir Somnath", lat: 20.9000, lng: 70.5000 },
  { name: "Junagadh", district: "Junagadh", lat: 21.5200, lng: 70.4700 },
  { name: "Kheda", district: "Kheda", lat: 22.7500, lng: 72.7000 },
  { name: "Mahisagar", district: "Mahisagar", lat: 23.0886, lng: 73.5973 },
  { name: "Mehsana", district: "Mehsana", lat: 23.6000, lng: 72.3800 },
  { name: "Morbi", district: "Morbi", lat: 22.8200, lng: 73.0800 },
  { name: "Narmada", district: "Narmada", lat: 21.8500, lng: 73.4700 },
  { name: "Navsari", district: "Navsari", lat: 20.9500, lng: 72.9300 },
  { name: "Panchmahal", district: "Panchmahal", lat: 22.7700, lng: 73.6100 },
  { name: "Patan", district: "Patan", lat: 23.8300, lng: 72.1000 },
  { name: "Porbandar", district: "Porbandar", lat: 21.6400, lng: 69.6100 },
  { name: "Sabarkantha", district: "Sabarkantha", lat: 23.6000, lng: 73.0200 },
  { name: "Surendranagar", district: "Surendranagar", lat: 22.7000, lng: 71.6500 },
  { name: "Tapi", district: "Tapi", lat: 21.1500, lng: 73.4000 }
];

const sabarmatiStations = [
    { id: 1, station: "Sabarmati (Upstream)", lat: 23.2156, lng: 72.6369 },
    { id: 2, station: "Sabarmati (Ahmedabad)", lat: 23.0225, lng: 72.5714 },
    { id: 3, "station": "Sabarmati (Downstream)", lat: 22.8464, lng: 72.6338 }
];

const center = [22.2587, 71.1924]; 
const AQI_DESCRIPTORS = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };

// SOLUTION CONTENT (Defined in global scope)
const SOLUTION_CONTENT = {
    'air': [
        { risk: 4, title: "Immediate Emission Reduction", icon: "🚗💨", detail: "Governments should enforce odd-even vehicle restrictions and temporary shutdown of construction sites to reduce PM2.5 concentrations." },
        { risk: 2, title: "Long-Term Air Quality Planning", icon: "🌱", detail: "Focus on renewable energy adoption, public transport expansion, and urban greening projects." }
    ],
    'water': [
        { risk: 5, title: "CRITICAL: Health Warning", icon: "⚠️", detail: "Avoid consumption or contact with river water. Municipal bodies must immediately verify and stop the discharge of untreated sewage and industrial effluents." },
        { risk: 3, title: "Monitoring and Treatment", icon: "🧪", detail: "Increased GPCB monitoring frequency at discharge points. Investment in decentralized sewage treatment plants (STPs) in industrial estates." }
    ],
    'land': [
        { risk: 5, type: 'Solid Waste', title: "EMERGENCY DUMPSITE REMEDIATION", icon: "🗑️🔥", detail: "Allocate immediate ring-fenced funds for bio-mining and site capping. Public: Strict adherence to plastic ban and source segregation." },
        { risk: 5, type: 'Chemical', title: "INDUSTRY AUDIT & ENFORCEMENT", icon: "🏭⚖️", detail: "Authorities must conduct unscheduled audits of highly polluting industrial clusters (Ankleshwar, Vapi). NGOs can file public interest litigation." },
        { risk: 2, type: 'All', title: "Promote Circular Economy", icon: "♻️", detail: "Encourage e-waste recycling programs and subsidized composting for households to reduce landfill burden." }
    ]
};

// --- Color and Value Helpers ---

const getAqiColor = (aqi) => {
    if (aqi === 0 || aqi === null) return '#A0AEC0'; 
    if (aqi <= 2) return '#10B981'; 
    if (aqi === 3) return '#F59E0B'; 
    return '#DC2626'; 
};

const getWaterColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('critically polluted') || s.includes('highly polluted')) return 'darkred';
    if (s.includes('polluted')) return 'red';
    if (s.includes('moderate')) return 'orange';
    return 'blue'; 
};

const getAqiValue = (dataPoint) => {
    if (!dataPoint) return 0;
    
    if (dataPoint.data) {
        return dataPoint.data.list?.[0]?.main?.aqi || 0;
    }
    
    return dataPoint.aqi || 0;
};

const getLandScoreForFilter = (dataPoint, selectedLandType) => {
    if (!dataPoint || !dataPoint.land_pollution) return 0;
    
    const landData = dataPoint.land_pollution;

    if (selectedLandType === 'Solid Waste') {
        return landData.solid_waste_score || 0;
    }
    if (selectedLandType === 'Chemical') {
        return landData.chemical_score || 0;
    }

    const solidScore = landData.solid_waste_score || 0;
    const chemicalScore = landData.chemical_score || 0;

    return Math.max(solidScore, chemicalScore);
};

// --- API Functions ---
const fetchWeather = async (setWeather, API_KEY) => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad,in&appid=${API_KEY}&units=metric`);
        setWeather(res.data);
    } catch (err) {
        console.error('Weather API error', err);
    }
};

const fetchAllAirPollution = async (setLiveAirDataList, API_KEY) => {
    const airFetches = monitorLocations.map(async (loc) => {
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`
            );
            return { ...loc, data: res.data }; 
        } catch (err) {
            return { ...loc, data: null };
        }
    });
    const results = await Promise.all(airFetches);
    setLiveAirDataList(results);
};

const fetchLiveWaterData = async (setLiveWaterData, waterDataSource) => {
    setLiveWaterData(waterDataSource); 
};

// --- Solutions Panel Renderer (Defined outside the main component) ---
const renderSolutionsPanel = (currentPollutionData, selectedLayer, selectedLandType, triggerImpactReport, reportStatus, impactReport) => {
    const getHighestRiskScore = (data, layer, landType) => {
        let maxScore = 0;
        
        if (layer === 'air' && data.air) {
            maxScore = data.air.map(item => getAqiValue(item)).reduce((a, b) => Math.max(a, b), 0);
        }
        
        if (layer === 'land' && data.land) {
            maxScore = data.land.map(item => getLandScoreForFilter(item, landType)).reduce((a, b) => Math.max(a, b), 0);
        }

        if (layer === 'water' && data.water) {
             const statusScores = data.water.map(p => {
                const s = p.status.toLowerCase();
                if (s.includes('critically polluted')) return 5;
                if (s.includes('highly polluted') || s.includes('polluted')) return 4;
                if (s.includes('moderate')) return 3;
                return 1;
             });
             maxScore = statusScores.length > 0 ? Math.max(...statusScores) : 1;
        }

        return maxScore;
    };

    const currentRiskScore = getHighestRiskScore(currentPollutionData, selectedLayer, selectedLandType);
    const riskStatus = AQI_DESCRIPTORS[currentRiskScore] || 'Low';

    const solutions = SOLUTION_CONTENT[selectedLayer]?.filter(sol => {
        if (selectedLayer === 'land' && sol.type) {
            if (selectedLandType === 'All') return sol.risk <= currentRiskScore;
            return sol.type === selectedLandType && sol.risk <= currentRiskScore;
        }
        return sol.risk <= currentRiskScore;
    });

    const isHighRisk = currentRiskScore >= 4;
    const districtForReport = monitorLocations.find(loc => 
        (currentPollutionData.air.find(item => getAqiValue(item) === currentRiskScore) || currentPollutionData.land.find(item => getLandScoreForFilter(item, 'All') === currentRiskScore))
    )?.district || 'Gujarat';


    return (
        <>
            <p className="text-sm text-gray-600 mb-3">
                Current Risk Level: <span className="font-bold" style={{color: getAqiColor(currentRiskScore)}}>{riskStatus} ({currentRiskScore}/5)</span>
            </p>
            
            {/* GEMINI IMPACT REPORT BUTTON AND OUTPUT */}
            {isHighRisk && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <button 
                        onClick={() => triggerImpactReport(districtForReport, currentRiskScore, selectedLayer)}
                        disabled={reportStatus === 'loading'}
                        className={`w-full py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2 ${reportStatus === 'loading' ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {reportStatus === 'loading' ? (
                            <>
                                <span className="animate-spin">⚙️</span>
                                <span>Generating Report...</span>
                            </>
                        ) : (
                            <>
                                <span>✨ Generate Impact Analysis</span>
                            </>
                        )}
                    </button>

                    {reportStatus === 'success' && impactReport && (
                        <div className="mt-3 text-xs p-2 bg-white rounded border border-green-300 shadow-inner">
                            <h4 className="font-bold text-green-700">Immediate Impact Summary:</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{impactReport}</p>
                        </div>
                    )}
                    {reportStatus === 'error' && <p className="mt-2 text-xs text-red-600">Error generating report. Please check your Gemini API key and console for details.</p>}
                </div>
            )}


            {solutions?.map((sol, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <div className="font-semibold text-gray-800 flex items-center mb-1">
                        <span className="text-xl mr-2">{sol.icon}</span> 
                        {sol.title}
                    </div>
                    <p className="text-xs text-gray-600">
                        {sol.detail}
                    </p>
                </div>
            ))}

            {(currentRiskScore === 1 || solutions?.length === 0) && (
                <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                    ✅ Data shows low risk. Maintain conservation and green infrastructure practices.
                </p>
            )}
        </>
    );
};


// --- React Component ---

export default function ExploreData({ selectedLayer, mode, historicalYear, selectedLandType }) {
  const [weather, setWeather] = useState(null);
  const [liveAirDataList, setLiveAirDataList] = useState(null); 
  const [liveWaterData, setLiveWaterData] = useState(null);   
  const [loading, setLoading] = useState(true); 
  
  // NEW GEMINI STATE
  const [impactReport, setImpactReport] = useState(null);
  const [reportStatus, setReportStatus] = useState('idle'); // idle, loading, success, error

  const isLive = mode === 'live';
  
  // Memoized GeoJSON Filter
  const gujaratDistricts = useMemo(() => {
    if (!indiaDistricts || !indiaDistricts.features) return { type: "FeatureCollection", features: [] };
    const features = indiaDistricts.features.filter(
      feature => feature.properties.st_nm === "Gujarat" 
    );
    return { type: "FeatureCollection", features };
  }, [indiaDistricts]); 

  // Data Source Consolidation
  const historicalAir = historicalData[historicalYear]?.air;
  const historicalWater = historicalData[historicalYear]?.water;
  const historicalLand = historicalData[historicalYear]?.land || []; 

  const waterDataSource = historicalData['2015']?.water; 
  
  const currentPollutionData = {
    air: isLive ? (liveAirDataList || []) : (historicalAir || []),
    water: isLive ? (liveWaterData || waterDataSource || []) : (historicalWater || []),
    land: isLive ? (pollutionData.landPollution || []) : (historicalLand || [])
  };

    // --- GEMINI API CALL FUNCTION ---
  // --- GEMINI API CALL FUNCTION ---
const generateImpactReport = async (district, score, layer) => {
  if (reportStatus === 'loading') return;
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
    setReportStatus('error');
    setImpactReport("Error: Gemini API Key missing or invalid. Check your .env file.");
    return;
  }

  setReportStatus('loading');
  setImpactReport(null);

  const systemPrompt = `You are a public health and economic analyst specializing in Gujarat, India. 
  Analyze environmental risk data (1-5 scale) and generate a concise, single-paragraph report (max 100 words) 
  on the immediate health and economic impact for the local government and general public. 
  Use urgent and professional language.`;

  const userQuery = `Current risk score for ${layer} pollution in ${district} district, Gujarat is ${score}/5. 
  The current mode is ${mode}. Describe the most severe short-term consequences.`;

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userQuery}` }]
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      setImpactReport(text);
      setReportStatus("success");
    } else {
      setImpactReport("⚠️ Gemini API did not return a valid response.");
      setReportStatus("error");
    }
  } catch (err) {
    console.error("Gemini API call failed:", err);
    setReportStatus("error");
    setImpactReport(`Generation failed: ${err.message}`);
  }
};



  useEffect(() => {
    
    const loadData = async () => {
        setLoading(true);

        if (isLive) {
            await Promise.all([
                fetchAllAirPollution(setLiveAirDataList, API_KEY),
                fetchWeather(setWeather, API_KEY),
                fetchLiveWaterData(setLiveWaterData, waterDataSource),
            ]);
        }
        
        setTimeout(() => {
            setLoading(false);
        }, 100); 
    };
    
    loadData();

  }, [isLive, historicalYear]); 


  // --- GeoJSON Rendering Logic ---
  
  const renderGeoJSON = () => {
    
    const findDataPoint = (dataList, districtNameGeo) => dataList 
        ? dataList.find(item => normalize(item.district) === normalize(districtNameGeo)) 
        : null;

    // 1. Styling function for District Choropleth (Air/Land Layers)
    const styleFeature = (feature) => {
        const districtNameGeo = feature.properties.district; 
        const isGujarat = feature.properties.st_nm === "Gujarat";
        
        if (!districtNameGeo || !isGujarat) { 
            return { fillColor: 'transparent', weight: 0.5, opacity: 0.3, color: 'gray', fillOpacity: 0.1 };
        }
        
        const baseStyle = { weight: 1.5, opacity: 0.8, color: 'white', fillOpacity: 0.7 };
        
        // --- AIR LAYER ---
        if (selectedLayer === 'air') {
            const dataPoint = findDataPoint(currentPollutionData.air, districtNameGeo);
            const aqi = getAqiValue(dataPoint); 
            return { ...baseStyle, fillColor: getAqiColor(aqi) };
        } 
        
        // --- LAND LAYER (Filtering by selectedLandType) ---
        if (selectedLayer === 'land') {
            const dataPoint = findDataPoint(currentPollutionData.land, districtNameGeo);
            const score = getLandScoreForFilter(dataPoint, selectedLandType);
            
            return { ...baseStyle, fillColor: getAqiColor(score) }; 
        } 
        
        // Default style when other layers are selected
        return {
            fillColor: 'rgba(100, 100, 200, 0.2)', 
            weight: 1,
            opacity: 0.8,
            color: 'blue', 
            fillOpacity: 0.2
        };
    };
    
    // 2. Rendering function for Water Pollution (River Path and Stations)
    const renderWaterLayer = () => {
        if (selectedLayer !== 'water') return null;

        const riverPath = (
            <GeoJSON 
                key="sabarmati-path"
                data={sabarmatiRiver} 
                style={() => ({ color: '#60A5FA', weight: 3, opacity: 1 })}
            />
        );

        const stationMarkers = sabarmatiStations.map(station => {
            const pollutionPoint = currentPollutionData.water.find(p => p.station === station.station);
            const status = pollutionPoint?.status || 'No Data';
            const ph = pollutionPoint?.ph || 'N/A';
            const color = getWaterColor(status);

            return (
                <CircleMarker 
                    key={station.id} 
                    center={[station.lat, station.lng]} 
                    pathOptions={{ color: color, fillColor: color, fillOpacity: 1 }} 
                    radius={8}
                >
                    <Popup>
                        <b>{station.station}</b><br />
                        <span className={`font-semibold`} style={{color: color}}>Status: {status}</span><br/>
                        pH: {ph} ({isLive ? 'Mock Data' : historicalYear})
                    </Popup>
                </CircleMarker>
            );
        });

        const transparentGujaratLayer = (
             <GeoJSON 
                key="water-base"
                data={gujaratDistricts} 
                style={() => ({ fillColor: 'transparent', weight: 0, opacity: 0 })}
            />
        );


        return (
            <>
                {transparentGujaratLayer}
                {riverPath}
                {stationMarkers}
            </>
        );
    };


    const onEachFeature = (feature, layer) => {
        const districtNameGeo = feature.properties.district;
        const isGujarat = feature.properties.st_nm === "Gujarat";
        
        if (!districtNameGeo || !isGujarat) return; 

        const dataList = currentPollutionData[selectedLayer];
        const dataPoint = findDataPoint(dataList, districtNameGeo);
        
        // --- AIR POPUP ---
        if (selectedLayer === 'air') {
            const aqi = getAqiValue(dataPoint); 
            const descriptor = AQI_DESCRIPTORS[aqi] || 'N/A';
            const color = getAqiColor(aqi);
            
            if (aqi > 0) {
                 layer.bindPopup(`<b>${districtNameGeo} District AQI</b><br/>Status: <span style="color:${color}">${descriptor} (${aqi}/5)</span><br/>Data Source: ${isLive ? 'Live API Data' : `Historical (${historicalYear})`}`);
            } else {
                 layer.bindPopup(`<b>${districtNameGeo} District</b><br/>AQI Data Not Monitored/Unavailable`);
            }
        } 
        
        // --- LAND POPUP ---
        if (selectedLayer === 'land') {
            const totalScore = getLandScoreForFilter(dataPoint, 'All');
            const totalColor = getAqiColor(totalScore);

            let content;
            if (dataPoint) {
                const land_pollution = dataPoint.land_pollution || {};
                const primaryIssue = land_pollution.primary_issue || 'General';
                const description = land_pollution.description || 'No detailed source description.';
                const chemicalScore = land_pollution.chemical_score || 0;
                const solidScore = land_pollution.solid_waste_score || 0;
                
                content = `
                    <b>${districtNameGeo} Land Risk (Total: ${totalScore}/5)</b><br/>
                    <span style="font-weight: bold; color:${totalColor}">Primary Issue: ${primaryIssue}</span><br/>
                    <hr style="margin: 4px 0; border-top: 1px dashed #ccc;"/>
                    - Solid Waste Risk: ${solidScore}/5<br/>
                    - Chemical Risk: ${chemicalScore}/5<br/>
                    <i style="font-size: 0.8em;">${description}</i>
                `;
            } else {
                content = `<b>${districtNameGeo} District</b><br/>Land Data Not Available.`;
            }
            
            layer.bindPopup(content);
        }
    };

    return (
        <>
            <GeoJSON 
                key={`choropleth-${isLive ? 'live' : historicalYear}-${selectedLayer}`} 
                data={gujaratDistricts} 
                style={styleFeature}
                onEachFeature={onEachFeature}
            />
            {renderWaterLayer()}
        </>
    );
  };


  // --- Component Structure (JSX) ---

  return (
    <div className="relative flex flex-col md:flex-row gap-4">
      
      {/* MAP CONTAINER (W-FULL on mobile, W-3/4 on desktop) */}
      <div className="flex-1 w-full md:w-3/4 min-h-[500px]">
        
        {/* Weather Display */}
        {isLive && weather && (
          <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-sm z-[1000] w-48"> 
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-800 text-base">Current Weather</span>
              <span className="text-xl">☀️</span>
            </div>
            <div className="text-gray-600 mb-2">{weather.name}</div>
            <div className="text-3xl font-light text-blue-600">{weather.main.temp}°C</div>
            <div className="text-xs mt-1">
              <span className="font-medium">{weather.weather[0].main}</span>
              <span className="ml-2 text-gray-500">| Humidity: {weather.main.humidity}%</span>
            </div>
          </div>
        )}
        
        {/* Map Container - Conditional Rendering */}
        {loading ? (
          <div className="map-container-style flex items-center justify-center bg-gray-200 rounded-lg text-lg font-semibold text-gray-700">
            Loading Map & Data... 🌍
          </div>
        ) : (
          <MapContainer center={center} zoom={7} className="map-container-style"> 
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {renderGeoJSON()} 
          </MapContainer>
        )}
      </div>

      {/* SOLUTIONS SIDEBAR */}
      <div className="w-full md:w-1/4 md:pl-0 min-h-0">
          <div className="md:sticky md:top-20 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-3 border-b pb-2 text-gray-800">
                  Actionable Solutions
              </h3>
              {renderSolutionsPanel(currentPollutionData, selectedLayer, selectedLandType, generateImpactReport, reportStatus, impactReport)}
          </div>
      </div>
    </div>
  );
}