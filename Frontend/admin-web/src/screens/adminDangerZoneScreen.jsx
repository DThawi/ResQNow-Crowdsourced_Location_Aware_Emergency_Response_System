import React, { useState } from 'react';
import { 
  AlertCircle, Users, ShieldAlert, Download, Calendar, 
  Plus, Search, Map, Cpu, Smartphone, Link, X, 
  ToggleRight, ToggleLeft, MapPin, Clock, Wand2 
} from 'lucide-react';

const AdminDangerZoneScreen = () => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- FUNCTIONAL STATES ---
  const [automationModalOpen, setAutomationModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [autoResolve, setAutoResolve] = useState(true);

  const [newZoneData, setNewZoneData] = useState({
      name: '',
      type: 'Fire',
      severity: 'HIGH',
      affected: ''
  });

  const initialZones = [
    { id: 'DZ-01', name: 'Downtown Fire Zone', type: 'Fire', severity: 'CRITICAL', affected: '1,200', status: 'ACTIVE', created: '12/9/2023' },
    { id: 'DZ-02', name: 'Chemical Spill - Hwy 95', type: 'Hazmat', severity: 'HIGH', affected: '450', status: 'ACTIVE', created: '12/9/2023' },
    { id: 'DZ-03', name: 'Flood Risk Area - West End', type: 'Flood', severity: 'MEDIUM', affected: '200', status: 'INACTIVE', created: '12/9/2023' },
    { id: 'DZ-04', name: 'Civil Unrest - Broadway', type: 'Civil Unrest', severity: 'MEDIUM', affected: '800', status: 'ACTIVE', created: '12/9/2023' },
    { id: 'DZ-05', name: 'Gas Leak Detection Zone', type: 'Chemical', severity: 'LOW', affected: '100', status: 'ACTIVE', created: '12/9/2023' },
  ];

  const [zones, setZones] = useState(initialZones);

  const filteredZones = zones.filter(zone => 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      zone.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ACTIONS ---
  const handleAutoEstimate = () => {
      setIsCalculating(true);
      setTimeout(() => {
          let baseAffected = 0;
          if (newZoneData.type === 'Fire') baseAffected = 150;
          else if (newZoneData.type === 'Hazmat') baseAffected = 300;
          else if (newZoneData.type === 'Flood') baseAffected = 500;
          else if (newZoneData.type === 'Civil Unrest') baseAffected = 200;
          else baseAffected = 100;

          let severityMultiplier = 1;
          if (newZoneData.severity === 'CRITICAL') severityMultiplier = 4.5;
          else if (newZoneData.severity === 'HIGH') severityMultiplier = 2.5;
          else if (newZoneData.severity === 'MEDIUM') severityMultiplier = 1.2;
          
          const variance = Math.floor(Math.random() * 40) - 20; 
          const finalEstimate = Math.floor(baseAffected * severityMultiplier) + variance;

          setNewZoneData({ ...newZoneData, affected: Math.max(10, finalEstimate).toString() });
          setIsCalculating(false);
      }, 1200);
  };

  const handleCreateZone = () => {
      const newEntry = {
          id: `DZ-0${zones.length + 1}`,
          name: newZoneData.name || 'Manual Danger Zone',
          type: newZoneData.type,
          severity: newZoneData.severity,
          affected: newZoneData.affected || '0',
          status: 'ACTIVE',
          created: new Date().toLocaleDateString('en-US') 
      };
      setZones([newEntry, ...zones]);
      setCreateModalOpen(false);
      setNewZoneData({ name: '', type: 'Fire', severity: 'HIGH', affected: '' });
  };

  const getSeverityClasses = (severity) => {
      switch(severity) {
          case 'CRITICAL': return 'bg-[#FEE2E2] text-[#DC2626]';
          case 'HIGH': return 'bg-[#FFEDD5] text-[#EA580C]';
          case 'MEDIUM': return 'bg-[#FEF3C7] text-[#D97706]';
          case 'LOW': return 'bg-[#FEF9C3] text-[#CA8A04]';
          default: return 'bg-[#F3F4F6] text-[#4B5563]';
      }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. TOP ACTION BAR */}
      <div className="flex justify-between items-center mb-[25px]">
        <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[8px] bg-white px-[12px] py-[6px] rounded-[8px] border border-[#E5E7EB]">
                <Calendar size={14} color="#6B7280" />
                <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)} 
                    className="bg-transparent border-none outline-none text-[13px] font-semibold text-[#4B5563] cursor-pointer"
                >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                    <option>All Time</option>
                </select>
            </div>
        </div>
        <button className="bg-[#D62828] text-white border-none py-[10px] px-[15px] rounded-[8px] font-bold text-[13px] flex items-center gap-[8px] cursor-pointer hover:bg-red-700 transition-colors">
            <Download size={16} /> Export Zone Report
        </button>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
          <StatCard title="Active Zones" value={zones.filter(z => z.status === 'ACTIVE').length} trend="+12%" isPositive={true} icon={<AlertCircle color="#D62828" size={20} />} iconBg="#FEE2E2" />
          <StatCard title="People Affected" value="2,550" trend="+28%" isPositive={false} icon={<Users color="#D97706" size={20} />} iconBg="#FEF3C7" />
          <StatCard title="Total Created" value={zones.length} trend="+5%" isPositive={false} icon={<MapPin color="#2563EB" size={20} />} iconBg="#DBEAFE" />
          <StatCard title="Average Duration" value="4.2 h" trend="-15%" isPositive={true} icon={<Clock color="#8B5CF6" size={20} />} iconBg="#EDE9FE" />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-2 gap-[25px] mb-[25px]">
          <ChartCard title="Severity Distribution">
              <div className="flex justify-center items-center h-[220px]">
                  <div 
                    className="relative w-[180px] h-[180px] rounded-full" 
                    style={{ background: 'conic-gradient(#991B1B 0% 25%, #78350F 25% 50%, #F59E0B 50% 75%, #D97706 75% 100%)' }}
                  ></div>
              </div>
          </ChartCard>
          <ChartCard title="Live Zone Map Preview">
              <div className="h-[220px] bg-[#E5E7EB] rounded-[12px] relative border border-[#D1D5DB] overflow-hidden">
                  <div className="w-full h-full opacity-30 bg-[radial-gradient(#9CA3AF_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  <div className="absolute top-[30%] left-[40%] w-[80px] h-[80px] bg-red-600/20 border-2 border-red-600 rounded-full"></div>
              </div>
          </ChartCard>
      </div>

      {/* 4. TABLE SECTION */}
      <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-[25px] py-[20px] border-b border-[#F3F4F6] flex justify-between items-center">
              <h3 className="m-0 text-[16px] text-[#2B2D42] font-extrabold">Recent Danger Zones</h3>
              <div className="flex gap-[15px]">
                  <div className="relative">
                      <Search size={14} color="#8D99AE" className="absolute left-[12px] top-[8px]" />
                      <input 
                        type="text" 
                        placeholder="Search zones..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-[200px] py-[6px] pr-[12px] pl-[32px] border border-[#E5E7EB] rounded-[8px] outline-none text-[13px]" 
                      />
                  </div>
                  <div className="flex gap-[8px] bg-[#F3F4F6] p-[4px] rounded-[10px]">
                      <button onClick={() => setAutomationModalOpen(true)} className="bg-transparent border-none py-[6px] px-[12px] rounded-[6px] font-bold text-[12px] cursor-pointer flex items-center gap-[5px] hover:bg-slate-200">
                          <Cpu size={16} /> Automation
                      </button>
                      <button onClick={() => setCreateModalOpen(true)} className="bg-[#10B981] text-white border-none py-[6px] px-[15px] rounded-[6px] font-bold text-[12px] cursor-pointer hover:bg-emerald-600">
                          <Plus size={14} /> Create Zone
                      </button>
                  </div>
              </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="bg-[#F9FAFB] border-b-[2px] border-[#F3F4F6] text-[#6B7280] text-[11px] uppercase">
                        <th className="p-[15px_25px]">Zone Name</th>
                        <th className="p-[15px_10px]">Type</th>
                        <th className="p-[15px_10px]">Severity</th>
                        <th className="p-[15px_10px]">Affected</th>
                        <th className="p-[15px_10px]">Status</th>
                        <th className="p-[15px_25px]">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredZones.map((zone) => (
                        <tr key={zone.id} className="border-b border-[#F3F4F6] hover:bg-slate-50 transition-colors">
                            <td className="p-[15px_25px] text-[13px] font-bold text-[#2B2D42]">{zone.name}</td>
                            <td className="p-[15px_10px] text-[13px]">{zone.type}</td>
                            <td className="p-[15px_10px]">
                                <span className={`text-[10px] font-bold px-[8px] py-[4px] rounded-[6px] ${getSeverityClasses(zone.severity)}`}>
                                    {zone.severity}
                                </span>
                            </td>
                            <td className="p-[15px_10px] text-[13px]">{zone.affected}</td>
                            <td className={`p-[15px_10px] text-[11px] font-bold ${zone.status === 'ACTIVE' ? 'text-[#10B981]' : 'text-[#6B7280]'}`}>
                                {zone.status}
                            </td>
                            <td className="p-[15px_25px] text-[13px] text-[#9CA3AF]">{zone.created}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

      {/* --- CREATE ZONE MODAL --- */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[2147483647]">
          <div className="bg-white w-full max-w-[450px] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="flex justify-between items-center px-[25px] py-[20px] border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <div className="flex items-center gap-[10px]">
                  <div className="bg-[#D1FAE5] p-[8px] rounded-[8px] text-[#059669]"><MapPin size={20} /></div>
                  <h3 className="m-0 text-[18px] font-extrabold text-slate-800">Create Danger Zone</h3>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="bg-transparent border-none cursor-pointer text-[#94A3B8] hover:text-slate-700"><X size={20} /></button>
            </div>
            <div className="p-[30px_25px] flex flex-col gap-[20px]">
              <div>
                  <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Zone Name</label>
                  <input type="text" placeholder="e.g. South Park Gas Leak" value={newZoneData.name} onChange={(e) => setNewZoneData({...newZoneData, name: e.target.value})} className="w-full p-[10px] border border-[#D1D5DB] rounded-[8px] box-border outline-none focus:border-red-500" />
              </div>
              <div className="flex gap-[15px]">
                  <div className="flex-1">
                      <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Type</label>
                      <select value={newZoneData.type} onChange={(e) => setNewZoneData({...newZoneData, type: e.target.value})} className="w-full p-[10px] border border-[#D1D5DB] rounded-[8px] box-border outline-none cursor-pointer">
                          <option>Fire</option><option>Hazmat</option><option>Flood</option><option>Civil Unrest</option>
                      </select>
                  </div>
                  <div className="flex-1">
                      <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Severity</label>
                      <select value={newZoneData.severity} onChange={(e) => setNewZoneData({...newZoneData, severity: e.target.value})} className="w-full p-[10px] border border-[#D1D5DB] rounded-[8px] box-border outline-none cursor-pointer">
                          <option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                      </select>
                  </div>
              </div>
              <div>
                  <div className="flex justify-between items-center mb-[8px]">
                      <label className="block text-[13px] font-bold text-[#4B5563]">Estimated Affected</label>
                      <button onClick={handleAutoEstimate} disabled={isCalculating} className="bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] py-[4px] px-[10px] rounded-[6px] text-[11px] font-bold cursor-pointer flex items-center gap-[4px] hover:bg-indigo-100 disabled:opacity-50">
                          {isCalculating ? "Calculating..." : <><Wand2 size={12} /> Auto-Predict</>}
                      </button>
                  </div>
                  <input type="number" placeholder="500" value={newZoneData.affected} onChange={(e) => setNewZoneData({...newZoneData, affected: e.target.value})} disabled={isCalculating} className={`w-full p-[10px] border border-[#D1D5DB] rounded-[8px] box-border outline-none ${isCalculating ? 'bg-[#F3F4F6]' : 'bg-white focus:border-red-500'}`} />
              </div>
            </div>
            <div className="px-[25px] py-[20px] border-t border-[#F3F4F6] flex justify-end gap-[12px] bg-[#FAFAFA]">
                <button onClick={() => setCreateModalOpen(false)} className="py-[10px] px-[20px] rounded-[8px] border border-[#E2E8F0] bg-white cursor-pointer hover:bg-slate-100 font-semibold transition-colors">Cancel</button>
                <button onClick={handleCreateZone} className="py-[10px] px-[20px] rounded-[8px] border-none bg-[#10B981] text-white font-bold cursor-pointer hover:bg-emerald-600 transition-colors">Create Zone</button>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTOMATION MODAL --- */}
      {automationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[2147483647]">
          <div className="bg-white w-full max-w-[550px] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="flex justify-between items-center px-[25px] py-[20px] border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <div className="flex items-center gap-[10px] text-slate-800"><Cpu size={20} /> <h3 className="m-0 text-[18px] font-extrabold">Automation Rules</h3></div>
              <button onClick={() => setAutomationModalOpen(false)} className="bg-transparent border-none cursor-pointer text-[#94A3B8] hover:text-slate-700"><X size={20} /></button>
            </div>
            <div className="p-[30px_25px] flex flex-col gap-[20px]">
                <AutoRule icon={<Map size={20} className="text-slate-500" />} title="Smart Clustering" desc="Auto-generate zone if 5+ incidents occur in 500m." active={true} />
                <AutoRule icon={<Smartphone size={20} className="text-slate-500" />} title="Geofence Alerts" desc="Auto-alert citizens entering the zone." active={autoAlerts} onToggle={() => setAutoAlerts(!autoAlerts)} />
                <AutoRule icon={<Link size={20} className="text-slate-500" />} title="Linked Deactivation" desc="Deactivate zone when all incidents are resolved." active={autoResolve} onToggle={() => setAutoResolve(!autoResolve)} />
            </div>
            <div className="px-[25px] py-[20px] border-t border-[#F3F4F6] flex justify-end gap-[12px] bg-[#FAFAFA]">
                <button onClick={() => setAutomationModalOpen(false)} className="py-[10px] px-[20px] rounded-[8px] bg-[#1D4ED8] text-white font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// --- SHARED COMPONENTS & STYLES ---

const StatCard = ({ title, value, trend, isPositive, icon, iconBg }) => (
    <div className="bg-white rounded-[12px] p-[20px] border border-black/5 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-[15px]">
            <div className="p-[10px] rounded-[10px]" style={{ backgroundColor: iconBg }}>{icon}</div>
            <div className={`text-[12px] font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#D62828]'}`}>{trend}</div>
        </div>
        <div className="text-[28px] font-extrabold text-slate-800">{value}</div>
        <div className="text-[13px] text-[#8D99AE] font-medium mt-[5px]">{title}</div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-[16px] p-[25px] border border-black/5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <h3 className="m-0 mb-[15px] text-[15px] font-extrabold text-slate-800">{title}</h3>
        {children}
    </div>
);

const AutoRule = ({ icon, title, desc, active, onToggle }) => (
    <div className="flex justify-between items-center p-[15px] border border-[#E2E8F0] rounded-[12px] bg-white">
        <div className="flex gap-[12px]">
            {icon} 
            <div>
                <div className="font-bold text-slate-800">{title}</div>
                <div className="text-[12px] text-[#64748B] mt-[2px]">{desc}</div>
            </div>
        </div>
        <div onClick={onToggle} className="cursor-pointer">
            {active ? <ToggleRight size={28} color="#10B981" /> : <ToggleLeft size={28} color="#94A3B8" />}
        </div>
    </div>
);

export default AdminDangerZoneScreen;