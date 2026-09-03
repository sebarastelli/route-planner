import { Customer } from "../types/customer";

export async function getRoute(customers: Customer[]) {
  if (customers.length < 2) {
    return null;
  }

  const coordinates = customers
    .map((customer) => `${customer.longitude},${customer.latitude}`)
    .join(";");

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener la ruta");
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No se encontró una ruta");
  }

  return data.routes[0];
}