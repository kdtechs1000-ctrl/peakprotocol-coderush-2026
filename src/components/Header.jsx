import React from 'react';
import { useMode } from '../context/ModeContext';
import { 
  MapPin, 
  Compass, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Palmtree, 
  Radio, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export default function Header() {
  const {
    isEmergencyMode,
    setIsEmergencyMode,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    setIsReportingModalOpen,
    offlineMode,
    t
  } = useMode();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 flex-wrap">
        
        {/* Left: Brand Identity with Peak Protocol Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab(isEmergencyMode ? 'liveMap' : 'tourism')}
        >
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-md border-2 border-slate-900/10 flex-shrink-0 bg-slate-950 flex items-center justify-center hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Peak Protocol Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-1.5">
                <span>Peak Protocol</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.live}
              </span>
              {offlineMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t.subTitle}
            </p>
          </div>
        </div>

        {/* Center: Nav Pills matching screenshots */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200 text-xs sm:text-sm font-medium overflow-x-auto">
          {/* Live Map */}
          <button
            onClick={() => setActiveTab('liveMap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'liveMap'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🗺️</span>
            <span>{t.tabs.liveMap}</span>
          </button>

          {/* Report Hazard button */}
          <button
            onClick={() => setIsReportingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-all whitespace-nowrap"
          >
            <span>🚨</span>
            <span>{t.tabs.reportHazard}</span>
          </button>

          {/* Recent Reports */}
          <button
            onClick={() => setActiveTab('recentReports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'recentReports'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>📋</span>
            <span>{t.tabs.recentReports}</span>
          </button>

          {/* Plan Route */}
          <button
            onClick={() => setActiveTab('planRoute')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'planRoute'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🧭</span>
            <span>{t.tabs.planRoute}</span>
          </button>

          {/* Safe Zones */}
          <button
            onClick={() => setActiveTab('safeZones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
              activeTab === 'safeZones'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🛡️</span>
            <span>{t.tabs.safeZones}</span>
          </button>

        </nav>

        {/* Right: Language switch + Dual Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Dual Mode Switch (Tourism vs Emergency) */}
          <button
            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              isEmergencyMode
                ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 shadow-sm'
                : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 shadow-sm'
            }`}
            title="Toggle between Tourism & Emergency Mode"
          >
            {isEmergencyMode ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                <span className="hidden md:inline">{t.disasterMode}</span>
                <span className="md:hidden">{t.disasterMode}</span>
              </>
            ) : (
              <>
                <Palmtree className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">{t.tourismMode}</span>
                <span className="md:hidden">{t.tourismMode}</span>
              </>
            )}
          </button>

          {/* Language Toggle matching screenshot: [ने | EN] */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5 text-xs font-medium">
            <button
              onClick={() => setLanguage('np')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'np' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ने
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
