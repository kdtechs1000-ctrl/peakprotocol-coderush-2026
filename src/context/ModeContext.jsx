import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  INITIAL_HAZARD_REPORTS,
  INITIAL_RED_ZONES,
  INITIAL_HAZARD_VECTORS,
  INITIAL_SAFE_SHELTERS,
  INITIAL_DISTRICT_IMPACTS,
  checkPointInRedZone
} from '../services/supabaseClient';
import {
  queueOfflineReport,
  queueOfflineSos,
  getQueuedReports,
  clearQueuedReports
} from '../services/indexedDbService';
import { fetchAllLiveDisasterEvents } from '../services/liveDisasterService';
import { translations } from '../i18n/translations';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  // Core states
  const [isEmergencyMode, setIsEmergencyMode] = useState(true); // Default to live disaster watch for presentation
  const [currentDangerZone, setCurrentDangerZone] = useState(null);
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('liveMap'); // Default to Live Map so user immediately sees live API locations!
  const [isReportingModalOpen, setIsReportingModalOpen] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);

  // User GPS coordinates (defaults to Kathmandu or live watch)
  const [userLocation, setUserLocation] = useState({ lat: 27.7172, lng: 85.3240 });

  // Disaster dataset states
  const [reports, setReports] = useState(INITIAL_HAZARD_REPORTS);
  const [redZones, setRedZones] = useState(INITIAL_RED_ZONES);
  const [hazardVectors, setHazardVectors] = useState(INITIAL_HAZARD_VECTORS);
  const [safeShelters, setSafeShelters] = useState(INITIAL_SAFE_SHELTERS);
  const [districtImpacts, setDistrictImpacts] = useState(INITIAL_DISTRICT_IMPACTS);
  const [isLoadingLiveFeeds, setIsLoadingLiveFeeds] = useState(false);

  // Notification / toast
  const [alertBanner, setAlertBanner] = useState(null);

  const t = translations[language] || translations.en;

  // Function to query actual live public disaster APIs (USGS Seismic + BIPAD Portal + Open-Meteo)
  const refreshLiveFeeds = async () => {
    setIsLoadingLiveFeeds(true);
    try {
      const liveEvents = await fetchAllLiveDisasterEvents();
      if (liveEvents && liveEvents.length > 0) {
        setReports((prev) => {
          // Merge and deduplicate by ID
          const liveIds = new Set(liveEvents.map(e => e.id));
          const filteredPrev = prev.filter(p => !liveIds.has(p.id));
          return [...liveEvents, ...filteredPrev];
        });
        setAlertBanner(`📡 Live Disaster APIs Synced: Located ${liveEvents.length} real-time hazard events (USGS & BIPAD Portal).`);
      }
    } catch (err) {
      console.warn('Error refreshing live disaster feeds:', err);
    } finally {
      setIsLoadingLiveFeeds(false);
    }
  };

  // 1. DYNAMIC TRIGGER: Supabase Realtime Subscription on system_status & safe_shelters + Live APIs
  useEffect(() => {
    const fetchInitialData = async () => {
      // Step A: Fetch Live Telemetry from USGS & BIPAD APIs
      try {
        const liveEvents = await fetchAllLiveDisasterEvents();
        if (liveEvents && liveEvents.length > 0) {
          setReports((prev) => {
            const liveIds = new Set(liveEvents.map(e => e.id));
            const filteredPrev = prev.filter(p => !liveIds.has(p.id));
            return [...liveEvents, ...filteredPrev];
          });
        }
      } catch (err) {
        console.warn('Live API telemetry load:', err.message);
      }

      // Step B: Fetch Supabase Database status & hazard reports
      try {
        const { data: statusData } = await supabase
          .table('system_status')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (statusData && statusData.length > 0) {
          const latest = statusData[0];
          if (latest.emergency_active !== undefined) {
            setIsEmergencyMode(latest.emergency_active);
          }
        }

        const { data: reportsData } = await supabase
          .table('hazard_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsData && reportsData.length > 0) {
          setReports((prev) => {
            const dbIds = new Set(reportsData.map(r => r.id));
            const nonDbLive = prev.filter(p => !dbIds.has(p.id));
            return [...reportsData, ...nonDbLive];
          });
        }

        const { data: zonesData } = await supabase
          .table('red_zones')
          .select('*')
          .eq('is_active', true);

        if (zonesData && zonesData.length > 0) {
          setRedZones(zonesData);
        }

        const { data: sheltersData } = await supabase
          .table('safe_shelters')
          .select('*')
          .order('created_at', { ascending: false });

        if (sheltersData && sheltersData.length > 0) {
          const normalizedShelters = sheltersData.map(s => ({
            ...s,
            contact: s.contact_number || s.contact
          }));
          setSafeShelters(normalizedShelters);
        }
      } catch (err) {
        console.warn('Initial Supabase fetch fallback to local seed data:', err.message);
      }
    };

    fetchInitialData();

    // Auto-poll live APIs every 2 minutes
    const intervalId = setInterval(() => {
      refreshLiveFeeds();
    }, 120000);

    // Setup Realtime Channel
    const systemChannel = supabase
      .channel('realtime_system_status')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_status' },
        (payload) => {
          console.log('Realtime system_status update:', payload);
          if (payload.new && payload.new.emergency_active !== undefined) {
            setIsEmergencyMode(payload.new.emergency_active);
            if (payload.new.emergency_active) {
              setAlertBanner(payload.new.broadcast_message || 'Emergency Mode Activated by National Disaster Center');
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hazard_reports' },
        (payload) => {
          console.log('New hazard report received:', payload);
          setReports((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'safe_shelters' },
        (payload) => {
          console.log('New safe shelter received:', payload);
          const item = { ...payload.new, contact: payload.new.contact_number || payload.new.contact };
          setSafeShelters((prev) => [item, ...prev]);
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(systemChannel);
    };
  }, []);

  // 2. DYNAMIC TRIGGER: Automated Geofence Check via GPS watchPosition
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Query spatial RPC or fallback polygon check
        const inZone = await checkPointInRedZone(latitude, longitude);
        if (inZone && inZone.inside) {
          setCurrentDangerZone(inZone);
          setIsEmergencyMode(true); // Automatically force emergency mode when in danger zone
        } else {
          setCurrentDangerZone(null);
        }
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 3. Network connectivity & IndexedDB offline syncing
  useEffect(() => {
    const handleOnline = async () => {
      setOfflineMode(false);
      // Sync queued offline reports to Supabase
      const queued = await getQueuedReports();
      if (queued.length > 0) {
        try {
          for (const item of queued) {
            const { local_id, queued_at, ...cleanReport } = item;
            await supabase.table('hazard_reports').insert(cleanReport);
          }
          await clearQueuedReports();
          setAlertBanner(`Connected! Synced ${queued.length} offline hazard report(s) to National Grid.`);
        } catch (err) {
          console.error('Failed to sync offline queue:', err);
        }
      }
    };

    const handleOffline = () => {
      setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add new report
  const addHazardReport = async (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      title: reportData.title,
      description: reportData.description,
      hazard_type: reportData.hazard_type || 'Landslide',
      severity: reportData.severity || 'CRITICAL',
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      ai_detected: !!reportData.ai_detected,
      image_url: reportData.image_url || null,
      status: 'VERIFIED',
      created_at: new Date().toISOString(),
      reported_by: reportData.reported_by || 'Citizen Reporter'
    };

    // Optimistically update UI
    setReports((prev) => [newReport, ...prev]);

    if (!offlineMode) {
      try {
        await supabase.table('hazard_reports').insert({
          title: newReport.title,
          description: newReport.description,
          hazard_type: newReport.hazard_type,
          severity: newReport.severity,
          latitude: newReport.latitude,
          longitude: newReport.longitude,
          ai_detected: newReport.ai_detected,
          status: 'VERIFIED'
        });
      } catch (err) {
        console.warn('Network error saving report to Supabase, queuing locally:', err);
        await queueOfflineReport(newReport);
      }
    } else {
      await queueOfflineReport(newReport);
    }
  };

  // Add new safe shelter
  const addSafeShelter = async (shelterData) => {
    const newShelter = {
      id: `sh-${Date.now()}`,
      name: shelterData.name,
      district: shelterData.district || 'Kathmandu',
      capacity: parseInt(shelterData.capacity) || 500,
      current_occupancy: parseInt(shelterData.current_occupancy) || 0,
      latitude: parseFloat(shelterData.latitude),
      longitude: parseFloat(shelterData.longitude),
      facilities: shelterData.facilities || ['Clean Water', 'Medical Camp'],
      contact: shelterData.contact || '+977-9800000000',
      created_at: new Date().toISOString()
    };

    setSafeShelters((prev) => [newShelter, ...prev]);
    setAlertBanner(`✅ New Safe Location added: ${newShelter.name} (${newShelter.district})`);

    if (!offlineMode) {
      try {
        await supabase.table('safe_shelters').insert({
          name: newShelter.name,
          district: newShelter.district,
          capacity: newShelter.capacity,
          current_occupancy: newShelter.current_occupancy,
          latitude: newShelter.latitude,
          longitude: newShelter.longitude,
          facilities: newShelter.facilities,
          contact_number: newShelter.contact
        });
      } catch (err) {
        console.warn('Error saving safe shelter to Supabase:', err.message);
      }
    }
  };

  // Submit Emergency SOS
  const triggerSos = async (customCoords) => {
    const coords = customCoords || userLocation;
    const sosPayload = {
      user_name: 'Emergency User',
      phone: '9800000000',
      status: 'CRITICAL',
      latitude: coords.lat,
      longitude: coords.lng,
      is_resolved: false,
      created_at: new Date().toISOString()
    };

    if (!offlineMode) {
      try {
        await supabase.table('sos_pings').insert(sosPayload);
      } catch (err) {
        console.warn('Error pushing SOS to Supabase, fallback queue:', err);
        await queueOfflineSos(sosPayload);
      }
    } else {
      await queueOfflineSos(sosPayload);
      // Trigger SMS fallback immediately
      window.location.href = `sms:1234?body=EMERGENCY SOS: Help needed at Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}. Sent via Peak Protocol.`;
    }

    setAlertBanner('🚨 SOS Rescue beacon transmitted! Coordinates sent to rescue command.');
  };

  return (
    <ModeContext.Provider
      value={{
        isEmergencyMode,
        setIsEmergencyMode,
        currentDangerZone,
        setCurrentDangerZone,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isReportingModalOpen,
        setIsReportingModalOpen,
        offlineMode,
        setOfflineMode,
        userLocation,
        setUserLocation,
        reports,
        redZones,
        hazardVectors,
        safeShelters,
        districtImpacts,
        addHazardReport,
        addSafeShelter,
        triggerSos,
        refreshLiveFeeds,
        isLoadingLiveFeeds,
        alertBanner,
        setAlertBanner,
        t
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
