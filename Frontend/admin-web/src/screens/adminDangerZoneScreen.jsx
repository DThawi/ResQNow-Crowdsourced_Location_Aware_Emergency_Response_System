import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAnalyticsTotal,
  getIncidents,
  getAnalyticsResponseTime,
  createIncident,
} from '../services/analyticsService';
import { exportZoneReportPdf } from '../utils/exportZoneReportPdf';
import { 
  AlertCircle, Users, ShieldAlert, Download, Calendar, 
  Plus, Search, Map, Cpu, Smartphone, Link, X, 
  ToggleRight, ToggleLeft, MapPin, Clock, Wand2 
} from 'lucide-react';

const DEFAULT_LAT = '6.9271';
const DEFAULT_LNG = '79.8612';

const AdminDangerZoneScreen = () => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- FUNCTIONAL STATES ---
  const [automationModalOpen, setAutomationModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [avgResponseMinutes, setAvgResponseMinutes] = useState(0);
  
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [autoResolve, setAutoResolve] = useState(true);

  const [newZoneData, setNewZoneData] = useState({
      name: '',
      type: 'Fire',
      severity: 'HIGH',
      affected: ''
  });

  const [allIncidents, setAllIncidents] = useState([]);
  const [totalIncidentsCount, setTotalIncidentsCount] = useState(0);
  const [zones, setZones] = useState([]);

  const filterIncidentsByDateRange = useCallback((incidents, range) => {
    if (range === 'All Time') return incidents;
    const now = new Date();
    const start = new Date(now);
    if (range === 'Last 7 Days') start.setDate(now.getDate() - 7);
    else if (range === 'Last 30 Days') start.setDate(now.getDate() - 30);
    else if (range === 'This Year') start.setFullYear(now.getFullYear(), 0, 1);
    return incidents.filter((incident) => {
      if (!incident.timestamp) return true;
      return new Date(incident.timestamp) >= start;
    });
  }, []);

  const mapIncidentToZone = useCallback((incident, index) => {
  const affectedCount = estimateAffectedCount(incident);

  let severity = 'LOW';

  switch ((incident.severity || '').toLowerCase()) {
    case 'high':
      severity = 'HIGH';
      break;

    case 'moderate':
      severity = 'MODERATE';
      break;

    case 'low':
      severity = 'LOW';
      break;

    default:
      severity = 'LOW';
  }

  return {
    id: incident._id,
    name:
      incident.description?.substring(0, 48) ||
      incident.type ||
      `Danger Zone ${index + 1}`,

    type: incident.type || 'Unknown',

    // REAL BACKEND SEVERITY
    severity,

    affected: affectedCount.toLocaleString(),
    affectedCount,

    status:
      incident.status === 'Resolved'
        ? 'INACTIVE'
        : 'ACTIVE',

    created: incident.timestamp
      ? new Date(incident.timestamp).toLocaleDateString('en-US')
      : '—',

    coordinates: parseCoordinates(incident.location),

    timestamp: incident.timestamp,
  };
}, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const [totalRes, incidentsRes, responseRes] = await Promise.all([
        getAnalyticsTotal(),
        getIncidents(1, 1000),
        getAnalyticsResponseTime(),
      ]);

      const incidents = Array.isArray(incidentsRes)
        ? incidentsRes
        : incidentsRes?.incidents || [];

      setAllIncidents(incidents);
      setTotalIncidentsCount(totalRes?.totalIncidents || 0);
      setAvgResponseMinutes(responseRes?.averageResponseTime_minutes || 0);
    } catch (error) {
      console.error('FETCH ERROR:', error);
      setLoadError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to load dashboard data'
      );
      setAllIncidents([]);
      setTotalIncidentsCount(0);
      setAvgResponseMinutes(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const filtered = filterIncidentsByDateRange(allIncidents, dateRange);
    setZones(filtered.map(mapIncidentToZone));
  }, [allIncidents, dateRange, filterIncidentsByDateRange, mapIncidentToZone]);

  const filteredZones = zones.filter(zone => 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      zone.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const severitySummary = useMemo(() => {
      const counts = zones.reduce((acc, z) => {
          acc[z.severity] = (acc[z.severity] ?? 0) + 1;
          return acc;
      }, /** @type {Record<string, number>} */ ({}));
      const order = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
      const total = order.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
      const items = order.map((k) => {
          const value = counts[k] ?? 0;
          const pct = total > 0 ? (value / total) * 100 : 0;
          return { key: k, label: k, value, pct };
      });
      return { total, items };
  }, [zones]);

  const activeTrend7d = useMemo(() => buildActiveTrend7d(zones), [zones]);

  const trendYMax = useMemo(() => {
    const peak = Math.max(
      ...activeTrend7d.map((d) => Math.max(d.active, d.affectedScaled)),
      1
    );
    return Math.ceil(peak);
  }, [activeTrend7d]);

  const peopleAffectedTotal = useMemo(
    () => zones.reduce((sum, z) => sum + (z.affectedCount || 0), 0),
    [zones]
  );

  const activeZonesCount = useMemo(() => {
    if (dateRange === 'All Time') {
      return allIncidents.filter((incident) => incident.status !== 'Resolved').length;
    }
    return zones.filter((zone) => zone.status === 'ACTIVE').length;
  }, [dateRange, allIncidents, zones]);

  const totalCreatedCount = useMemo(() => {
    if (dateRange === 'All Time') {
      return totalIncidentsCount;
    }
    return zones.length;
  }, [dateRange, totalIncidentsCount, zones]);

  const avgDurationLabel = useMemo(() => {
    if (!avgResponseMinutes) return '—';
    if (avgResponseMinutes >= 60) {
      return `${(avgResponseMinutes / 60).toFixed(1)} h`;
    }
    return `${avgResponseMinutes.toFixed(0)} min`;
  }, [avgResponseMinutes]);

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

  const handleExportZoneReport = async () => {
    setExportMessage(null);
    setExporting(true);
    try {
      exportZoneReportPdf({
        dateRange,
        searchTerm,
        stats: {
          activeZonesCount,
          peopleAffectedCount: peopleAffectedTotal,
          peopleAffectedLabel: peopleAffectedTotal.toLocaleString(),
          totalCreatedCount,
          avgDurationLabel,
        },
        severitySummary,
        zones: filteredZones,
      });
      setExportMessage('PDF report downloaded successfully.');
    } catch (error) {
      console.error('PDF export failed:', error);
      setExportMessage(
        error?.message || 'Could not generate the PDF. Please try again.'
      );
    } finally {
      setExporting(false);
    }
  };

  const handleCreateZone = async () => {
      try {
        await createIncident({
          type: newZoneData.type,
          description: newZoneData.name || `${newZoneData.type} danger zone`,
          longitude: DEFAULT_LNG,
          latitude: DEFAULT_LAT,
        });
        setCreateModalOpen(false);
        setNewZoneData({ name: '', type: 'Fire', severity: 'HIGH', affected: '' });
        await fetchAllData();
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.message ||
            'Failed to create danger zone. Sign in as admin and try again.'
        );
      }
  };

  const getSeverityClasses = (severity) => {
      switch(severity) {
          case 'CRITICAL': return 'bg-[#FEE2E2] text-[#DC2626]';
          case 'HIGH': return 'bg-[#FFEDD5] text-[#EA580C]';
          case 'MODERATE': return 'bg-[#FEF3C7] text-[#D97706]';
          case 'LOW': return 'bg-[#FEF9C3] text-[#CA8A04]';
          default: return 'bg-[#F3F4F6] text-[#4B5563]';
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-[18px] font-bold text-slate-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">

      {loadError && (
        <div className="mb-[20px] rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-[16px] py-[12px] text-[13px] font-semibold text-[#B91C1C]">
          {loadError}
        </div>
      )}
      
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
        <button
          type="button"
          onClick={handleExportZoneReport}
          disabled={exporting || loading}
          className="bg-[#D62828] text-white border-none py-[10px] px-[15px] rounded-[8px] font-bold text-[13px] flex items-center gap-[8px] cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <Download size={16} />
            {exporting ? 'Generating PDF…' : 'Export Zone Report'}
        </button>
      </div>

      {exportMessage && (
        <div
          className={`mb-[20px] rounded-[10px] border px-[16px] py-[12px] text-[13px] font-semibold ${
            exportMessage.includes('successfully')
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
          }`}
        >
          {exportMessage}
        </div>
      )}

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-4 gap-[20px] mb-[25px]">
          <StatCard title="Active Zones" value={activeZonesCount} trend="+12%" isPositive={true} icon={<AlertCircle color="#D62828" size={20} />} iconBg="#FEE2E2" />
          <StatCard title="People Affected" value={peopleAffectedTotal.toLocaleString()} trend="+28%" isPositive={false} icon={<Users color="#D97706" size={20} />} iconBg="#FEF3C7" />
          <StatCard title="Total Created" value={totalCreatedCount} trend="+5%" isPositive={false} icon={<MapPin color="#2563EB" size={20} />} iconBg="#DBEAFE" />
          <StatCard title="Average Duration" value={avgDurationLabel} trend="-15%" isPositive={true} icon={<Clock color="#8B5CF6" size={20} />} iconBg="#EDE9FE" />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-2 gap-[25px] mb-[25px]">
          <ChartCard title="Severity Distribution">
              <div className="grid grid-cols-[220px_1fr] gap-[20px] items-center">
                  <DonutChart
                      size={190}
                      strokeWidth={22}
                      segments={severitySummary.items.map((s) => ({
                          key: s.key,
                          label: s.label,
                          value: s.value,
                          color: getSeverityColor(s.key),
                          meta: {
                              Count: s.value,
                              Percent: `${s.pct.toFixed(1)}%`,
                          },
                      }))}
                      centerLabel={{
                          title: 'Zones',
                          value: String(severitySummary.total),
                      }}
                  />
                  <div className="flex flex-col gap-[10px]">
                      {severitySummary.items.map((s) => (
                          <div key={s.key} className="flex items-center justify-between gap-[12px]">
                              <div className="flex items-center gap-[10px]">
                                  <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: getSeverityColor(s.key) }} />
                                  <div className="text-[13px] font-bold text-slate-800">{s.label}</div>
                              </div>
                              <div className="flex items-center gap-[10px] text-[12px] text-[#6B7280] font-semibold">
                                  <span>{s.value}</span>
                                  <span className="text-[#9CA3AF]">{severitySummary.total ? `${s.pct.toFixed(0)}%` : '0%'}</span>
                              </div>
                          </div>
                      ))}
                      <div className="mt-[6px] text-[11px] text-[#9CA3AF] font-semibold">
                          Hover the chart to see details
                      </div>
                  </div>
              </div>
          </ChartCard>
          <ChartCard title="Live Zone Map Preview">
              <LiveZoneMapPreview zones={zones} />
          </ChartCard>
      </div>

      {/* 3.5 ACTIVE TREND */}
      <div className="mb-[25px]">
        <ChartCard title="Active Trend (Last 7 Days)">
            <LineChart
                data={activeTrend7d}
                series={[
                    { key: 'active', label: 'Active Zones', color: '#D62828' },
                    { key: 'affectedScaled', label: 'People Affected', color: '#10B981', tooltipKey: 'affected', tooltipFormatter: (v) => `${Number(v).toLocaleString()} people` },
                ]}
                yMax={trendYMax}
                yTicks={Array.from({ length: 5 }, (_, i) => Math.round((trendYMax / 4) * i))}
                yTickSuffix=""
            />
            <div className="mt-[8px] text-[11px] text-[#9CA3AF] font-semibold">
                People Affected is scaled to fit the same axis (hover for exact values).
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
                    {filteredZones.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-[20px_25px] text-center text-[#64748B] text-[13px]">
                                No incidents found in the database for this date range.
                            </td>
                        </tr>
                    ) : filteredZones.map((zone) => (
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

function getSeverityColor(severity) {
    switch (severity) {
        case 'CRITICAL': return '#DC2626';
        case 'HIGH': return '#EA580C';
        case 'MODERATE': return '#D97706';
        case 'LOW': return '#CA8A04';
        default: return '#6B7280';
    }
}

const LineChart = ({ data, series, yMax, yTicks, yTickSuffix = '' }) => {
    const [tip, setTip] = useState(null);
    const width = 900;
    const height = 240;
    const padding = { left: 40, right: 14, top: 16, bottom: 30 };
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

    const pointsFor = (key) =>
        data.map((d, i) => ({
            x: padding.left + i * xStep,
            y: yFor(Number(d[key]) || 0),
        }));

    return (
        <div className="relative mt-[10px]">
            <div className="flex gap-[14px] items-center mb-[10px]">
                {series.map((s) => (
                    <div key={s.key} className="flex items-center gap-[6px] text-[12px] text-[#6B7280] font-semibold">
                        <span className="w-[10px] h-[10px] rounded-full inline-block" style={{ backgroundColor: s.color }} />
                        {s.label}
                    </div>
                ))}
                <div className="ml-auto text-[11px] text-[#9CA3AF] font-semibold">Hover points to see details</div>
            </div>

            <svg className="w-full h-[240px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {yTicks.map((t) => {
                    const y = yFor(t);
                    return (
                        <g key={t}>
                            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke={t === 0 ? '#E5E7EB' : '#F3F4F6'} strokeDasharray={t === 0 ? '0' : '4 4'} />
                            <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{t}{yTickSuffix}</text>
                        </g>
                    );
                })}
                <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="#E5E7EB" />
                <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#E5E7EB" />

                {series.map((s) => (
                    <path
                        key={s.key}
                        d={getSplinePath(pointsFor(s.key))}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.6"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                {data.map((d, i) => {
                    const x = padding.left + i * xStep;
                    return (
                        <g key={d.label}>
                            {series.map((s) => {
                                const rawTooltipVal = s.tooltipKey ? (Number(d[s.tooltipKey]) || 0) : (Number(d[s.key]) || 0);
                                const displayedVal = Number(d[s.key]) || 0;
                                const y = yFor(displayedVal);
                                return (
                                    <circle
                                        key={s.key}
                                        cx={x}
                                        cy={y}
                                        r="6"
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
                                                    Value: s.tooltipFormatter ? s.tooltipFormatter(rawTooltipVal) : String(rawTooltipVal),
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
                                        ...(s.meta ?? {}),
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

const LiveZoneMapPreview = ({ zones }) => {
    const [tip, setTip] = useState(null);

    const items = useMemo(() => {
        const seedFrom = (str) => {
            let h = 2166136261;
            for (let i = 0; i < str.length; i += 1) {
                h ^= str.charCodeAt(i);
                h = Math.imul(h, 16777619);
            }
            return (h >>> 0);
        };
        const toPct = (n, min, max) => min + (n % 1000) / 1000 * (max - min);

        return zones.map((z) => {
            const seed = seedFrom(z.id);
            const top = toPct(seed, 18, 68);
            const left = toPct(seed * 31, 18, 78);
            const r = toPct(seed * 17, 26, 62);
            return { ...z, top, left, r };
        });
    }, [zones]);

    return (
        <div className="h-[220px] bg-[#E5E7EB] rounded-[12px] relative border border-[#D1D5DB] overflow-hidden">
            <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#9CA3AF_1px,transparent_1px)] bg-[size:22px_22px]" />

            <div className="absolute left-[12px] top-[12px] bg-white/80 backdrop-blur-sm border border-white/40 rounded-[10px] px-[10px] py-[6px] text-[12px] font-extrabold text-slate-800">
                Active zones: {zones.filter((z) => z.status === 'ACTIVE').length}
            </div>

            {items.slice(0, 8).map((z) => (
                <div key={z.id}>
                    <div
                        className="absolute rounded-full cursor-pointer transition-[transform,opacity] duration-150 hover:opacity-90 hover:scale-[1.02]"
                        style={{
                            top: `${z.top}%`,
                            left: `${z.left}%`,
                            width: `${z.r}px`,
                            height: `${z.r}px`,
                            backgroundColor: `${getSeverityColor(z.severity)}25`,
                            border: `2px solid ${getSeverityColor(z.severity)}`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                            if (!rect) return;
                            setTip({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                                title: z.name,
                                color: getSeverityColor(z.severity),
                                lines: {
                                    Severity: z.severity,
                                    Type: z.type,
                                    Affected: z.affected,
                                    Status: z.status,
                                },
                            });
                        }}
                        onMouseLeave={() => setTip(null)}
                    />
                    <div
                        className="absolute w-[10px] h-[10px] rounded-full border-[2px] border-white"
                        style={{
                            top: `${z.top}%`,
                            left: `${z.left}%`,
                            backgroundColor: getSeverityColor(z.severity),
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>
            ))}

            {tip && (
                <div className="absolute inset-0 pointer-events-none">
                    <Tooltip x={tip.x} y={tip.y} title={tip.title} color={tip.color} lines={tip.lines} />
                </div>
            )}
        </div>
    );
};

function parseCoordinates(location) {
  const coords = location?.coordinates;
  if (Array.isArray(coords) && coords.length >= 2) {
    return [Number(coords[0]) || 0, Number(coords[1]) || 0];
  }
  if (typeof coords === 'string') {
    const parts = coords.trim().split(/[\s,]+/).map(Number);
    if (parts.length >= 2 && parts.every(Number.isFinite)) {
      return [parts[0], parts[1]];
    }
  }
  return [0, 0];
}


function estimateAffectedCount(incident) {
  const verified = incident.verified_by?.length || 0;
  const inaccurate = incident.reported_inaccurate_by?.length || 0;
  const base = 50;
  return Math.max(10, base + verified * 75 - inaccurate * 25);
}

function buildActiveTrend7d(zones = []) {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      active: 0,
      affected: 0,
      affectedScaled: 0,
    };
  });

  zones.forEach((zone) => {
    if (!zone.timestamp) return;
    const date = new Date(zone.timestamp);
    const day = days.find(
      (item) =>
        item.label === date.toLocaleDateString('en-US', { weekday: 'short' })
    );
    if (!day) return;
    if (zone.status === 'ACTIVE') day.active += 1;
    day.affected += zone.affectedCount || 0;
  });

  const maxAffected = Math.max(...days.map((d) => d.affected), 1);
  const maxActive = Math.max(...days.map((d) => d.active), 1);
  const scaleBase = Math.max(maxAffected, maxActive, 1);

  days.forEach((d) => {
    d.affectedScaled =
      Math.round((d.affected / scaleBase) * Math.max(maxActive, 4) * 10) / 10;
  });

  return days;
}

export default AdminDangerZoneScreen;