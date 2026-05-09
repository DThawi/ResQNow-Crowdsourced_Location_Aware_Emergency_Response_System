import React, { useMemo, useState } from 'react';
import { 
  AlertCircle, ShieldAlert, Users, Download, 
  TrendingUp, TrendingDown, Calendar
} from 'lucide-react';

const AdminAnalyticsScreen = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // --- MOCK CHART DATA ---
  const incidentsOverTime = useMemo(() => ([
    { label: 'Jan', reported: 70, resolved: 55 },
    { label: 'Feb', reported: 92, resolved: 72 },
    { label: 'Mar', reported: 105, resolved: 88 },
    { label: 'Apr', reported: 98, resolved: 81 },
    { label: 'May', reported: 120, resolved: 97 },
    { label: 'Jun', reported: 132, resolved: 110 },
  ]), []);

  const incidentsByCategory = useMemo(() => ([
    { label: 'Fire', value: 420, color: '#D62828' },
    { label: 'Accident', value: 560, color: '#F59E0B' },
    { label: 'Crime', value: 300, color: '#2B2D42' },
    { label: 'Medical', value: 220, color: '#6B7280' },
  ]), []);

  const severityDistribution = useMemo(() => ([
    { key: 'LOW', label: 'LOW', value: 2, color: '#3B82F6' },
    { key: 'MEDIUM', label: 'MEDIUM', value: 3, color: '#10B981' },
    { key: 'HIGH', label: 'HIGH', value: 1, color: '#F59E0B' },
    { key: 'CRITICAL', label: 'CRITICAL', value: 1, color: '#D62828' },
  ]), []);

  const avgResponseTime = useMemo(() => ([
    { label: 'Mon', minutes: 4.0 },
    { label: 'Tue', minutes: 3.6 },
    { label: 'Wed', minutes: 4.4 },
    { label: 'Thu', minutes: 3.9 },
    { label: 'Fri', minutes: 4.2 },
  ]), []);

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
              <LineChart
                  data={incidentsOverTime}
                  series={[
                      { key: 'reported', label: 'Reported', color: '#D62828' },
                      { key: 'resolved', label: 'Resolved', color: '#10B981' },
                  ]}
                  yMax={150}
                  yTicks={[0, 30, 60, 90, 120, 150]}
              />
          </ChartCard>

          <ChartCard title="Incidents by Category">
              <BarChart
                  data={incidentsByCategory}
                  yMax={600}
                  yTicks={[0, 150, 300, 450, 600]}
                  valueKey="value"
                  valueLabel="Incidents"
              />
          </ChartCard>

          <ChartCard title="Danger Zone Severity Distribution">
              <div className="grid grid-cols-[220px_1fr] gap-[20px] items-center">
                  <DonutChart
                      size={190}
                      strokeWidth={22}
                      segments={severityDistribution.map((s) => ({
                          key: s.key,
                          label: s.label,
                          value: s.value,
                          color: s.color,
                      }))}
                      centerLabel={{
                          title: 'Zones',
                          value: String(severityDistribution.reduce((sum, s) => sum + s.value, 0)),
                      }}
                  />
                  <LegendList
                      items={severityDistribution.map((s) => ({ label: s.label, value: s.value, color: s.color }))}
                      hint="Hover the chart to see details"
                  />
              </div>
          </ChartCard>

          <ChartCard title="Average Response Time (Minutes)">
              <BarChart
                  data={avgResponseTime.map((d) => ({ label: d.label, value: d.minutes, color: '#2B2D42' }))}
                  yMax={8}
                  yTicks={[0, 2, 4, 6, 8]}
                  valueKey="value"
                  valueLabel="Minutes"
                  valueFormatter={(v) => `${Number(v).toFixed(1)} min`}
              />
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

const LegendList = ({ items, hint }) => {
    const total = items.reduce((sum, i) => sum + (Number(i.value) || 0), 0);
    return (
        <div className="flex flex-col gap-[10px]">
            {items.map((i) => {
                const pct = total > 0 ? (Number(i.value) || 0) / total * 100 : 0;
                return (
                    <div key={i.label} className="flex items-center justify-between gap-[12px]">
                        <div className="flex items-center gap-[10px]">
                            <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: i.color }} />
                            <div className="text-[13px] font-bold text-slate-800">{i.label}</div>
                        </div>
                        <div className="flex items-center gap-[10px] text-[12px] text-[#6B7280] font-semibold">
                            <span>{i.value}</span>
                            <span className="text-[#9CA3AF]">{total ? `${pct.toFixed(0)}%` : '0%'}</span>
                        </div>
                    </div>
                );
            })}
            {hint && (
                <div className="mt-[6px] text-[11px] text-[#9CA3AF] font-semibold">{hint}</div>
            )}
        </div>
    );
};

const DonutChart = ({ size = 180, strokeWidth = 20, segments, centerLabel }) => {
    const total = segments.reduce((sum, s) => sum + (Number(s.value) || 0), 0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const [tip, setTip] = useState(null);

    let offset = 0;
    const renderedSegments = segments.map((s) => {
        const value = Number(s.value) || 0;
        const pct = total > 0 ? value / total : 0;
        const dash = Math.max(0, pct * circumference);
        const dashArray = `${dash} ${circumference - dash}`;
        const dashOffset = -offset;
        offset += dash;
        return { ...s, pct, dashArray, dashOffset };
    });

    return (
        <div className="relative w-fit" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                />
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                    {renderedSegments.map((s) => (
                        <circle
                            key={s.key}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={s.dashArray}
                            strokeDashoffset={s.dashOffset}
                            strokeLinecap="butt"
                            className="cursor-pointer transition-[opacity] duration-150 hover:opacity-90"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                if (!rect) return;
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                setTip({
                                    x,
                                    y,
                                    title: s.label,
                                    color: s.color,
                                    lines: {
                                        Count: String(s.value),
                                        Percent: `${(s.pct * 100).toFixed(1)}%`,
                                    },
                                });
                            }}
                            onMouseLeave={() => setTip(null)}
                        />
                    ))}
                </g>
            </svg>

            {centerLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-[11px] text-[#9CA3AF] font-bold uppercase tracking-wide">
                        {centerLabel.title}
                    </div>
                    <div className="text-[22px] font-extrabold text-slate-800 leading-none mt-[4px]">
                        {centerLabel.value}
                    </div>
                </div>
            )}

            {tip && (
                <Tooltip
                    x={tip.x}
                    y={tip.y}
                    title={tip.title}
                    color={tip.color}
                    lines={tip.lines}
                />
            )}
        </div>
    );
};

const Tooltip = ({ x, y, title, color, lines }) => {
    const left = Math.min(Math.max(8, x + 12), 220);
    const top = Math.min(Math.max(8, y + 12), 220);
    return (
        <div
            className="absolute z-[5] bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-[10px] px-[12px] py-[10px] pointer-events-none"
            style={{ left, top, width: 200 }}
        >
            <div className="flex items-center gap-[8px] mb-[8px]">
                <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: color }} />
                <div className="text-[13px] font-extrabold text-slate-800">{title}</div>
            </div>
            <div className="flex flex-col gap-[6px]">
                {Object.entries(lines || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-[12px] text-[12px]">
                        <span className="text-[#6B7280] font-semibold">{k}</span>
                        <span className="text-slate-800 font-bold">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart = ({ data, series, yMax, yTicks }) => {
    const [tip, setTip] = useState(null);
    const width = 520;
    const height = 220;
    const padding = { left: 36, right: 12, top: 14, bottom: 28 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const xStep = data.length > 1 ? plotW / (data.length - 1) : plotW;
    const yFor = (v) => padding.top + plotH - (Math.min(Math.max(v, 0), yMax) / yMax) * plotH;

    const getSplinePath = (pts) => {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
        const tension = 0.22;
        let d = `M${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i += 1) {
            const p0 = pts[i - 1] ?? pts[i];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2] ?? p2;
            const c1x = p1.x + (p2.x - p0.x) * tension;
            const c1y = p1.y + (p2.y - p0.y) * tension;
            const c2x = p2.x - (p3.x - p1.x) * tension;
            const c2y = p2.y - (p3.y - p1.y) * tension;
            d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
        }
        return d;
    };

    const pointsFor = (key) => {
        return data.map((d, i) => ({
            x: padding.left + i * xStep,
            y: yFor(Number(d[key]) || 0),
        }));
    };

    return (
        <div className="relative mt-[10px]">
            <div className="flex gap-[14px] items-center mb-[10px]">
                {series.map((s) => (
                    <div key={s.key} className="flex items-center gap-[6px] text-[12px] text-[#6B7280] font-semibold">
                        <span className="w-[10px] h-[10px] rounded-full inline-block" style={{ backgroundColor: s.color }} />
                        {s.label}
                    </div>
                ))}
            </div>

            <svg className="w-full h-[220px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {/* Grid + axes */}
                {yTicks.map((t) => {
                    const y = yFor(t);
                    return (
                        <g key={t}>
                            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={t === 0 ? '#E5E7EB' : '#F3F4F6'} strokeDasharray={t === 0 ? '0' : '4 4'} />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{t}</text>
                        </g>
                    );
                })}
                <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#E5E7EB" />
                <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#E5E7EB" />

                {/* Lines */}
                {series.map((s) => (
                    <path
                        key={s.key}
                        d={getSplinePath(pointsFor(s.key))}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                {/* Points */}
                {data.map((d, i) => {
                    const x = padding.left + i * xStep;
                    return (
                        <g key={d.label}>
                            {series.map((s) => {
                                const val = Number(d[s.key]) || 0;
                                const y = yFor(val);
                                return (
                                    <circle
                                        key={s.key}
                                        cx={x}
                                        cy={y}
                                        r="5"
                                        fill={s.color}
                                        stroke="white"
                                        strokeWidth="2"
                                        className="cursor-pointer"
                                        onMouseMove={(e) => {
                                            const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                            if (!rect) return;
                                            setTip({
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top,
                                                title: d.label,
                                                color: s.color,
                                                lines: {
                                                    Series: s.label,
                                                    Count: String(val),
                                                },
                                            });
                                        }}
                                        onMouseLeave={() => setTip(null)}
                                    />
                                );
                            })}
                            <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#9CA3AF">{d.label}</text>
                        </g>
                    );
                })}
            </svg>

            {tip && (
                <Tooltip x={tip.x} y={tip.y} title={tip.title} color={tip.color} lines={tip.lines} />
            )}
        </div>
    );
};

const BarChart = ({ data, yMax, yTicks, valueKey, valueLabel, valueFormatter }) => {
    const [tip, setTip] = useState(null);
    const width = 520;
    const height = 220;
    const padding = { left: 36, right: 12, top: 14, bottom: 28 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;
    const barW = data.length ? Math.min(48, plotW / data.length - 12) : 40;
    const gap = data.length ? (plotW - barW * data.length) / Math.max(1, data.length) : 10;

    const yFor = (v) => padding.top + plotH - (Math.min(Math.max(v, 0), yMax) / yMax) * plotH;

    return (
        <div className="relative mt-[10px]">
            <svg className="w-full h-[220px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {yTicks.map((t) => {
                    const y = yFor(t);
                    return (
                        <g key={t}>
                            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={t === 0 ? '#E5E7EB' : '#F3F4F6'} strokeDasharray={t === 0 ? '0' : '4 4'} />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{t}</text>
                        </g>
                    );
                })}
                <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#E5E7EB" />
                <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#E5E7EB" />

                {data.map((d, i) => {
                    const raw = Number(d[valueKey]) || 0;
                    const x = padding.left + gap / 2 + i * (barW + gap);
                    const y = yFor(raw);
                    const h = (height - padding.bottom) - y;
                    const color = d.color || '#111827';
                    return (
                        <g key={d.label}>
                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={h}
                                rx="6"
                                fill={color}
                                className="cursor-pointer opacity-90 hover:opacity-100"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                    if (!rect) return;
                                    setTip({
                                        x: e.clientX - rect.left,
                                        y: e.clientY - rect.top,
                                        title: d.label,
                                        color,
                                        lines: {
                                            [valueLabel]: valueFormatter ? valueFormatter(raw) : String(raw),
                                        },
                                    });
                                }}
                                onMouseLeave={() => setTip(null)}
                            />
                            <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="10" fill="#9CA3AF">{d.label}</text>
                        </g>
                    );
                })}
            </svg>

            {tip && (
                <Tooltip x={tip.x} y={tip.y} title={tip.title} color={tip.color} lines={tip.lines} />
            )}
        </div>
    );
};

export default AdminAnalyticsScreen;