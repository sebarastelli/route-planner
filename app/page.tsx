"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Customer } from "./types/customer";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import CsvImporter from "./components/CsvImporter";
import { geocodeAddress } from "./lib/geocoding";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
});

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers");

        if (!response.ok) {
          throw new Error("No se pudieron cargar los clientes");
        }

        const data: Customer[] = await response.json();

        setCustomers(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    }

    loadCustomers();
  }, []);

  async function removeCustomer(id: string) {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || "No se pudo eliminar el cliente",
        );
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== id),
      );

      setSelectedCustomerIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== id),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el cliente",
      );
    }
  }

  function toggleCustomer(id: string) {
    setSelectedCustomerIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  async function addCustomer(address: string) {
    if (!address.trim()) return;

    try {
      const data = await geocodeAddress(address);

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Cliente ${customers.length + 1}`,
          address,
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

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        customer,
      ]);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Ocurrió un error",
      );
    }
  }

  function handleCustomersImported(newCustomers: Customer[]) {
    setCustomers((currentCustomers) => [
      ...currentCustomers,
      ...newCustomers,
    ]);
  }

  function updateCustomer(updatedCustomer: Customer) {
  setCustomers((currentCustomers) =>
    currentCustomers.map((customer) =>
      customer.id === updatedCustomer.id
        ? updatedCustomer
        : customer,
    ),
  );
}

  const selectedCustomers = customers.filter((customer) =>
    selectedCustomerIds.includes(customer.id),
  );

  return (
    <main>
      <h1>Route Planner</h1>
      <p>Planificá tus rutas de manera inteligente.</p>

      <div>
        <CustomerForm onAddCustomer={addCustomer} />

        <CsvImporter
          onCustomersImported={handleCustomersImported}
        />
      </div>

      <CustomerList
  customers={customers}
  selectedCustomerIds={selectedCustomerIds}
  onToggleCustomer={toggleCustomer}
  onRemoveCustomer={removeCustomer}
  onCustomerUpdated={updateCustomer}
/>

      <Map
        locations={customers}
        selectedLocations={selectedCustomers}
      />
    </main>
  );
}