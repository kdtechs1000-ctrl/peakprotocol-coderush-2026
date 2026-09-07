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
    tabs: {
      liveMap: 'Live Map',
      reportHazard: 'Report Hazard',
      recentReports: 'Recent Reports',
      planRoute: 'Plan Route',
      safeZones: 'Safe Zones',
      account: 'Account'
    },
    tourismMode: 'Tourism Mode',
    disasterMode: 'Emergency Mode',
    switchMode: 'Switch Mode',
    adminOverride: 'Admin Override',
    realtimeFeed: 'Realtime Feed',
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
      submitting: 'Broadcasting...'
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
      neoc: 'NDRRMA / NEOC'
    },
    sos: {
      button: 'SOS RESCUE',
      prompt: 'Broadcasting your live GPS coordinates to Nepal Army & Armed Police Force rescue units.'
    }
  },
  np: {
    appTitle: 'Peak Protocol (पिक प्रोटोकल)',
    subTitle: 'राष्ट्रिय आपतकालीन उद्धार तथा सुरक्षा नेटवर्क',
    live: 'प्रत्यक्ष',
    tabs: {
      liveMap: 'प्रत्यक्ष नक्सा',
      reportHazard: 'विपद् रिपोर्ट गर्नुहोस्',
      recentReports: 'हालैका रिपोर्टहरू',
      planRoute: 'सुरक्षित यात्रा योजना',
      safeZones: 'सुरक्षित क्षेत्रहरू',
      account: 'खाता'
    },
    tourismMode: 'पर्यटन मोड',
    disasterMode: 'आपतकालीन मोड',
    switchMode: 'मोड परिवर्तन गर्नुहोस्',
    adminOverride: 'प्रशासक नियन्त्रण',
    realtimeFeed: 'प्रत्यक्ष फिड',
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
      submitting: 'प्रसारण गरिँदैछ...'
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
      neoc: 'विपद् प्राधिकरण (NEOC)'
    },
    sos: {
      button: 'एसओएस उद्धार',
      prompt: 'तपाईंको प्रत्यक्ष जीपीएस स्थान नेपाली सेना र सशस्त्र प्रहरी बलमा पठाइँदैछ।'
    }
  }
};
