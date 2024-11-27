export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  expiryDate: Date;
  batchNumber: string;
  storageConditions: string;
}

export interface Shipment {
  id: string;
  status: 'pending' | 'in-transit' | 'delivered';
  origin: Location;
  destination: Location;
  products: ShipmentProduct[];
  driver: string;
  vehicle: string;
  departureTime?: Date;
  estimatedArrival?: Date;
  actualArrival?: Date;
  currentLocation?: Location;
}

export interface ShipmentProduct {
  productId: string;
  quantity: number;
  batchNumber: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  currentStock: number;
}