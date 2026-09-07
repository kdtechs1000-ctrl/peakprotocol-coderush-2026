import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { QUICK_HUBS, calculateRouteComparison } from '../services/osrmRouting';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeftRight, Navigation, ShieldCheck, AlertTriangle, Sparkles, MapPin } from 'lucide-react';

// Custom Pin Icon for Mini Map
const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -32]
});

// Detour Waypoint Hub Icon (Hetauda)
const hubIcon = L.divIcon({
  className: 'hub-transit-marker',
  html: `
    <div style="
      background-color: #047857;
      color: white;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 9999px;
      border: 2px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      <span>🛡️</span>
      <span>Hetauda Bypass</span>
    </div>
  `,
  iconSize: [120, 30],
  iconAnchor: [60, 15]
});

// Helper component for map tap-to-pin
function MapPinPicker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

export default function PlanRoute() {
  const { redZones, reports, userLocation, language, t } = useMode();

  // Starting Point: default Pokhara [28.2096, 83.9856] for instant demo test
  const [startPoint, setStartPoint] = useState([28.2096, 83.9856]);
  const [startLabel, setStartLabel] = useState('Pokhara');

  // Destination: default Kathmandu [27.7172, 85.3240]
  const [destPoint, setDestPoint] = useState([27.7172, 85.3240]);
  const [destLabel, setDestLabel] = useState('Kathmandu');

  const [loading, setLoading] = useState(false);
  const [routeResults, setRouteResults] = useState(null);

  // Quick hub selection
  const handleQuickHub = (hub) => {
    if (startLabel === hub.name) return;
    setDestPoint([hub.lat, hub.lng]);
    setDestLabel(language === 'np' ? hub.name_np : hub.name);
  };

  // Swap locations
  const handleSwap = () => {
    const tempPt = startPoint;
    const tempLbl = startLabel;
    setStartPoint(destPoint);
    setStartLabel(destLabel);
    setDestPoint(tempPt);
    setDestLabel(tempLbl);
  };

  // Set current location
  const handleUseCurrentLocation = (target) => {
    if (target === 'start') {
      setStartPoint([userLocation.lat, userLocation.lng]);
      setStartLabel(language === 'np' ? 'मेरो हालको स्थान' : 'My Current Location');
    } else {
      setDestPoint([userLocation.lat, userLocation.lng]);
      setDestLabel(language === 'np' ? 'मेरो हालको स्थान' : 'My Current Location');
    }
  };

  // Calculate routes using LIVE data (reports + redZones)
  const handleSuggestRoutes = async () => {
    setLoading(true);
    try {
      const results = await calculateRouteComparison({
        origin: startPoint,
        destination: destPoint,
        redZones: redZones,
        reports: reports // Passing live citizen & telemetry reports!
      });
      setRouteResults(results);
    } catch (err) {
      console.error('Routing calculation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Title Header matching Screenshot 2 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t.planRoute.title}
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {t.planRoute.sub}
        </p>
      </div>

      {/* Quick Hubs Bar matching Screenshot 2 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <span>⚡</span>
          <span>{t.planRoute.quickHubs}:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {QUICK_HUBS.map((hub) => (
            <button
              key={hub.name}
              onClick={() => handleQuickHub(hub)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              + {language === 'np' ? hub.name_np : hub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Two Map Card Pickers with Center Swap Button */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* STARTING POINT CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                {t.planRoute.startingPoint}
              </span>
            </div>
            <button
              onClick={() => handleUseCurrentLocation('start')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              {t.reportModal.useCurrentLocation}
            </button>
          </div>
          <p className="text-[12px] text-slate-500 mb-3">
            {t.reportModal.tapMapPrompt} ({startLabel})
          </p>
          
          <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
              center={startPoint}
              zoom={7}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapPinPicker
                position={startPoint}
                onPositionChange={(pos) => {
                  setStartPoint(pos);
                  setStartLabel(`${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}`);
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Center Swap Button */}
        <button
          onClick={handleSwap}
          className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 w-10 h-10 mx-auto rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center shadow-md hover:bg-slate-50 hover:scale-105 transition-all"
          title="Swap starting point and destination"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* DESTINATION CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
              <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                {t.planRoute.destination}
              </span>
            </div>
            <button
              onClick={() => handleUseCurrentLocation('dest')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              {t.reportModal.useCurrentLocation}
            </button>
          </div>
          <p className="text-[12px] text-slate-500 mb-3">
            {t.reportModal.tapMapPrompt} ({destLabel})
          </p>
          
          <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
              center={destPoint}
              zoom={7}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapPinPicker
                position={destPoint}
                onPositionChange={(pos) => {
                  setDestPoint(pos);
                  setDestLabel(`${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}`);
                }}
              />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Suggest Routes Action Button */}
      <button
        onClick={handleSuggestRoutes}
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
      >
        <span>🚀</span>
        <span>{loading ? t.planRoute.calculating : t.planRoute.suggestRoutes}</span>
      </button>

      {/* Route Results Comparison Section with LIVE DATA Detour */}
      {routeResults && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🧭</span>
              <span>Trajectory Safety Comparison (Live Hazard Ingestion)</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live Data Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Fastest Route Card (Blocked by Live Landslide Data) */}
            <div className={`p-5 rounded-xl border ${
              routeResults.fastest.hasConflict 
                ? 'bg-rose-50/80 border-rose-300' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  {t.planRoute.fastestLabel} (Direct Prithvi Highway)
                </span>
                {routeResults.fastest.hasConflict && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-200 text-rose-900 border border-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> BLOCKED BY LIVE DATA
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-slate-900 mb-1">
                {routeResults.fastest.distanceKm} km
                <span className="text-sm font-normal text-slate-500 ml-2">
                  (~{Math.floor(routeResults.fastest.durationMinutes / 60)}h {routeResults.fastest.durationMinutes % 60}m)
                </span>
              </p>
              {routeResults.fastest.hasConflict ? (
                <div className="text-xs font-semibold text-rose-800 space-y-1 mt-2 p-2.5 rounded-lg bg-white/70 border border-rose-200">
                  <p className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Sector Closed:</strong> {routeResults.fastest.conflictZoneName}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 pl-5">
                    {routeResults.fastest.conflictDetail}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">Standard highway corridor without active blockages.</p>
              )}
            </div>

            {/* Safest Route Card (Recommended Detour via Hetauda) */}
            <div className="p-5 rounded-xl border bg-emerald-50/80 border-emerald-300 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  {t.planRoute.safestLabel} {routeResults.safest.viaHub ? `(Via ${routeResults.safest.viaHub})` : ''}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> RECOMMENDED DETOUR
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 mb-1">
                {routeResults.safest.distanceKm} km
                <span className="text-sm font-normal text-slate-500 ml-2">
                  (~{Math.floor(routeResults.safest.durationMinutes / 60)}h {routeResults.safest.durationMinutes % 60}m)
                </span>
              </p>
              <div className="text-xs font-semibold text-emerald-900 mt-2 p-2.5 rounded-lg bg-white/70 border border-emerald-200 space-y-1">
                <p className="flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {routeResults.safest.detourDescription || 'Safe verified mountain corridor bypassing active debris flow.'}
                  </span>
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 font-bold pl-5">
                  <span>Routing:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                    {startLabel} ➔ {routeResults.safest.viaHub || 'Safe Bypass'} ➔ {destLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Map Preview with Both Polylines and Hetauda Hub */}
          <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
              center={[27.900, 84.800]} // Centered between Pokhara, Hetauda, and Kathmandu
              zoom={7}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={startPoint} icon={pinIcon}>
                <Popup><b>Start:</b> {startLabel}</Popup>
              </Marker>
              <Marker position={destPoint} icon={pinIcon}>
                <Popup><b>Destination:</b> {destLabel}</Popup>
              </Marker>

              {/* Transit Hub Marker if detour via Hetauda */}
              {routeResults.safest.waypointCoords && (
                <Marker position={routeResults.safest.waypointCoords} icon={hubIcon}>
                  <Popup>
                    <div className="p-1">
                      <b className="text-emerald-700">Strategic Transit Hub: Hetauda</b>
                      <p className="text-xs text-slate-600 mt-1">
                        Alternative safe corridor connecting Pokhara and Kathmandu via Kanti Lokpath & Tribhuvan Highway.
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Fastest Route Polyline (Red/Dashed because blocked) */}
              <Polyline
                positions={routeResults.fastest.coordinates}
                color={routeResults.fastest.hasConflict ? '#ef4444' : '#64748b'}
                weight={routeResults.fastest.hasConflict ? 4 : 3}
                dashArray={routeResults.fastest.hasConflict ? '6, 8' : null}
              />

              {/* Safest Route Polyline (Solid Green via Hetauda) */}
              {routeResults.safest.isDetour && (
                <Polyline
                  positions={routeResults.safest.coordinates}
                  color="#059669"
                  weight={5}
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
