#!/usr/bin/env python3
"""
scripts/calculate_safe_route.py
===============================
Calculates detour waypoints around active Red Zone hazard polygons using Shapely.
Compares:
1. Fastest Route (Straight / OSRM line which may pass directly through hazard polygons).
2. Safest Route (Detour path buffering away from high-risk flood & landslide zones).
"""

import sys
import json
import math
from typing import List, Tuple, Dict, Any

try:
    from shapely.geometry import Point, LineString, Polygon, MultiPolygon
    from shapely.ops import nearest_points
except ImportError:
    # Graceful fallback if shapely is not yet installed in active environment
    Point = LineString = Polygon = MultiPolygon = None

def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """Calculates approximate distance in kilometers between two lat/lng coordinates."""
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def create_polygon_from_coords(coords: List[List[float]]) -> Any:
    """Converts a list of [lat, lng] pairs to a Shapely Polygon (using lng, lat order for spatial math)."""
    if Polygon is None:
        return None
    # Shapely expects (x, y) = (lng, lat)
    xy_coords = [(pt[1], pt[0]) for pt in coords]
    return Polygon(xy_coords)

def compute_safe_detour(
    origin: Tuple[float, float], 
    dest: Tuple[float, float], 
    red_zones: List[Dict[str, Any]],
    buffer_km: float = 8.0
) -> Dict[str, Any]:
    """
    Checks if line connecting origin and dest intersects any red zones.
    If yes, generates safe bypass waypoints around the perimeter.
    """
    orig_lat, orig_lng = origin
    dest_lat, dest_lng = dest

    direct_line_coords = [origin, dest]
    fastest_distance = haversine_distance(origin, dest)

    if LineString is None or Polygon is None:
        # Fallback if Shapely isn't installed
        return {
            "fastest_route": direct_line_coords,
            "safest_route": direct_line_coords,
            "has_hazard_intersection": False,
            "intersecting_zones": []
        }

    travel_line = LineString([(orig_lng, orig_lat), (dest_lng, dest_lat)])
    intersecting_zones = []
    detour_waypoints = []

    for zone in red_zones:
        poly_coords = zone.get("coordinates", [])
        if not poly_coords or len(poly_coords) < 3:
            continue
        
        poly = create_polygon_from_coords(poly_coords)
        if poly and poly.is_valid and travel_line.intersects(poly):
            intersecting_zones.append(zone.get("title", "High-Risk Zone"))
            
            # Create a buffer polygon around hazard zone (approx degrees: 1 deg ~ 111 km)
            deg_buffer = buffer_km / 111.0
            buffered_poly = poly.buffer(deg_buffer)
            
            # Find external envelope or northern/southern detour point
            minx, miny, maxx, maxy = buffered_poly.bounds
            
            # Choose detour waypoint that minimizes deviation
            north_detour = (maxy, (minx + maxx) / 2) # (lat, lng)
            south_detour = (miny, (minx + maxx) / 2) # (lat, lng)
            
            dist_north = haversine_distance(origin, north_detour) + haversine_distance(north_detour, dest)
            dist_south = haversine_distance(origin, south_detour) + haversine_distance(south_detour, dest)
            
            chosen_detour = north_detour if dist_north < dist_south else south_detour
            detour_waypoints.append(chosen_detour)

    if detour_waypoints:
        safest_route = [origin] + detour_waypoints + [dest]
        safest_distance = 0.0
        for i in range(len(safest_route) - 1):
            safest_distance += haversine_distance(safest_route[i], safest_route[i + 1])
        
        return {
            "fastest_route": direct_line_coords,
            "fastest_distance_km": round(fastest_distance, 1),
            "safest_route": safest_route,
            "safest_distance_km": round(safest_distance, 1),
            "has_hazard_intersection": True,
            "intersecting_zones": intersecting_zones,
            "detour_added_km": round(safest_distance - fastest_distance, 1)
        }
    else:
        return {
            "fastest_route": direct_line_coords,
            "fastest_distance_km": round(fastest_distance, 1),
            "safest_route": direct_line_coords,
            "safest_distance_km": round(fastest_distance, 1),
            "has_hazard_intersection": False,
            "intersecting_zones": [],
            "detour_added_km": 0.0
        }

if __name__ == "__main__":
    # Test sample: Kathmandu (27.7172, 85.3240) to Chitwan (27.5291, 84.4533)
    # Intersects Narayangadh landslide corridor!
    ktm = (27.7172, 85.3240)
    chitwan = (27.5291, 84.4533)
    
    sample_zones = [
        {
            "title": "Narayangadh-Mugling High-Risk Landslide Corridor",
            "coordinates": [
                [27.760, 84.420],
                [27.770, 84.510],
                [27.710, 84.530],
                [27.690, 84.440],
                [27.760, 84.420]
            ]
        }
    ]
    
    result = compute_safe_detour(ktm, chitwan, sample_zones)
    print(json.dumps(result, indent=2))
