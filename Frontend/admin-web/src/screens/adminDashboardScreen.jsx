import React from 'react';
import { 
  AlertCircle, CheckCircle, Users, Clock, 
  TrendingUp, TrendingDown, Eye, Map as MapIcon, Activity
} from 'lucide-react';

const AdminDashboardScreen = () => {
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-[25px]">
        <h2 className="m-0 mb-1 text-[24px] text-[#2B2D42] font-extrabold">Dashboard Overview</h2>
        <p className="m-0 text-[#8D99AE] text-[14px]">Real-time emergency response monitoring</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
        <StatCard icon={<AlertCircle color="#D62828" size={24} />} bg="#FEE2E2" title="Active Incidents" value="4" trend="+12%" positive={false} />
        <StatCard icon={<Users color="#4A5568" size={24} />} bg="#F3F4F6" title="Active Responders" value="128" trend="+8%" positive={true} />
        <StatCard icon={<CheckCircle color="#10B981" size={24} />} bg="#D1FAE5" title="Resolved Today" value="42" trend="+18%" positive={true} />
        <StatCard icon={<Clock color="#F59E0B" size={24} />} bg="#FEF3C7" title="Avg. Dispatch Time" value="1.2 min" trend="-15%" positive={true} />
      </div>

      {/* Live Incident Map */}
      <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2 overflow-hidden mb-[25px]">
        <div className="px-[25px] py-[15px] border-b border-[#F3F4F6] flex justify-between items-center bg-white">
            <div className="flex items-center gap-[10px]">
                <MapIcon size={18} color="#2B2D42" />
                <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">Live Incident Map</h3>
            </div>
            <div className="flex gap-[15px]">
                <LegendItem color="#D62828" label="Fire / Rescue" />
                <LegendItem color="#10B981" label="Medical" />
                <LegendItem color="#3B82F6" label="Security" />
            </div>
        </div>
        
        <div className="h-[350px] bg-[#E5E7EB] relative flex justify-center items-center bg-[radial-gradient(#D1D5DB_2px,transparent_2px)] bg-[size:25px_25px]">
            <MapMarker top="35%" left="42%" color="#D62828" pulse />
            <MapMarker top="60%" left="55%" color="#10B981" />
            <MapMarker top="45%" left="65%" color="#3B82F6" pulse />
            <MapMarker top="25%" left="75%" color="#D62828" />
            <div className="bg-white/80 py-[10px] px-[20px] rounded-[8px] text-[#6B7280] font-bold text-[14px] backdrop-blur-sm">
                MAP INTEGRATION PLACEHOLDER
            </div>
        </div>
      </div>

      {/* Table + Live Feed */}
      <div className="grid grid-cols-[2fr_1fr] gap-[20px] mb-[25px]">
        {/* Recent Incidents */}
        <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2">
            <div className="flex justify-between items-center mb-[20px]">
              <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">Recent Incidents</h3>
              <span className="text-[12px] text-[#D62828] font-bold cursor-pointer hover:underline">View All</span>
            </div>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-[2px] border-[#F3F4F6] text-[#8D99AE] text-[12px] uppercase">
                  <th className="p-[15px_10px] font-bold">ID</th>
                  <th className="p-[15px_10px] font-bold">Title</th>
                  <th className="p-[15px_10px] font-bold">Status</th>
                  <th className="p-[15px_10px] font-bold">Location</th>
                  <th className="p-[15px_10px] text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <TableRow id="#1042" title="Building Fire" status="in-progress" loc="123 Main Street" />
                <TableRow id="#1041" title="Medical Emergency" status="assigned" loc="456 Park Avenue" />
                <TableRow id="#1040" title="Car Accident" status="verified" loc="I-95 Exit 12" />
                <TableRow id="#1039" title="Robbery in Progress" status="reported" loc="789 Broadway" />
              </tbody>
            </table>
        </div>

        {/* Live Feed */}
        <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2">
            <div className="flex justify-between items-center mb-[20px]">
                <div className="flex items-center gap-[8px]">
                    <Activity size={18} color="#D62828" />
                    <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">Live Feed</h3>
                </div>
            </div>
            <div className="flex flex-col gap-[15px]">
                <FeedItem time="2m ago" title="Unit 04 Dispatched" desc="Assigned to Medical Emergency at 456 Park Ave." />
                <FeedItem time="5m ago" title="10 Verifications Reached" desc="Car Accident at I-95 verified." />
                <FeedItem time="12m ago" title="Citizen Report" desc="New Fire reported at 123 Main Street." />
                <FeedItem time="18m ago" title="Incident Resolved" desc="Unit 02 cleared Flooding at West End." />
            </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseMarker { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ icon, bg, title, value, trend, positive }) => (
  <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-[15px]">
      <div className="p-[12px] rounded-[12px]" style={{ backgroundColor: bg }}>{icon}</div>
      <div 
        className="flex items-center gap-[4px] text-[13px] font-bold"
        style={{ color: positive ? '#10B981' : '#D62828' }}
      >
        {positive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {trend}
      </div>
    </div>
    <div>
      <h4 className="m-0 mb-[5px] text-[28px] text-[#2B2D42] font-extrabold">{value}</h4>
      <p className="m-0 text-[13px] text-[#8D99AE] font-medium">{title}</p>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-[6px]">
        <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: color }}></div>
        <span className="text-[12px] text-[#6B7280] font-semibold">{label}</span>
    </div>
);

const MapMarker = ({ top, left, color, pulse }) => (
    <div className="absolute flex justify-center items-center" style={{ top, left }}>
        {pulse && (
            <div 
              className="absolute w-[30px] h-[30px] rounded-full opacity-30 animate-[pulseMarker_2s_infinite]" 
              style={{ backgroundColor: color }}
            ></div>
        )}
        <div className="w-[12px] h-[12px] rounded-full border-[2px] border-white z-[2]" style={{ backgroundColor: color }}></div>
    </div>
);

const TableRow = ({ id, title, status, loc }) => {
  const statusStyles = {
    'in-progress': { bg: '#E0E7FF', text: '#3730A3' },
    'assigned': { bg: '#F3E8FF', text: '#6B21A8' },
    'verified': { bg: '#FEF08A', text: '#854D0E' },
    'reported': { bg: '#F3F4F6', text: '#374151' },
  };
  const badge = statusStyles[status];
  
  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-slate-50 transition-colors">
      <td className="p-[15px_10px] text-[13px] text-[#4A5568]">{id}</td>
      <td className="p-[15px_10px] text-[14px] text-[#2B2D42] font-bold">{title}</td>
      <td className="p-[15px_10px]">
        <span 
            className="py-[5px] px-[10px] rounded-[20px] text-[11px] font-bold uppercase tracking-wider" 
            style={{ backgroundColor: badge.bg, color: badge.text }}
        >
            {status}
        </span>
      </td>
      <td className="p-[15px_10px] text-[13px] text-[#8D99AE]">{loc}</td>
      <td className="p-[15px_10px] text-right text-[#8D99AE]">
        <Eye size={16} className="cursor-pointer hover:text-[#2B2D42] inline-block" />
      </td>
    </tr>
  );
};

const FeedItem = ({ time, title, desc }) => (
    <div className="flex gap-[15px] border-b border-[#F3F4F6] pb-[15px] last:border-0 last:pb-0">
        <div className="mt-[4px] w-[8px] h-[8px] rounded-full bg-[#D62828] flex-shrink-0"></div>
        <div>
            <div className="flex items-center gap-[10px] mb-[2px]">
                <span className="text-[13px] font-bold text-[#2B2D42]">{title}</span>
                <span className="text-[11px] text-[#8D99AE]">{time}</span>
            </div>
            <p className="m-0 text-[12px] text-[#6B7280]">{desc}</p>
        </div>
    </div>
);

export default AdminDashboardScreen;