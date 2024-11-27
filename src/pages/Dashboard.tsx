import React from 'react';
import { Package, Truck, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import BatchManagement from '../components/dashboard/BatchManagement';
import { useInventoryStore } from '../store/inventoryStore';

export default function Dashboard() {
  const { products } = useInventoryStore();

  // Calculate inventory statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity < 10).length;
  const expiringProducts = products.filter(p => {
    const expiryDate = new Date(p.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatCard
          title="Active Shipments"
          value={5}
          icon={Truck}
          trend={{ value: 8, label: 'vs last month' }}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts}
          icon={AlertTriangle}
          className="bg-orange-50"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringProducts}
          icon={TrendingUp}
          className="bg-red-50"
        />
      </div>

      <QuickActions />
      
      <BatchManagement />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity items will be added here */}
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Alerts</h2>
          <div className="space-y-4">
            {lowStockProducts > 0 && (
              <div className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{lowStockProducts} products are running low on stock</span>
              </div>
            )}
            {expiringProducts > 0 && (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{expiringProducts} products are expiring soon</span>
              </div>
            )}
            {lowStockProducts === 0 && expiringProducts === 0 && (
              <p className="text-gray-500 text-sm">No alerts at this time</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}