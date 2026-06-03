import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Activity,
} from "lucide-react";

import {
  getAnalyticsCategories,
  getAnalyticsResponseTime,
  getAnalyticsStatus,
  getIncidents,
} from "../services/analyticsService";

const AdminDashboardScreen = () => {
  const [incidentTrends7d, setIncidentTrends7d] = useState([]);
  const [incidentsByType, setIncidentsByType] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [liveFeedItems, setLiveFeedItems] = useState([]);
  const [stats, setStats] = useState({
    activeIncidents: 0,
    activeResponders: 0,
    resolvedToday: 0,
    avgDispatchTime: "0.0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [incidentsByStatus, setIncidentsByStatus] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const mapStatus = (status) => {
      switch (status) {
        case "Pending":
          return "reported";
        case "Verified":
          return "verified";
        case "Assigned":
          return "assigned";
        case "Resolved":
          return "resolved";
        default:
          return status?.toLowerCase() || "reported";
      }
    };

    const buildWeeklyTrend = (incidents = []) => {
      const days = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        days.push({
          date: date.toLocaleDateString("en-CA"),
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
          }),
          reported: 0,
          resolved: 0,
        });
      }

      incidents.forEach((incident) => {
        const incidentDate = new Date(incident.timestamp).toLocaleDateString(
          "en-CA",
        );

        const day = days.find((d) => d.date === incidentDate);

        if (day) {
          day.reported += 1;

          if (incident.status === "Resolved") {
            day.resolved += 1;
          }
        }
      });

      return days;

      console.log("Days:", days);
      console.log(
        incidents.map((i) => ({
          timestamp: i.timestamp,
          status: i.status,
        })),
      );
    };

    const buildTypeCounts = (categories = []) =>
      categories.map((item, index) => ({
        key: item._id || "Unknown",
        label: item._id || "Unknown",
        value: item.count,
        color: ["#D62828", "#2B2D42", "#F59E0B", "#10B981"][index % 4],
      }));

    const buildStatusCounts = (statuses = []) =>
      statuses.map((item, index) => ({
        key: item._id || "Unknown",
        label: item._id || "Unknown",
        value: item.count,
        color: ["#F59E0B", "#10B981", "#3B82F6", "#D62828"][index % 4],
      }));

    const buildFeed = (incidents = []) =>
      incidents.slice(0, 4).map((incident, idx) => ({
        time: new Date(incident.timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        title: incident.type || "Incident Reported",
        desc: incident.description
          ? incident.description.slice(0, 60)
          : "Report received from device.",
        id: idx,
      }));

    const buildStats = (incidents = [], avgResponse = 0) => {
      const activeIncidents = incidents.filter(
        (incident) => incident.status !== "Resolved",
      ).length;
      const activeResponders = new Set(
        incidents.flatMap((incident) =>
          (incident.assignedAuthorities || []).map(
            (authority) => authority._id || authority,
          ),
        ),
      ).size;
      const resolvedToday = incidents.filter((incident) => {
        if (!incident.timestamp) return false;
        const created = new Date(incident.timestamp);
        const today = new Date();
        return (
          created.toDateString() === today.toDateString() &&
          incident.status === "Resolved"
        );
      }).length;
      return {
        activeIncidents,
        activeResponders,
        resolvedToday,
        avgDispatchTime: avgResponse.toFixed(1),
      };
    };

    const loadDashboard = async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setError(null);
        const [categoriesRes, responseRes, incidentsRes, statusRes] =
          await Promise.all([
            getAnalyticsCategories(),
            getAnalyticsResponseTime(),
            getIncidents(1, 20),
            getAnalyticsStatus(),
          ]);
        const incidents = Array.isArray(incidentsRes)
      ? incidentsRes
      : incidentsRes?.incidents || [];
        setIncidentTrends7d(buildWeeklyTrend(incidents));
        setIncidentsByType(buildTypeCounts(categoriesRes || []));
        setStatusData(statusRes || []);

        setIncidentsByStatus(buildStatusCounts(statusRes || []));
        setRecentIncidents(
          incidents.slice(0, 5).map((incident) => ({
            id: incident._id,
            title: incident.type || incident.description || "Incident",
            status: mapStatus(incident.status),
            loc: incident.location?.coordinates
              ? `${incident.location.coordinates[1].toFixed(3)}, ${incident.location.coordinates[0].toFixed(3)}`
              : "Unknown",
          })),
        );
        setLiveFeedItems(buildFeed(incidents));
        setStats(
          buildStats(incidents, responseRes?.averageResponseTime_minutes || 0),
        );
        setStatusData(statusRes || []);
      } catch (err) {
        if (!cancelled)
          setError(err.message || "Unable to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
      console.log("Incidents:", incidents);
    };

    loadDashboard(true);
    const interval = setInterval(() => {
      loadDashboard(false);
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };

    // return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-[#64748B] text-lg font-medium">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <div className="text-red-700 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-[25px]">
        <h2 className="m-0 mb-1 text-[24px] text-[#2B2D42] font-extrabold">
          Dashboard Overview
        </h2>
        <p className="m-0 text-[#8D99AE] text-[14px]">
          Real-time emergency response monitoring
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
        <StatCard
          icon={<AlertCircle color="#D62828" size={24} />}
          bg="#FEE2E2"
          title="Active Incidents"
          value={stats.activeIncidents.toString()}
          trend="+12%"
          positive={false}
        />
        <StatCard
          icon={<Users color="#4A5568" size={24} />}
          bg="#F3F4F6"
          title="Active Responders"
          value={stats.activeResponders.toString()}
          trend="+8%"
          positive={true}
        />
        <StatCard
          icon={<CheckCircle color="#10B981" size={24} />}
          bg="#D1FAE5"
          title="Resolved Today"
          value={stats.resolvedToday.toString()}
          trend="+18%"
          positive={true}
        />
        <StatCard
          icon={<Clock color="#F59E0B" size={24} />}
          bg="#FEF3C7"
          title="Avg. Dispatch Time"
          value={`${stats.avgDispatchTime} min`}
          trend="-15%"
          positive={true}
        />
      </div>

      {/* Incident Trend Analytics */}
      <div className="grid grid-cols-3 gap-[20px] mb-[25px]">
        <ChartCard title="Incident Trends (Last 7 Days)">
          <LineChart
            data={incidentTrends7d}
            series={[
              { key: "reported", label: "Reported", color: "#D62828" },
              { key: "resolved", label: "Resolved", color: "#10B981" },
            ]}
            yMax={80}
            yTicks={[0, 20, 40, 60, 80]}
          />
        </ChartCard>
        <ChartCard title="Incidents by Type">
          <div className="grid grid-cols-[180px_1fr] gap-[12px] items-center">
            <DonutChart
              size={160}
              strokeWidth={22}
              segments={incidentsByType}
              centerLabel={{
                title: "Total",
                value: String(
                  incidentsByType.reduce((sum, s) => sum + s.value, 0),
                ),
              }}
            />
            <LegendList
              items={incidentsByType.map((s) => ({
                label: s.label,
                value: s.value,
                color: s.color,
              }))}
              hint="Hover the chart to see details"
            />
          </div>
        </ChartCard>

        <ChartCard title="Incidents by Status">
          <div className="grid grid-cols-[180px_1fr] gap-[12px] items-center">
            <DonutChart
              size={160}
              strokeWidth={22}
              segments={incidentsByStatus}
              centerLabel={{
                title: "Total",
                value: String(
                  incidentsByStatus.reduce((sum, s) => sum + s.value, 0),
                ),
              }}
            />

            <LegendList
              items={incidentsByStatus.map((s) => ({
                label: s.label,
                value: s.value,
                color: s.color,
              }))}
            />
          </div>
        </ChartCard>
      </div>

      {/* Table + Live Feed */}
      <div className="grid grid-cols-[2fr_1fr] gap-[20px] mb-[25px]">
        {/* Recent Incidents */}
        <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2">
          <div className="flex justify-between items-center mb-[20px]">
            <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">
              Recent Incidents
            </h3>
            <span className="text-[12px] text-[#D62828] font-bold cursor-pointer hover:underline">
              View All
            </span>
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
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident) => (
                  <TableRow
                    key={incident.id}
                    id={incident.id.slice(-8)}
                    title={incident.title}
                    status={incident.status}
                    loc={incident.loc}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-[15px] text-center text-[#64748B]"
                  >
                    No recent incidents available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Live Feed */}
        <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2">
          <div className="flex justify-between items-center mb-[20px]">
            <div className="flex items-center gap-[8px]">
              <Activity size={18} color="#D62828" />
              <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">
                Live Feed
              </h3>
            </div>
          </div>
          <div className="flex flex-col gap-[15px]">
            {liveFeedItems.length > 0 ? (
              liveFeedItems.map((item) => (
                <FeedItem
                  key={item.id}
                  time={item.time}
                  title={item.title}
                  desc={item.desc}
                />
              ))
            ) : (
              <div className="text-[#64748B] text-[13px]">
                No live activity available.
              </div>
            )}
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
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2">
    <div className="flex justify-between items-center mb-[12px]">
      <h3 className="m-0 text-[16px] text-[#2B2D42] font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

const StatCard = ({ icon, bg, title, value, trend, positive }) => (
  <div className="bg-white p-[25px] rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/2 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-[15px]">
      <div className="p-[12px] rounded-[12px]" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div
        className="flex items-center gap-[4px] text-[13px] font-bold"
        style={{ color: positive ? "#10B981" : "#D62828" }}
      >
        {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{" "}
        {trend}
      </div>
    </div>
    <div>
      <h4 className="m-0 mb-[5px] text-[28px] text-[#2B2D42] font-extrabold">
        {value}
      </h4>
      <p className="m-0 text-[13px] text-[#8D99AE] font-medium">{title}</p>
    </div>
  </div>
);

const TableRow = ({ id, title, status, loc }) => {
  const statusStyles = {
    "in-progress": { bg: "#E0E7FF", text: "#3730A3" },
    assigned: { bg: "#F3E8FF", text: "#6B21A8" },
    verified: { bg: "#FEF08A", text: "#854D0E" },
    reported: { bg: "#F3F4F6", text: "#374151" },
    resolved: { bg: "#D1FAE5", text: "#065F46" },
  };
  const badge = statusStyles[status] || {
    bg: "#F3F4F6",
    text: "#374151",
  };

  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-slate-50 transition-colors">
      <td className="p-[15px_10px] text-[13px] text-[#4A5568]">{id}</td>
      <td className="p-[15px_10px] text-[14px] text-[#2B2D42] font-bold">
        {title}
      </td>
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
        <Eye
          size={16}
          className="cursor-pointer hover:text-[#2B2D42] inline-block"
        />
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

const LegendList = ({ items, hint }) => {
  const total = items.reduce((sum, i) => sum + (Number(i.value) || 0), 0);
  return (
    <div className="flex flex-col gap-[10px]">
      {items.map((i) => {
        const pct = total > 0 ? ((Number(i.value) || 0) / total) * 100 : 0;
        return (
          <div
            key={i.label}
            className="flex items-center justify-between gap-[12px]"
          >
            <div className="flex items-center gap-[10px]">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: i.color }}
              />
              <div className="text-[12px] font-bold text-slate-800">
                {i.label}
              </div>
            </div>
            <div className="flex items-center gap-[6px] text-[11px] text-[#6B7280] font-semibold">
              <span>{i.value}</span>
              <span className="text-[#9CA3AF]">
                {total ? `${pct.toFixed(0)}%` : "0%"}
              </span>
            </div>
          </div>
        );
      })}
      {hint && (
        <div className="mt-[6px] text-[11px] text-[#9CA3AF] font-semibold">
          {hint}
        </div>
      )}
    </div>
  );
};

const DonutChart = ({
  size = 180,
  strokeWidth = 20,
  segments,
  centerLabel,
}) => {
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
                const rect =
                  e.currentTarget.ownerSVGElement?.getBoundingClientRect();
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

const LineChart = ({ data, series, yMax, yTicks }) => {
  const [tip, setTip] = useState(null);
  const width = 520;
  const height = 220;
  const padding = { left: 36, right: 12, top: 14, bottom: 28 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const xStep = data.length > 1 ? plotW / (data.length - 1) : plotW;
  const yFor = (v) =>
    padding.top + plotH - (Math.min(Math.max(v, 0), yMax) / yMax) * plotH;

  const getSplinePath = (pts) => {
    if (pts.length === 0) return "";
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

  const pointsFor = (key) =>
    data.map((d, i) => ({
      x: padding.left + i * xStep,
      y: yFor(Number(d[key]) || 0),
    }));

  // const pathFor = (key) =>
  //   data
  //     .map((d, i) => {
  //       const x = padding.left + i * xStep;
  //       const y = yFor(Number(d[key]) || 0);
  //       return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  //     })
  //     .join(' ');

  return (
    <div className="relative mt-[10px]">
      <div className="flex gap-[14px] items-center mb-[10px]">
        {series.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-[6px] text-[12px] text-[#6B7280] font-semibold"
          >
            <span
              className="w-[10px] h-[10px] rounded-full inline-block"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </div>
        ))}
      </div>

      <svg
        className="w-full h-[220px]"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {yTicks.map((t) => {
          const y = yFor(t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={t === 0 ? "#E5E7EB" : "#F3F4F6"}
                strokeDasharray={t === 0 ? "0" : "4 4"}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9CA3AF"
              >
                {t}
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
                      const rect =
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (!rect) return;
                      setTip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        title: d.label,
                        color: s.color,
                        lines: { Series: s.label, Count: String(val) },
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
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

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
  const left = Math.min(Math.max(8, x + 12), 260);
  const top = Math.min(Math.max(8, y + 12), 240);
  return (
    <div
      className="absolute z-[5] bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-[10px] px-[12px] py-[10px] pointer-events-none"
      style={{ left, top, width: 210 }}
    >
      <div className="flex items-center gap-[8px] mb-[8px]">
        <div
          className="w-[10px] h-[10px] rounded-full"
          style={{ backgroundColor: color }}
        />
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

export default AdminDashboardScreen;
