import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { MapPin, Clock, Sparkles, AlertCircle, ShieldCheck, Filter } from 'lucide-react';

export default function RecentReports() {
  const { reports, language, t } = useMode();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter reports based on selected severity
  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'All') return true;
    return r.severity?.toUpperCase() === selectedFilter.toUpperCase();
  });

  // Calculate human-readable relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return language === 'np' ? 'भर्खरै' : 'Just now';
    if (diffMins < 60) return `${diffMins}m ${language === 'np' ? 'अघि' : 'ago'}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ${language === 'np' ? 'अघि' : 'ago'}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ${language === 'np' ? 'अघि' : 'ago'}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Realtime Feed pill matching Screenshot 1 */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {language === 'np' ? 'हालैका रिपोर्टहरू' : 'Recent Reports'}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t.realtimeFeed}</span>
        </div>
      </div>

      {/* Severity Filter Pills matching Screenshot 1 */}
      <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-1">
        {['All', 'Critical', 'Moderate', 'Low'].map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {filter === 'All' ? t.filters.all :
               filter === 'Critical' ? t.filters.critical :
               filter === 'Moderate' ? t.filters.moderate : t.filters.low}
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">
              {language === 'np' ? 'कुनै पनि सक्रिय रिपोर्टहरू भेटिएन।' : 'No active hazard reports for this severity level.'}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isCritical = report.severity?.toUpperCase() === 'CRITICAL';
            const isModerate = report.severity?.toUpperCase() === 'MODERATE';
            const isLow = report.severity?.toUpperCase() === 'LOW';

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header: Title + Badges */}
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {report.title}
                    </h3>
                    {report.ai_detected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        <Sparkles className="w-3 h-3" />
                        AI DETECTED
                      </span>
                    )}
                  </div>

                  {/* Severity Badge */}
                  <div>
                    {isCritical && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-200">
                        CRITICAL
                      </span>
                    )}
                    {isModerate && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-200">
                        MODERATE
                      </span>
                    )}
                    {isLow && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                        LOW
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {report.description}
                </p>

                {/* Metadata row: Coordinates + Timestamp */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="text-rose-500">📍</span>
                    <span>
                      {language === 'np' ? 'निर्देशांक' : 'Coordinates'}: {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{getRelativeTime(report.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
