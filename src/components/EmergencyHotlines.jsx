import React from 'react';
import { useMode } from '../context/ModeContext';
import { Phone, Shield, Flame, HeartPulse, Radio } from 'lucide-react';

export default function EmergencyHotlines() {
  const { language, t } = useMode();

  const hotlines = [
    {
      number: '100',
      label: t.hotlines.police,
      icon: Shield,
      color: 'bg-blue-600 hover:bg-blue-700',
      desc: 'Nepal Police Control'
    },
    {
      number: '101',
      label: t.hotlines.fire,
      icon: Flame,
      color: 'bg-amber-600 hover:bg-amber-700',
      desc: 'Fire Extinguisher & Rescue'
    },
    {
      number: '102',
      label: t.hotlines.ambulance,
      icon: HeartPulse,
      color: 'bg-rose-600 hover:bg-rose-700',
      desc: 'Nepal Red Cross Ambulance'
    },
    {
      number: '1234',
      label: t.hotlines.neoc,
      icon: Radio,
      color: 'bg-emerald-700 hover:bg-emerald-800',
      desc: 'Disaster Authority Operations'
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>{language === 'np' ? 'आपतकालीन हटलाइनहरू' : 'National Emergency Hotlines'}</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Toll-Free Direct Dispatch</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {hotlines.map((h) => {
          const Icon = h.icon;
          return (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className={`${h.color} text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md transition-all hover:scale-105 active:scale-95 group`}
            >
              <Icon className="w-5 h-5 mb-1.5 opacity-90 group-hover:animate-bounce" />
              <span className="text-xl font-black tracking-tight">{h.number}</span>
              <span className="text-xs font-bold mt-0.5">{h.label}</span>
              <span className="text-[10px] text-white/75 mt-0.5">{h.desc}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
