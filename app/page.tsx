"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import { Location } from "./types/location";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
});


export default function Home() {
  const [address, setAddress] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isImporting, setIsImporting] = useState(false);
const [importProgress, setImportProgress] = useState(0);
const [importTotal, setImportTotal] = useState(0);

  async function geocodeAddress(address: string) {
  const response = await fetch("/api/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo encontrar la dirección");
  }

  return data;
}

  async function addAddress() {
  if (!address.trim()) return;

  try {
    const data = await geocodeAddress(address);

    setLocations([
      ...locations,
      {
        id: crypto.randomUUID(),
        customer: `Cliente ${locations.length + 1}`,
        address,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    ]);

    setAddress("");
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Ocurrió un error"
    );
  }
}

async function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  setIsImporting(true);
  setImportProgress(0);

  Papa.parse<{ cliente: string; direccion: string }>(file, {
    header: true,
    skipEmptyLines: true,

    complete: async (results) => {
      setImportTotal(results.data.length);

      let processed = 0;

      for (const row of results.data) {
        try {
          console.log("Procesando:", row.cliente);

          const data = await geocodeAddress(row.direccion);

          const newLocation: Location = {
            id: crypto.randomUUID(),
            customer: row.cliente,
            address: row.direccion,
            latitude: data.latitude,
            longitude: data.longitude,
          };

          setLocations((currentLocations) => [
            ...currentLocations,
            newLocation,
          ]);

          console.log("Procesado:", newLocation);
        } catch (error) {
          console.error(
            `No se pudo geocodificar ${row.direccion}`,
            error
          );
        }

        processed++;
        setImportProgress(processed);
      }

      setIsImporting(false);
    },
  });
}

  return (
    <main>
      <h1>Route Planner</h1>
      <p>Planificá tus rutas de manera inteligente.</p>

      <div>
        <input
          type="text"
          placeholder="Ingresá una dirección"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />

        <button
  onClick={addAddress}
  disabled={isImporting}
>
  Agregar
</button>
        <input
  type="file"
  accept=".csv"
  disabled={isImporting}
  onChange={handleFileUpload}
/>
{isImporting && (
  <div>
    <p>
      Importando {importProgress} / {importTotal}
    </p>

    <progress
      value={importProgress}
      max={importTotal}
    />
  </div>
)}
      </div>

      <div>
        <h2>Direcciones</h2>

        <ul>
          {locations.map((location) => (
  <li key={location.id}>
    <span>
      {location.customer} — {location.address}
    </span>

    <button
      onClick={() =>
        setLocations(
          locations.filter((item) => item.id !== location.id)
        )
      }
    >
      Eliminar
    </button>
  </li>
))}
        </ul>
      </div>

      <Map locations={locations} />
    </main>
  );
}