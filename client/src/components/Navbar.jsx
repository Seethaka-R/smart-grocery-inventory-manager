import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LayoutDashboard, Bell, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Hide navbar on auth pages

  return (
    <nav className="bg-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingCart size={24} />
          SmartGrocery
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 hover:text-emerald-200 transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/inventory" className="flex items-center gap-1 hover:text-emerald-200 transition">
            <Package size={18} /> Inventory
          </Link>
          <Link to="/alerts" className="flex items-center gap-1 hover:text-emerald-200 transition">
            <Bell size={18} /> Alerts
          </Link>
          <span className="text-emerald-200 text-sm">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-lg transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;