import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Alerts from './pages/Alerts';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected App Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
            Smart Grocery Inventory Manager &copy; {new Date().getFullYear()}
          </footer>
        </div>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
