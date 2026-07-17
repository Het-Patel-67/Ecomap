import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  CloudRain,
  Droplet,
  Home,
  MapPin,
  Shield,
  Thermometer,
  User,
  Wind,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const USGS_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

const GUJARAT_CITIES = [
  { name: 'Ahmedabad', query: 'Ahmedabad,in', zone: 'Central Gujarat', floodNote: 'Urban drainage and Sabarmati riverbank areas' },
  { name: 'Surat', query: 'Surat,in', zone: 'South Gujarat', floodNote: 'Tapi basin and low-lying urban wards' },
  { name: 'Vadodara', query: 'Vadodara,in', zone: 'Central Gujarat', floodNote: 'Vishwamitri river and low-lying settlements' },
  { name: 'Bharuch', query: 'Bharuch,in', zone: 'South Gujarat', floodNote: 'Narmada river and estuarine areas' },
  { name: 'Valsad', query: 'Valsad,in', zone: 'South Gujarat', floodNote: 'Coastal and river-adjacent communities' },
  { name: 'Rajkot', query: 'Rajkot,in', zone: 'Saurashtra', floodNote: 'Aji basin and urban drainage corridors' },
  { name: 'Jamnagar', query: 'Jamnagar,in', zone: 'Saurashtra', floodNote: 'Coastal wards and low-lying roads' },
  { name: 'Bhuj', query: 'Bhuj,in', zone: 'Kutch', floodNote: 'Seasonal streams and low-lying rural routes' },
];

const floodPreparedness = [
  { group: 'Residents', icon: <User className="w-4 h-4" />, text: 'Move valuables and documents above flood level. Do not walk or drive through flooded roads.' },
  { group: 'Local authorities', icon: <Shield className="w-4 h-4" />, text: 'Inspect drains, issue local closures, and pre-position response teams in vulnerable wards.' },
  { group: 'Communities', icon: <Home className="w-4 h-4" />, text: 'Check evacuation routes, assist older neighbours, and follow official district advisories.' },
];

const weatherPreparedness = [
  { group: 'Residents', icon: <User className="w-4 h-4" />, text: 'Keep phone alerts enabled, avoid exposed areas during thunderstorms, and secure loose objects.' },
  { group: 'Local authorities', icon: <Shield className="w-4 h-4" />, text: 'Share ward-level advisories and monitor traffic, power, and drainage disruptions.' },
  { group: 'Researchers', icon: <BookOpen className="w-4 h-4" />, text: 'Track rainfall accumulation and compare it with local flood-prone area thresholds.' },
];

function getFloodRisk(totalRain, peakRain, windSpeed) {
  if (totalRain >= 80 || peakRain >= 35) return { label: 'CRITICAL', className: 'bg-red-100 border-red-600', badge: 'bg-red-200 text-red-800' };
  if (totalRain >= 35 || peakRain >= 15 || windSpeed >= 50) return { label: 'HIGH', className: 'bg-orange-50 border-orange-600', badge: 'bg-orange-200 text-orange-800' };
  if (totalRain >= 10 || peakRain >= 5) return { label: 'WATCH', className: 'bg-yellow-50 border-yellow-500', badge: 'bg-yellow-200 text-yellow-800' };
  return { label: 'LOW', className: 'bg-emerald-50 border-emerald-500', badge: 'bg-emerald-200 text-emerald-800' };
}

function summariseForecast(city, list = []) {
  const next24Hours = list.slice(0, 8);
  const totalRain = next24Hours.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);
  const peakRain = next24Hours.reduce((peak, item) => Math.max(peak, item.rain?.['3h'] || 0), 0);
  const maxWind = next24Hours.reduce((peak, item) => Math.max(peak, (item.wind?.speed || 0) * 3.6), 0);
  const maxTemp = next24Hours.reduce((peak, item) => Math.max(peak, item.main?.temp ?? -Infinity), -Infinity);
  const risk = getFloodRisk(totalRain, peakRain, maxWind);

  return {
    ...city,
    totalRain,
    peakRain,
    maxWind,
    maxTemp: Number.isFinite(maxTemp) ? maxTemp : null,
    risk,
    updatedAt: list[0]?.dt_txt || null,
  };
}

export default function DisasterAlerts({ disasterType }) {
  const [cityForecasts, setCityForecasts] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [seismicData, setSeismicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAlertId, setOpenAlertId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchAlerts() {
      setLoading(true);
      setErrorMessage('');
      const starttime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const seismicRequest = axios.get(USGS_API_URL, {
        params: { format: 'geojson', minmagnitude: 4.5, eventtype: 'earthquake', starttime, minlatitude: 5, maxlatitude: 40, minlongitude: 60, maxlongitude: 100, orderby: 'time' },
      }).catch(() => ({ data: { features: [] } }));

      if (!API_KEY) {
        const seismicResponse = await seismicRequest;
        if (active) {
          setSeismicData(seismicResponse.data?.features || []);
          setErrorMessage('Add VITE_OPENWEATHER_API_KEY to client/.env to enable live Gujarat weather and flood monitoring.');
          setLoading(false);
        }
        return;
      }

      const forecastRequests = GUJARAT_CITIES.map((city) =>
        axios.get(FORECAST_URL, { params: { q: city.query, appid: API_KEY, units: 'metric' } })
          .then((response) => summariseForecast(city, response.data?.list))
          .catch(() => null),
      );
      const currentRequest = axios.get(CURRENT_URL, { params: { q: 'Ahmedabad,in', appid: API_KEY, units: 'metric' } }).catch(() => null);

      const [forecastResults, currentResponse, seismicResponse] = await Promise.all([
        Promise.all(forecastRequests), currentRequest, seismicRequest,
      ]);

      if (!active) return;
      const availableForecasts = forecastResults.filter(Boolean);
      setCityForecasts(availableForecasts);
      setCurrentWeather(currentResponse?.data || null);
      setSeismicData(seismicResponse.data?.features || []);
      if (!availableForecasts.length) setErrorMessage('Live weather data is temporarily unavailable. Check your OpenWeather API key and network connection.');
      setLoading(false);
    }

    fetchAlerts();
    return () => { active = false; };
  }, []);

  const floodAlerts = useMemo(() => cityForecasts
    .filter((city) => city.risk.label !== 'LOW')
    .sort((a, b) => ({ CRITICAL: 3, HIGH: 2, WATCH: 1 }[b.risk.label] - { CRITICAL: 3, HIGH: 2, WATCH: 1 }[a.risk.label]))
    .map((city) => ({
      id: `flood-${city.name}`,
      type: `${city.risk.label === 'WATCH' ? 'Rainfall Watch' : 'Flood Risk Alert'} — ${city.name}`,
      risk: city.risk.label,
      className: city.risk.className,
      badge: city.risk.badge,
      icon: <CloudRain className="w-7 h-7 text-blue-700" />,
      message: `${city.totalRain.toFixed(1)} mm forecast in the next 24 hours (peak ${city.peakRain.toFixed(1)} mm / 3h). Focus: ${city.floodNote}.`,
      preparedness: floodPreparedness,
    })), [cityForecasts]);

  const weatherAlerts = useMemo(() => cityForecasts.flatMap((city) => {
    const alerts = [];
    if (city.maxTemp >= 42) alerts.push({
      id: `heat-${city.name}`, type: `Heatwave Alert — ${city.name}`, risk: 'HIGH', className: 'bg-orange-50 border-orange-600', badge: 'bg-orange-200 text-orange-800',
      icon: <Thermometer className="w-7 h-7 text-orange-700" />, message: `Maximum temperature may reach ${Math.round(city.maxTemp)}°C in the next 24 hours.`, preparedness: weatherPreparedness,
    });
    if (city.maxWind >= 50) alerts.push({
      id: `wind-${city.name}`, type: `Strong Wind Alert — ${city.name}`, risk: 'HIGH', className: 'bg-sky-50 border-sky-600', badge: 'bg-sky-200 text-sky-800',
      icon: <Wind className="w-7 h-7 text-sky-700" />, message: `Wind gusts may reach ${Math.round(city.maxWind)} km/h in the next 24 hours.`, preparedness: weatherPreparedness,
    });
    return alerts;
  }), [cityForecasts]);

  const earthquakeAlerts = seismicData.slice(0, 3).map((feature, index) => {
    const magnitude = feature.properties.mag;
    const risk = magnitude >= 6 ? 'CRITICAL' : magnitude >= 5 ? 'HIGH' : 'WATCH';
    return {
      id: `earthquake-${index}`, type: 'Earthquake Alert', risk,
      className: risk === 'CRITICAL' ? 'bg-red-50 border-red-600' : risk === 'HIGH' ? 'bg-orange-50 border-orange-600' : 'bg-yellow-50 border-yellow-500',
      badge: risk === 'CRITICAL' ? 'bg-red-200 text-red-800' : risk === 'HIGH' ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800',
      icon: <AlertTriangle className="w-7 h-7 text-red-700" />,
      message: `M${magnitude.toFixed(1)} near ${feature.properties.place} at ${new Date(feature.properties.time).toLocaleString()}.`,
      preparedness: [{ group: 'Residents', icon: <User className="w-4 h-4" />, text: 'Drop, cover, and hold on. Check for injuries and unsafe structures after shaking stops.' }],
    };
  });

  const allAlerts = [...floodAlerts, ...weatherAlerts, ...earthquakeAlerts];
  const filteredAlerts = allAlerts.filter((alert) => {
    if (!disasterType || disasterType === 'All') return true;
    if (disasterType === 'Flood') return /flood|rain/i.test(alert.type);
    if (disasterType === 'Earthquake') return /earthquake/i.test(alert.type);
    if (disasterType === 'Heatwave') return /heatwave|wind/i.test(alert.type);
    return true;
  });

  const visibleForecasts = [...cityForecasts].sort((a, b) => ({ CRITICAL: 3, HIGH: 2, WATCH: 1, LOW: 0 }[b.risk.label] - { CRITICAL: 3, HIGH: 2, WATCH: 1, LOW: 0 }[a.risk.label]));
  const liveFloodCount = floodAlerts.length;
  const isFloodPage = disasterType === 'Flood';
  const showWeatherConditions = isFloodPage || disasterType === 'Heatwave';
  const pageTitle = isFloodPage ? 'Gujarat Flood Alerts' : disasterType === 'Heatwave' ? 'Heat & Coldwave Alerts' : disasterType === 'Earthquake' ? 'Earthquake Alerts' : disasterType === 'Tsunami' ? 'Tsunami Alerts' : 'Natural Disaster Alerts';


  return (
    <div className="space-y-6 max-w-6xl py-4">
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-700 p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        {isFloodPage && <>
        <p className="mt-2 max-w-3xl text-blue-100">Live 24-hour rainfall, wind, and temperature checks for key Gujarat cities. Flood risk is a decision-support signal—always follow official IMD, GSDMA, and district administration warnings.</p>
        </>}
        
      </div>

       {showWeatherConditions && errorMessage && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{errorMessage}</div>}


      {showWeatherConditions && currentWeather && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-slate-800">Current conditions — {currentWeather.name}</h2>
          <div className="grid grid-cols-3 gap-4 text-center text-gray-700">
            <div><Thermometer className="mx-auto h-5 w-5 text-orange-500" /><p className="mt-1 text-xl font-bold">{Math.round(currentWeather.main.temp)}°C</p><p className="text-xs">Temperature</p></div>
            <div><Droplet className="mx-auto h-5 w-5 text-blue-500" /><p className="mt-1 text-xl font-bold">{currentWeather.main.humidity}%</p><p className="text-xs">Humidity</p></div>
            <div><Wind className="mx-auto h-5 w-5 text-cyan-600" /><p className="mt-1 text-xl font-bold">{Math.round(currentWeather.wind.speed * 3.6)} km/h</p><p className="text-xs">Wind</p></div>
          </div>
        </section>
      )}

      {isFloodPage && <section>
        <div className="mb-3 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Gujarat flood outlook</h2><p className="text-sm text-gray-600">Next 24 hours, based on forecast rainfall and wind.</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">{liveFloodCount} area{liveFloodCount === 1 ? '' : 's'} under watch</span></div>
        {loading ? <p className="text-gray-600">Loading Gujarat weather stations…</p> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleForecasts.map((city) => <div key={city.name} className={`rounded-xl border-l-4 p-4 shadow-sm ${city.risk.className}`}>
              <div className="flex items-start justify-between"><div><p className="flex items-center gap-1 font-bold text-slate-800"><MapPin className="h-4 w-4" />{city.name}</p><p className="text-xs text-gray-600">{city.zone}</p></div><span className={`rounded-full px-2 py-1 text-xs font-bold ${city.risk.badge}`}>{city.risk.label}</span></div>
              <p className="mt-3 text-2xl font-bold text-slate-800">{city.totalRain.toFixed(1)} <span className="text-sm font-medium">mm</span></p><p className="text-xs text-gray-600">forecast rainfall / 24h</p>
              <div className="mt-3 grid grid-cols-2 border-t border-black/10 pt-2 text-xs text-gray-700"><span>Peak: {city.peakRain.toFixed(1)} mm/3h</span><span>Wind: {Math.round(city.maxWind)} km/h</span></div>
            </div>)}
          </div>
        )}
      </section>}

      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-800">Active alerts & preparedness</h2>
        {loading ? null : filteredAlerts.length ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{filteredAlerts.map((alert) => <article key={alert.id} className={`overflow-hidden rounded-xl border-l-8 shadow-sm ${alert.className}`}>
          <button type="button" onClick={() => setOpenAlertId(openAlertId === alert.id ? null : alert.id)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
            <div className="flex gap-3"><div className="mt-0.5">{alert.icon}</div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{alert.type}</h3><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${alert.badge}`}>{alert.risk}</span></div><p className="mt-1 text-sm text-gray-700">{alert.message}</p></div></div><ChevronDown className={`mt-1 h-5 w-5 shrink-0 transition-transform ${openAlertId === alert.id ? 'rotate-180' : ''}`} />
          </button>
          {openAlertId === alert.id && <div className="border-t border-gray-200 bg-white p-4"><h4 className="mb-2 font-bold text-slate-800">Recommended actions</h4><ul className="space-y-2">{alert.preparedness.map((step) => <li key={step.group} className="flex gap-2 text-sm text-gray-700"><span className="mt-0.5">{step.icon}</span><span><strong>{step.group}:</strong> {step.text}</span></li>)}</ul></div>}
        </article>)}</div> : <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">No active {disasterType?.toLowerCase() || 'weather'} alerts from the available forecast. Continue routine monitoring during monsoon periods.</div>}
      </section>

      <p className="rounded-lg bg-blue-50 p-4 text-xs leading-5 text-blue-900">Data sources: OpenWeather forecast data for city-level conditions and USGS for regional seismic events. This application estimates local risk from forecast thresholds; it is not an official warning system.</p>
    </div>
  );
}
