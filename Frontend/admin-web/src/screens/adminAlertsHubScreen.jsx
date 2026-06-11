import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bell, Filter, Search, ChevronRight, CheckCircle,
  AlertTriangle, Info, ExternalLink, X, ShieldCheck, Navigation, FileText
} from 'lucide-react';

const getTimeAgo = (timestamp) => {
  if (!timestamp) return "Just now";
  const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const AdminAlertsHubScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [viewLogs, setViewLogs] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHubData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/incidents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseData = Array.isArray(response.data) ? response.data : response.data.incidents || [];
      
      // Clean parsing of database status flags to match UI tabs safely
      const fullyMapped = responseData.map(incident => {
        let mappedStatus = 'Unverified';
        if (incident.status === 'Verified') mappedStatus = 'Unverified';
        if (incident.status === 'Assigned') mappedStatus = 'In-Progress';
        if (incident.status === 'Resolved') mappedStatus = 'Resolved';
        if (incident.status === 'Pending') mappedStatus = 'Unverified';

        return {
          id: incident._id,
          type: incident.severity ? incident.severity.toUpperCase() : 'INFO',
          text: incident.description || `${incident.type} Emergency reported`,
          time: getTimeAgo(incident.timestamp),
          status: mappedStatus,
          category: incident.type || 'General',
          raw: incident
        };
      });

      setAlerts(fullyMapped);
    } catch (error) {
      console.error("Hub view connectivity fault standard error code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  const filteredAlerts = alerts.filter(a => filter === 'All' || a.status === filter);

  const handleClose = () => {
    setSelectedAlert(null);
    setViewLogs(false);
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "px-[10px] py-[4px] rounded-[8px] text-[11px] font-extrabold";
    if (status === 'Resolved') return `${baseClass} bg-[#DCFCE7] text-[#166534]`;
    if (status === 'Unverified') return `${baseClass} bg-[#FEE2E2] text-[#991B1B]`;
    return `${baseClass} bg-[#DBEAFE] text-[#1E40AF]`; 
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] p-6">
      {/* Header & Filters */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h2 className="m-0 text-[24px] font-extrabold text-slate-800">System Alerts Hub</h2>
          <p className="m-0 text-slate-500 text-sm">Audit trail of emergency signals and system logs</p>
        </div>
        <div className="flex gap-[8px] bg-white p-[5px] rounded-[12px] border border-slate-200">
          {['All', 'Unverified', 'In-Progress', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[16px] py-[8px] rounded-[8px] border-none text-[13px] font-bold cursor-pointer transition-colors duration-200 ${
                filter === f ? 'bg-[#D62828] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List Viewport */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">Loading dynamic control logs...</div>
      ) : (
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="flex items-center px-[25px] py-[20px] border-b border-slate-100 cursor-pointer transition-colors duration-200 hover:bg-slate-50"
            >
              <div className="flex items-center gap-[15px] flex-1">
                <div className={`w-[40px] h-[40px] rounded-[10px] flex justify-center items-center ${
                  alert.status === 'Resolved' ? 'bg-[#F0FDF4] text-[#10B981]' : 'bg-[#FFF1F2] text-[#D62828]'
                }`}>
                  {alert.type === 'CRITICAL' ? <AlertTriangle size={18} /> : <Bell size={18} />}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-slate-800">{alert.text}</div>
                  <div className="text-[12px] text-slate-400 mt-0.5">{alert.category} • {alert.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-[15px]">
                <span className={getStatusBadgeClass(alert.status)}>{alert.status}</span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          )) : (
            <div className="p-[40px] text-center text-slate-400">No alerts found for this filter.</div>
          )}
        </div>
      )}

      {/* Workflow Modal Layer */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] flex justify-center items-center z-[1000]">
          <div className="bg-white w-[400px] rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <div className="px-[25px] py-[20px] border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="m-0 text-slate-800 font-bold">{viewLogs ? 'Technological Logs' : 'Alert Workflow'}</h3>
              <X onClick={handleClose} className="cursor-pointer text-slate-500 hover:text-slate-800" />
            </div>
            <div className="p-[25px]">
              <div className="bg-slate-50 p-[15px] rounded-[12px] border border-slate-200 mb-4">
                <p className="m-0 font-bold text-slate-800">{selectedAlert.text}</p>
                <p className="m-0 mt-[5px] text-[12px] text-slate-500">Status: {selectedAlert.status} • {selectedAlert.time}</p>
              </div>

              {!viewLogs ? (
                <div className="flex flex-col gap-[12px]">
                  {selectedAlert.status === 'Unverified' && (
                    <button
                      onClick={() => { handleClose(); navigate('/verification'); }}
                      className="w-full p-[15px] bg-[#10B981] text-white border-none rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-emerald-600 transition-colors"
                    >
                      <ShieldCheck size={20} /> Go to Verification Center
                    </button>
                  )}
                  {selectedAlert.status === 'In-Progress' && (
                    <button
                      onClick={() => { handleClose(); navigate('/incident'); }}
                      className="w-full p-[15px] bg-[#3B82F6] text-white border-none rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-blue-600 transition-colors"
                    >
                      <Navigation size={20} /> Open Incident Management
                    </button>
                  )}
                  {selectedAlert.status === 'Resolved' && (
                    <div className="p-[15px] bg-[#F0FDF4] text-[#166534] rounded-[12px] text-[13px] flex items-center gap-[10px] font-semibold">
                      <CheckCircle size={18} /> This incident has been archived as resolved.
                    </div>
                  )}
                  <button
                    onClick={() => setViewLogs(true)}
                    className="w-full p-[15px] bg-white text-slate-800 border border-slate-200 rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-slate-50 transition-colors"
                  >
                    <FileText size={18} /> View Technological Logs
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-slate-800 p-[15px] rounded-[12px] text-slate-400 font-mono text-[11px] mb-4">
                    <div className="mb-[5px]">[10:42:01] Incident received initialization state.</div>
                    <div className="mb-[5px]">[10:42:05] Node cluster mapping processing completed.</div>
                    <div className="mb-[5px]">[10:43:12] Status transition: {selectedAlert.status}.</div>
                    <div>[10:43:45] Sync complete tracking pushed to Head Dispatcher.</div>
                  </div>
                  <button
                    onClick={() => setViewLogs(false)}
                    className="w-full p-[15px] bg-white text-slate-800 border border-slate-200 rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-slate-50 transition-colors"
                  >
                    Back to Actions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlertsHubScreen;