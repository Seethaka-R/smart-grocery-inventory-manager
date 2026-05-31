import React from 'react';

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color} transform hover:-translate-y-1 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-2 tracking-tight">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl text-emerald-600/80">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
