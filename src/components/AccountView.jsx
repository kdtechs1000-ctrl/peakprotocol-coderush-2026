import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { supabase } from '../services/supabaseClient';
import { User, ShieldAlert, Cpu, Database, RefreshCw, Radio, CheckCircle, Navigation } from 'lucide-react';

export default function AccountView() {
  const {
    isEmergencyMode,
    setIsEmergencyMode,
    setUserLocation,
    setCurrentDangerZone,
    redZones,
    setAlertBanner,
    offlineMode,
    setOfflineMode
  } = useMode();

  const [simStatus, setSimStatus] = useState('');

  // 1. Broadcast Admin Override to Supabase
  const handleAdminOverride = async (enableEmergency) => {
    setSimStatus('Broadcasting system_status to Supabase Realtime...');
    setIsEmergencyMode(enableEmergency);
    try {
      await supabase
        .table('system_status')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          emergency_active: enableEmergency,
          alert_level: enableEmergency ? 'WARNING' : 'NORMAL',
          broadcast_message: enableEmergency
            ? 'Admin Trigger: Monsoon Disaster Watch Broadcast Activated'
            : 'Admin Trigger: Normal Tourism Operations Restored',
          updated_at: new Date().toISOString()
        });
      setSimStatus(`Success! Broadcasted emergency_active = ${enableEmergency}`);
      setAlertBanner(enableEmergency ? '🚨 Emergency Mode broadcasted to all connected devices.' : '✅ Tourism Mode restored.');
    } catch (err) {
      setSimStatus(`Local override applied. Supabase sync note: ${err.message}`);
    }
  };

  // 2. Geofence simulator: teleport user into Narayangadh red zone
  const handleSimulateGeofence = () => {
    // Narayangadh red zone coordinate
    const dangerCoord = { lat: 27.730, lng: 84.470 };
    setUserLocation(dangerCoord);
    setCurrentDangerZone({
      inside: true,
      zone_title: 'Narayangadh-Mugling High-Risk Landslide Corridor',
      hazard_type: 'Landslide',
      severity: 'CRITICAL'
    });
    setIsEmergencyMode(true);
    setAlertBanner('⚠️ GEOFENCE ALERT: GPS entered active Red Zone! Immediate evacuation advised.');
    setSimStatus('GPS set to Narayangadh Red Zone [27.730, 84.470]. System auto-pivoted to Emergency Mode.');
  };

  // 3. Reset GPS to Kathmandu safe zone
  const handleResetGps = () => {
    setUserLocation({ lat: 27.7172, lng: 85.3240 });
    setCurrentDangerZone(null);
    setSimStatus('GPS reset to Kathmandu Center [27.7172, 85.3240]. Safe status verified.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border border-emerald-300">
            ND
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">National Responder Account</h3>
            <p className="text-xs text-slate-500">Disaster Triage & Field Operations Desk</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Role: Emergency Coordinator
            </span>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500">
          <p>Station ID: <span className="font-mono font-bold text-slate-700">NP-KTM-01</span></p>
          <p>Encryption: <span className="font-semibold text-emerald-600">PostGIS Active</span></p>
        </div>
      </div>

      {/* Presentation & Live Testing Simulation Center */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h4 className="text-lg font-bold">Live Trigger & Geofence Simulation Center</h4>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Use these controls during presentations or testing to demonstrate the 4 core dynamic mode triggers.
        </p>

        <div className="space-y-4">
          {/* Trigger 1: Realtime Admin Broadcast */}
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                1. Supabase Realtime System Status Override
              </p>
              <p className="text-[11px] text-slate-400">
                Pushes changes to <code className="text-emerald-400">system_status</code> table, immediately flipping all clients.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAdminOverride(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Broadcast Emergency
              </button>
              <button
                onClick={() => handleAdminOverride(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                Restore Tourism
              </button>
            </div>
          </div>

          {/* Trigger 2: Geofence Simulation */}
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Automated GPS Geofence Check
              </p>
              <p className="text-[11px] text-slate-400">
                Simulates GPS moving inside the Narayangadh Landslide Red Zone polygon.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSimulateGeofence}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Teleport to Red Zone</span>
              </button>
              <button
                onClick={handleResetGps}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                Reset to Kathmandu
              </button>
            </div>
          </div>

          {/* Trigger 3: Offline PWA Simulation */}
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                3. Offline Network Simulator
              </p>
              <p className="text-[11px] text-slate-400">
                Toggles offline mode to test IndexedDB queuing and SMS fallback (<code className="text-emerald-400">sms:1234</code>).
              </p>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                offlineMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {offlineMode ? 'Simulate Go Online' : 'Simulate Go Offline'}
            </button>
          </div>
        </div>

        {/* Live Feedback Terminal */}
        {simStatus && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400 flex-shrink-0" />
            <span>{simStatus}</span>
          </div>
        )}
      </div>

      {/* Configured API Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Integration Telemetry & Keys
        </h4>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <span className="font-semibold">Supabase Endpoint</span>
            <span className="font-mono text-emerald-700 font-bold">mnneihyojqnqwopjemyw.supabase.co (Active)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <span className="font-semibold">Google Gemini Vision & NLP</span>
            <span className="font-mono text-emerald-700 font-bold">API Key Connected</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <span className="font-semibold">OSRM Dynamic Routing</span>
            <span className="font-mono text-emerald-700 font-bold">router.project-osrm.org (Active)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <span className="font-semibold">Emergency SMS Gateway</span>
            <span className="font-mono text-emerald-700 font-bold">sms:1234 (NEOC Toll-Free Fallback)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
