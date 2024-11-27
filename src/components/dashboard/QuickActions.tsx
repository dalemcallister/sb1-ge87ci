import React from 'react';
import { Plus, Package, Truck, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/inventory?action=add"
          className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="rounded-full bg-blue-100 p-2 mr-3">
            <Plus className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900">Add Product</h3>
            <p className="text-xs text-blue-700">Add new inventory item</p>
          </div>
        </Link>

        <Link
          to="/inventory"
          className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div className="rounded-full bg-green-100 p-2 mr-3">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-900">Manage Inventory</h3>
            <p className="text-xs text-green-700">View and edit products</p>
          </div>
        </Link>

        <Link
          to="/shipments?action=add"
          className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="rounded-full bg-purple-100 p-2 mr-3">
            <Truck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-900">Create Shipment</h3>
            <p className="text-xs text-purple-700">Start new delivery</p>
          </div>
        </Link>

        <Link
          to="/shipments"
          className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <div className="rounded-full bg-orange-100 p-2 mr-3">
            <Search className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-orange-900">Track Shipments</h3>
            <p className="text-xs text-orange-700">Monitor deliveries</p>
          </div>
        </Link>
      </div>
    </div>
  );
}