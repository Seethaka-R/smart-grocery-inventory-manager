import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar, RefreshCw } from 'lucide-react';

const AlertCard = ({ item, type }) => {
  if (type === 'lowstock') {
    return (
      <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/50 px-2.5 py-0.5 rounded-md">
                {item.category}
              </span>
              <h3 className="font-bold text-gray-800 text-base mt-2">{item.name}</h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
              <AlertTriangle size={12} className="text-orange-500" /> Low
            </span>
          </div>
          
          <div className="mt-4 bg-white/80 rounded-xl p-3 border border-orange-100 flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-400 text-[10px] block uppercase font-semibold">Current</span>
              <span className="text-orange-600 font-extrabold text-lg">{item.quantity} {item.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] block uppercase font-semibold">Min Limit</span>
              <span className="text-gray-700 font-bold text-lg">{item.minStock} {item.unit}</span>
            </div>
          </div>
        </div>

        <Link 
          to={`/edit/${item._id}`}
          className="mt-4 w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl text-sm transition-all duration-200 shadow-sm"
        >
          <RefreshCw size={14} /> Update Stock
        </Link>
      </div>
    );
  }

  if (type === 'expiry') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(item.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;

    return (
      <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100/50 px-2.5 py-0.5 rounded-md">
                {item.category}
              </span>
              <h3 className="font-bold text-gray-800 text-base mt-2">{item.name}</h3>
            </div>
            <span 
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isExpired 
                  ? 'bg-red-150 text-red-700 border-red-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              <Calendar size={12} className="text-red-500" />
              {isExpired ? 'Expired' : `${daysLeft}d left`}
            </span>
          </div>
          
          <div className="mt-4 bg-white/80 rounded-xl p-3 border border-red-100 flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-400 text-[10px] block uppercase font-semibold">Remaining</span>
              <span className="text-red-650 font-extrabold text-lg">{item.quantity} {item.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] block uppercase font-semibold">Expiry Date</span>
              <span className="text-gray-700 font-bold text-xs block mt-1">
                {new Date(item.expiryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <Link 
          to={`/edit/${item._id}`}
          className="mt-4 w-full flex items-center justify-center gap-1.5 bg-red-550 hover:bg-red-600 text-white font-semibold py-2 rounded-xl text-sm transition-all duration-200 shadow-sm"
        >
          <RefreshCw size={14} /> Update Stock
        </Link>
      </div>
    );
  }

  return null;
};

export default AlertCard;
