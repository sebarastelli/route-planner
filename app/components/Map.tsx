"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapUpdater from "./MapUpdater";
import { Customer } from "../types/customer";
import { getRoute } from "../lib/routing";

interface MapProps {
  locations: Customer[];
  selectedLocations: Customer[];
}

export default function Map({
  locations,
  selectedLocations,
}: MapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<
    [number, number][]
  >([]);

    useEffect(() => {
    async function loadRoute() {
      if (selectedLocations.length < 2) {
        setRouteCoordinates([]);
        return;
      }

      try {
        const route = await getRoute(selectedLocations);

        if (!route) {
          setRouteCoordinates([]);
          return;
        }

        const coordinates: [number, number][] =
          route.geometry.coordinates.map(
            ([longitude, latitude]: [number, number]) => [
              latitude,
              longitude,
            ],
          );

        setRouteCoordinates(coordinates);
      } catch (error) {
        console.error("Error obteniendo la ruta:", error);
        setRouteCoordinates([]);
      }
    }

    loadRoute();
  }, [selectedLocations]);
  return (
    <MapContainer
      center={[-31.393, -58.017]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater locations={locations} />

      {locations.map((customer) => (
        <Marker
          key={customer.id}
          position={[customer.latitude, customer.longitude]}
        >
          <Popup>
            <strong>{customer.name}</strong>
            <br />
            {customer.address}
          </Popup>
        </Marker>
      ))}

      {routeCoordinates.length > 0 && (
  <Polyline positions={routeCoordinates} />
)}
    </MapContainer>
  );
}