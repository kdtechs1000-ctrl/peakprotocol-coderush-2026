import React from 'react';
import { useMode } from '../context/ModeContext';
import { Users, AlertOctagon, HeartCrack, Home, Banknote } from 'lucide-react';

export default function DistrictImpactCard() {
  const { districtImpacts, language } = useMode();

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
            {language === 'np' ? 'जिल्लागत क्षति तथा प्रभाव विवरण' : 'National District Impact Summary'}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'np'
            ? 'गृह मन्त्रालय तथा राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरण (NDRRMA) बाट प्रमाणित तथ्यांक।'
            : 'Verified casualty & monetary infrastructure damage verified by MoHA & NDRRMA.'}
        </p>
      </div>

      {/* Aggregate High-Level Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
            {language === 'np' ? 'मृत्यु' : 'Deaths'}
          </span>
          <span className="text-2xl font-black text-rose-900">{totalDeaths}</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            {language === 'np' ? 'बेपत्ता' : 'Missing'}
          </span>
          <span className="text-2xl font-black text-amber-900">{totalMissing}</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            {language === 'np' ? 'घाइते' : 'Injured'}
          </span>
          <span className="text-2xl font-black text-blue-900">{totalInjured}</span>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            {language === 'np' ? 'विस्थापित परिवार' : 'Displaced Families'}
          </span>
          <span className="text-2xl font-black text-purple-900">{totalDisplaced}</span>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            {language === 'np' ? 'अनुमानित क्षति' : 'Est. Damage'}
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
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Province</th>
                <th className="py-3 px-4 text-rose-600">Deaths</th>
                <th className="py-3 px-4 text-amber-600">Missing</th>
                <th className="py-3 px-4">Injured</th>
                <th className="py-3 px-4">Displaced</th>
                <th className="py-3 px-4 text-right">Est. Damage (NPR)</th>
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
