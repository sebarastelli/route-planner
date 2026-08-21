"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Location } from "../types/location";

interface MapUpdaterProps {
  locations: Location[];
}

export default function MapUpdater({ locations }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      map.setView(
        [locations[0].latitude, locations[0].longitude],
        15
      );
      return;
    }

    const bounds = locations.map(
      (location) =>
        [location.latitude, location.longitude] as [number, number]
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [locations, map]);

  return null;
}