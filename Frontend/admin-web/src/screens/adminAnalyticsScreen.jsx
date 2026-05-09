import React, { useState } from 'react';
import { 
  AlertCircle, ShieldAlert, Users, Download, 
  TrendingUp, TrendingDown, Calendar
} from 'lucide-react';

const AdminAnalyticsScreen = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // --- MOCK DATA FOR TABLE ---
  const reportData = [
    { id: 1, type: 'Fire', total: 85, resolved: 42, pending: 10, rate: '90.8%' },
    { id: 2, type: 'Medical', total: 140, resolved: 55, pending: 7, rate: '88.5%' },
    { id: 3, type: 'Accident', total: 113, resolved: 83, pending: 18, rate: '91.3%' },
    { id: 4, type: 'Crime', total: 112, resolved: 107, pending: 19, rate: '97.6%' },
  ];

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      
      {/* HEADER ACTIONS AREA (Date Filter & Export) */}
      <div className="flex justify-between items-center mb-[25px]">
        <div className="flex items-center gap-[15px]">
            <div className="flex items-center gap-[8px] bg-white px-[15px] py-[8px] rounded-[10px] border border-[#E5E7EB] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
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

        <button className="bg-[#D62828] text-white border-none px-[20px] py-[10px] rounded-[10px] font-bold text-[13px] flex items-center gap-[8px] cursor-pointer shadow-[0_4px_12px_rgba(214,40,40,0.2)] hover:bg-red-700 transition-colors">
            <Download size={16} /> Export PDF Report
        </button>
      </div>

      {/* 1. STAT CARDS ROW */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
          <StatCard title="Total Incidents" value="1,284" trend="+12%" isPositive={true} icon={<AlertCircle color="#D62828" size={20} />} iconBg="#FEE2E2" />
          <StatCard title="Active Danger Zones" value="5" trend="+5%" isPositive={false} icon={<ShieldAlert color="#D97706" size={20} />} iconBg="#FEF3C7" />
          <StatCard title="Total Responders" value="156" trend="+8%" isPositive={true} icon={<Users color="#2563EB" size={20} />} iconBg="#DBEAFE" />
          <StatCard title="Total Users" value="12,450" trend="-15%" isPositive={false} icon={<Users color="#10B981" size={20} />} iconBg="#D1FAE5" />
      </div>

      {/* 2. CHARTS GRID (2x2) */}
      <div className="grid grid-cols-2 gap-[25px] mb-[25px]">
          
          <ChartCard title="Incidents Over Time">
              <div className="h-[220px] relative mt-[20px]">
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-[#9CA3AF]">
                      <span>120</span><span>90</span><span>60</span><span>30</span><span>0</span>
                  </div>
                  <div className="ml-[30px] h-full border-b border-l border-[#E5E7EB] relative">
                      <div className="absolute w-full h-[25%] border-t border-dashed border-[#F3F4F6] top-[25%]"></div>
                      <div className="absolute w-full h-[25%] border-t border-dashed border-[#F3F4F6] top-[50%]"></div>
                      <div className="absolute w-full h-[25%] border-t border-dashed border-[#F3F4F6] top-[75%]"></div>
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                          <path d="M0,70 L20,50 L40,40 L60,45 L80,20 L100,10" fill="none" stroke="#D62828" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                          <path d="M0,80 L20,60 L40,55 L60,60 L80,30 L100,20" fill="none" stroke="#10B981" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      </svg>
                  </div>
                  <div className="ml-[30px] flex justify-between text-[11px] text-[#9CA3AF] mt-[10px]">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
              </div>
          </ChartCard>

          <ChartCard title="Incidents by Category">
              <div className="h-[220px] relative mt-[20px]">
                   <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-[#9CA3AF]">
                      <span>600</span><span>450</span><span>300</span><span>150</span><span>0</span>
                  </div>
                  <div className="ml-[30px] h-full border-b border-l border-[#E5E7EB] flex items-end justify-around px-[20px]">
                      <Bar height="55%" color="#D62828" label="Fire" />
                      <Bar height="75%" color="#F59E0B" label="Accident" />
                      <Bar height="40%" color="#2B2D42" label="Crime" />
                      <Bar height="30%" color="#6B7280" label="Medical" />
                  </div>
              </div>
          </ChartCard>

          <ChartCard title="Danger Zone Severity Distribution">
              <div className="flex justify-center items-center h-[250px]">
                  <div className="relative w-[180px] h-[180px]">
                      <div className="w-full h-full rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)]" style={{ background: 'conic-gradient(#3B82F6 0% 29%, #10B981 29% 67%, #F59E0B 67% 85%, #D62828 85% 100%)' }}></div>
                  </div>
              </div>
          </ChartCard>

          <ChartCard title="Average Response Time (Minutes)">
               <div className="h-[220px] relative mt-[20px]">
                   <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-[#9CA3AF]">
                      <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
                  </div>
                  <div className="ml-[20px] h-full border-b border-l border-[#E5E7EB] flex items-end justify-around px-[10px]">
                      <Bar height="50%" color="#2B2D42" label="Mon" width="30px" />
                      <Bar height="45%" color="#2B2D42" label="Tue" width="30px" />
                      <Bar height="55%" color="#2B2D42" label="Wed" width="30px" />
                      <Bar height="48%" color="#2B2D42" label="Thu" width="30px" />
                      <Bar height="52%" color="#2B2D42" label="Fri" width="30px" />
                  </div>
              </div>
          </ChartCard>
      </div>

      {/* 3. REPORT GENERATOR SECTION */}
      <div className="bg-white rounded-[16px] p-[25px] border border-[#E5E7EB] mb-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          <h3 className="m-0 mb-[20px] text-[16px] text-[#2B2D42] font-extrabold">Generate Custom Report</h3>
          <div className="flex gap-[20px] items-end">
              <div className="flex-1">
                  <label className="block text-[12px] font-bold text-[#4B5563] mb-[8px]">Report Type</label>
                  <select className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] bg-white cursor-pointer">
                      <option>Comprehensive Overview</option>
                      <option>Incident Demographics</option>
                      <option>Responder Efficiency</option>
                  </select>
              </div>
              <div className="flex-1">
                  <label className="block text-[12px] font-bold text-[#4B5563] mb-[8px]">Select Date Range</label>
                  <div className="flex items-center bg-white border border-[#D1D5DB] rounded-[8px] py-[10px] px-[15px]">
                      <Calendar size={16} color="#9CA3AF" className="mr-[10px]" />
                      <input type="text" placeholder="MM/DD/YYYY - MM/DD/YYYY" className="border-none outline-none w-full text-[14px] bg-transparent" defaultValue="05/01/2024 - 05/31/2024" />
                  </div>
              </div>
              <button className="bg-[#111827] text-white border-none py-[12px] px-[30px] rounded-[8px] font-bold text-[14px] cursor-pointer transition-colors hover:bg-black">
                  Generate Report
              </button>
          </div>
      </div>

      {/* 4. DATA TABLE SECTION */}
      <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/5 overflow-hidden">
          <div className="px-[25px] py-[20px] border-b border-[#F3F4F6]">
              <h3 className="m-0 text-[16px] text-[#2B2D42] font-extrabold">Report Preview</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                  <thead>
                      <tr className="bg-[#F9FAFB] border-b-[2px] border-[#F3F4F6] text-[#6B7280] text-[12px] uppercase">
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Date Range</th>
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Type</th>
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Total Count</th>
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Resolved</th>
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Pending</th>
                          <th className="p-[15px_10px] border-b-[2px] border-[#F3F4F6]">Success Rate</th>
                      </tr>
                  </thead>
                  <tbody>
                      {reportData.map((row) => (
                          <tr key={row.id} className="border-b border-[#F3F4F6] hover:bg-slate-50 transition-colors">
                              <td className="px-[25px] py-[15px] text-[13px] text-[#4B5563]">{dateRange}</td>
                              <td className="p-[15px_10px] text-[14px] font-semibold text-[#2B2D42]">{row.type}</td>
                              <td className="p-[15px_10px] text-[14px] text-[#4B5563]">{row.total}</td>
                              <td className="p-[15px_10px] text-[14px] font-bold text-[#10B981]">{row.resolved}</td>
                              <td className="p-[15px_10px] text-[14px] font-bold text-[#D97706]">{row.pending}</td>
                              <td className="px-[25px] py-[15px] text-[14px] text-[#4B5563]">{row.rate}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, trend, isPositive, icon, iconBg }) => (
    <div className="bg-white rounded-[12px] p-[20px] border border-black/5 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-[15px]">
            <div className="p-[10px] rounded-[10px]" style={{ backgroundColor: iconBg }}>{icon}</div>
            <div className="flex items-center gap-[4px] text-[12px] font-bold" style={{ color: isPositive ? '#10B981' : '#D62828' }}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
            </div>
        </div>
        <div className="text-[28px] font-extrabold text-[#2B2D42] mb-[5px]">{value}</div>
        <div className="text-[13px] text-[#8D99AE] font-medium">{title}</div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-[16px] p-[25px] border border-black/5 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <h3 className="m-0 mb-[10px] text-[16px] text-[#2B2D42] font-extrabold">{title}</h3>
        {children}
    </div>
);

const Bar = ({ height, color, label, width = '45px' }) => (
    <div className="flex flex-col items-center h-full justify-end gap-[10px]">
        <div className="rounded-t-[4px] transition-[height] duration-500 ease-in-out" style={{ width: width, height: height, backgroundColor: color }}></div>
        <span className="text-[11px] text-[#6B7280] font-semibold">{label}</span>
    </div>
);

export default AdminAnalyticsScreen;