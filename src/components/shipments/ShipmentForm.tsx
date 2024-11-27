import React from 'react';
import { useForm } from 'react-hook-form';
import { Shipment, Product } from '../../types';
import { useInventoryStore } from '../../store/inventoryStore';

interface ShipmentFormProps {
  onSubmit: (data: Omit<Shipment, 'id'>) => Promise<void>;
  initialData?: Shipment;
  onCancel: () => void;
}

export default function ShipmentForm({ onSubmit, initialData, onCancel }: ShipmentFormProps) {
  const { products } = useInventoryStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      status: 'pending',
      driver: '',
      vehicle: '',
      origin: { lat: 0, lng: 0, address: '' },
      destination: { lat: 0, lng: 0, address: '' },
      products: [],
      departureTime: new Date().toISOString().slice(0, 16),
      estimatedArrival: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Driver</label>
          <input
            type="text"
            {...register('driver', { required: 'Driver is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.driver && (
            <p className="mt-1 text-sm text-red-600">{errors.driver.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle</label>
          <input
            type="text"
            {...register('vehicle', { required: 'Vehicle is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.vehicle && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Origin Address</label>
          <input
            type="text"
            {...register('origin.address', { required: 'Origin address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Destination Address</label>
          <input
            type="text"
            {...register('destination.address', { required: 'Destination address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input
            type="datetime-local"
            {...register('departureTime', { required: 'Departure time is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated Arrival</label>
          <input
            type="datetime-local"
            {...register('estimatedArrival')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Shipment' : 'Create Shipment'}
        </button>
      </div>
    </form>
  );
}