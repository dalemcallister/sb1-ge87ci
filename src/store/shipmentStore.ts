import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Shipment } from '../types';

interface ShipmentState {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<Shipment, 'id'>) => Promise<void>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  updateShipmentLocation: (id: string, location: { lat: number; lng: number }) => Promise<void>;
}

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  shipments: [],
  loading: false,
  error: null,

  fetchShipments: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, 'shipments'));
      const shipments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        departureTime: doc.data().departureTime?.toDate(),
        estimatedArrival: doc.data().estimatedArrival?.toDate(),
        actualArrival: doc.data().actualArrival?.toDate(),
      })) as Shipment[];
      set({ shipments, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch shipments', loading: false });
    }
  },

  addShipment: async (shipment) => {
    set({ loading: true, error: null });
    try {
      await addDoc(collection(db, 'shipments'), {
        ...shipment,
        departureTime: new Date(shipment.departureTime || Date.now()),
        estimatedArrival: shipment.estimatedArrival ? new Date(shipment.estimatedArrival) : null,
        actualArrival: null,
      });
      await get().fetchShipments();
    } catch (error) {
      set({ error: 'Failed to add shipment', loading: false });
    }
  },

  updateShipment: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const shipmentRef = doc(db, 'shipments', id);
      await updateDoc(shipmentRef, {
        ...updates,
        departureTime: updates.departureTime ? new Date(updates.departureTime) : undefined,
        estimatedArrival: updates.estimatedArrival ? new Date(updates.estimatedArrival) : undefined,
        actualArrival: updates.actualArrival ? new Date(updates.actualArrival) : undefined,
      });
      await get().fetchShipments();
    } catch (error) {
      set({ error: 'Failed to update shipment', loading: false });
    }
  },

  deleteShipment: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'shipments', id));
      await get().fetchShipments();
    } catch (error) {
      set({ error: 'Failed to delete shipment', loading: false });
    }
  },

  updateShipmentLocation: async (id, location) => {
    set({ loading: true, error: null });
    try {
      const shipmentRef = doc(db, 'shipments', id);
      await updateDoc(shipmentRef, {
        currentLocation: location,
      });
      await get().fetchShipments();
    } catch (error) {
      set({ error: 'Failed to update shipment location', loading: false });
    }
  },
}));