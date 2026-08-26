"use client";

import { useState } from "react";
import { Customer } from "../types/customer";
import {
  getCustomerStatus,
  getDaysSinceLastPurchase,
} from "../lib/customerStatus";
import { useCurrentTime } from "../hooks/useCurrentTime";

interface CustomerListProps {
  customers: Customer[];
  onRemoveCustomer: (id: string) => void;
  selectedCustomerIds: string[];
  onToggleCustomer: (id: string) => void;
  onCustomerUpdated: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  onRemoveCustomer,
  selectedCustomerIds,
  onToggleCustomer,
  onCustomerUpdated,
}: CustomerListProps) {
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );

  const [name, setName] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [lastPurchaseDate, setLastPurchaseDate] = useState("");
  useCurrentTime();

  function startEditing(customer: Customer) {
    setEditingCustomerId(customer.id);
    setName(customer.name);
    setOpeningTime(customer.openingTime ?? "");
    setClosingTime(customer.closingTime ?? "");
    setLastPurchaseDate(
      customer.lastPurchaseDate
        ? customer.lastPurchaseDate.split("T")[0]
        : "",
    );
  }

  function cancelEditing() {
    setEditingCustomerId(null);
  }

  async function saveChanges(id: string) {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          openingTime: openingTime || null,
          closingTime: closingTime || null,
          lastPurchaseDate: lastPurchaseDate || null,
        }),
      });

      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudieron guardar los cambios",
        );
      }
      onCustomerUpdated(data);
      setEditingCustomerId(null);

      alert("Cambios guardados correctamente");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar",
      );
    }
  }

  return (
    <div>
      <h2>Clientes</h2>

      <ul>
        {customers.map((customer) => {
  const status = getCustomerStatus(customer);
  const daysSincePurchase = getDaysSinceLastPurchase(
    customer.lastPurchaseDate,
  );

  return (
    <li key={customer.id}>
      <input
        type="checkbox"
        checked={selectedCustomerIds.includes(customer.id)}
        onChange={() => onToggleCustomer(customer.id)}
      />

      <span>
        {customer.name} — {customer.address}
      </span>

      <p>
        Estado:{" "}
        {status === "open"
          ? "🟢 Abierto"
          : status === "closed"
            ? "🔴 Cerrado"
            : "⚪ Sin horario"}
      </p>

      <p>
        Última compra:{" "}
        {daysSincePurchase === null
          ? "Sin datos"
          : `hace ${daysSincePurchase} días`}
      </p>

      <button
        onClick={() =>
          editingCustomerId === customer.id
            ? cancelEditing()
            : startEditing(customer)
        }
      >
        {editingCustomerId === customer.id ? "Cancelar" : "Editar"}
      </button>

      <button onClick={() => onRemoveCustomer(customer.id)}>
        Eliminar
      </button>

      {editingCustomerId === customer.id && (
        <div>
          <p>Editar cliente</p>

          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <br />

          <label>
            Horario de apertura:
            <input
              type="time"
              value={openingTime}
              onChange={(event) => setOpeningTime(event.target.value)}
            />
          </label>

          <br />

          <label>
            Horario de cierre:
            <input
              type="time"
              value={closingTime}
              onChange={(event) => setClosingTime(event.target.value)}
            />
          </label>

          <br />

          <label>
            Última compra:
            <input
              type="date"
              value={lastPurchaseDate}
              onChange={(event) => setLastPurchaseDate(event.target.value)}
            />
          </label>

          <br />

          <button onClick={() => saveChanges(customer.id)}>
            Guardar cambios
          </button>
        </div>
      )}
    </li>
  );
})}
      </ul>
    </div>
  );
}