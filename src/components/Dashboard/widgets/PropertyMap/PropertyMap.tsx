/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef } from "react";
import type { PropertyRecordCard } from "@/types/property";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";

// Define Indiana State Plane East (NAD83) and WGS84
proj4.defs(
  "EPSG:2965",
  "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +units=us-ft +no_defs"
);
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

interface PropertyMapProps {
  property: PropertyRecordCard;
  mapContainerId: string;
  isOpen: boolean;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  property,
  mapContainerId,
  isOpen,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const leafletInitialized = useRef(false);

  const parseGeometry = (geometryStr: string): L.LatLngExpression[] => {
    try {
      // Remove SRID prefix and get coordinates string
      const coordsStr = geometryStr
        .split(";")[1] // Split on semicolon and take second part
        .replace("MULTIPOLYGON (((", "") // Remove opening parentheses
        .replace(")))", "") // Remove closing parentheses
        .trim();

      // Parse coordinates string into array of points
      return coordsStr.split(",").map((point) => {
        const [x, y] = point.trim().split(" ").map(Number);

        // Transform coordinates from Indiana State Plane East to WGS84
        const [lng, lat] = proj4("EPSG:2965", "EPSG:4326", [x, y]);

        return [lat, lng] as L.LatLngTuple;
      });
    } catch (error) {
      console.error("Error parsing geometry:", error);
      // Fallback to using lat/long if geometry parsing fails
      if (property.latitude && property.longitude) {
        return [[property.latitude, property.longitude]];
      }
      return [];
    }
  };

  useEffect(() => {
    if (!isOpen || !property?.geometry || leafletInitialized.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!mapRef.current && !leafletInitialized.current) {
        try {
          const coordinates = parseGeometry(property.geometry);

          if (coordinates.length === 0) {
            console.error("No valid coordinates found");
            return;
          }

          // Calculate bounds to center the map
          const bounds = L.latLngBounds(coordinates);

          mapRef.current = L.map(mapContainerId).fitBounds(bounds);

          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              attribution: "©OpenStreetMap, ©CartoDB",
              maxZoom: 19,
            }
          ).addTo(mapRef.current);

          // Add property polygon using actual geometry
          L.polygon(coordinates, {
            color: "#2563eb",
            weight: 2,
            opacity: 0.8,
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
          }).addTo(mapRef.current);

          // Add marker at centroid
          const center = bounds.getCenter();
          L.marker([center.lat, center.lng])
            .addTo(mapRef.current)
            .bindPopup(
              `${property.propertyStreetNumber} ${property.propertyStreetName}`
            );

          leafletInitialized.current = true;
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        leafletInitialized.current = false;
      }
    };
  }, [isOpen, property, mapContainerId]);

  return (
    <div id={mapContainerId} className="h-64 rounded-lg overflow-hidden" />
  );
};

export default PropertyMap;
