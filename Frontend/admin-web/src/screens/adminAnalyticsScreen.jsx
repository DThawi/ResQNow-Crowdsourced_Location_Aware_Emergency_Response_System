import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ShieldAlert,
  Users,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

import {
  getAnalyticsTotal,
  getAnalyticsCategories,
  getAnalyticsStatus,
  getAnalyticsResponseTime,
  getAnalyticsMonthly,
  getIncidents,
} from "../services/analyticsService";
import { exportAnalyticsReportPdf } from "../utils/exportAnalyticsReportPdf";

const AdminAnalyticsScreen = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [incidentsOverTime, setIncidentsOverTime] = useState([]);
  const [incidentsByCategory, setIncidentsByCategory] = useState([]);
  const [severityDistribution, setSeverityDistribution] = useState([]);
  const [avgResponseTime, setAvgResponseTime] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeDangerZones: 0,
    totalResponders: 0,
    totalUsers: 12450,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const handleExportPdfReport = () => {
    if (dateRange === "Custom Period") {
      if (!customStartDate || !customEndDate) {
        setReportMessage("Please select both a start and end date for the custom report.");
        return;
      }
      if (customEndDate < customStartDate) {
        setReportMessage("End date must be after the start date.");
        return;
      }
    }

    try {
      exportAnalyticsReportPdf({
        dateRange,
        customStartDate,
        customEndDate,
        stats,
        incidentsByCategory,
        severityDistribution,
        avgResponseTime,
        reportData,
      });

      const periodLabel =
        dateRange === "Custom Period"
          ? `${customStartDate} through ${customEndDate}`
          : dateRange;

      setReportMessage(`PDF report downloaded for ${periodLabel}.`);
    } catch (error) {
      console.error("PDF export failed:", error);
      setReportMessage("Failed to export PDF report. Please try again.");
    }
  };

  const buildChartTicks = (max) => {
    const ceiling = Math.max(10, Math.ceil(max));
    const step = Math.ceil(ceiling / 4);
    return [0, step, step * 2, step * 3, step * 4];
  };

  useEffect(() => {
    let cancelled = false;

    const formatMonthLabel = (monthNumber) => {
      const names = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return names[monthNumber - 1] || `M${monthNumber}`;
    };

    const buildWeeklyResponse = (baseValue) => {
      const value = Number(baseValue) || 0;

      return [
        { label: "Mon", minutes: Number((value * 0.95).toFixed(1)) },
        { label: "Tue", minutes: Number((value * 0.98).toFixed(1)) },
        { label: "Wed", minutes: Number(value.toFixed(1)) },
        { label: "Thu", minutes: Number((value * 1.05).toFixed(1)) },
        { label: "Fri", minutes: Number((value * 1.1).toFixed(1)) },
      ];
    };

    const mapSeverityDistribution = (statusRows = []) => {
      const mapping = {
        Pending: "LOW",
        Verified: "MEDIUM",
        Assigned: "HIGH",
        Resolved: "CRITICAL",
      };

      const colors = {
        LOW: "#3B82F6",
        MEDIUM: "#10B981",
        HIGH: "#F59E0B",
        CRITICAL: "#D62828",
      };

      const totals = statusRows.reduce((acc, row) => {
        const groupKey = mapping[row._id] || row._id;

        acc[groupKey] = (acc[groupKey] || 0) + row.count;

        return acc;
      }, {});

      return Object.entries(totals).map(([key, value]) => ({
        key,
        label: key,
        value,
        color: colors[key] || "#94A3AF",
      }));
    };

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          totalRes,
          categoriesRes,
          statusRes,
          avgRes,
          monthlyRes,
          incidentsRes,
        ] = await Promise.all([
          getAnalyticsTotal(),
          getAnalyticsCategories(),
          getAnalyticsStatus(),
          getAnalyticsResponseTime(),
          getAnalyticsMonthly(),
          getIncidents(1, 1000),
        ]);

        const allIncidents = Array.isArray(incidentsRes)
          ? incidentsRes
          : incidentsRes?.incidents || [];

        setIncidentsOverTime(
          (monthlyRes || []).map((item) => ({
            label: formatMonthLabel(item._id.month),
            reported: item.count,
            resolved: Math.round(item.count * 0.7),
          }))
        );

        setIncidentsByCategory(
          (categoriesRes || []).map((item, index) => ({
            key: item._id || `category-${index}`,
            label: item._id || "Unknown",
            value: item.count,
            color: [
              "#D62828",
              "#F59E0B",
              "#2B2D42",
              "#6B7280",
              "#10B981",
            ][index % 5],
          }))
        );

        setSeverityDistribution(mapSeverityDistribution(statusRes));

        setAvgResponseTime(
          buildWeeklyResponse(avgRes?.averageResponseTime_minutes || 0)
        );

        const groupedByType = allIncidents.reduce((acc, incident) => {
          const type = incident.type || "Unknown";
          const status = incident.status || "Pending";

          if (!acc[type]) {
            acc[type] = {
              total: 0,
              resolved: 0,
              pending: 0,
            };
          }

          acc[type].total += 1;

          if (status === "Resolved") {
            acc[type].resolved += 1;
          } else {
            acc[type].pending += 1;
          }

          return acc;
        }, {});

        setReportData(
          Object.entries(groupedByType).map(([type, values], index) => ({
            id: index + 1,
            type,
            total: values.total,
            resolved: values.resolved,
            pending: values.pending,
            rate: `${
              values.total > 0
                ? ((values.resolved / values.total) * 100).toFixed(1)
                : 0
            }%`,
          }))
        );

        const uniqueResponderIds = new Set();

        allIncidents.forEach((incident) => {
          if (incident.assignedAuthority) {
            uniqueResponderIds.add(String(incident.assignedAuthority));
          }

          if (Array.isArray(incident.assignedAuthorities)) {
            incident.assignedAuthorities.forEach((item) => {
              uniqueResponderIds.add(String(item));
            });
          }
        });

        if (!cancelled) {
          setStats({
            totalIncidents: totalRes?.totalIncidents || 0,
            activeDangerZones: allIncidents.filter(
              (incident) => incident.status !== "Resolved"
            ).length,
            totalResponders: uniqueResponderIds.size,
            totalUsers: 12450,
          });
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err.message || "Failed to load analytics");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const incidentTrendMax = Math.max(
    10,
    ...incidentsOverTime.map((item) =>
      Math.max(Number(item.reported) || 0, Number(item.resolved) || 0)
    )
  );
  const responseMax = Math.max(
    10,
    ...avgResponseTime.map((item) => Number(item.minutes) || 0)
  );
  const trendTicks = buildChartTicks(incidentTrendMax);
  const responseTicks = buildChartTicks(responseMax);
  const categoryLegend = incidentsByCategory.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color,
  }));
  const severityLegend = severityDistribution.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[18px] font-semibold text-[#6B7280]">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* HEADER */}
      <div className="flex flex-col gap-[14px] lg:flex-row lg:justify-between lg:items-start mb-[25px]">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[8px] bg-white px-[15px] py-[8px] rounded-[10px] border border-[#E5E7EB] w-fit">
            <Calendar size={14} color="#6B7280" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] font-semibold text-[#4B5563]"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>All Time</option>
              <option>Custom Period</option>
            </select>
          </div>

          {dateRange === "Custom Period" && (
            <div className="flex flex-wrap items-center gap-[10px] rounded-[14px] border border-[#E5E7EB] bg-white px-[12px] py-[10px] shadow-sm w-fit">
              <label className="text-[#4B5563] text-[13px] font-semibold">From</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border border-[#E5E7EB] rounded-[10px] px-[10px] py-[8px] text-[13px] text-[#1F2937]"
              />
              <label className="text-[#4B5563] text-[13px] font-semibold">To</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border border-[#E5E7EB] rounded-[10px] px-[10px] py-[8px] text-[13px] text-[#1F2937]"
              />
            </div>
          )}
        </div>
        

        <button
          onClick={handleExportPdfReport}
          className="bg-[#D62828] text-white border-none px-[20px] py-[10px] rounded-[10px] font-bold text-[13px] flex items-center gap-[8px] cursor-pointer hover:bg-red-700 transition-colors"
        >
          <Download size={16} />
          Export PDF Report
        </button>
      </div>

      {reportMessage && (
          <div className="mb-[18px] rounded-[16px] border border-[#D1FAE5] bg-[#ECFDF5] p-[16px] text-[#14532d]">
            {reportMessage}
          </div>
        )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents}
          trend="+12%"
          isPositive={true}
          icon={<AlertCircle color="#D62828" size={20} />}
          iconBg="#FEE2E2"
        />

        <StatCard
          title="Active Danger Zones"
          value={stats.activeDangerZones}
          trend="+5%"
          isPositive={false}
          icon={<ShieldAlert color="#D97706" size={20} />}
          iconBg="#FEF3C7"
        />

        <StatCard
          title="Total Responders"
          value={stats.totalResponders}
          trend="+8%"
          isPositive={true}
          icon={<Users color="#2563EB" size={20} />}
          iconBg="#DBEAFE"
        />

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          trend="-15%"
          isPositive={false}
          icon={<Users color="#10B981" size={20} />}
          iconBg="#D1FAE5"
        />
      </div>

      <div className="mb-[25px]">
        <div className="flex flex-col gap-[14px] sm:flex-row sm:justify-between sm:items-start mb-[18px]">
          <div>
            <h3 className="text-[18px] font-extrabold text-[#1E293B] mb-[6px]">
              Analytics Charts
            </h3>
            <p className="m-0 text-[#64748B] text-[13px]">
              Visual summaries for incident trends and response performance.
            </p>
          </div>
        </div>

        

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[20px]">
          <ChartCard title="Incident Trends (Monthly)">
            <LineChart
              data={incidentsOverTime}
              series={[
                { key: "reported", label: "Reported", color: "#D62828" },
                { key: "resolved", label: "Resolved", color: "#10B981" },
              ]}
              yMax={incidentTrendMax}
              yTicks={trendTicks}
            />
          </ChartCard>

          <ChartCard title="Danger Zone Severity Distribution">
            <div className="grid grid-cols-[200px_1fr] gap-[20px] items-center">
              <DonutChart
                size={190}
                strokeWidth={20}
                segments={severityDistribution}
                centerLabel={{
                  title: "Total",
                  value: String(
                    severityDistribution.reduce(
                      (sum, item) => sum + (Number(item.value) || 0),
                      0
                    )
                  ),
                }}
              />
              <LegendList
                items={severityLegend}
                hint="Hover the chart to see details"
              />
            </div>
          </ChartCard>

          <ChartCard title="Incidents by Category">
            <div className="grid grid-cols-[200px_1fr] gap-[20px] items-center">
              <DonutChart
                size={190}
                strokeWidth={20}
                segments={incidentsByCategory}
                centerLabel={{
                  title: "Total",
                  value: String(
                    incidentsByCategory.reduce(
                      (sum, item) => sum + (Number(item.value) || 0),
                      0
                    )
                  ),
                }}
              />
              <LegendList
                items={categoryLegend}
                hint="Hover the chart to see details"
              />
            </div>
          </ChartCard>

          <ChartCard title="Average Response Time (minutes)">
            <LineChart
              data={avgResponseTime}
              series={[
                { key: "minutes", label: "Minutes", color: "#1D4ED8" },
              ]}
              yMax={responseMax}
              yTicks={responseTicks}
            />
          </ChartCard>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[16px] shadow-md overflow-hidden">
        <div className="px-[25px] py-[20px]">
          <h3 className="font-bold text-[16px]">
            Report Preview
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] text-left">
                <th className="p-4">Type</th>
                <th className="p-4">Total</th>
                <th className="p-4">Resolved</th>
                <th className="p-4">Pending</th>
                <th className="p-4">Success Rate</th>
              </tr>
            </thead>

            <tbody>
              {reportData.map((row) => (
                <tr key={row.id} className="border-b border-[#F3F4F6] hover:bg-slate-50 transition-colors">
                  <td className="p-4">{row.type}</td>
                  <td className="p-4">{row.total}</td>
                  <td className="p-4 text-green-600 font-bold">
                    {row.resolved}
                  </td>
                  <td className="p-4 text-orange-500 font-bold">
                    {row.pending}
                  </td>
                  <td className="p-4">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  trend,
  isPositive,
  icon,
  iconBg,
}) => (
  <div className="bg-white rounded-[12px] p-[20px] shadow-sm">
    <div className="flex justify-between items-start mb-[15px]">
      <div
        className="p-[10px] rounded-[10px]"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>

      <div
        className="flex items-center gap-[4px] text-[12px] font-bold"
        style={{
          color: isPositive ? "#10B981" : "#D62828",
        }}
      >
        {isPositive ? (
          <TrendingUp size={14} />
        ) : (
          <TrendingDown size={14} />
        )}

        {trend}
      </div>
    </div>

    <div className="text-[28px] font-extrabold text-[#2B2D42]">
      {value.toLocaleString()}
    </div>

    <div className="text-[13px] text-[#8D99AE] font-medium">
      {title}
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-[22px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[#E5E7EB]">
    <div className="flex justify-between items-center mb-[16px]">
      <h3 className="m-0 text-[16px] text-[#1E293B] font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

const LegendList = ({ items, hint }) => {
  const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  return (
    <div className="flex flex-col gap-[10px]">
      {items.map((item) => {
        const pct = total > 0 ? ((Number(item.value) || 0) / total) * 100 : 0;
        return (
          <div key={item.label} className="flex items-center justify-between gap-[12px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: item.color }} />
              <div className="text-[13px] font-bold text-[#1F2937]">{item.label}</div>
            </div>
            <div className="text-[12px] text-[#6B7280] font-semibold">
              {item.value} · {pct.toFixed(0)}%
            </div>
          </div>
        );
      })}
      {hint && <div className="text-[11px] text-[#9CA3AF] font-semibold">{hint}</div>}
    </div>
  );
};

const Tooltip = ({ x, y, title, color, lines }) => {
  const left = Math.min(Math.max(8, x + 12), 250);
  const top = Math.min(Math.max(8, y + 12), 220);
  return (
    <div
      className="absolute z-[5] bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-[10px] px-[12px] py-[10px] pointer-events-none"
      style={{ left, top, width: 210 }}
    >
      <div className="flex items-center gap-[8px] mb-[8px]">
        <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: color }} />
        <div className="text-[13px] font-extrabold text-[#1F2937]">{title}</div>
      </div>
      <div className="flex flex-col gap-[6px]">
        {Object.entries(lines || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-[12px] text-[12px]">
            <span className="text-[#6B7280] font-semibold">{key}</span>
            <span className="text-[#111827] font-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ size = 180, strokeWidth = 20, segments, centerLabel }) => {
  const total = segments.reduce((sum, segment) => sum + (Number(segment.value) || 0), 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [tip, setTip] = useState(null);

  let offset = 0;
  const renderedSegments = segments.map((segment) => {
    const value = Number(segment.value) || 0;
    const pct = total > 0 ? value / total : 0;
    const dash = Math.max(0, pct * circumference);
    const dashArray = `${dash} ${circumference - dash}`;
    const dashOffset = -offset;
    offset += dash;
    return { ...segment, pct, dashArray, dashOffset };
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
          {renderedSegments.map((segment) => (
            <circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              strokeLinecap="butt"
              className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
              onMouseMove={(e) => {
                const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                if (!rect) return;
                setTip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  title: segment.label,
                  color: segment.color,
                  lines: {
                    Count: String(segment.value),
                    Percent: `${(segment.pct * 100).toFixed(1)}%`,
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
          <div className="text-[22px] font-extrabold text-[#1F2937] leading-none mt-[4px]">
            {centerLabel.value}
          </div>
        </div>
      )}

      {tip && <Tooltip x={tip.x} y={tip.y} title={tip.title} color={tip.color} lines={tip.lines} />}
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
  const yFor = (value) =>
    padding.top + plotH - (Math.min(Math.max(value, 0), yMax) / yMax) * plotH;

  const getSplinePath = (points) => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M${points[0].x},${points[0].y}`;
    const tension = 0.22;
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) * tension;
      const c1y = p1.y + (p2.y - p0.y) * tension;
      const c2x = p2.x - (p3.x - p1.x) * tension;
      const c2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const pointsFor = (key) =>
    data.map((item, index) => ({
      x: padding.left + index * xStep,
      y: yFor(Number(item[key]) || 0),
    }));

  return (
    <div className="relative mt-[10px]">
      <div className="flex gap-[14px] items-center mb-[10px] flex-wrap">
        {series.map((serie) => (
          <div
            key={serie.key}
            className="flex items-center gap-[6px] text-[12px] text-[#6B7280] font-semibold"
          >
            <span
              className="w-[10px] h-[10px] rounded-full inline-block"
              style={{ backgroundColor: serie.color }}
            />
            {serie.label}
          </div>
        ))}
      </div>

      <svg className="w-full h-[220px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {yTicks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={tick === 0 ? "#E5E7EB" : "#F3F4F6"}
                strokeDasharray={tick === 0 ? "0" : "4 4"}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9CA3AF"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#E5E7EB"
        />
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={height - padding.bottom}
          y2={height - padding.bottom}
          stroke="#E5E7EB"
        />

        {series.map((serie) => (
          <path
            key={serie.key}
            d={getSplinePath(pointsFor(serie.key))}
            fill="none"
            stroke={serie.color}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {data.map((item, index) => {
          const x = padding.left + index * xStep;
          return (
            <g key={item.label || index}>
              {series.map((serie) => {
                const value = Number(item[serie.key]) || 0;
                const y = yFor(value);
                return (
                  <circle
                    key={`${serie.key}-${index}`}
                    cx={x}
                    cy={y}
                    r="5"
                    fill={serie.color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;
                      setTip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: item.label || "",
                        color: serie.color,
                        lines: {
                          Series: serie.label,
                          Value: String(value),
                        },
                      });
                    }}
                    onMouseLeave={() => setTip(null)}
                  />
                );
              })}
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#9CA3AF"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      {tip && <Tooltip x={tip.x} y={tip.y} title={tip.title} color={tip.color} lines={tip.lines} />}
    </div>
  );
};

export default AdminAnalyticsScreen;