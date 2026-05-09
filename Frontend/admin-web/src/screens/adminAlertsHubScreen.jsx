import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Filter, Search, ChevronRight, CheckCircle, 
  AlertTriangle, Info, ExternalLink, X, ShieldCheck, Navigation, FileText
} from 'lucide-react';

const AdminAlertsHubScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [viewLogs, setViewLogs] = useState(false);
  
  // --- ALERTS DATA ---
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'CRITICAL', text: 'Critical Fire reported in Sector 4', time: '2m ago', status: 'Unverified', category: 'Fire' },
    { id: 2, type: 'INFO', text: 'Unit 04 has arrived on scene', time: '15m ago', status: 'In-Progress', category: 'Dispatch' },
    { id: 3, type: 'SUCCESS', text: 'Chemical spill at Hwy 95 cleared', time: '1h ago', status: 'Resolved', category: 'Hazmat' },
    { id: 4, type: 'CRITICAL', text: 'Multi-Car Collision near Main St.', time: '2h ago', status: 'Unverified', category: 'Accident' },
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = alerts.filter(a => filter === 'All' || a.status === filter);

  const handleClose = () => {
    setSelectedAlert(null);
    setViewLogs(false);
  };

  // Helper for dynamic status badge classes
  const getStatusBadgeClass = (status) => {
    const baseClass = "px-[10px] py-[4px] rounded-[8px] text-[11px] font-extrabold";
    if (status === 'Resolved') return `${baseClass} bg-[#DCFCE7] text-[#166534]`;
    if (status === 'Unverified') return `${baseClass} bg-[#FEE2E2] text-[#991B1B]`;
    return `${baseClass} bg-[#DBEAFE] text-[#1E40AF]`; // In-Progress
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header & Filters */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h2 className="m-0 text-[24px] font-extrabold text-slate-800">System Alerts Hub</h2>
          <p className="m-0 text-slate-500">Audit trail of emergency signals and system logs</p>
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

      {/* Alert List */}
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
                {alert.type === 'CRITICAL' ? <AlertTriangle size={18}/> : <Bell size={18}/>}
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

      {/* DYNAMIC WORKFLOW MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] flex justify-center items-center z-[1000]">
            <div className="bg-white w-[400px] rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                <div className="px-[25px] py-[20px] border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="m-0 text-slate-800 font-bold">{viewLogs ? 'Technological Logs' : 'Alert Workflow'}</h3>
                    <X onClick={handleClose} className="cursor-pointer text-slate-500 hover:text-slate-800" />
                </div>
                
                <div className="p-[25px]">
                    <div className="bg-slate-50 p-[15px] rounded-[12px] border border-slate-200">
                        <p className="m-0 font-bold text-slate-800">{selectedAlert.text}</p>
                        <p className="m-0 mt-[5px] text-[12px] text-slate-500">Status: {selectedAlert.status} • {selectedAlert.time}</p>
                    </div>

                    {!viewLogs ? (
                        /* ACTION BUTTONS */
                        <div className="flex flex-col gap-[12px] mt-[20px]">
                            {/* CASE 1: UNVERIFIED */}
                            {selectedAlert.status === 'Unverified' && (
                                <button 
                                  onClick={() => navigate('/verification')} 
                                  className="w-full p-[15px] bg-[#10B981] text-white border-none rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-emerald-600 transition-colors"
                                >
                                    <ShieldCheck size={20} /> Go to Verification Center
                                </button>
                            )}

                            {/* CASE 2: IN-PROGRESS / DISPATCHED */}
                            {selectedAlert.status === 'In-Progress' && (
                                <button 
                                  onClick={() => navigate('/incident')} 
                                  className="w-full p-[15px] bg-[#3B82F6] text-white border-none rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-blue-600 transition-colors"
                                >
                                    <Navigation size={20} /> Open Incident Management
                                </button>
                            )}

                            {/* CASE 3: RESOLVED */}
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
                        /* TECHNICAL LOGS VIEW */
                        <div className="mt-[20px]">
                            <div className="bg-slate-800 p-[15px] rounded-[12px] text-slate-400 font-mono text-[11px]">
                                <div className="mb-[5px]">[10:42:01] System initial trigger received.</div>
                                <div className="mb-[5px]">[10:42:05] Node Cluster 084 validated GPS.</div>
                                <div className="mb-[5px]">[10:43:12] Status transition: {selectedAlert.status}.</div>
                                <div>[10:43:45] Alert pushed to Head Dispatcher.</div>
                            </div>
                            <button 
                              onClick={() => setViewLogs(false)} 
                              className="w-full p-[15px] mt-[15px] bg-white text-slate-800 border border-slate-200 rounded-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-[10px] hover:bg-slate-50 transition-colors"
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