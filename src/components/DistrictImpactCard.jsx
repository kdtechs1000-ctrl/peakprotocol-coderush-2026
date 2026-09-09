import React from 'react';
import { useMode } from '../context/ModeContext';
import { Users, AlertOctagon, HeartCrack, Home, Banknote } from 'lucide-react';

export default function DistrictImpactCard() {
  const { districtImpacts, language, t } = useMode();

  // Aggregate totals
  const totalDeaths = districtImpacts.reduce((sum, d) => sum + (d.deaths || 0), 0);
  const totalMissing = districtImpacts.reduce((sum, d) => sum + (d.missing || 0), 0);
  const totalInjured = districtImpacts.reduce((sum, d) => sum + (d.injured || 0), 0);
  const totalDisplaced = districtImpacts.reduce((sum, d) => sum + (d.displaced_families || 0), 0);
  const totalDamageNpr = districtImpacts.reduce((sum, d) => sum + (d.estimated_damage_npr || 0), 0);

  const formatNpr = (val) => {
    if (val >= 10000000) {
      return `NPR ${(val / 10000000).toFixed(1)} Crore`;
    }
    return `NPR ${(val / 100000).toFixed(1)} Lakh`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span>
            {t.districtImpact.title}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t.districtImpact.subtitle}
        </p>
      </div>

      {/* Aggregate High-Level Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
            {t.districtImpact.deaths}
          </span>
          <span className="text-2xl font-black text-rose-900">{totalDeaths}</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            {t.districtImpact.missing}
          </span>
          <span className="text-2xl font-black text-amber-900">{totalMissing}</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            {t.districtImpact.injured}
          </span>
          <span className="text-2xl font-black text-blue-900">{totalInjured}</span>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            {t.districtImpact.displaced}
          </span>
          <span className="text-2xl font-black text-purple-900">{totalDisplaced}</span>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            {t.districtImpact.damage}
          </span>
          <span className="text-base sm:text-lg font-black text-white">{formatNpr(totalDamageNpr)}</span>
        </div>
      </div>

      {/* District breakdown table / card list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t.districtImpact.district}</th>
                <th className="py-3 px-4">{t.districtImpact.province}</th>
                <th className="py-3 px-4 text-rose-600">{t.districtImpact.deaths}</th>
                <th className="py-3 px-4 text-amber-600">{t.districtImpact.missing}</th>
                <th className="py-3 px-4">{t.districtImpact.injured}</th>
                <th className="py-3 px-4">{t.districtImpact.displaced}</th>
                <th className="py-3 px-4 text-right">{t.districtImpact.estimatedDamage}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtImpacts.map((d) => (
                <tr key={d.district_name} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{d.district_name}</td>
                  <td className="py-3 px-4 text-slate-500">{d.province_name}</td>
                  <td className="py-3 px-4 font-bold text-rose-600">{d.deaths}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">{d.missing}</td>
                  <td className="py-3 px-4 text-slate-700">{d.injured}</td>
                  <td className="py-3 px-4 text-slate-700">{d.displaced_families}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {formatNpr(d.estimated_damage_npr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
