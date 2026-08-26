"use client";

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

interface MapProps {
  locations: Customer[];
  selectedLocations: Customer[];
}

export default function Map({
  locations,
  selectedLocations,
}: MapProps) {
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

      <Polyline
        positions={selectedLocations.map((customer) => [
          customer.latitude,
          customer.longitude,
        ])}
      />
    </MapContainer>
  );
}