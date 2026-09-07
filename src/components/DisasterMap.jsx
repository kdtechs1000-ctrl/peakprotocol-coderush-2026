import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Polyline, 
  CircleMarker 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Camera, 
  Droplet, 
  Mountain, 
  ArrowRight 
} from 'lucide-react';

// Custom icons using standard Leaflet DivIcon
const createCustomIcon = (type, severity) => {
  const isCritical = severity === 'CRITICAL';
  const color = type === 'Safe Shelter' ? '#10b981' : isCritical ? '#dc2626' : '#d97706';
  const iconEmoji = type === 'Flood' ? '🌊' : type === 'Landslide' ? '🏔️' : type === 'Safe Shelter' ? '🛡️' : '⚠️';

  return L.divIcon({
    className: 'custom-hazard-marker',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        background-color: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${iconEmoji}
        ${isCritical ? `<div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid ${color};
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.75;
        "></div>` : ''}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

export default function DisasterMap() {
  const { 
    reports, 
    redZones, 
    hazardVectors, 
    safeShelters, 
    setIsReportingModalOpen, 
    userLocation,
    language,
    t 
  } = useMode();

  const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'
  const [filterType, setFilterType] = useState('All'); // 'All', 'Landslides', 'Floods', 'Safe Shelters'

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (filterType === 'All') return true;
    if (filterType === 'Landslides') return r.hazard_type === 'Landslide';
    if (filterType === 'Floods') return r.hazard_type === 'Flood';
    if (filterType === 'Safe Shelters') return r.hazard_type === 'Safe Shelter';
    return true;
  });

  // Street vs Satellite Tile URLs
  const tileUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttr = mapType === 'satellite'
    ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[550px] overflow-hidden bg-slate-900">
      
      {/* 1. TOP STAT PILL BAR matching Screenshot 5 */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 flex-wrap max-w-[80vw]">
        <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>4 {t.stats.activeAlerts}</span>
        </div>
        <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>18 {t.stats.safeShelters}</span>
        </div>
        <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>2 {t.stats.blockedRoads}</span>
        </div>
        <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-slate-500" />
          <span>7 {t.stats.liveCctv}</span>
        </div>
      </div>

      {/* 2. STREET / SATELLITE TOGGLE matching Screenshot 5 */}
      <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur p-1 rounded-xl shadow-md border border-slate-200 flex items-center text-xs font-bold">
        <button
          onClick={() => setMapType('street')}
          className={`px-3 py-1 rounded-lg transition-all ${
            mapType === 'street' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 rounded-lg transition-all ${
            mapType === 'satellite' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* 3. MAIN LEAFLET MAP */}
      <MapContainer
        center={[27.7172, 85.3240]} // Centered on Nepal
        zoom={7}
        minZoom={6}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer attribution={tileAttr} url={tileUrl} />

        {/* Render Red Zone Polygons */}
        {redZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{
              color: '#dc2626',
              weight: 2,
              fillColor: '#ef4444',
              fillOpacity: 0.25,
              dashArray: '4, 4'
            }}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-1 text-rose-600 font-bold text-xs uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{zone.severity} HAZARD GEOFENCE</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{zone.title}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Active evacuation area. Traversing this perimeter triggers immediate system warning.
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Render Animated Hazard River / Flow Vectors */}
        {hazardVectors.map((vec) => (
          <Polyline
            key={vec.id}
            positions={vec.coordinates}
            pathOptions={{
              color: '#2563eb',
              weight: 5,
              opacity: 0.8,
              dashArray: '8, 8',
              className: 'animated-flow-vector'
            }}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-1 text-blue-600 font-bold text-xs uppercase">
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{vec.water_level_status} WATER VECTOR</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{vec.river_or_route_name}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Flow Rate: {vec.flow_rate_m3s} m³/s | Heading: {vec.heading_direction}
                </p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Render Hazard Reports Markers */}
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.hazard_type, report.severity)}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-rose-600 uppercase tracking-wider">
                    {report.hazard_type}
                  </span>
                  {report.ai_detected && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">
                      AI DETECTED
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{report.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Lat: {report.latitude?.toFixed(3)}, Lng: {report.longitude?.toFixed(3)}</span>
                  <span className="font-semibold text-rose-500">{report.severity}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Safe Shelters if selected */}
        {(filterType === 'All' || filterType === 'Safe Shelters') &&
          safeShelters.map((sh) => (
            <Marker
              key={sh.id}
              position={[sh.latitude, sh.longitude]}
              icon={createCustomIcon('Safe Shelter', 'LOW')}
            >
              <Popup>
                <div className="p-1 max-w-xs">
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED SAFE SHELTER</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{sh.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Capacity: {sh.current_occupancy} / {sh.capacity} persons
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sh.facilities?.map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                        {f}
                      </span>
                    ))}
                  </div>
                  {sh.contact && (
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      Tel: <a href={`tel:${sh.contact}`} className="text-emerald-700 underline">{sh.contact}</a>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {/* User Current Location Indicator */}
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={8}
          pathOptions={{
            color: '#ffffff',
            weight: 3,
            fillColor: '#3b82f6',
            fillOpacity: 1
          }}
        >
          <Popup>
            <div className="text-xs font-semibold">
              📍 {language === 'np' ? 'तपाईंको हालको स्थान' : 'Your Current Location'}
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>

      {/* 4. BOTTOM FILTER PILL BAR matching Screenshot 5 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-700/80 max-w-[95vw] overflow-x-auto">
        <button
          onClick={() => setFilterType('All')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'All'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>⚡</span>
          <span>{t.filters.all}</span>
        </button>

        <button
          onClick={() => setFilterType('Landslides')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'Landslides'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🏔️</span>
          <span>{t.filters.landslides}</span>
        </button>

        <button
          onClick={() => setFilterType('Floods')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'Floods'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🌊</span>
          <span>{t.filters.floods}</span>
        </button>

        <button
          onClick={() => setFilterType('Safe Shelters')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            filterType === 'Safe Shelters'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🛡️</span>
          <span>{t.filters.safeShelters}</span>
        </button>
      </div>

      {/* 5. FLOATING "REPORT HAZARD" BIG RED BUTTON matching Screenshot 5 */}
      <button
        onClick={() => setIsReportingModalOpen(true)}
        className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-2xl shadow-red-600/50 hover:scale-105 transition-all border border-red-400/40"
      >
        <span>🚨</span>
        <span>{t.tabs.reportHazard}</span>
      </button>

    </div>
  );
}
