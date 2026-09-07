import React, { useState, useRef } from 'react';
import { useMode } from '../context/ModeContext';
import { analyzeHazardWithGemini } from '../services/geminiService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  X, 
  Camera, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertOctagon,
  Loader2,
  Navigation,
  RefreshCw,
  MapPin
} from 'lucide-react';

const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32]
});

function MiniMapPinPicker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

export default function ReportHazardModal() {
  const {
    isReportingModalOpen,
    setIsReportingModalOpen,
    offlineMode,
    setOfflineMode,
    userLocation,
    setUserLocation,
    addHazardReport,
    language,
    t
  } = useMode();

  const [disasterType, setDisasterType] = useState('');
  const [severity, setSeverity] = useState('CRITICAL');
  const [pinCoords, setPinCoords] = useState([userLocation.lat, userLocation.lng]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isReportingModalOpen) return null;

  // Handle file selection (Online Grid Mode only)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-sync device GPS location
  const handleRefreshGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          setPinCoords([coords.lat, coords.lng]);
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location fetch error:', err.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setStatusMessage(offlineMode ? 'Preparing SMS dispatch payload...' : t.reportModal.analyzingWithAi);

    try {
      // In offline mode, strictly use device current GPS location
      const finalCoords = offlineMode ? [userLocation.lat, userLocation.lng] : pinCoords;
      let finalHazardType = disasterType;
      let finalSeverity = severity || 'CRITICAL';
      let finalTitle = disasterType || 'Citizen Hazard Report';
      let finalDescription = `Reported near coordinates ${finalCoords[0].toFixed(3)}, ${finalCoords[1].toFixed(3)}`;
      let aiDetected = false;

      // In Online Mode, run Gemini AI detection
      if (!offlineMode) {
        const aiResult = await analyzeHazardWithGemini({
          imageBase64: imagePreview,
          userDescription: disasterType
        });

        if (aiResult) {
          finalHazardType = disasterType || aiResult.hazard_type;
          finalSeverity = aiResult.severity;
          finalTitle = aiResult.title;
          finalDescription = aiResult.description;
          aiDetected = true;
        }
      }

      // If Offline Mode: Trigger SMS fallback to 1234 directly using current location
      if (offlineMode) {
        const smsBody = encodeURIComponent(
          `DISASTER REPORT: Type: ${finalHazardType || 'Hazard'}, Severity: ${finalSeverity}, Lat: ${finalCoords[0].toFixed(4)}, Lng: ${finalCoords[1].toFixed(4)}. via Peak Protocol`
        );
        window.location.href = `sms:1234?body=${smsBody}`;
      }

      // Add report to state and DB / IndexedDB queue
      await addHazardReport({
        title: finalTitle,
        description: finalDescription,
        hazard_type: finalHazardType || 'Landslide',
        severity: finalSeverity,
        latitude: finalCoords[0],
        longitude: finalCoords[1],
        ai_detected: aiDetected,
        image_url: offlineMode ? null : imagePreview
      });

      setStatusMessage(offlineMode ? 'SMS Dispatch triggered & report queued!' : 'Report submitted successfully!');
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsReportingModalOpen(false);
        // Reset form
        setDisasterType('');
        setImageFile(null);
        setImagePreview(null);
        setStatusMessage(null);
      }, 1000);
    } catch (err) {
      console.error('Error in hazard reporting:', err);
      setIsAnalyzing(false);
      setStatusMessage('Submission completed locally.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={() => setIsReportingModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODE BANNER */}
        <div className="mb-6">
          {offlineMode ? (
            /* Offline SMS Banner */
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-bold text-slate-800 tracking-wider">
                  {t.reportModal.offlineBanner}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t.reportModal.offlineSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOfflineMode(false)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                {t.reportModal.switchToOnline}
              </button>
            </div>
          ) : (
            /* Online AI Active Banner */
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-900 tracking-wider">
                  {t.reportModal.aiActive}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOfflineMode(true)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                {t.reportModal.switchToOffline}
              </button>
            </div>
          )}
        </div>

        {/* Modal Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>🚨</span>
            <span>{t.reportModal.onlineTitle}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {offlineMode
              ? (language === 'np' ? 'इन्टरनेट बिना सिधा एसएमएस (१२३४) मार्फत आफ्नो जीपीएस स्थानसहित रिपोर्ट पठाउनुहोस्।' : 'Low latency offline emergency report dispatched directly via SMS 1234.')
              : t.reportModal.onlineSub}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                offlineMode
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {offlineMode ? 'Saved locally · syncs when online' : 'Synced to backend'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. DISASTER TYPE */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {offlineMode ? t.reportModal.disasterType : t.reportModal.disasterTypeOptional}
            </label>
            <input
              type="text"
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              placeholder={offlineMode ? 'e.g. Landslide, Flood, Road Block' : t.reportModal.disasterTypePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              required={offlineMode}
            />
          </div>

          {/* 2. RISK SEVERITY LEVEL (In Offline mode) */}
          {offlineMode && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t.reportModal.severity}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-700"
              >
                <option value="CRITICAL">CRITICAL (अति संवेदनशील)</option>
                <option value="MODERATE">MODERATE (मध्यम)</option>
                <option value="LOW">LOW (सामान्य)</option>
              </select>
            </div>
          )}

          {/* PHOTO EVIDENCE: Shown ONLY in Online Grid Mode (completely excluded from offline mode as requested) */}
          {!offlineMode && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t.reportModal.photoEvidence}
              </label>
              <div className="space-y-2">
                {/* Viewfinder Camera Button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>{t.reportModal.launchCamera}</span>
                </button>

                {/* File picker row */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    {t.reportModal.chooseFile}
                  </button>
                  <span className="text-xs text-slate-500 truncate">
                    {imageFile ? imageFile.name : t.reportModal.noFileChosen}
                  </span>
                </div>

                {/* Hidden Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mt-2 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Hazard evidence"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur">
                      Photo Evidence Ready
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. COORDINATE VERIFICATION: 
              In Offline Mode: Map is removed, device current location is automatically used!
              In Online Mode: Interactive mini-map is shown. */}
          {offlineMode ? (
            /* Offline Mode: Clean Current Location Card (NO MAP) */
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {language === 'np' ? 'स्वतः पहिचान गरिएको जीपीएस स्थान' : 'Auto-Detected GPS Location'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshGps}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring...' : 'Refresh GPS'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mb-2">
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  GPS LOCKED
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {language === 'np'
                  ? 'इन्टरनेट नभएको बेला नक्सा लोड हुँदैन; तपाईंको यन्त्रको जीपीएस स्थान स्वतः एसएमएसमा पठाइनेछ।'
                  : 'Map rendered offline is disabled. Your exact live device coordinates are encoded directly into the SMS payload for Nepal Emergency Services (1234).'}
              </p>
            </div>
          ) : (
            /* Online Mode: Interactive Mini-Map */
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t.reportModal.coordVerification}
                </label>
                <button
                  type="button"
                  onClick={() => setPinCoords([userLocation.lat, userLocation.lng])}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                >
                  {t.reportModal.useCurrentLocation}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                {t.reportModal.tapMapPrompt} (Lat: {pinCoords[0].toFixed(3)}, Lng: {pinCoords[1].toFixed(3)})
              </p>

              <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <MapContainer
                  center={pinCoords}
                  zoom={8}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MiniMapPinPicker
                    position={pinCoords}
                    onPositionChange={(pos) => setPinCoords(pos)}
                  />
                </MapContainer>
              </div>
            </div>
          )}

          {/* Status feedback */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Big Action Submit Button */}
          {offlineMode ? (
            /* Big Red Button */
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              <span>🚨</span>
              <span>{t.reportModal.dispatchSms}</span>
            </button>
          ) : (
            /* Big Green Button */
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? t.reportModal.analyzingWithAi : t.reportModal.submitOnline}</span>
            </button>
          )}

        </form>
      </div>
    </div>
  );
}
