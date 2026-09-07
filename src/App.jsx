import React from 'react';
import { ModeProvider, useMode } from './context/ModeContext';
import Header from './components/Header';
import DisasterMap from './components/DisasterMap';
import RecentReports from './components/RecentReports';
import PlanRoute from './components/PlanRoute';
import SafeZones from './components/SafeZones';
import AccountView from './components/AccountView';
import ReportHazardModal from './components/ReportHazardModal';
import SosButton from './components/SosButton';
import EmergencyHotlines from './components/EmergencyHotlines';
import DistrictImpactCard from './components/DistrictImpactCard';
import TourismView from './components/TourismView';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

function AppContent() {
  const {
    isEmergencyMode,
    currentDangerZone,
    activeTab,
    alertBanner,
    setAlertBanner,
    language,
    t
  } = useMode();

  return (
    <div className={`min-h-screen flex flex-col ${
      isEmergencyMode ? 'bg-[#f8fafc]' : 'bg-[#fcfdfd]'
    }`}>
      {/* 1. Universal Header matching reference UI */}
      <Header />

      {/* 2. Geofence Danger Alert Banner (Active when GPS inside Red Zone) */}
      {currentDangerZone && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-lg border-b border-red-700 animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <p className="text-xs sm:text-sm font-black tracking-wide">
                {t.geofenceAlert.warning}
                <span className="ml-2 underline font-bold">[{currentDangerZone.zone_title}]</span>
              </p>
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur">
              {t.geofenceAlert.action}
            </span>
          </div>
        </div>
      )}

      {/* 3. Broadcast Alert Banner (from Supabase Realtime) */}
      {alertBanner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold shadow-md flex items-center justify-between border-b border-amber-600">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span>📢</span>
            <span>{alertBanner}</span>
          </div>
          <button
            onClick={() => setAlertBanner(null)}
            className="text-slate-900 hover:text-black font-black p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Main Body Content Based on Active Tab & Mode */}
      <main className="flex-1 pb-16">
        {/* If in Tourism Mode and on home/recentReports or liveMap tab */}
        {!isEmergencyMode && activeTab === 'tourism' ? (
          <TourismView />
        ) : (
          <>
            {activeTab === 'liveMap' && <DisasterMap />}
            
            {activeTab === 'recentReports' && (
              <>
                <RecentReports />
                {isEmergencyMode && (
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
                    <EmergencyHotlines />
                  </div>
                )}
                {isEmergencyMode && <DistrictImpactCard />}
              </>
            )}

            {activeTab === 'planRoute' && <PlanRoute />}

            {activeTab === 'safeZones' && <SafeZones />}

            {activeTab === 'account' && <AccountView />}
          </>
        )}
      </main>

      {/* 5. Emergency SOS Floating Action (Available across Disaster Mode) */}
      {isEmergencyMode && <SosButton />}

      {/* 6. Report Hazard Modal (Online AI Vision / Offline SMS) */}
      <ReportHazardModal />

      {/* 7. Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <p>© 2026 Peak Protocol & Travel Safety Network. In collaboration with NDRRMA, DHM, BIPAD & Nepal Army.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 font-semibold">PostGIS Enabled</span>
            <span>•</span>
            <span className="text-purple-600 font-semibold">Gemini AI Detection</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">PWA Offline Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ModeProvider>
      <AppContent />
    </ModeProvider>
  );
}
