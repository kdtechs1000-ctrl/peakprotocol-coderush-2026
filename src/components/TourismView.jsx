import React from 'react';
import { useMode } from '../context/ModeContext';
import { Compass, Mountain, MapPin, ShieldCheck, Sun, CloudRain, AlertTriangle, Calendar, Phone } from 'lucide-react';
import VolunteerTourForm from './VolunteerTourForm';

export default function TourismView() {
  const { setActiveTab } = useMode();

  const destinations = [
    {
      name: 'Annapurna Circuit',
      elevation: '5,416m (Thorong La)',
      duration: '14 - 18 Days',
      status: 'CAUTION',
      statusText: 'Monsoon season: Leech alert & high humidity',
      color: 'from-amber-700 to-orange-900',
      description: 'World-renowned trekking circuit passing through Hindu lowlands to Tibetan Buddhist monasteries.'
    },
    {
      name: 'Everest Base Camp & Gokyo',
      elevation: '5,364m / 5,357m',
      duration: '12 - 16 Days',
      status: 'OPEN',
      statusText: 'Flights operating from Ramechhap/Lukla',
      color: 'from-blue-700 to-indigo-950',
      description: 'Stand at the foot of Mount Sagarmatha with breathtaking vistas of Nuptse, Lhotse, and Ama Dablam.'
    },
    {
      name: 'Pokhara & Mardi Himal',
      elevation: '4,500m',
      duration: '5 - 7 Days',
      status: 'OPEN',
      statusText: 'Optimal for short trekking and paragliding',
      color: 'from-emerald-700 to-teal-950',
      description: 'Lakeside serenity beneath the majestic Machapuchare (Fishtail) peak with tea houses along the ridge.'
    },
    {
      name: 'Chitwan Wildlife Safari',
      elevation: '150m (Terai Plains)',
      duration: '3 - 4 Days',
      status: 'CAUTION',
      statusText: 'Rapti river levels moderate',
      color: 'from-yellow-800 to-amber-950',
      description: 'Canoe safari and guided jungle walks home to the endangered One-horned Rhinoceros and Bengal Tiger.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-14 mb-10 shadow-2xl border border-slate-800">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Nepal Safety First Trekking Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Explore the Himalayas with Real-Time Trail Safety
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Connecting global adventurers to certified local Sherpa guides, live weather telemetry from the Department of Hydrology, and automated hazard geofencing.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('planRoute')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-emerald-600/30 transition-all"
            >
              Plan Safe Journey
            </button>
            <button
              onClick={() => setActiveTab('liveMap')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur transition-all border border-white/20"
            >
              View Trail Map
            </button>
          </div>
        </div>

        {/* Subtle Background Decorative Grid */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none p-6 text-9xl font-black select-none">
          NEPAL
        </div>
      </div>

      {/* Featured Trekking Trails with Safety Status */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Popular Himalayan Routes & Live Status</h3>
            <p className="text-xs text-slate-500">Continuous telemetry verification with TAAN and local checkpoint posts.</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Updated hourly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <h4 className="text-lg font-bold text-slate-900">{dest.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    dest.status === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {dest.status}
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                  {dest.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Peak Elevation</span>
                    <span className="font-semibold text-slate-800">{dest.elevation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-semibold text-slate-800">{dest.duration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate mr-2 font-medium text-slate-600">{dest.statusText}</span>
                <span className="text-emerald-700 font-bold hover:underline cursor-pointer">Guide Details &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide & Tour Booking Form */}
      <div className="mb-10">
        <VolunteerTourForm />
      </div>
    </div>
  );
}
