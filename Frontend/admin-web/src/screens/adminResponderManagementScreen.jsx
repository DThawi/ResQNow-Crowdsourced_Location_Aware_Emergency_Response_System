import React, { useState } from 'react';
import { 
  MapPin, Clock, Truck, Shield, Flame, Plus, Search, 
  Filter, Phone, Calendar, Activity, AlertCircle, X, CheckCircle
} from 'lucide-react';

const AdminResponderManagementScreen = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  const [responders, setResponders] = useState([
    { id: 'R-001', name: 'Medical Unit 04', type: 'Medical', status: 'Available', location: 'Station Alpha, West District', vehicle: 'Ambulance AM-492', phone: '+1 (555) 123-4567', lastActive: '2 mins ago', currentAssignment: 'None' },
    { id: 'R-002', name: 'Police Cruiser 07', type: 'Security', status: 'Dispatched', location: 'Downtown Intersection, 5th Ave', vehicle: 'Cruiser PC-102', phone: '+1 (555) 987-6543', lastActive: 'Just now', currentAssignment: 'INC-1043 (Multi-Car Collision)' },
    { id: 'R-003', name: 'Fire Engine 15', type: 'Fire', status: 'Available', location: 'Station Bravo, North District', vehicle: 'Engine FE-015', phone: '+1 (555) 456-7890', lastActive: '15 mins ago', currentAssignment: 'None' },
  ]);

  const [selectedResponderId, setSelectedResponderId] = useState(responders[0].id);
  const [newUnit, setNewUnit] = useState({ name: '', type: 'Medical', vehicle: '', phone: '' });

  // --- HANDLERS ---
  const handleAddUnit = () => {
    const unit = {
        ...newUnit,
        id: `R-00${responders.length + 1}`,
        status: 'Available',
        location: 'HQ Central',
        lastActive: 'Just now',
        currentAssignment: 'None'
    };
    setResponders([unit, ...responders]);
    setAddModalOpen(false);
    setNewUnit({ name: '', type: 'Medical', vehicle: '', phone: '' });
  };

  const filteredResponders = responders.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const selectedResponder = responders.find(r => r.id === selectedResponderId);

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. TOP STATISTICS ROW */}
      <div className="flex gap-[20px] mb-[25px]">
          <StatCard title="Total Units" value={responders.length} subtitle="Registered fleet" color="#2B2D42" />
          <StatCard title="Available" value={responders.filter(r => r.status === 'Available').length} subtitle="Ready for dispatch" color="#10B981" />
          <StatCard title="Active" value={responders.filter(r => r.status === 'Dispatched').length} subtitle="Currently on duty" color="#3B82F6" />
      </div>

      <div className="flex gap-[25px] h-[calc(100vh-280px)]">
          
          {/* LEFT: DIRECTORY */}
          <div className="flex-1 bg-white rounded-[20px] border border-[#E2E8F0] flex flex-col overflow-hidden">
              <div className="p-[20px] bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <div className="flex justify-between items-center mb-[15px]">
                      <h3 className="m-0 text-[16px] font-extrabold text-slate-800">Fleet Directory</h3>
                      <button 
                        onClick={() => setAddModalOpen(true)} 
                        className="bg-[#D62828] text-white border-none py-[8px] px-[16px] rounded-[8px] font-bold text-[12px] cursor-pointer flex items-center gap-[6px] hover:bg-red-700 transition-colors"
                      >
                        <Plus size={14} /> Add Unit
                      </button>
                  </div>
                  <div className="flex gap-[10px]">
                      <div className="relative flex-1">
                          <Search size={16} className="absolute left-[12px] top-[10px] text-[#8D99AE]" />
                          <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full py-[10px] pr-[10px] pl-[35px] border border-[#E2E8F0] rounded-[10px] outline-none text-[13px]" 
                          />
                      </div>
                      <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)} 
                        className="p-[10px] border border-[#E2E8F0] rounded-[10px] text-[13px] bg-white cursor-pointer outline-none"
                      >
                          <option>All Types</option>
                          <option>Medical</option>
                          <option>Security</option>
                          <option>Fire</option>
                      </select>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-[10px]">
                  {filteredResponders.map(r => (
                      <div 
                        key={r.id} 
                        onClick={() => setSelectedResponderId(r.id)} 
                        className={`p-[15px_20px] border-b border-[#F1F5F9] cursor-pointer transition-colors duration-200 border-l-[4px] ${
                            selectedResponderId === r.id ? 'bg-[#F8FAFC] border-l-[#D62828]' : 'bg-white border-l-transparent hover:bg-slate-50'
                        }`}
                      >
                          <div className="font-bold text-[14px] text-slate-800">{r.name}</div>
                          <div className="flex justify-between mt-[5px]">
                              <span className="text-[11px] text-[#8D99AE]">{r.id} • {r.type}</span>
                              <span className={`text-[11px] font-extrabold ${r.status === 'Available' ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
                                {r.status}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* RIGHT: UNIT PROFILE */}
          <div className="flex-1 bg-white rounded-[20px] border border-[#E2E8F0] flex flex-col overflow-hidden">
              {selectedResponder ? (
                  <>
                      {/* MAP HEADER */}
                      <div className="h-[220px] bg-[#E5E7EB] relative overflow-hidden shrink-0">
                          <div className="w-full h-full opacity-40 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                          
                          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="bg-[#1E293B] p-[10px] rounded-full text-white z-10 relative">
                                {getTypeIcon(selectedResponder.type, 20)}
                              </div>
                              {selectedResponder.status === 'Dispatched' && (
                                <div className="w-[50px] h-[50px] bg-[#3B82F6] rounded-full absolute opacity-30 animate-[pulse_2s_infinite]"></div>
                              )}
                          </div>
                          
                          <div className="absolute top-[15px] right-[15px] bg-white py-[6px] px-[12px] rounded-[8px] text-[11px] font-bold flex items-center gap-[5px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                            <Activity size={14} className="text-[#10B981]" /> Live GPS Tracking
                          </div>
                      </div>

                      {/* PROFILE DETAILS */}
                      <div className="flex-1 p-[25px] overflow-y-auto">
                          <div className="flex justify-between items-start border-b border-[#F1F5F9] pb-[20px] mb-[20px]">
                              <div>
                                  <h2 className="m-0 text-[24px] font-[900] text-[#1E293B]">{selectedResponder.name}</h2>
                                  <div className="flex items-center gap-[8px] mt-[5px] text-[#64748B] text-[14px]">
                                      <MapPin size={16} /> {selectedResponder.location}
                                  </div>
                              </div>
                              <button className="py-[8px] px-[16px] rounded-[10px] border border-[#E2E8F0] bg-white font-bold text-[13px] cursor-pointer hover:bg-slate-50 transition-colors">
                                Edit Profile
                              </button>
                          </div>

                          <div className="grid grid-cols-2 gap-[20px]">
                              {/* Left Details */}
                              <div className="flex flex-col gap-[15px]">
                                  <DetailRow icon={<Truck size={16}/>} label="Vehicle" value={selectedResponder.vehicle} />
                                  <DetailRow icon={<Phone size={16}/>} label="Contact" value={selectedResponder.phone} />
                                  <DetailRow icon={<Clock size={16}/>} label="Last Ping" value={selectedResponder.lastActive} />
                              </div>
                              
                              {/* Right Status Box */}
                              <div className="bg-[#F8FAFC] p-[20px] rounded-[16px] border border-[#E2E8F0]">
                                  <h4 className="m-0 text-[12px] text-[#64748B] font-extrabold flex items-center gap-[6px]">
                                    <AlertCircle size={14} /> Operational Status
                                  </h4>
                                  
                                  <div className="mt-[15px]">
                                      <span className={`py-[6px] px-[12px] rounded-[8px] text-[12px] font-[900] ${
                                        selectedResponder.status === 'Available' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#DBEAFE] text-[#1E40AF]'
                                      }`}>
                                          {selectedResponder.status}
                                      </span>
                                  </div>
                                  
                                  <div className="mt-[15px]">
                                      <div className="text-[11px] text-[#94A3B8] font-bold">ACTIVE ASSIGNMENT</div>
                                      <div className="text-[14px] font-bold text-[#1E293B] mt-0.5">{selectedResponder.currentAssignment}</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </>
              ) : (
                  <div className="flex-1 flex justify-center items-center text-[#94A3B8]">Select a unit to view details</div>
              )}
          </div>
      </div>

      {/* ADD UNIT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[10000]">
            <div className="bg-white w-[400px] rounded-[20px] overflow-hidden shadow-2xl">
                <div className="p-[20px] border-b border-gray-200 flex justify-between items-center">
                    <h3 className="m-0 font-extrabold text-slate-800">Register New Responder Unit</h3>
                    <X onClick={() => setAddModalOpen(false)} className="cursor-pointer text-slate-500 hover:text-slate-800" />
                </div>
                <div className="p-[25px] flex flex-col gap-[15px]">
                    <div>
                        <label className="block text-[12px] font-bold mb-[5px] text-slate-700">Unit Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Rescue Alpha 1" 
                          value={newUnit.name} 
                          onChange={e => setNewUnit({...newUnit, name: e.target.value})} 
                          className="w-full p-[10px] rounded-[8px] border border-gray-300 box-border outline-none focus:border-red-400" 
                        />
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold mb-[5px] text-slate-700">Unit Type</label>
                        <select 
                          value={newUnit.type} 
                          onChange={e => setNewUnit({...newUnit, type: e.target.value})} 
                          className="w-full p-[10px] rounded-[8px] border border-gray-300 box-border outline-none bg-white cursor-pointer"
                        >
                            <option>Medical</option>
                            <option>Security</option>
                            <option>Fire</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold mb-[5px] text-slate-700">Vehicle ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AMB-202" 
                          value={newUnit.vehicle} 
                          onChange={e => setNewUnit({...newUnit, vehicle: e.target.value})} 
                          className="w-full p-[10px] rounded-[8px] border border-gray-300 box-border outline-none focus:border-red-400" 
                        />
                    </div>
                    <button 
                      onClick={handleAddUnit} 
                      className="w-full p-[12px] bg-[#D62828] text-white border-none rounded-[10px] font-bold cursor-pointer mt-[10px] hover:bg-red-700 transition-colors"
                    >
                      Register Unit
                    </button>
                </div>
            </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }`}</style>
    </div>
  );
};

// --- HELPERS ---
const getTypeIcon = (type, size) => {
    if (type === 'Fire') return <Flame size={size} color="#D62828" />;
    if (type === 'Security') return <Shield size={size} color="#1D4ED8" />;
    return <Activity size={size} color="#10B981" />;
};

const StatCard = ({ title, value, subtitle, color }) => (
    <div className="flex-1 bg-white rounded-[16px] p-[20px] border border-[#E2E8F0] shadow-sm">
        <div className="text-[13px] text-[#94A3B8] font-bold">{title.toUpperCase()}</div>
        <div className="text-[32px] font-[900] my-[5px]" style={{ color }}>{value}</div>
        <div className="text-[12px] text-[#64748B]">{subtitle}</div>
    </div>
);

const DetailRow = ({ icon, label, value }) => (
    <div className="flex gap-[12px] items-center">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F8FAFC] flex justify-center items-center text-slate-500">
          {icon}
        </div>
        <div>
            <div className="text-[11px] text-[#94A3B8] font-bold">{label}</div>
            <div className="text-[14px] font-bold text-[#1E293B]">{value}</div>
        </div>
    </div>
);

export default AdminResponderManagementScreen;