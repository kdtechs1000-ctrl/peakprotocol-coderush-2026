import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { AlertCircle, Radio, CheckCircle, ShieldAlert, PhoneCall } from 'lucide-react';

export default function SosButton() {
  const { triggerSos, userLocation, language, t } = useMode();
  const [showModal, setShowModal] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSosClick = async () => {
    setIsSent(true);
    await triggerSos(userLocation);
    setTimeout(() => {
      setShowModal(true);
    }, 400);
  };

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <div className="fixed bottom-6 left-4 sm:left-8 z-40">
        <button
          onClick={handleSosClick}
          className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-2xl shadow-red-700/60 hover:scale-105 active:scale-95 transition-all border-2 border-white/80"
          title="Broadcast Emergency SOS Beacon"
        >
          {/* Animated beacon ring */}
          <span className="absolute -inset-1 rounded-full bg-red-500 opacity-40 animate-ping"></span>
          
          <Radio className="w-5 h-5 text-white animate-pulse" />
          <span className="relative z-10">{t.sos.button}</span>
        </button>
      </div>

      {/* Confirmation & Survival Guidance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 animate-scale-up text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight">
              {t.sos.transmitted}
            </h3>
            
            <p className="text-xs font-semibold text-rose-600 mb-4">
              {t.common.gpsCoordinates}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>

            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              {t.sos.prompt}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
              <p className="font-bold text-slate-800">Immediate Survival Steps:</p>
              <p className="text-slate-600">• Move away from river embankments and unstable hill cut slopes.</p>
              <p className="text-slate-600">• Keep phone battery preserved; SMS channel 1234 active.</p>
              <p className="text-slate-600">• If trapped, make rhythmic metallic sounds for search dogs & acoustic sensors.</p>
            </div>

            <div className="flex gap-3">
              <a
                href="tel:1234"
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call NDRRMA (1234)</span>
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
