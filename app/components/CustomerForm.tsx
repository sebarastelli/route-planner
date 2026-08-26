"use client";

import { useState } from "react";

interface CustomerFormProps {
  onAddCustomer: (address: string) => void;
}

export default function CustomerForm({
  onAddCustomer,
}: CustomerFormProps) {
  const [address, setAddress] = useState("");

  function handleSubmit() {
    if (!address.trim()) return;

    onAddCustomer(address);
    setAddress("");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Ingresá una dirección"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />

      <button onClick={handleSubmit}>
        Agregar
      </button>
    </div>
  );
}