export interface Customer {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openingTime: string | null;
  closingTime: string | null;
  lastPurchaseDate: string | null;
}