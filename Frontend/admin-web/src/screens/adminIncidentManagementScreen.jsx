import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, Users, MapPin, Clock, Truck, 
  Activity, Navigation, CheckCircle2, Shield, Flame, Plus, X, ToggleRight
} from 'lucide-react';
import { getIncidents, updateIncidentStatus } from '../services/analyticsService';

const AdminIncidentManagementScreen = () => {
    const [incidents, setIncidents] = useState([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);
    const [incidentError, setIncidentError] = useState(null);

  const [availableResponders, setAvailableResponders] = useState([
    { id: 'R-01', name: 'Unit 04 (Medical)', distance: '1.2 km away', lat: '35%', lng: '45%' },
    { id: 'R-02', name: 'Unit 07 (Police)', distance: '2.5 km away', lat: '65%', lng: '55%' },
    { id: 'R-03', name: 'Unit 15 (Fire/Rescue)', distance: '3.1 km away', lat: '25%', lng: '65%' }
  ]);

    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  // --- ASSIGN LOGIC ---
  const handleAssign = (responder) => {
    setIncidents(prev => prev.map(inc => {
        if (inc.id === selectedIncidentId) {
            return {
                ...inc,
                status: 'Dispatched',
                assigned: [...inc.assigned, responder.name]
            };
        }
        return inc;
    }));
    setAvailableResponders(prev => prev.filter(r => r.id !== responder.id));
  };

  // --- RESOLVE & REMOVE LOGIC ---
    const [resolveModalOpen, setResolveModalOpen] = useState(false);

    const handleResolveSequence = async () => {
        if (!selectedIncidentId) return;
        setResolveModalOpen(true);
        try {
            await updateIncidentStatus(selectedIncidentId, 'Resolved');
        } catch (err) {
            console.warn('Unable to update incident status', err);
        }
        setIncidents(prev => prev.map(inc => 
                inc.id === selectedIncidentId ? { ...inc, status: 'Resolved' } : inc
        ));

        setTimeout(() => {
            setIncidents(prev => {
                const remaining = prev.filter(i => i.id !== selectedIncidentId);
                if (remaining.length > 0) setSelectedIncidentId(remaining[0].id);
                else setSelectedIncidentId(null);
                return remaining;
            });
            setResolveModalOpen(false);
        }, 3000);
    };

    useEffect(() => {
        let cancelled = false;

        const formatIncident = (incident) => {
            const coords = incident.location?.coordinates;
            const location = coords ? `${coords[1].toFixed(3)}, ${coords[0].toFixed(3)}` : 'Unknown location';
            const reportTime = incident.timestamp ? new Date(incident.timestamp) : null;
            const timeLabel = reportTime ? `${Math.max(1, Math.floor((Date.now() - reportTime.getTime()) / 60000))}m ago` : 'Unknown';
            return {
                id: incident._id,
                title: incident.type || incident.description || 'Incident Reported',
                type: incident.type || 'Unknown',
                location,
                status: incident.status === 'Assigned' ? 'Dispatched' : incident.status === 'Pending' ? 'Reported' : incident.status,
                rawStatus: incident.status,
                time: timeLabel,
                assigned: Array.isArray(incident.assignedAuthorities) ? incident.assignedAuthorities.map((item) => String(item)) : [],
            };
        };

        const loadIncidents = async () => {
            try {
                setLoadingIncidents(true);
                setIncidentError(null);
                const incidentRecords = await getIncidents(1, 20);
                if (cancelled) return;
                const transformed = Array.isArray(incidentRecords) ? incidentRecords.map(formatIncident) : [];
                setIncidents(transformed);
                if (transformed.length > 0) {
                    setSelectedIncidentId(transformed[0].id);
                }
            } catch (err) {
                if (!cancelled) setIncidentError(err.message || 'Unable to load incidents');
            } finally {
                if (!cancelled) setLoadingIncidents(false);
            }
        };

        loadIncidents();
        return () => { cancelled = true; };
    }, []);

  const getStatusClasses = (status) => {
    switch(status) {
        case 'Verified': return 'bg-[#FEF3C7] text-[#D97706]'; 
        case 'Dispatched': return 'bg-[#DBEAFE] text-[#1D4ED8]'; 
        case 'On Scene': return 'bg-[#F3E8FF] text-[#7E22CE]'; 
        case 'Resolved': return 'bg-[#DCFCE7] text-[#10B981]';
        default: return 'bg-[#F3F4F6] text-[#4B5563]';
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex gap-[25px] h-[calc(100vh-150px)]">
          
          {/* LEFT LIST - Width reduced to 380px and added ml-2 for border visibility */}
          <div className="w-[380px] ml-2 flex flex-col shrink-0">
              <h2 className="m-0 mb-[5px] text-[24px] text-[#1E293B] font-extrabold">Active Incidents</h2>
              <p className="m-0 mb-[20px] text-[#64748B] text-[14px]">Verified events requiring dispatch</p>
              
              <div className="flex-1 overflow-y-auto flex flex-col gap-[15px] pr-[10px]">
                  {incidents.map((incident) => {
                      const isSelected = selectedIncidentId === incident.id;
                      return (
                          <div key={incident.id} onClick={() => setSelectedIncidentId(incident.id)} 
                            className={`bg-white rounded-[18px] p-[20px] cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.03)] ${isSelected ? 'border-[2.5px] border-[#1E293B] scale-[1.02]' : 'border border-[#E2E8F0] scale-100 hover:border-slate-300'}`}>
                              <div className="flex justify-between items-center mb-[12px]">
                                  <div className="flex items-center gap-[8px]">
                                      {incident.type === 'Fire' ? <Flame size={18} color="#D62828" /> : <AlertCircle size={18} color="#F59E0B" />}
                                      <span className="text-[16px] text-[#1E293B] font-extrabold">{incident.title}</span>
                                  </div>
                                  <span className={`text-[11px] font-bold px-[12px] py-[4px] rounded-[12px] ${getStatusClasses(incident.status)}`}>
                                      {incident.status}
                                  </span>
                              </div>
                              <div className="flex items-center gap-[6px] text-[#64748B] text-[13px] mb-[12px]">
                                  <MapPin size={14} /> {incident.location}
                              </div>
                              <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-[10px]">
                                  <div className="text-[#94A3B8] text-[12px] flex items-center gap-[5px]"><Clock size={12}/> {incident.time}</div>
                                  <div className={`text-[13px] font-extrabold ${incident.assigned.length > 0 ? 'text-[#10B981]' : 'text-[#D62828]'}`}>
                                      {incident.assigned.length > 0 ? `${incident.assigned.length} Units Assigned` : 'Unassigned'}
                                  </div>
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex-1 bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col overflow-hidden mr-2">
              {selectedIncident ? (
                  <>
                      {/* HEADER */}
                      <div className="p-[30px] border-b border-[#F1F5F9] flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-[10px] mb-[8px]">
                                <h2 className="m-0 text-[32px] text-[#1E293B] font-[900]">{selectedIncident.title}</h2>
                                <span className={`text-[12px] font-bold px-[12px] py-[5px] rounded-[8px] ${getStatusClasses(selectedIncident.status)}`}>
                                    {selectedIncident.status}
                                </span>
                              </div>
                              <div className="flex gap-[20px] text-[#64748B] text-[14px]">
                                  <span className="flex items-center gap-[6px]"><MapPin size={18} /> {selectedIncident.location}</span>
                                  <span className="flex items-center gap-[6px]"><AlertCircle size={18} /> ID: {selectedIncident.id}</span>
                              </div>
                          </div>
                          <button 
                            onClick={handleResolveSequence} 
                            className="px-[30px] py-[15px] rounded-[14px] border-none bg-[#10B981] text-white font-extrabold text-[16px] cursor-pointer flex items-center gap-[10px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600 transition-colors"
                          >
                              <CheckCircle2 size={20} /> Mark as Resolved
                          </button>
                      </div>

                      <div className="flex-1 p-[30px] overflow-y-auto flex flex-col gap-[25px]">
                          <div className="w-full h-[320px] bg-[#F1F5F9] rounded-[20px] relative overflow-hidden border border-[#E2E8F0] shrink-0">
                              <div className="w-full h-full opacity-40 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] bg-[size:25px_25px]"></div>
                              <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                                  <div className="bg-[#D62828] p-[10px] rounded-full text-white shadow-[0_0_20px_rgba(214,40,40,0.4)] relative z-10">
                                      <AlertCircle size={24} />
                                  </div>
                                  <div className="w-[60px] h-[60px] bg-[#D62828] rounded-full absolute -top-[10px] -left-[10px] opacity-20 animate-[pulseMarker_2s_infinite]"></div>
                              </div>
                              {availableResponders.map(r => (
                                <div key={r.id} className="absolute flex flex-col items-center" style={{ top: r.lat, left: r.lng }}>
                                    <div className="bg-[#1D4ED8] p-[5px] rounded-full text-white border-[2px] border-white shadow-md">
                                        <Truck size={14} />
                                    </div>
                                </div>
                              ))}
                          </div>

                          <div className="flex gap-[30px]">
                              <div className="flex-1">
                                  <div className="flex justify-between items-center mb-[20px]">
                                    <h3 className="m-0 text-[18px] text-[#1E293B] font-[900] flex items-center gap-[10px]">
                                        <Navigation size={20} color="#D62828" /> Dispatch Responders
                                    </h3>
                                    <div className="flex items-center gap-[6px] text-[#10B981] text-[12px] font-[900]">
                                        <ToggleRight size={22} /> Auto-Dispatch ON
                                    </div>
                                  </div>
                                  <div className="bg-[#F8FAFC] rounded-[20px] border border-[#E2E8F0] p-[25px]">
                                      <h4 className="m-0 mb-[12px] text-[11px] text-[#94A3B8] font-[900] tracking-[1px]">CURRENTLY ASSIGNED</h4>
                                      <div className="mb-[25px]">
                                          {selectedIncident.assigned.length > 0 ? (
                                              <div className="flex flex-col gap-[10px]">
                                                  {selectedIncident.assigned.map(unit => (
                                                      <div key={unit} className="flex items-center justify-between bg-[#ECFDF5] p-[15px] rounded-[12px] border border-[#A7F3D0]">
                                                          <div className="flex items-center gap-[10px]">
                                                              <Truck size={18} color="#059669" /> 
                                                              <span className="text-[15px] font-bold text-emerald-900">{unit}</span>
                                                          </div>
                                                          <span className="text-[11px] text-[#059669] font-[900]">EN ROUTE</span>
                                                      </div>
                                                  ))}
                                              </div>
                                          ) : (
                                              <div className="bg-white p-[20px] rounded-[12px] border border-dashed border-[#CBD5E1] text-center text-[14px] text-[#94A3B8] italic">
                                                  No units assigned yet.
                                              </div>
                                          )}
                                      </div>
                                      <h4 className="m-0 mb-[12px] text-[11px] text-[#94A3B8] font-[900] tracking-[1px]">AVAILABLE UNITS NEARBY</h4>
                                      <div className="flex flex-col gap-[12px]">
                                          {availableResponders.map(unit => (
                                              <div key={unit.id} className="flex justify-between items-center bg-white p-[15px] rounded-[12px] border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                                  <div>
                                                      <div className="text-[15px] font-extrabold text-[#1E293B]">{unit.name}</div>
                                                      <div className="text-[12px] text-[#94A3B8]">{unit.distance}</div>
                                                  </div>
                                                  <button onClick={() => handleAssign(unit)} className="bg-[#EEF2FF] text-[#4F46E5] border-[1.5px] border-[#C7D2FE] px-[18px] py-[8px] rounded-[10px] text-[13px] font-extrabold cursor-pointer flex items-center gap-[6px] hover:bg-indigo-100 transition-colors">
                                                      <Plus size={16} /> Assign
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <h3 className="m-0 mb-[20px] text-[18px] text-[#1E293B] font-[900] flex items-center gap-[10px]">
                                      <Activity size={20} color="#10B981" /> Live Activity Log
                                  </h3>
                                  <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-[25px] flex flex-col gap-[20px]">
                                      <LogItem color="#10B981" title="System Auto-Verified" desc="Reached citizen verification threshold." time="10m ago" />
                                      <LogItem color="#3B82F6" title="Incident Registered" desc="Incident #1043 logged in database." time="12m ago" />
                                      {selectedIncident.assigned.length > 0 && <LogItem color="#8B5CF6" title="Dispatch Sent" desc={`${selectedIncident.assigned.length} units confirmed reception.`} time="Just now" />}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col justify-center items-center">
                      <AlertCircle size={80} className="opacity-10 mb-[20px]" />
                      <h2 className="text-[#94A3B8]">Select an incident to manage</h2>
                  </div>
              )}
          </div>
      </div>

      {resolveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[9999]">
          <div className="bg-white w-full max-w-[400px] rounded-[28px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="p-[40px_30px] flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full bg-[#F0FDF4] flex justify-center items-center mb-[20px]">
                  <CheckCircle size={40} color="#22C55E" />
              </div>
              <h3 className="m-0 mb-[10px] text-[20px] font-[900] text-[#1E293B]">Incident Resolved!</h3>
              <p className="m-0 text-[14px] text-[#64748B] leading-[1.6]">The incident has been closed.<br/>Removing from active list in a moment...</p>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulseMarker { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }`}</style>
    </div>
  );
};

const LogItem = ({ color, title, desc, time }) => (
    <div className="flex gap-[15px]">
        <div className="w-[10px] h-[10px] rounded-full mt-[6px] shrink-0" style={{ backgroundColor: color }}></div>
        <div>
            <div className="flex items-center gap-[10px]">
                <span className="text-[14px] font-extrabold text-[#1E293B]">{title}</span>
                <span className="text-[12px] text-[#94A3B8]">{time}</span>
            </div>
            <p className="m-0 mt-[4px] text-[13px] text-[#64748B] leading-[1.5]">{desc}</p>
        </div>
    </div>
);

export default AdminIncidentManagementScreen;