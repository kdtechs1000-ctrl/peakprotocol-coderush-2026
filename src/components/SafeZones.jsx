import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { translateDistrict, translateFacility } from '../i18n/translations';
import { ShieldCheck, Phone, MapPin, CheckCircle, Plus, X, Navigation, Check } from 'lucide-react';

const COMMON_FACILITIES = [
  'Clean Water',
  'Medical Camp',
  'Backup Power',
  'Food Supplies',
  'Tents',
  'Sanitation',
  'Satellite Phone',
  'Helipad Landing'
];

export default function SafeZones() {
  const { safeShelters, addSafeShelter, userLocation, language, setActiveTab, t, translateLiveContent } = useMode();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    district: 'Kathmandu',
    capacity: '500',
    current_occupancy: '0',
    facilities: ['Clean Water', 'Medical Camp'],
    contact: '',
    latitude: userLocation.lat.toFixed(4),
    longitude: userLocation.lng.toFixed(4)
  });

  const handleFacilityToggle = (fac) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(fac);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== fac)
          : [...prev.facilities, fac]
      };
    });
  };

  const handleUseCurrentLocation = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: userLocation.lat.toFixed(4),
      longitude: userLocation.lng.toFixed(4)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addSafeShelter({
      name: formData.name,
      district: formData.district,
      capacity: parseInt(formData.capacity) || 500,
      current_occupancy: parseInt(formData.current_occupancy) || 0,
      facilities: formData.facilities,
      contact: formData.contact || '+977-9800000000',
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });

    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      district: 'Kathmandu',
      capacity: '500',
      current_occupancy: '0',
      facilities: ['Clean Water', 'Medical Camp'],
      contact: '',
      latitude: userLocation.lat.toFixed(4),
      longitude: userLocation.lng.toFixed(4)
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <span>{t.safeZones.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.safeZones.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Add New Safe Location Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>{t.safeZones.addNew}</span>
          </button>

          {/* View on Live Map */}
          <button
            onClick={() => setActiveTab('liveMap')}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            {t.common.viewOnLiveMap}
          </button>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safeShelters.map((sh) => {
          const occupancyPercent = Math.round((sh.current_occupancy / sh.capacity) * 100);
          return (
            <div
              key={sh.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{translateLiveContent(sh.name)}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex-shrink-0">
                  {translateDistrict(language, sh.district)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.safeZones.coordinates}: {Number(sh.latitude).toFixed(3)}, {Number(sh.longitude).toFixed(3)}</span>
              </div>

              {/* Occupancy Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{t.safeZones.capacityOccupancy}</span>
                  <span>{sh.current_occupancy} / {sh.capacity} ({occupancyPercent}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                  ></div>
                </div>
              </div>

              {/* Facilities Checklist */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t.safeZones.emergencyResources}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sh.facilities?.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {translateFacility(language, f)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              {sh.contact && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t.safeZones.campCoordinator}:</span>
                  <a
                    href={`tel:${sh.contact}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{sh.contact}</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD NEW SAFE LOCATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-up">
            
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.safeZones.communityLabel}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t.safeZones.registerTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.safeZones.registerSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.safeZones.shelterName}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.safeZones.shelterNamePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* District & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.safeZones.district}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-800"
                  >
                    {['Kathmandu', 'Kaski', 'Chitwan', 'Sunsari', 'Makwanpur', 'Lalitpur', 'Bhaktapur', 'Myagdi', 'Gorkha'].map((district) => (
                      <option key={district} value={district}>
                        {translateDistrict(language, district)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.safeZones.coordinatorContact}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={t.safeZones.phonePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Capacity & Initial Occupancy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.safeZones.totalCapacity}
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.safeZones.currentOccupancy}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_occupancy}
                    onChange={(e) => setFormData({ ...formData, current_occupancy: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Coordinates Verification */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.safeZones.gpsCoordinates}
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t.common.useMyLocation}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder={t.safeZones.latitudePlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                  />
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder={t.safeZones.longitudePlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Facilities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t.safeZones.emergencyResources}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_FACILITIES.map((fac) => {
                    const isSelected = formData.facilities.includes(fac);
                    return (
                      <button
                        type="button"
                        key={fac}
                        onClick={() => handleFacilityToggle(fac)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{translateFacility(language, fac)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 transition-all mt-2"
              >
                {t.safeZones.broadcastSave}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
