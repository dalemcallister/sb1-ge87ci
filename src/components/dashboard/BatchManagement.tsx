import React, { useState } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';
import { format } from 'date-fns';
import { Package, AlertTriangle, Search } from 'lucide-react';

export default function BatchManagement() {
  const [searchBatch, setSearchBatch] = useState('');
  const { getProductsByBatch, products } = useInventoryStore();
  
  // Get unique batch numbers
  const uniqueBatches = [...new Set(products.map(p => p.batchNumber))];
  const batchProducts = searchBatch ? getProductsByBatch(searchBatch) : [];

  // Get expiring batches (within 30 days)
  const expiringBatches = uniqueBatches.filter(batch => {
    const batchProducts = getProductsByBatch(batch);
    return batchProducts.some(product => {
      const expiryDate = new Date(product.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow;
    });
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Batch Management</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            placeholder="Search batch..."
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <button className="p-2 text-blue-600 hover:text-blue-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Active Batches</h3>
          <div className="space-y-2">
            {uniqueBatches.slice(0, 5).map(batch => {
              const batchProducts = getProductsByBatch(batch);
              const totalItems = batchProducts.reduce((sum, p) => sum + p.quantity, 0);
              return (
                <div key={batch} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{batch}</span>
                  </div>
                  <span className="text-sm text-gray-500">{totalItems} items</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Expiring Batches</h3>
          <div className="space-y-2">
            {expiringBatches.slice(0, 5).map(batch => {
              const batchProducts = getProductsByBatch(batch);
              const earliestExpiry = new Date(Math.min(...batchProducts.map(p => new Date(p.expiryDate).getTime())));
              return (
                <div key={batch} className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-700">{batch}</span>
                  </div>
                  <span className="text-sm text-red-600">
                    Expires {format(earliestExpiry, 'dd/MM/yyyy')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {searchBatch && batchProducts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Batch Details: {searchBatch}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{product.sku}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}