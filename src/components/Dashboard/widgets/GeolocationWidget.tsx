"use client";

import React, { useEffect, useRef, useMemo } from "react";
import proj4 from "proj4";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useAppSelector } from "@/store/hooks";
import { selectPropertyStatus } from "@/store/propertySlice";
import type { RootState } from "@/store/store";
import { logger, validatePropertyData } from "@/utils/logger";

interface HeatMapDataPoint {
  lat: number;
  lng: number;
  value: number;
}
// Define the coordinate systems
const indyBounds = {
  lat: {
    min: 39.6325, // Southern boundary
    max: 39.928, // Northern boundary
  },
  lng: {
    min: -86.3281, // Western boundary
    max: -85.9421, // Eastern boundary
  },
};

proj4.defs([
  [
    "EPSG:2965",
    "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +units=us-ft +no_defs",
  ],
  ["EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"],
]);

const convertToLatLng = (geometry: string) => {
  try {
    // Extract coordinates from the MULTIPOLYGON string
    const coordMatch = geometry.match(/\(\(\((.*?)\)\)\)/);
    if (!coordMatch) return null;

    const coords = coordMatch[1].split(",")[0].trim().split(" ").map(Number);
    const [x, y] = coords;

    // Convert from State Plane to WGS84
    const [lng, lat] = proj4("EPSG:2965", "EPSG:4326", [x, y]);

    return { lat, lng };
  } catch (error) {
    console.error("Error converting coordinates:", error);
    return null;
  }
};
const useHeatMapData = () => {
  return useAppSelector((state: RootState) => {
    const { data } = state.property.data;
    const { status } = state.property;

    logger.debug("useSummaryData", "Selector called", {
      status: status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }

    // Get the maximum valuation for normalization
    const maxValuation = Math.max(
      ...data.map((p) => parseInt(p.mostRecentValuation))
    );

    // Convert property data to heat map points
    const heatMapPoints: HeatMapDataPoint[] = data
      .map((property) => {
        const coords = convertToLatLng(property.geometry);
        if (!coords) return null;

        return {
          lat: coords.lat,
          lng: coords.lng,
          value: parseFloat(property.mostRecentValuation) / maxValuation,
        };
      })
      .filter((point): point is HeatMapDataPoint => point !== null);

    return heatMapPoints;
  });
};

export default function GeolocationWidget() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = "map";
  const heatMapData = useHeatMapData();
  const status = useAppSelector((state) => selectPropertyStatus(state));
  // Memoize points to prevent unnecessary recalculations
  const points = useMemo(() => {
    if (!heatMapData) return [];
    return heatMapData.map(
      (point) => [point.lat, point.lng, point.value] as [number, number, number]
    );
  }, [heatMapData]);

  useEffect(() => {
    if (status !== "succeeded" || !heatMapData) return;

    try {
      if (!mapRef.current) {
        const centerLat = (indyBounds.lat.min + indyBounds.lat.max) / 2;
        const centerLng = (indyBounds.lng.min + indyBounds.lng.max) / 2;

        mapRef.current = L.map(mapContainerId).setView(
          [centerLat, centerLng],
          11
        );

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "©OpenStreetMap, ©CartoDB",
            maxZoom: 19,
          }
        ).addTo(mapRef.current);

        L.heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          gradient: {
            0.4: "#1E40AF",
            0.6: "#0891B2",
            0.8: "#B45309",
            1.0: "#BE123C",
          },
        }).addTo(mapRef.current);
      }
    } catch (error) {
      console.error("Error initializing Leaflet:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [status, heatMapData, points]);

  if (status === "loading" || !heatMapData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
        <h2 className="text-lg font-semibold mb-4">
          Property Location Heat Map
        </h2>
        <div className="w-full h-[calc(100%-2rem)] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <h2 className="text-lg font-semibold mb-4">Property Location Heat Map</h2>
      <div
        id={mapContainerId}
        className="w-full h-[calc(100%-2rem)] rounded-lg overflow-hidden"
      />
    </div>
  );
}
