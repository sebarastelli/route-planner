"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapUpdater from "./MapUpdater";
import { Location } from "../types/location";

interface MapProps {
  locations: Location[];
}

export default function Map({ locations }: MapProps) {
  return (
    <MapContainer
      center={[-31.393, -58.017]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    <MapUpdater locations={locations} />
     {locations.map((location) => (
  <Marker
  key={location.id}
  position={[location.latitude, location.longitude]}
>
  <Popup>
    <strong>{location.customer}</strong>
    <br />
    {location.address}
  </Popup>
</Marker>
))}
    </MapContainer>
  );
}

