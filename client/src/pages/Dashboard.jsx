import { useEffect, useState } from 'react';
import { getDashboard } from '../services/itemService';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Package, AlertTriangle, Calendar, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';

const COLORS = ['#059669', '#0891b2', '#d97706', '#dc2626', '#7c3aed', '#db2777'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Your inventory overview</p>
        </div>
        <Link to="/add"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition">
          <Plus size={18} /> Add Item
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Package size={40} />}
          label="Total Items"
          value={data?.totalItems || 0}
          color="border-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle size={40} />}
          label="Low Stock"
          value={data?.lowStockCount || 0}
          color="border-orange-500"
        />
        <StatCard
          icon={<Calendar size={40} />}
          label="Expiring Soon"
          value={data?.expirySoonCount || 0}
          color="border-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart: Items by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Items by Category</h2>
          {data?.categoryData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {data.categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No data yet. Add some items!</p>
          )}
        </div>

        {/* Bar Chart: Category count */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Category Distribution</h2>
          {data?.categoryData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No data yet.</p>
          )}
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-4">Recently Added</h2>
        {data?.recentItems?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentItems.map(item => (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-700">{item.name}</td>
                    <td className="py-2 text-gray-500">{item.category}</td>
                    <td className="py-2">{item.quantity} {item.unit}</td>
                    <td className="py-2">
                      {item.quantity < item.minStock ? (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Low Stock</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No items yet.</p>
            <Link to="/add" className="text-emerald-600 font-medium hover:underline text-sm mt-2 inline-block">
              + Add your first item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;