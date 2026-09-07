import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mnneihyojqnqwopjemyw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmVpaHlvanFucXdvcGplbXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMTYyNjQsImV4cCI6MjEwMzg5MjI2NH0.zTPh9o7ZKAnlR3sgaddwzU4x-EfnH6zZcvEBDnbG5Jc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback seed data in case network is disconnected or tables are initializing
export const INITIAL_HAZARD_REPORTS = [
  {
    id: 'rep-001',
    title: 'Landslide Alert',
    description: 'Major blockage near Narayangadh Highway due to heavy debris.',
    hazard_type: 'Landslide',
    severity: 'CRITICAL',
    latitude: 27.701,
    longitude: 84.430,
    ai_detected: true,
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    reported_by: 'Highway Patrol AI'
  },
  {
    id: 'rep-002',
    title: 'Flash Flood Warning',
    description: 'Koshi River water levels exceeded danger thresholds.',
    hazard_type: 'Flood',
    severity: 'CRITICAL',
    latitude: 26.812,
    longitude: 87.165,
    ai_detected: false,
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    reported_by: 'DHM Automated Gauge'
  },
  {
    id: 'rep-003',
    title: 'Safe Evacuation Shelter',
    description: 'Pokhara Safe Zone A open for emergency temporary shelter.',
    hazard_type: 'Safe Shelter',
    severity: 'LOW',
    latitude: 28.210,
    longitude: 83.986,
    ai_detected: false,
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
    reported_by: 'Kaski District Administration'
  },
  {
    id: 'rep-004',
    title: 'Road Blockage (Mudflow)',
    description: 'Beni-Jomsom highway blocked by mudflow near Tatopani.',
    hazard_type: 'Road Block',
    severity: 'MODERATE',
    latitude: 28.497,
    longitude: 83.655,
    ai_detected: true,
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 10800 * 1000).toISOString(),
    reported_by: 'Local Guide Team'
  },
  {
    id: 'rep-005-krishna-bhir',
    title: 'Krishna Bhir Landslide - Dhading',
    description: 'Active landslide debris and road blockage reported near Krishna Bhir in Dhading, requiring traffic diversion and emergency inspection.',
    hazard_type: 'Landslide',
    severity: 'CRITICAL',
    latitude: 27.885,
    longitude: 84.918,
    ai_detected: false,
    status: 'VERIFIED',
    created_at: new Date().toISOString(),
    reported_by: 'Road Safety Unit'
  }
];

export const INITIAL_RED_ZONES = [
  {
    id: 'zone-001',
    title: 'Narayangadh-Mugling High-Risk Landslide Corridor',
    hazard_type: 'Landslide',
    severity: 'CRITICAL',
    coordinates: [
      [27.760, 84.420],
      [27.770, 84.510],
      [27.710, 84.530],
      [27.690, 84.440]
    ],
    is_active: true
  },
  {
    id: 'zone-001-krishna-bhir',
    title: 'Krishna Bhir Landslide Corridor - Dhading',
    hazard_type: 'Landslide',
    severity: 'CRITICAL',
    coordinates: [
      [27.900, 84.900],
      [27.910, 84.940],
      [27.875, 84.948],
      [27.864, 84.905]
    ],
    is_active: true
  },
  {
    id: 'zone-002',
    title: 'Koshi River Flood Inundation Zone',
    hazard_type: 'Flood',
    severity: 'CRITICAL',
    coordinates: [
      [26.850, 87.100],
      [26.880, 87.250],
      [26.750, 87.280],
      [26.720, 87.120]
    ],
    is_active: true
  }
];

export const INITIAL_HAZARD_VECTORS = [
  {
    id: 'vec-001',
    hazard_type: 'Flood Surge',
    river_or_route_name: 'Saptakoshi River Vector',
    heading_direction: 'SOUTH_EAST',
    water_level_status: 'RISING',
    flow_rate_m3s: 4280.5,
    coordinates: [
      [26.910, 87.150],
      [26.840, 87.180],
      [26.740, 87.210],
      [26.650, 87.240]
    ]
  },
  {
    id: 'vec-002',
    hazard_type: 'River Surge',
    river_or_route_name: 'Narayani River Vector',
    heading_direction: 'SOUTH_WEST',
    water_level_status: 'RISING',
    flow_rate_m3s: 2150.0,
    coordinates: [
      [27.740, 84.440],
      [27.680, 84.380],
      [27.580, 84.320]
    ]
  }
];

export const INITIAL_SAFE_SHELTERS = [
  {
    id: 'sh-001',
    name: 'Pokhara Safe Zone A (Exhibition Ground)',
    district: 'Kaski',
    capacity: 1200,
    current_occupancy: 310,
    latitude: 28.210,
    longitude: 83.986,
    facilities: ['Clean Water', 'Medical Camp', 'Backup Power', 'Food Supplies'],
    contact: '+977-61-520100'
  },
  {
    id: 'sh-002',
    name: 'Kathmandu Open Space - Tundikhel',
    district: 'Kathmandu',
    capacity: 5000,
    current_occupancy: 450,
    latitude: 27.702,
    longitude: 85.314,
    facilities: ['Tents', 'Medical Aid', 'Satellite Comms', 'Sanitation'],
    contact: '+977-01-4261945'
  },
  {
    id: 'sh-003',
    name: 'Chitwan Flood Relief Camp',
    district: 'Chitwan',
    capacity: 800,
    current_occupancy: 220,
    latitude: 27.685,
    longitude: 84.435,
    facilities: ['Rescue Boats', 'Life Jackets', 'Emergency Rations'],
    contact: '+977-56-520123'
  },
  {
    id: 'sh-004',
    name: 'Dharan Emergency Shelter Centre',
    district: 'Sunsari',
    capacity: 1500,
    current_occupancy: 640,
    latitude: 26.815,
    longitude: 87.280,
    facilities: ['Disaster Relief Team', 'Mobile Clinic', 'Solar Generator'],
    contact: '+977-25-520044'
  }
];

export const INITIAL_DISTRICT_IMPACTS = [
  { district_name: 'Chitwan', province_name: 'Bagmati', deaths: 4, missing: 2, injured: 12, displaced_families: 180, estimated_damage_npr: 45000000 },
  { district_name: 'Sunsari', province_name: 'Koshi', deaths: 6, missing: 8, injured: 25, displaced_families: 420, estimated_damage_npr: 89000000 },
  { district_name: 'Kaski', province_name: 'Gandaki', deaths: 1, missing: 0, injured: 5, displaced_families: 45, estimated_damage_npr: 12000000 },
  { district_name: 'Myagdi', province_name: 'Gandaki', deaths: 2, missing: 3, injured: 7, displaced_families: 60, estimated_damage_npr: 28000000 },
  { district_name: 'Kathmandu', province_name: 'Bagmati', deaths: 0, missing: 0, injured: 2, displaced_families: 15, estimated_damage_npr: 5000000 }
];

// RPC helper: check point in red zone
export async function checkPointInRedZone(lat, lng) {
  try {
    const { data, error } = await supabase.rpc('is_point_in_red_zone', {
      user_lat: lat,
      user_lng: lng
    });
    if (error) throw error;
    return data && data.length > 0 && data[0].inside ? data[0] : null;
  } catch (err) {
    // Client-side fallback point-in-polygon evaluation
    return evaluatePointInPolygonFallback(lat, lng, INITIAL_RED_ZONES);
  }
}

// Client-side ray casting fallback for polygon containment
function evaluatePointInPolygonFallback(lat, lng, zones) {
  for (const zone of zones) {
    const poly = zone.coordinates;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][1], yi = poly[i][0];
      const xj = poly[j][1], yj = poly[j][0];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    if (inside) {
      return {
        inside: true,
        zone_id: zone.id,
        zone_title: zone.title,
        hazard_type: zone.hazard_type,
        severity: zone.severity
      };
    }
  }
  return null;
}
