import React from 'react';
import { X, Bell, CheckCircle } from 'lucide-react';

const AdminAlertsModal = ({ isOpen, onClose, notifications, onNotificationClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[2000]">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mx-4">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-[#D62828]">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800">All System Notifications</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 bg-white">
          <div className="flex flex-col gap-4">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => onNotificationClick(n)}
                className={`p-5 rounded-2xl border flex gap-4 items-center cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] ${
                    n.read ? 'bg-white border-slate-100' : 'bg-red-50/50 border-red-100 shadow-sm'
                }`}
              >
                <div className="shrink-0 p-2 bg-white rounded-xl shadow-sm border border-slate-50">
                    {n.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${n.read ? 'text-slate-400' : 'text-[#D62828]'}`}>
                      {n.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{n.time}</span>
                  </div>
                  <p className={`text-base leading-tight ${n.read ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>
                    {n.text}
                  </p>
                </div>
                <div className="shrink-0">
                    {n.read ? <CheckCircle size={22} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full bg-[#D62828] shadow-md animate-pulse"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#2B2D42] text-white rounded-xl font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAlertsModal;