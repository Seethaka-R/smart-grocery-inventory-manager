import { useEffect, useState } from 'react';
import { getItems, deleteItem, updateQuantity } from '../services/itemService';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['All', 'Grains', 'Dairy', 'Vegetables', 'Fruits', 'Beverages', 'Snacks', 'Meat', 'Frozen', 'Spices', 'Other'];

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const data = await getItems(category === 'All' ? '' : category, search);
      setItems(data);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [category, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteItem(id);
      toast.success(`${name} deleted`);
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleQtyChange = async (id, change) => {
    try {
      const updated = await updateQuantity(id, change);
      setItems(prev => prev.map(item => item._id === id ? updated : item));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <Link to="/add"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition">
          <Plus size={18} /> Add Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl">
          <p className="text-gray-400 text-lg">No items found</p>
          <Link to="/add" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">+ Add your first item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <ItemCard 
              key={item._id} 
              item={item} 
              handleQtyChange={handleQtyChange} 
              handleDelete={handleDelete} 
              handleEdit={(id) => navigate(`/edit/${id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;