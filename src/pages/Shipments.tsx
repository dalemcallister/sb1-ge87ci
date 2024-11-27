import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useShipmentStore } from '../store/shipmentStore';
import ShipmentList from '../components/shipments/ShipmentList';
import ShipmentForm from '../components/shipments/ShipmentForm';
import { Shipment } from '../types';

export default function Shipments() {
  const { shipments, loading, error, fetchShipments, addShipment, updateShipment, deleteShipment } = useShipmentStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleAddShipment = async (data: Omit<Shipment, 'id'>) => {
    await addShipment(data);
    setIsFormOpen(false);
  };

  const handleUpdateShipment = async (data: Omit<Shipment, 'id'>) => {
    if (editingShipment) {
      await updateShipment(editingShipment.id, data);
      setEditingShipment(null);
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      await deleteShipment(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingShipment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Shipments Management</h1>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingShipment ? 'Edit Shipment' : 'Create New Shipment'}
          </h2>
          <ShipmentForm
            onSubmit={editingShipment ? handleUpdateShipment : handleAddShipment}
            initialData={editingShipment || undefined}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <ShipmentList
            shipments={shipments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}