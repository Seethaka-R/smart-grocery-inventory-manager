import { useEffect, useState } from 'react';
import { getLowStockAlerts, getExpiryAlerts } from '../services/itemService';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import AlertCard from '../components/AlertCard';

const Alerts = () => {
  const [lowStock, setLowStock] = useState([]);
  const [expirySoon, setExpirySoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const [ls, exp] = await Promise.all([getLowStockAlerts(), getExpiryAlerts()]);
        setLowStock(ls);
        setExpirySoon(exp);
      } catch {
        toast.error('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Alerts</h1>

      {/* Low Stock Alerts */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-700">
            Low Stock ({lowStock.length} items)
          </h2>
        </div>

        {lowStock.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-700 font-medium">✅ All items are sufficiently stocked!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {lowStock.map(item => (
                <AlertCard key={item._id} item={item} type="lowstock" />
              ))}
            </div>

            {/* Auto Shopping List */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="text-blue-500" size={18} />
                <h3 className="font-semibold text-blue-800">Auto-Generated Shopping List</h3>
              </div>
              <ul className="space-y-1">
                {lowStock.map(item => (
                  <li key={item._id} className="flex items-center gap-2 text-sm text-blue-700">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    {item.name} — need at least {item.minStock} {item.unit} (have {item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Expiry Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-red-500" />
          <h2 className="text-lg font-semibold text-gray-700">
            Expiring Soon ({expirySoon.length} items)
          </h2>
        </div>

        {expirySoon.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-700 font-medium">✅ No items expiring within 7 days!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expirySoon.map(item => (
              <AlertCard key={item._id} item={item} type="expiry" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;