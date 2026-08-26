"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Customer } from "../types/customer";
import { geocodeAddress } from "../lib/geocoding";

interface CsvImporterProps {
  onCustomersImported: (customers: Customer[]) => void;
}

export default function CsvImporter({
  onCustomersImported,
}: CsvImporterProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
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
        const newCustomers: Customer[] = [];

        for (const row of results.data) {
          try {
            console.log("Procesando:", row.cliente);

            const data = await geocodeAddress(row.direccion);

            const response = await fetch("/api/customers", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: row.cliente,
                address: row.direccion,
                latitude: data.latitude,
                longitude: data.longitude,
              }),
            });

            const customer = await response.json();

            if (!response.ok) {
              throw new Error(
                customer.error || "No se pudo guardar el cliente",
              );
            }

            const newCustomer: Customer = {
              id: customer.id,
              name: customer.name,
              address: customer.address,
              latitude: customer.latitude,
              longitude: customer.longitude,
              openingTime: customer.openingTime,
              closingTime: customer.closingTime,
              lastPurchaseDate: customer.lastPurchaseDate,
            };

            newCustomers.push(newCustomer);

            console.log("Guardado:", customer);
          } catch (error) {
            console.error(
              `No se pudo procesar ${row.direccion}`,
              error,
            );
          }

          processed++;
          setImportProgress(processed);
        }

        onCustomersImported(newCustomers);
        setIsImporting(false);
      },
    });
  }

  return (
    <div>
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

          <progress value={importProgress} max={importTotal} />
        </div>
      )}
    </div>
  );
}