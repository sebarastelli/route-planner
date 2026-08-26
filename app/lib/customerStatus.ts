import { Customer } from "../types/customer";

export type CustomerStatus =
  | "open"
  | "closed"
  | "no-schedule";

export function getCustomerStatus(customer: Customer): CustomerStatus {
  if (!customer.openingTime || !customer.closingTime) {
    return "no-schedule";
  }

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const [openingHour, openingMinute] = customer.openingTime
    .split(":")
    .map(Number);

  const [closingHour, closingMinute] = customer.closingTime
    .split(":")
    .map(Number);

  const openingMinutes = openingHour * 60 + openingMinute;
  const closingMinutes = closingHour * 60 + closingMinute;

  return currentMinutes >= openingMinutes &&
    currentMinutes < closingMinutes
    ? "open"
    : "closed";
}

export function getDaysSinceLastPurchase(
  lastPurchaseDate: string | null,
): number | null {
  if (!lastPurchaseDate) {
    return null;
  }

  const purchaseDate = new Date(lastPurchaseDate);
  const now = new Date();

  const difference = now.getTime() - purchaseDate.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24));
}