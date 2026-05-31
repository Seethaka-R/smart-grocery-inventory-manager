import React from 'react';
import { ChevronUp, ChevronDown, Pencil, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const ItemCard = ({ item, handleQtyChange, handleDelete, handleEdit }) => {
  const isLowStock = item.quantity < item.minStock;
  
  // Calculate days left for expiry if exists
  let daysLeft = null;
  let isExpired = false;
  if (item.expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(item.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isExpired = daysLeft < 0;
  }

  return (
    <div 
      className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-150 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden ${
        isLowStock ? 'ring-2 ring-orange-500/20 bg-orange-50/10' : ''
      }`}
    >
      {/* Category badge */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
            {item.category}
          </span>
          <h3 className="font-bold text-gray-800 text-lg mt-2 line-clamp-1">{item.name}</h3>
        </div>
        
        {/* Status badges */}
        <div className="flex flex-col gap-1 items-end">
          {isLowStock && (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
              <AlertTriangle size={10} /> Low
            </span>
          )}
          {item.expiryDate && (
            <span 
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                isExpired 
                  ? 'bg-red-100 text-red-700' 
                  : daysLeft <= 3 
                    ? 'bg-red-50 text-red-650' 
                    : daysLeft <= 7 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <Calendar size={10} /> 
              {isExpired ? 'Expired' : `${daysLeft}d left`}
            </span>
          )}
        </div>
      </div>

      {/* Item info */}
      <div className="my-2">
        {/* Quantity control */}
        <div className="flex items-center justify-between bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 mb-3">
          <button 
            onClick={() => handleQtyChange(item._id, -1)}
            disabled={item.quantity <= 0}
            className="text-gray-500 hover:text-emerald-600 hover:bg-white disabled:opacity-30 p-1.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <ChevronDown size={18} />
          </button>
          
          <div className="text-center">
            <span className="font-extrabold text-xl text-gray-800">{item.quantity}</span>
            <span className="text-xs font-semibold text-gray-400 ml-1 uppercase">{item.unit}</span>
          </div>

          <button 
            onClick={() => handleQtyChange(item._id, 1)}
            className="text-gray-500 hover:text-emerald-600 hover:bg-white p-1.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <ChevronUp size={18} />
          </button>
        </div>

        {/* Stock status detail */}
        <div className="flex justify-between text-xs text-gray-550 px-1">
          <span>Min target: <strong>{item.minStock} {item.unit}</strong></span>
          {item.price > 0 && (
            <span className="font-semibold text-emerald-700">₹{item.price}</span>
          )}
        </div>

        {/* Expiry date display if exists */}
        {item.expiryDate && (
          <div className="mt-2 text-xs flex items-center gap-1 px-1">
            <span className="text-gray-400">Expires:</span>
            <span className={`font-medium ${isExpired ? 'text-red-650 line-through' : 'text-gray-700'}`}>
              {new Date(item.expiryDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Notes if exists */}
        {item.notes && (
          <div className="mt-2 bg-gray-50/40 p-2 rounded-lg border border-dashed border-gray-200 text-xs text-gray-500 line-clamp-2 italic">
            "{item.notes}"
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100">
        <button 
          onClick={() => handleEdit(item._id)}
          className="flex-1 flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-50/50 py-2 rounded-xl text-sm font-semibold transition duration-200 border border-transparent hover:border-blue-100"
        >
          <Pencil size={14} /> Edit
        </button>
        <button 
          onClick={() => handleDelete(item._id, item.name)}
          className="flex-1 flex items-center justify-center gap-1.5 text-red-550 hover:bg-red-50/50 py-2 rounded-xl text-sm font-semibold transition duration-200 border border-transparent hover:border-red-100"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
