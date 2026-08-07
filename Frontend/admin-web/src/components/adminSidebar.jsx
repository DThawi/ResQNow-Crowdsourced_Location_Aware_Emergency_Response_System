import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, AlertCircle, CheckCircle, Users, 
  ShieldAlert, BarChart2, Settings, LogOut, X, Bell 
} from 'lucide-react';
import API from '../services/api'; // Adjust relative path to services/api if needed

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <AlertCircle size={20} />, label: "Incident Management", path: "/incident" },
    { icon: <CheckCircle size={20} />, label: "Verification Center", path: "/verification" },
    { icon: <Users size={20} />, label: "Responder Management", path: "/responder" },
    { icon: <ShieldAlert size={20} />, label: "Danger Zone Management", path: "/dangerzone" },
    { icon: <BarChart2 size={20} />, label: "Analytics & Reports", path: "/analytics" },
    { icon: <Users size={20} />, label: "User Management", path: "/users" },
    { icon: <Settings size={20} />, label: "System Settings", path: "/settings" },
    { icon: <Bell size={20} />, label: "Alerts Center", path: "/alerts-hub" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 🔒 Send logout API request so Express logs the event
      await API.post('/auth/logout');
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      // Clear token / local session data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setShowLogoutPopup(false);
      setIsLoggingOut(false);
      
      // Redirect to login screen
      navigate('/login');
    }
  };

  return (
    <div className="w-[260px] bg-gradient-to-b from-[#A52426] to-[#2B2D42] text-white flex flex-col h-screen fixed">
      
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h2 className="m-0 text-[22px] font-extrabold">ResQNow Admin</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-5">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="text-decoration-none block">
            <div className={`flex items-center gap-4 py-4 px-6 cursor-pointer transition-colors duration-200 text-sm font-semibold border-l-4 ${
              location.pathname === item.path 
                ? 'bg-white/10 border-white text-white' 
                : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
            }`}>
              {item.icon} <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Trigger */}
      <div 
        onClick={() => setShowLogoutPopup(true)} 
        className="p-6 border-t border-white/10 cursor-pointer flex items-center gap-4 text-white/70 hover:text-white transition-colors"
      >
        <LogOut size={20} /> <span>Logout</span>
      </div>

      {/* Logout Popup Overlay */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
          <div className="bg-white p-10 rounded-3xl text-center w-[350px] text-slate-800 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex justify-center items-center mx-auto mb-5">
              <LogOut color="#D62828" size={30} />
            </div>
            <h3 className="m-0 mb-2.5 text-xl font-bold">Logout?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to log out of your admin account?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowLogoutPopup(false)} 
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-xl border-none bg-[#D62828] text-white font-bold cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
