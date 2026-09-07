-- ==========================================================
-- NEPAL DUAL-MODE DISASTER RESPONSE & TRAVEL SAFETY NETWORK
-- PostGIS Database Schema, Spatial RPC Functions & Seed Data
-- ==========================================================

-- 1. Enable PostGIS Spatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. System Status (Realtime Broadcast Table for Emergency Mode)
CREATE TABLE IF NOT EXISTS system_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_active BOOLEAN NOT NULL DEFAULT FALSE,
    alert_level VARCHAR(20) DEFAULT 'NORMAL', -- 'NORMAL', 'WATCH', 'WARNING', 'EMERGENCY'
    active_hazard_count INT DEFAULT 0,
    broadcast_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Hazard Reports (Recent Reports Feed & User Submissions)
CREATE TABLE IF NOT EXISTS hazard_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    hazard_type VARCHAR(100) NOT NULL, -- 'Landslide', 'Flood', 'Road Block', 'Avalanche', 'Earthquake'
    severity VARCHAR(20) NOT NULL DEFAULT 'MODERATE', -- 'CRITICAL', 'MODERATE', 'LOW'
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    image_url TEXT,
    ai_detected BOOLEAN DEFAULT FALSE,
    ai_confidence DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'VERIFIED', -- 'PENDING', 'VERIFIED', 'RESOLVED'
    reported_by VARCHAR(100) DEFAULT 'Citizen Reporter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically populate PostGIS POINT geography from lat/lng
CREATE OR REPLACE FUNCTION set_hazard_point_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hazard_point_geom ON hazard_reports;
CREATE TRIGGER trg_hazard_point_geom
BEFORE INSERT OR UPDATE OF latitude, longitude ON hazard_reports
FOR EACH ROW EXECUTE FUNCTION set_hazard_point_geom();

-- 4. Red Zones (Active Danger Geofence Polygons)
CREATE TABLE IF NOT EXISTS red_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    hazard_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'CRITICAL', -- 'CRITICAL', 'HIGH', 'MODERATE'
    coordinates JSONB, -- Stored as GeoJSON / array of [lat, lng]
    boundary GEOMETRY(POLYGON, 4326),
    buffer_radius_meters DOUBLE PRECISION DEFAULT 500,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Spatial index for high-speed geofence queries
CREATE INDEX IF NOT EXISTS idx_red_zones_boundary ON red_zones USING GIST (boundary);

-- 5. Hazard Vectors (Live River and Flood Trajectories)
CREATE TABLE IF NOT EXISTS hazard_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hazard_type VARCHAR(100) NOT NULL, -- 'River Surge', 'Debris Flow', 'Glacial Outburst'
    river_or_route_name VARCHAR(255) NOT NULL,
    heading_direction VARCHAR(50), -- 'SOUTH_EAST', 'SOUTH_WEST', etc.
    water_level_status VARCHAR(50) NOT NULL DEFAULT 'RISING', -- 'RISING', 'RECEDING', 'DANGER_THRESHOLD'
    flow_rate_m3s DOUBLE PRECISION,
    coordinates JSONB,
    path_geometry GEOMETRY(LINESTRING, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hazard_vectors_geom ON hazard_vectors USING GIST (path_geometry);

-- 6. District Impacts (Casualties & Financial Damage in NPR)
CREATE TABLE IF NOT EXISTS district_impacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_name VARCHAR(100) NOT NULL UNIQUE,
    province_name VARCHAR(100) NOT NULL,
    deaths INT DEFAULT 0,
    missing INT DEFAULT 0,
    injured INT DEFAULT 0,
    displaced_families INT DEFAULT 0,
    estimated_damage_npr BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SOS Pings (Citizen Emergency Signals)
CREATE TABLE IF NOT EXISTS sos_pings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(150),
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'NEED_HELP', -- 'SAFE', 'NEED_HELP', 'CRITICAL'
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    medical_need BOOLEAN DEFAULT FALSE,
    trapped_count INT DEFAULT 1,
    notes TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sos_pings_location ON sos_pings USING GIST (location);

CREATE OR REPLACE FUNCTION set_sos_point_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sos_point_geom ON sos_pings;
CREATE TRIGGER trg_sos_point_geom
BEFORE INSERT OR UPDATE OF latitude, longitude ON sos_pings
FOR EACH ROW EXECUTE FUNCTION set_sos_point_geom();

-- 8. Safe Evacuation Shelters & Assembly Points
CREATE TABLE IF NOT EXISTS safe_shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 500,
    current_occupancy INT DEFAULT 0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    facilities TEXT[] DEFAULT ARRAY['Water', 'Medical Aid', 'Generator', 'Satellite Phone'],
    contact_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- PostGIS RPC Spatial Functions
-- ==========================================================

-- Function 1: Check if user GPS point is inside an active red zone
CREATE OR REPLACE FUNCTION is_point_in_red_zone(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION)
RETURNS TABLE (
    inside BOOLEAN,
    zone_id UUID,
    zone_title VARCHAR,
    hazard_type VARCHAR,
    severity VARCHAR
) AS $$
DECLARE
    user_geom GEOMETRY;
BEGIN
    user_geom := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326);
    
    RETURN QUERY
    SELECT 
        TRUE AS inside,
        rz.id AS zone_id,
        rz.title AS zone_title,
        rz.hazard_type,
        rz.severity
    FROM red_zones rz
    WHERE rz.is_active = TRUE
      AND ST_Contains(rz.boundary, user_geom)
    LIMIT 1;

    -- If no record found, return FALSE
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Radius search for SOS signals within X meters
CREATE OR REPLACE FUNCTION get_nearby_sos(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, radius_meters DOUBLE PRECISION DEFAULT 10000)
RETURNS TABLE (
    id UUID,
    user_name VARCHAR,
    phone VARCHAR,
    status VARCHAR,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_meters DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    user_geog GEOGRAPHY;
BEGIN
    user_geog := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;
    
    RETURN QUERY
    SELECT 
        s.id,
        s.user_name,
        s.phone,
        s.status,
        s.latitude,
        s.longitude,
        ST_Distance(s.location, user_geog) AS distance_meters,
        s.created_at
    FROM sos_pings s
    WHERE s.is_resolved = FALSE
      AND ST_DWithin(s.location, user_geog, radius_meters)
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Check if route between origin and destination intersects hazard polygons
CREATE OR REPLACE FUNCTION check_route_safety(
    origin_lat DOUBLE PRECISION, origin_lng DOUBLE PRECISION,
    dest_lat DOUBLE PRECISION, dest_lng DOUBLE PRECISION
)
RETURNS TABLE (
    is_safe BOOLEAN,
    intersecting_zone_id UUID,
    intersecting_zone_title VARCHAR,
    severity VARCHAR
) AS $$
DECLARE
    route_geom GEOMETRY;
BEGIN
    -- Build straight line trajectory geometry
    route_geom := ST_SetSRID(ST_MakeLine(ST_MakePoint(origin_lng, origin_lat), ST_MakePoint(dest_lng, dest_lat)), 4326);
    
    RETURN QUERY
    SELECT 
        FALSE AS is_safe,
        rz.id AS intersecting_zone_id,
        rz.title AS intersecting_zone_title,
        rz.severity
    FROM red_zones rz
    WHERE rz.is_active = TRUE
      AND ST_Intersects(rz.boundary, route_geom)
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY SELECT TRUE, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- Enable Supabase Realtime Publications
-- ==========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE system_status;
ALTER PUBLICATION supabase_realtime ADD TABLE hazard_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE red_zones;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_pings;
ALTER PUBLICATION supabase_realtime ADD TABLE safe_shelters;

-- Enable Row Level Security (RLS) with Public Access for Emergency Responders & Citizens
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE hazard_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE red_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hazard_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_shelters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read system_status" ON system_status FOR SELECT USING (true);
CREATE POLICY "Public Update system_status" ON system_status FOR UPDATE USING (true);
CREATE POLICY "Public Insert system_status" ON system_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read hazard_reports" ON hazard_reports FOR SELECT USING (true);
CREATE POLICY "Public Insert hazard_reports" ON hazard_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read red_zones" ON red_zones FOR SELECT USING (true);
CREATE POLICY "Public Read district_impacts" ON district_impacts FOR SELECT USING (true);
CREATE POLICY "Public Read hazard_vectors" ON hazard_vectors FOR SELECT USING (true);

CREATE POLICY "Public Read sos_pings" ON sos_pings FOR SELECT USING (true);
CREATE POLICY "Public Insert sos_pings" ON sos_pings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read safe_shelters" ON safe_shelters FOR SELECT USING (true);
CREATE POLICY "Public Insert safe_shelters" ON safe_shelters FOR INSERT WITH CHECK (true);

-- ==========================================================
-- SEED DATA (Nepal High-Risk & Tourism Coordinates)
-- ==========================================================

-- 1. Initial System Status
INSERT INTO system_status (emergency_active, alert_level, active_hazard_count, broadcast_message)
VALUES (TRUE, 'WARNING', 4, 'Monsoon High Alert: Active flash flood risks in Koshi basin and landslides along Narayangadh-Mugling highway.')
ON CONFLICT DO NOTHING;

-- 2. Hazard Reports (Matching Reference Screenshot UI)
INSERT INTO hazard_reports (title, description, hazard_type, severity, latitude, longitude, ai_detected, status, reported_by, created_at)
VALUES 
(
    'Landslide Alert',
    'Major blockage near Narayangadh Highway due to heavy debris.',
    'Landslide',
    'CRITICAL',
    27.701,
    84.430,
    TRUE,
    'VERIFIED',
    'Highway Patrol Bot',
    NOW() - INTERVAL '1 hour'
),
(
    'Flash Flood Warning',
    'Koshi River water levels exceeded danger thresholds.',
    'Flood',
    'CRITICAL',
    26.812,
    87.165,
    FALSE,
    'VERIFIED',
    'DHM Automated Gauge',
    NOW() - INTERVAL '1 hour'
),
(
    'Safe Evacuation Shelter',
    'Pokhara Safe Zone A open for emergency temporary shelter.',
    'Safe Shelter',
    'LOW',
    28.210,
    83.986,
    FALSE,
    'VERIFIED',
    'Kaski District Admin',
    NOW() - INTERVAL '2 hour'
),
(
    'Road Debris Blockage',
    'Beni-Jomsom highway blocked by mudflow near Tatopani.',
    'Road Block',
    'MODERATE',
    28.497,
    83.655,
    TRUE,
    'VERIFIED',
    'Local Guide Association',
    NOW() - INTERVAL '3 hour'
);

-- 3. Red Zones (Polygons for Narayangadh and Koshi Basin)
INSERT INTO red_zones (title, hazard_type, severity, coordinates, boundary, is_active)
VALUES
(
    'Narayangadh-Mugling High-Risk Landslide Corridor',
    'Landslide',
    'CRITICAL',
    '[
        [27.760, 84.420],
        [27.770, 84.510],
        [27.710, 84.530],
        [27.690, 84.440],
        [27.760, 84.420]
    ]'::jsonb,
    ST_SetSRID(ST_PolygonFromText('POLYGON((84.420 27.760, 84.510 27.770, 84.530 27.710, 84.440 27.690, 84.420 27.760))'), 4326),
    TRUE
),
(
    'Koshi River Flood Inundation Zone',
    'Flood',
    'CRITICAL',
    '[
        [26.850, 87.100],
        [26.880, 87.250],
        [26.750, 87.280],
        [26.720, 87.120],
        [26.850, 87.100]
    ]'::jsonb,
    ST_SetSRID(ST_PolygonFromText('POLYGON((87.100 26.850, 87.250 26.880, 87.280 26.750, 87.120 26.720, 87.100 26.850))'), 4326),
    TRUE
);

-- 4. Live Hazard River Vectors
INSERT INTO hazard_vectors (hazard_type, river_or_route_name, heading_direction, water_level_status, flow_rate_m3s, coordinates, path_geometry)
VALUES
(
    'Flood Surge',
    'Saptakoshi River Vector',
    'SOUTH_EAST',
    'RISING',
    4280.5,
    '[[26.910, 87.150], [26.840, 87.180], [26.740, 87.210], [26.650, 87.240]]'::jsonb,
    ST_SetSRID(ST_LineFromText('LINESTRING(87.150 26.910, 87.180 26.840, 87.210 26.740, 87.240 26.650)'), 4326)
),
(
    'River Surge',
    'Narayani River Vector',
    'SOUTH_WEST',
    'RISING',
    2150.0,
    '[[27.740, 84.440], [27.680, 84.380], [27.580, 84.320]]'::jsonb,
    ST_SetSRID(ST_LineFromText('LINESTRING(84.440 27.740, 84.380 27.680, 84.320 27.580)'), 4326)
);

-- 5. District Impacts Summary
INSERT INTO district_impacts (district_name, province_name, deaths, missing, injured, displaced_families, estimated_damage_npr)
VALUES
('Chitwan', 'Bagmati', 4, 2, 12, 180, 45000000),
('Sunsari', 'Koshi', 6, 8, 25, 420, 89000000),
('Kaski', 'Gandaki', 1, 0, 5, 45, 12000000),
('Myagdi', 'Gandaki', 2, 3, 7, 60, 28000000),
('Kathmandu', 'Bagmati', 0, 0, 2, 15, 5000000);

-- 6. Safe Evacuation Shelters
INSERT INTO safe_shelters (name, district, capacity, current_occupancy, latitude, longitude, facilities, contact_number)
VALUES
('Pokhara Safe Zone A (Exhibition Ground)', 'Kaski', 1200, 310, 28.210, 83.986, ARRAY['Clean Water', 'Medical Camp', 'Backup Power', 'Food Supplies'], '+977-61-520100'),
('Kathmandu Open Space - Tundikhel', 'Kathmandu', 5000, 450, 27.702, 85.314, ARRAY['Tents', 'Medical Tent', 'Satellite Comms', 'Sanitation'], '+977-01-4261945'),
('Chitwan Flood Relief Camp', 'Chitwan', 800, 220, 27.685, 84.435, ARRAY['Boats', 'Life Jackets', 'Emergency Food', 'First Aid'], '+977-56-520123'),
('Dharan Emergency Shelter Centre', 'Sunsari', 1500, 640, 26.815, 87.280, ARRAY['Disaster Relief Team', 'Mobile Clinic', 'Solar Generator'], '+977-25-520044');
