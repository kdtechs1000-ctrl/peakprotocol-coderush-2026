#!/usr/bin/env python3
"""
scripts/process_redzones.py
===========================
Processes raw GeoJSON / Shapefiles of Nepal flood basins and landslide zones,
formats them into standard WKT geometry polygons, and inserts into Supabase `red_zones`.
"""

import os
import sys
import json
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("RedZoneProcessor")

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://mnneihyojqnqwopjemyw.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

def format_wkt_polygon(coords: List[List[float]]) -> str:
    """
    Converts list of [lat, lng] to WKT 'POLYGON((lng lat, ...))'.
    Note: PostGIS and GIS standards use (longitude latitude) order.
    """
    # Ensure closed ring (first == last)
    if coords[0] != coords[-1]:
        coords.append(coords[0])
    points_str = ", ".join([f"{pt[1]} {pt[0]}" for pt in coords])
    return f"POLYGON(({points_str}))"

def generate_nepal_hazard_geojson():
    """Generates standard GeoJSON feature collection for Nepal key hazard zones."""
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "title": "Annapurna Circuit Thorong La Pass Avalanche Sector",
                    "hazard_type": "Avalanche",
                    "severity": "CRITICAL",
                    "buffer_radius_meters": 1000
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [83.920, 28.780],
                        [84.010, 28.810],
                        [84.030, 28.740],
                        [83.940, 28.720],
                        [83.920, 28.780]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "title": "Sindhupalchok Bhotekoshi Debris Flow Risk Zone",
                    "hazard_type": "Landslide",
                    "severity": "HIGH",
                    "buffer_radius_meters": 600
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [85.860, 27.910],
                        [85.920, 27.930],
                        [85.940, 27.870],
                        [85.880, 27.850],
                        [85.860, 27.910]
                    ]]
                }
            }
        ]
    }

def process_and_upload():
    """Processes GeoJSON features and syncs them to Supabase."""
    logger.info("Processing GeoJSON hazard zones for Nepal...")
    geojson_data = generate_nepal_hazard_geojson()

    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        logger.warning(f"Could not connect to Supabase: {e}. Outputting generated SQL commands.")
        supabase = None

    for feat in geojson_data["features"]:
        props = feat["properties"]
        # GeoJSON is [lng, lat], convert to [lat, lng] for UI coordinates
        raw_ring = feat["geometry"]["coordinates"][0]
        lat_lng_coords = [[pt[1], pt[0]] for pt in raw_ring]
        wkt = format_wkt_polygon(lat_lng_coords)
        
        logger.info(f"Generated Polygon for {props['title']}: {wkt[:60]}...")
        
        if supabase:
            try:
                # Upsert to red_zones
                supabase.table("red_zones").insert({
                    "title": props["title"],
                    "hazard_type": props["hazard_type"],
                    "severity": props["severity"],
                    "coordinates": lat_lng_coords,
                    "buffer_radius_meters": props.get("buffer_radius_meters", 500),
                    "is_active": True
                }).execute()
                logger.info(f"Inserted into Supabase: {props['title']}")
            except Exception as ex:
                logger.error(f"Failed to insert {props['title']}: {ex}")

if __name__ == "__main__":
    process_and_upload()
