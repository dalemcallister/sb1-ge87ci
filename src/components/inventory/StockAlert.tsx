import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import { format } from 'date-fns';

const STOCK_THRESHOLD = 10;
const EXPIRY_THRESHOLD_DAYS = 30;

export default function StockAlert() {
  const { getLowStockProducts, getExpiringProducts } = useInventoryStore();
  
  const lowStockProducts = getLowStockProducts(STOCK_THRESHOLD);
  const expiringProducts = getExpiringProducts(EXPIRY_THRESHOLD_DAYS);

  if (lowStockProducts.length === 0 && expiringProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Alerts</h2>
      
      {lowStockProducts.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-orange-800 mb-2">Low Stock Alerts</h3>
          <div className="space-y-2">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                <span>
                  {product.name} (SKU: {product.sku}) - Only {product.quantity} units remaining
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiringProducts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-red-800 mb-2">Expiring Products</h3>
          <div className="space-y-2">
            {expiringProducts.map(product => (
              <div key={product.id} className="flex items-center text-sm">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span>
                  {product.name} (Batch: {product.batchNumber}) - Expires on {format(new Date(product.expiryDate), 'dd/MM/yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}