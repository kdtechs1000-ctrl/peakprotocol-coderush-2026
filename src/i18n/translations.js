/**
 * i18n/translations.js
 * ====================
 * Full English ('en') and Nepali ('np') localization dictionaries.
 */

export const translations = {
  en: {
    appTitle: 'Peak Protocol',
    subTitle: 'National Emergency Response Network',
    live: 'LIVE',
    offline: 'Offline',
    tabs: {
      liveMap: 'Live Map',
      reportHazard: 'Report Hazard',
      recentReports: 'Recent Reports',
      planRoute: 'Plan Route',
      safeZones: 'Safe Zones'
    },
    tourismMode: 'Tourism Mode',
    disasterMode: 'Emergency Mode',
    switchMode: 'Switch Mode',
    adminOverride: 'Admin Override',
    realtimeFeed: 'Realtime Feed',
    common: {
      coordinates: 'Coordinates',
      gpsCoordinates: 'GPS Coordinates',
      useMyLocation: 'Use My Location',
      refreshGps: 'Refresh GPS',
      acquiringGps: 'Acquiring...',
      gpsLocked: 'GPS LOCKED',
      autoDetectedGps: 'Auto-Detected GPS Location',
      yourCurrentLocation: 'Your Current Location',
      justNow: 'Just now',
      minutesAgo: 'ago',
      hoursAgo: 'ago',
      daysAgo: 'ago',
      recentReports: 'Recent Reports',
      noActiveReports: 'No active hazard reports for this severity level.',
      viewOnLiveMap: 'View on Live Map →',
      aiDetected: 'AI DETECTED'
    },
    filters: {
      all: 'All',
      critical: 'Critical',
      moderate: 'Moderate',
      low: 'Low',
      landslides: 'Landslides',
      floods: 'Floods',
      safeShelters: 'Safe Shelters'
    },
    stats: {
      activeAlerts: 'Active Alerts',
      safeShelters: 'Safe Shelters',
      blockedRoads: 'Blocked Roads',
      liveCctv: 'Live CCTV'
    },
    map: {
      street: 'Street',
      satellite: 'Satellite',
      verifiedSafeShelter: 'VERIFIED SAFE SHELTER',
      capacity: 'Capacity',
      persons: 'persons',
      telephone: 'Tel',
      aiDetected: 'AI DETECTED',
      hazardGeofence: 'HAZARD GEOFENCE',
      activeEvacuationArea: 'Active evacuation area. Traversing this perimeter triggers immediate system warning.',
      waterVector: 'WATER VECTOR',
      flowRate: 'Flow Rate',
      heading: 'Heading',
      latitude: 'Lat',
      longitude: 'Lng'
    },
    footer: {
      collaboration: 'In collaboration with NDRRMA, DHM, BIPAD & Nepal Army.',
      postgis: 'PostGIS Enabled',
      gemini: 'Gemini AI Detection',
      offlineSync: 'PWA Offline Sync'
    },
    reportModal: {
      onlineTitle: 'Report a hazard',
      onlineSub: 'Add a photo and location. Leave the type blank and our AI will identify it for you.',
      offlineBanner: 'OFFLINE MODE (SMS EMERGENCY SERVICE)',
      offlineSub: 'Low Latency Direct SMS Dispatch',
      switchToOffline: 'Switch to Offline',
      switchToOnline: 'Switch to Online',
      aiActive: 'AI Hazard Detection Active',
      disasterType: 'DISASTER TYPE',
      disasterTypeOptional: 'DISASTER TYPE (OPTIONAL)',
      disasterTypePlaceholder: 'e.g. Flood — leave blank for AI detection',
      severity: 'RISK SEVERITY LEVEL (OPTIONAL)',
      selectSeverity: '-- Select Severity --',
      photoEvidence: 'PHOTO EVIDENCE',
      launchCamera: 'Launch Viewfinder Camera',
      chooseFile: 'Choose File',
      noFileChosen: 'No file chosen',
      coordVerification: 'COORDINATE VERIFICATION',
      tapMapPrompt: 'Or tap the map to pin the location',
      useCurrentLocation: 'Use my current location',
      dispatchSms: 'DISPATCH EMERGENCY SMS REPORT',
      submitOnline: 'SUBMIT REPORT (ONLINE GRID)',
      analyzingWithAi: 'Analyzing with Gemini AI...',
      submitting: 'Broadcasting...',
      offlineMessage: 'Low latency offline emergency report dispatched directly via SMS 1234.',
      offlineGpsNote: 'Map rendered offline is disabled. Your exact live device coordinates are encoded directly into the SMS payload for Nepal Emergency Services (1234).',
      syncedStatus: 'Synced to backend',
      localStatus: 'Saved locally · syncs when online',
      smsSubmitted: 'SMS Dispatch triggered & report queued!',
      submissionSuccess: 'Report submitted successfully!'
    },
    planRoute: {
      title: 'Plan a safe journey',
      sub: 'Set a start and end point — we compare a fastest route against a hazard-avoiding safest route.',
      quickHubs: 'QUICK HUBS',
      startingPoint: 'STARTING POINT',
      destination: 'DESTINATION',
      suggestRoutes: 'Suggest routes',
      calculating: 'Calculating safe trajectories...',
      fastestLabel: 'Fastest Route',
      safestLabel: 'Safest Route (Hazard Avoidance)',
      hazardWarning: 'Traverses High-Risk Hazard Zone',
      safePathNotice: 'Detours around active flood/landslide zones'
    },
    geofenceAlert: {
      warning: 'YOU ARE INSIDE A HIGH-RISK HAZARD ZONE. EVACUATE IMMEDIATELY.',
      zone: 'Zone',
      action: 'Follow emergency evacuation arrows to designated safe shelter.'
    },
    hotlines: {
      police: 'Police',
      fire: 'Fire Brigade',
      ambulance: 'Ambulance',
      neoc: 'NDRRMA / NEOC',
      title: 'National Emergency Hotlines',
      sub: 'Toll-Free Direct Dispatch'
    },
    volunteerTour: {
      emergencyTitle: 'Register 4x4 Vehicle & Relief Volunteer Resource',
      tourismTitle: 'Book Himalayan Trek & Certified Guide',
      emergencyDescription: 'Pivot tourism transport and mountaineering skills toward national flood and landslide evacuation.',
      tourismDescription: 'Explore the Himalayas with licensed local Sherpa guides and comprehensive safety monitoring.',
      emergencySuccessTitle: 'Relief Resource Registered!',
      tourismSuccessTitle: 'Trek Booking Requested!',
      emergencySuccessText: 'Thank you for standing with Nepal. NDRRMA emergency logistics desk will dispatch your unit as needs arise.',
      tourismSuccessText: 'Your expedition request has been routed to our certified Sherpa guide network. We will contact you within 2 hours.',
      submitAnother: 'Submit Another',
      emergencyButton: 'Register Resource for Relief Deployment',
      tourismButton: 'Confirm Tour Inquiry'
    },
    sos: {
      button: 'SOS RESCUE',
      prompt: 'Broadcasting your live GPS coordinates to Nepal Army & Armed Police Force rescue units.',
      transmitted: 'Emergency SOS Transmitted!',
      immediateSteps: 'Immediate Survival Steps:'
    },
    safeZones: {
      title: 'Verified Safe Shelters & Assembly Zones',
      subtitle: 'Pre-designated open spaces certified by NDRRMA, equipped with satellite communication, clean water, and triage units.',
      addNew: 'Add New Safe Location',
      viewOnMap: 'View on Live Map →',
      registerTitle: 'Register New Safe Location',
      registerSubtitle: 'Add an open space, relief camp, or reinforced evacuation center to the National Grid.',
      broadcastSave: 'Broadcast & Save Safe Location',
      communityLabel: 'Community Shelter Registration',
      coordinatorContact: 'Camp Coordinator Contact',
      resourceAvailability: 'Emergency Resources Available',
      totalCapacity: 'Total Capacity (Persons)',
      currentOccupancy: 'Current Occupancy',
      gpsCoordinates: 'GPS Coordinates',
      useLocation: 'Use My Location',
      shelterName: 'Shelter / Safe Location Name',
      district: 'District',
      coordinates: 'Coordinates',
      capacityOccupancy: 'Capacity Occupancy',
      emergencyResources: 'Emergency Resources Available',
      campCoordinator: 'Camp Coordinator',
      shelterName: 'Shelter / Safe Location Name',
      currentOccupancy: 'Current Occupancy',
      gpsCoordinates: 'GPS Coordinates'
    },
    districtImpact: {
      title: 'National District Impact Summary',
      subtitle: 'Verified casualty & monetary infrastructure damage verified by MoHA & NDRRMA.',
      deaths: 'Deaths',
      missing: 'Missing',
      injured: 'Injured',
      displaced: 'Displaced Families',
      damage: 'Est. Damage',
      district: 'District',
      province: 'Province',
      estimatedDamage: 'Est. Damage (NPR)'
    }
  },
  np: {
    appTitle: 'Peak Protocol (पिक प्रोटोकल)',
    subTitle: 'राष्ट्रिय आपतकालीन उद्धार तथा सुरक्षा नेटवर्क',
    live: 'प्रत्यक्ष',
    offline: 'अफलाइन',
    tabs: {
      liveMap: 'प्रत्यक्ष नक्सा',
      reportHazard: 'विपद् रिपोर्ट गर्नुहोस्',
      recentReports: 'हालैका रिपोर्टहरू',
      planRoute: 'सुरक्षित यात्रा योजना',
      safeZones: 'सुरक्षित क्षेत्रहरू'
    },
    tourismMode: 'पर्यटन मोड',
    disasterMode: 'आपतकालीन मोड',
    switchMode: 'मोड परिवर्तन गर्नुहोस्',
    adminOverride: 'प्रशासक नियन्त्रण',
    realtimeFeed: 'प्रत्यक्ष फिड',
    common: {
      coordinates: 'निर्देशांक',
      gpsCoordinates: 'जीपीएस स्थान',
      useMyLocation: 'मेरो हालको स्थान प्रयोग गर्नुहोस्',
      refreshGps: 'जीपीएस ताजा गर्नुहोस्',
      acquiringGps: 'प्राप्त गरिँदै...',
      gpsLocked: 'जीपीएस लक गरिएको',
      autoDetectedGps: 'स्वतः पहिचान गरिएको जीपीएस स्थान',
      yourCurrentLocation: 'तपाईंको हालको स्थान',
      justNow: 'भर्खरै',
      minutesAgo: 'अघि',
      hoursAgo: 'अघि',
      daysAgo: 'अघि',
      recentReports: 'हालैका रिपोर्टहरू',
      noActiveReports: 'कुनै पनि सक्रिय रिपोर्टहरू भेटिएन।',
      viewOnLiveMap: 'प्रत्यक्ष नक्सामा हेर्नुहोस् →',
      aiDetected: 'एआईद्वारा पहिचान गरिएको'
    },
    filters: {
      all: 'सबै',
      critical: 'अति संवेदनशील',
      moderate: 'मध्यम',
      low: 'सामान्य',
      landslides: 'पहिरोहरू',
      floods: 'बाढीहरू',
      safeShelters: 'सुरक्षित आश्रयहरू'
    },
    stats: {
      activeAlerts: 'सक्रिय सतर्कता',
      safeShelters: 'सुरक्षित आश्रय',
      blockedRoads: 'अवरुद्ध सडक',
      liveCctv: 'प्रत्यक्ष सीसीटीभी'
    },
    map: {
      street: 'सडक',
      satellite: 'स्याटेलाइट',
      verifiedSafeShelter: 'प्रमाणित सुरक्षित आश्रय',
      capacity: 'क्षमता',
      persons: 'व्यक्ति',
      telephone: 'फोन',
      aiDetected: 'एआईद्वारा पहिचान गरिएको',
      hazardGeofence: 'विपद् सुरक्षा क्षेत्र',
      activeEvacuationArea: 'सक्रिय निकासी क्षेत्र। यस सीमाभित्र प्रवेश गर्दा तत्काल प्रणाली चेतावनी जारी हुन्छ।',
      waterVector: 'पानीको बहाव',
      flowRate: 'बहाव दर',
      heading: 'दिशा',
      latitude: 'अक्षांश',
      longitude: 'देशान्तर'
    },
    footer: {
      collaboration: 'NDRRMA, DHM, BIPAD तथा नेपाली सेनासँग सहकार्यमा।',
      postgis: 'PostGIS सक्रिय',
      gemini: 'Gemini एआई पहिचान',
      offlineSync: 'PWA अफलाइन सिंक'
    },
    reportModal: {
      onlineTitle: 'विपद् रिपोर्ट गर्नुहोस्',
      onlineSub: 'तस्बिर र स्थान थप्नुहोस्। विपद्को प्रकार खाली छाड्न सक्नुहुन्छ, हाम्रो एआईले स्वतः पहिचान गर्नेछ।',
      offlineBanner: 'अफलाइन मोड (एसएमएस आपतकालीन सेवा)',
      offlineSub: 'सिधा आपतकालीन एसएमएस प्रेषण',
      switchToOffline: 'अफलाइनमा जानुहोस्',
      switchToOnline: 'अनलाइनमा जानुहोस्',
      aiActive: 'एआई विपद् पहिचान सक्रिय छ',
      disasterType: 'विपद्को प्रकार',
      disasterTypeOptional: 'विपद्को प्रकार (ऐच्छिक)',
      disasterTypePlaceholder: 'उदा. बाढी वा पहिरो — एआई पहिचानका लागि खाली छाड्नुहोस्',
      severity: 'जोखिम गम्भीरता स्तर (ऐच्छिक)',
      selectSeverity: '-- स्तर चयन गर्नुहोस् --',
      photoEvidence: 'तस्बिर प्रमाण',
      launchCamera: 'क्यामेरा खोल्नुहोस्',
      chooseFile: 'फाइल छान्नुहोस्',
      noFileChosen: 'कुनै फाइल छैन',
      coordVerification: 'स्थान प्रमाणिकरण',
      tapMapPrompt: 'वा स्थान छान्न नक्सामा थिच्नुहोस्',
      useCurrentLocation: 'मेरो हालको स्थान प्रयोग गर्नुहोस्',
      dispatchSms: 'आपतकालीन एसएमएस पठाउनुहोस्',
      submitOnline: 'रिपोर्ट पेश गर्नुहोस् (अनलाइन ग्रिड)',
      analyzingWithAi: 'जेमिनी एआईद्वारा विश्लेषण हुँदैछ...',
      submitting: 'प्रसारण गरिँदैछ...',
      offlineMessage: 'इन्टरनेट बिना सिधा एसएमएस (१२३४) मार्फत आफ्नो जीपीएस स्थानसहित रिपोर्ट पठाउनुहोस्।',
      offlineGpsNote: 'इन्टरनेट नभएको बेला नक्सा लोड हुँदैन; तपाईंको यन्त्रको जीपीएस स्थान स्वतः एसएमएसमा पठाइनेछ।',
      syncedStatus: 'ब्याकएन्डमा सिंक गरियो',
      localStatus: 'लोकलमा सुरक्षित · अनलाइन हुँदा सिंक हुन्छ',
      smsSubmitted: 'एसएमएस प्रेषण शुरू भयो र रिपोर्ट प्रतीक्षा सूचीमा राखियो!',
      submissionSuccess: 'रिपोर्ट सफलतापूर्वक पेश भयो!'
    },
    planRoute: {
      title: 'सुरक्षित यात्रा योजना',
      sub: 'सुरु र गन्तव्य विन्दु तय गर्नुहोस् — हामी द्रुत मार्ग र विपद्-रहित सुरक्षित मार्ग तुलना गर्नेछौं।',
      quickHubs: 'प्रमुख शहरहरू',
      startingPoint: 'सुरुवात विन्दु',
      destination: 'गन्तव्य',
      suggestRoutes: 'मार्ग सुझाव दिनुहोस्',
      calculating: 'सुरक्षित मार्ग गणना हुँदैछ...',
      fastestLabel: 'सबैभन्दा छिटो मार्ग',
      safestLabel: 'सबैभन्दा सुरक्षित मार्ग (जोखिम छलिएको)',
      hazardWarning: 'सक्रिय जोखिम क्षेत्र भएर जान्छ',
      safePathNotice: 'बाढी र पहिरो क्षेत्रबाट पर सुरक्षित मार्ग'
    },
    geofenceAlert: {
      warning: '⚠️ तपाईं उच्च जोखिमयुक्त विपद् क्षेत्रभित्र हुनुहुन्छ। तुरुन्तै सुरक्षित स्थानमा जानुहोस्।',
      zone: 'जोखिम क्षेत्र',
      action: 'नजिकैको सुरक्षित आश्रयस्थलमा जानुहोस्।'
    },
    hotlines: {
      police: 'नेपाल प्रहरी',
      fire: 'दमकल',
      ambulance: 'एम्बुलेन्स',
      neoc: 'विपद् प्राधिकरण (NEOC)',
      title: 'आपतकालीन हटलाइनहरू',
      sub: 'टोल-फ्री प्रत्यक्ष प्रेषण'
    },
    volunteerTour: {
      emergencyTitle: 'राहत उद्धार स्वयंसेवक तथा सवारी दर्ता',
      tourismTitle: 'प्रमाणित ट्रेकिङ गाइड तथा भ्रमण बुकिङ',
      emergencyDescription: 'पर्यटन यातायात र हिमालयी दक्षताहरूलाई राष्ट्रिय बाढी र पहिरो निकासीमा समायोजित गर्नुहोस्।',
      tourismDescription: 'स्थानीय लाइसेन्स प्राप्त शेरपा गाइड र व्यापक सुरक्षा अनुगमनसहित हिमालय अन्वेषण गर्नुहोस्।',
      emergencySuccessTitle: 'राहत संसाधन दर्ता भयो!',
      tourismSuccessTitle: 'ट्रेक बुकिङ अनुरोध गरिएको छ!',
      emergencySuccessText: 'नेपालका लागि सहयोग गर्नुभएकोमा धन्यवाद। NDRRMA आपतकालीन लजिस्टिक डेस्कले आवश्यकताअनुसार तपाईंको इकाईलाई पठाउनेछ।',
      tourismSuccessText: 'तपाईंको भ्रमण अनुरोध प्रमाणित शेरपा गाइड नेटवर्कमा पठाइएको छ। हामी २ घण्टाभित्र तपाईंलाई सम्पर्क गर्नेछौं।',
      submitAnother: 'अर्को पेश गर्नुहोस्',
      emergencyButton: 'राहत प्रस्थापनका लागि साधन दर्ता गर्नुहोस्',
      tourismButton: 'पर्यटन enquiry पुष्टि गर्नुहोस्'
    },
    sos: {
      button: 'एसओएस उद्धार',
      prompt: 'तपाईंको प्रत्यक्ष जीपीएस स्थान नेपाली सेना र सशस्त्र प्रहरी बलमा पठाइँदैछ।',
      transmitted: 'एसओएस संकेत प्रसारित गरियो!',
      immediateSteps: 'तत्काल जीवित रहने कदम:'
    },
    safeZones: {
      title: 'सुरक्षित आश्रयस्थल तथा भेला क्षेत्र',
      subtitle: 'NDRRMA द्वारा प्रमाणित खुला स्थानहरू, जसमा उपग्रह संचार, स्वच्छ पानी र ट्राएज यूनिटहरू छन्।',
      addNew: 'नयाँ सुरक्षित स्थान थप्नुहोस्',
      viewOnMap: 'प्रत्यक्ष नक्सामा हेर्नुहोस् →',
      registerTitle: 'नयाँ सुरक्षित स्थान दर्ता गर्नुहोस्',
      registerSubtitle: 'राष्ट्रिय ग्रिडमा खुला स्थान, राहत शिविर, वा मजबूतीकरण गरिएको निकाल्ने केन्द्र थप्नुहोस्।',
      broadcastSave: 'सुरक्षित स्थान थप्नुहोस् (प्रसारण गर्नुहोस्)',
      communityLabel: 'सामुदायिक आश्रय दर्ता',
      coordinatorContact: 'शिविर समन्वयक सम्पर्क',
      resourceAvailability: 'उपलब्ध आपतकालीन संसाधनहरू',
      totalCapacity: 'कुल क्षमता (व्यक्ति)',
      currentOccupancy: 'हालको भाडा',
      gpsCoordinates: 'जीपीएस निर्देशांक',
      useLocation: 'मेरो स्थान प्रयोग गर्नुहोस्',
      shelterName: 'आश्रय / सुरक्षित स्थान नाम',
      district: 'जिल्ला',
      coordinates: 'निर्देशांक',
      capacityOccupancy: 'क्षमता उपयोग',
      emergencyResources: 'उपलब्ध आपतकालीन संसाधनहरू',
      campCoordinator: 'शिविर समन्वयक',
      shelterName: 'आश्रय / सुरक्षित स्थान नाम',
      currentOccupancy: 'हालको भाडा',
      gpsCoordinates: 'जीपीएस निर्देशांक'
    },
    districtImpact: {
      title: 'जिल्लागत क्षति तथा प्रभाव विवरण',
      subtitle: 'गृह मन्त्रालय तथा राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरण (NDRRMA) बाट प्रमाणित तथ्यांक।',
      deaths: 'मृत्यु',
      missing: 'बेपत्ता',
      injured: 'घाइते',
      displaced: 'विस्थापित परिवार',
      damage: 'अनुमानित क्षति',
      district: 'जिल्ला',
      province: 'प्रदेश',
      estimatedDamage: 'अनुमानित क्षति (NPR)'
    }
  }
};

export const translateHazardType = (language, type) => {
  const lookup = {
    en: {
      Flood: 'Flood',
      Landslide: 'Landslide',
      'Safe Shelter': 'Safe Shelter',
      'Road Block': 'Road Block',
      Earthquake: 'Earthquake',
      Fire: 'Fire',
      'Disaster Alert': 'Disaster Alert',
      default: 'Hazard'
    },
    np: {
      Flood: 'बाढी',
      Landslide: 'पहिरो',
      'Safe Shelter': 'सुरक्षित आश्रय',
      'Road Block': 'सडक अवरुद्ध',
      Earthquake: 'भूकम्प',
      Fire: 'आगलागी',
      'Disaster Alert': 'विपद् सतर्कता',
      default: 'विपद्'
    }
  };

  return lookup[language]?.[type] || lookup.en[type] || type || lookup.en.default;
};

export const translateSeverity = (language, severity) => {
  const lookup = {
    en: {
      CRITICAL: 'CRITICAL',
      MODERATE: 'MODERATE',
      LOW: 'LOW'
    },
    np: {
      CRITICAL: 'अति संवेदनशील',
      MODERATE: 'मध्यम',
      LOW: 'सामान्य'
    }
  };

  return lookup[language]?.[severity?.toUpperCase()] || severity || '';
};

export const translateFacility = (language, facility) => {
  const lookup = {
    en: {
      'Clean Water': 'Clean Water',
      'Medical Camp': 'Medical Camp',
      'Backup Power': 'Backup Power',
      'Food Supplies': 'Food Supplies',
      Tents: 'Tents',
      Sanitation: 'Sanitation',
      'Satellite Phone': 'Satellite Phone',
      'Helipad Landing': 'Helipad Landing',
      'Medical Aid': 'Medical Aid',
      'Satellite Comms': 'Satellite Comms',
      'Rescue Boats': 'Rescue Boats',
      'Life Jackets': 'Life Jackets',
      'Emergency Rations': 'Emergency Rations',
      'Disaster Relief Team': 'Disaster Relief Team',
      'Mobile Clinic': 'Mobile Clinic',
      'Solar Generator': 'Solar Generator'
    },
    np: {
      'Clean Water': 'स्वच्छ पानी',
      'Medical Camp': 'स्वास्थ्य शिविर',
      'Backup Power': 'वैकल्पिक विद्युत',
      'Food Supplies': 'खाद्य सामग्री',
      Tents: 'पाल',
      Sanitation: 'सरसफाइ',
      'Satellite Phone': 'स्याटेलाइट फोन',
      'Helipad Landing': 'हेलिप्याड अवतरण',
      'Medical Aid': 'चिकित्सा सहायता',
      'Satellite Comms': 'स्याटेलाइट सञ्चार',
      'Rescue Boats': 'उद्धार डुङ्गा',
      'Life Jackets': 'लाइफ ज्याकेट',
      'Emergency Rations': 'आपतकालीन राशन',
      'Disaster Relief Team': 'विपद् राहत टोली',
      'Mobile Clinic': 'मोबाइल क्लिनिक',
      'Solar Generator': 'सौर्य जेनेरेटर'
    }
  };

  return lookup[language]?.[facility] || facility || '';
};

export const translateDistrict = (language, district) => {
  const lookup = {
    Kathmandu: { en: 'Kathmandu', np: 'काठमाडौं' },
    Kaski: { en: 'Kaski / Pokhara', np: 'कास्की / पोखरा' },
    Chitwan: { en: 'Chitwan', np: 'चितवन' },
    Sunsari: { en: 'Sunsari / Dharan', np: 'सुनसरी / धरान' },
    Makwanpur: { en: 'Makwanpur / Hetauda', np: 'मकवानपुर / हेटौंडा' },
    Lalitpur: { en: 'Lalitpur', np: 'ललितपुर' },
    Bhaktapur: { en: 'Bhaktapur', np: 'भक्तपुर' },
    Myagdi: { en: 'Myagdi', np: 'म्याग्दी' },
    Gorkha: { en: 'Gorkha', np: 'गोरखा' }
  };

  return lookup[district]?.[language] || district || '';
};

export const translateLiveText = (language, text) => {
  if (language !== 'np' || !text || /[\u0900-\u097F]/.test(text)) return text || '';

  const earthquake = text.match(/^Earthquake M([\d.]+) - (.+)$/);
  if (earthquake) {
    const location = earthquake[2]
      .replace(/(\d+) km NNE of (.+), Nepal$/, '$1 किमी $2 को उत्तर-उत्तरपूर्वमा, नेपाल')
      .replace(/(\d+) km NW of (.+), Nepal$/, '$1 किमी $2 को उत्तरपश्चिममा, नेपाल')
      .replace(/(\d+) km NE of (.+), Nepal$/, '$1 किमी $2 को उत्तरपूर्वमा, नेपाल')
      .replace(/(\d+) km SW of (.+), Nepal$/, '$1 किमी $2 को दक्षिणपश्चिममा, नेपाल')
      .replace(/(\d+) km NW of (.+), China$/, '$1 किमी $2 को उत्तरपश्चिममा, चीन')
      .replace('Nepal', 'नेपाल')
      .replace('China', 'चीन');
    return `भूकम्प M${earthquake[1]} - ${location}`;
  }

  const fire = text.match(/^Fire at (.+)$/);
  if (fire) {
    const location = fire[1]
      .replace('Rural Municipality', 'गाउँपालिका')
      .replace('Submetropolitan City', 'उपमहानगरपालिका')
      .replace('Municipality', 'नगरपालिका');
    return `${location} मा आगलागी`;
  }

  const bipadIncident = text.match(/^Verified field incident reported via (.+) to National BIPAD Portal\.$/);
  if (bipadIncident) {
    const source = bipadIncident[1]
      .replace('nepal_police', 'नेपाल प्रहरी')
      .replace('other', 'स्थानीय स्रोत')
      .replace('Nepal Police / Local Admin', 'नेपाल प्रहरी / स्थानीय प्रशासन');
    return `${source} बाट प्रमाणित घटना राष्ट्रिय BIPAD पोर्टलमा पठाइएको।`;
  }

  const exactTranslations = {
    'Krishna Bhir Landslide - Dhading': 'कृष्णभीर पहिरो - धादिङ',
    'Hazardous terrain obstacles reported along travel corridor.': 'यात्रा मार्गमा जोखिमपूर्ण भूभागका अवरोध रिपोर्ट गरिएको छ।',
    'Active landslide debris and road blockage reported near Krishna Bhir in Dhading, requiring traffic diversion and emergency inspection.': 'धादिङको कृष्णभीर नजिक सक्रिय पहिरोको भग्नावशेष र सडक अवरोध रिपोर्ट गरिएको छ, जसका लागि यातायात मोड र आपतकालीन निरीक्षण आवश्यक छ।',
    'Active landslide debris and road blockage reported near Krishna Bhir in Dhading. Traffic is being diverted around the affected section.': 'धादिङको कृष्णभीर नजिक सक्रिय पहिरोको भग्नावशेष र सडक अवरोध रिपोर्ट गरिएको छ। प्रभावित खण्ड वरिपरि यातायात मोडिएको छ।',
    'Live GloFAS telemetry: River discharge rate at': 'प्रत्यक्ष GloFAS टेलिमेट्री: नदी बहाव दर',
    'River Gauge:': 'नदी मापन केन्द्र:'
  };
  if (exactTranslations[text]) return exactTranslations[text];

  const replacements = [
    ['Verified field incident reported via', 'बाट प्रमाणित घटनाको रिपोर्ट'],
    ['to National BIPAD Portal.', 'राष्ट्रिय BIPAD पोर्टलमा पठाइएको।'],
    ['Live seismic activity detected by USGS Global Seismographic Network.', 'USGS विश्व भूकम्पीय सञ्जालले प्रत्यक्ष भूकम्पीय गतिविधि पत्ता लगाएको छ।'],
    ['Live GloFAS telemetry:', 'प्रत्यक्ष GloFAS टेलिमेट्री:'],
    ['River Gauge:', 'नदी मापन केन्द्र:'],
    ['Water flow monitored.', 'पानीको बहाव अनुगमन भइरहेको छ।'],
    ['Active landslide debris and road blockage reported near', 'नजिक सक्रिय पहिरोको भग्नावशेष र सडक अवरोध रिपोर्ट गरिएको छ'],
    ['Traffic is being diverted around the affected section.', 'प्रभावित खण्ड वरिपरि यातायात मोडिएको छ।'],
    ['Major blockage near', 'नजिक ठूलो अवरोध'],
    ['due to heavy debris.', 'भारी भग्नावशेषका कारण।'],
    ['water levels exceeded danger thresholds.', 'पानीको सतह खतराको सीमाभन्दा माथि पुगेको छ।'],
    ['open for emergency temporary shelter.', 'आपतकालीन अस्थायी आश्रयका लागि खुला छ।'],
    ['blocked by mudflow near', 'नजिक पहिरोले अवरुद्ध'],
    ['AI Detected Hazard', 'एआईद्वारा पहिचान गरिएको विपद्'],
    ['Flash Flood Warning', 'अचानक बाढीको चेतावनी'],
    ['Landslide & Debris Alert', 'पहिरो तथा भग्नावशेष चेतावनी'],
    ['Safe Evacuation Shelter', 'सुरक्षित निकासी आश्रय'],
    ['Route Debris & Hazard Alert', 'मार्ग भग्नावशेष तथा विपद् चेतावनी'],
    ['Pokhara Safe Zone A', 'पोखरा सुरक्षित क्षेत्र ए'],
    ['Kathmandu Open Space', 'काठमाडौं खुला क्षेत्र'],
    ['Chitwan Flood Relief Camp', 'चितवन बाढी राहत शिविर'],
    ['Dharan Emergency Shelter Centre', 'धरान आपतकालीन आश्रय केन्द्र'],
    ['Safe Zone', 'सुरक्षित क्षेत्र'],
    ['Exhibition Ground', 'प्रदर्शनी मैदान'],
    ['Emergency Shelter', 'आपतकालीन आश्रय'],
    ['Landslide Corridor', 'पहिरो क्षेत्र'],
    ['Flood Inundation Zone', 'बाढी डुबान क्षेत्र'],
    ['Capacity:', 'क्षमता:'],
    ['persons', 'व्यक्ति'],
    ['Magnitude:', 'परिमाण:'],
    ['Depth:', 'गहिराइ:'],
    ['Flow Rate:', 'बहाव दर:'],
    ['Heading:', 'दिशा:'],
    ['Live', 'प्रत्यक्ष'],
    ['Active', 'सक्रिय'],
    ['hazard risk identified.', 'विपद्को जोखिम पहिचान भयो।']
  ];

  return replacements.reduce((translated, [source, target]) => (
    translated.replaceAll(source, target)
  ), text);
};
