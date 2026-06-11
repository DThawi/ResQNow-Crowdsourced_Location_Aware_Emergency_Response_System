import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import AdminAlertsModal from "./adminAlertsModal.jsx";

// Helper function to map time differences matching the mobile screens
const getTimeAgo = (timestamp) => {
  if (!timestamp) return "Just now";
  const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notifRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch true live incidents from database
  const fetchLiveIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      // Fetch matching mobile pattern endpoint
      const response = await axios.get("http://localhost:5000/api/incidents", config);
      const fetchedData = Array.isArray(response.data) ? response.data : response.data.incidents || [];

      // Transform db entries to match frontend view requirements
      const formatted = fetchedData.map((item) => {
        let path = "/dashboard";
        if (item.status === "Pending" || item.status === "Verified") {
          path = "/verification";
        } else if (item.status === "Assigned") {
          path = "/incident";
        }

        // Assign contextual utility icons based on emergency levels
        let iconElement = <Info color="#10B981" size={18} />;
        if (item.severity === "Critical" || item.severity === "High") {
          iconElement = <AlertTriangle color="#D62828" size={18} />;
        } else if (item.severity === "Moderate") {
          iconElement = <AlertCircle color="#3B82F6" size={18} />;
        }

        return {
          id: item._id,
          type: item.severity ? item.severity.toUpperCase() : "INFO",
          text: item.description || `${item.type} Emergency Alert`,
          time: getTimeAgo(item.timestamp),
          read: item.status === "Resolved",
          targetPath: path,
          icon: iconElement,
        };
      });

      setNotifications(formatted);
    } catch (error) {
      console.error("Error connecting to /api/incidents inside header panel:", error);
    }
  };

  useEffect(() => {
    fetchLiveIncidents();
    // Optional: Real-time interval syncing tracking updates every 30 seconds
    const loopTracker = setInterval(fetchLiveIncidents, 30000);
    return () => clearInterval(loopTracker);
  }, []);

  // Handle auto-closing dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notif) => {
    try {
      // Local view state mutation
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );

      navigate(notif.targetPath);
      setShowNotif(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error executing action context paths:", err);
    }
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-[85px] bg-white flex items-center justify-between px-10 shadow-sm sticky top-0 z-[100]">
      <h1 className="m-0 text-[20px] text-[#2B2D42] font-extrabold">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <div
            onClick={() => setShowNotif(!showNotif)}
            className={`cursor-pointer p-2 rounded-full transition-colors relative ${
              showNotif ? "bg-slate-100" : "bg-transparent hover:bg-slate-50"
            }`}
          >
            <Bell size={22} color={showNotif ? "#2B2D42" : "#8D99AE"} />
            {unreadCount > 0 && (
              <div className="absolute top-0.5 right-0.5 bg-[#D62828] text-white text-[9px] w-4 h-4 rounded-full flex justify-center items-center font-bold border-2 border-white">
                {unreadCount}
              </div>
            )}
          </div>

          {showNotif && (
            <div className="absolute top-[60px] right-0 w-[340px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center font-extrabold text-sm">
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  <span>Notifications</span>
                </div>
                <span
                  onClick={markAllAsRead}
                  className="text-[11px] text-[#D62828] cursor-pointer font-extrabold hover:underline"
                >
                  Mark all as read
                </span>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 flex gap-3 border-b border-slate-50 cursor-pointer transition-colors items-center border-l-4 ${
                        n.read
                          ? "bg-white border-l-transparent"
                          : "bg-slate-50 border-l-[#D62828] hover:bg-slate-100"
                      }`}
                    >
                      <div className="mt-0.5">{n.icon}</div>
                      <div className="flex-1">
                        <div
                          className={`text-[13px] ${
                            n.read ? "font-medium text-slate-500" : "font-bold text-slate-800"
                          }`}
                        >
                          {n.text}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {n.time}
                        </div>
                      </div>
                      {n.read ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D62828] shadow-sm"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-[13px]">
                    No notifications available
                  </div>
                )}
              </div>

              <div
                className="p-3 text-center text-xs text-[#D62828] font-extrabold bg-red-50 cursor-pointer border-t border-red-100 hover:bg-red-100 transition-colors"
                onClick={() => {
                  setShowNotif(false);
                  setIsModalOpen(true);
                }}
              >
                View All Alerts
              </div>
            </div>
          )}
        </div>

        {/* Profile Info Row (Preserved exact styling & static content as ordered) */}
        <div
          onClick={() => navigate("/profile")}
          className="group flex items-center gap-3 border-l border-gray-200 pl-6 cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-10 h-10 rounded-full bg-[#2B2D42] text-white flex items-center justify-center font-bold group-hover:bg-[#D62828] transition">
            JA
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-[#2B2D42] group-hover:text-[#D62828] transition">
              John Anderson
            </span>
            <span className="text-[11px] text-[#8D99AE] uppercase font-bold tracking-wide">
              Head Dispatcher
            </span>
          </div>
        </div>
      </div>

      <AdminAlertsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </header>
  );
};

export default AdminHeader;