import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertCircle, CheckCircle, MapPin, Clock, ShieldCheck, XCircle, Image as ImageIcon, X, RefreshCw
} from 'lucide-react';
import API from '../services/api'; // adjust path if needed

const AdminVerificationCenterScreen = () => {

  // ── State ────────────────────────────────────────────────────────────────
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('verify');
  const [countdown, setCountdown] = useState(5);

  const selectedReport = reports.find(r => r._id === selectedReportId);

  // ── Fetch pending incidents from backend ─────────────────────────────────
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/incidents?limit=50');
      // Only show Pending incidents in the verification queue
      const pending = (Array.isArray(res.data) ? res.data : [])
        .filter(i => i.status === 'Pending');
      setReports(pending);
      if (pending.length > 0) setSelectedReportId(pending[0]._id);
      else setSelectedReportId(null);
    } catch (err) {
      setError('Failed to load incidents. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // ── Countdown + auto-close modal ─────────────────────────────────────────
  const closeAndRemoveReport = useCallback(() => {
    setFeedbackModalOpen(false);
    setReports(prev => {
      const updated = prev.filter(r => r._id !== selectedReportId);
      setSelectedReportId(updated.length > 0 ? updated[0]._id : null);
      return updated;
    });
  }, [selectedReportId]);

  useEffect(() => {
    let timer, interval;
    if (feedbackModalOpen) {
      setCountdown(5);
      interval = setInterval(() => setCountdown(c => c - 1), 1000);
      timer = setTimeout(closeAndRemoveReport, 5000);
    }
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [feedbackModalOpen, closeAndRemoveReport]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAction = async (type) => {
    if (!selectedReport || actionLoading) return;
    setActionLoading(true);
    try {
      if (type === 'verify') {
        await API.patch(`/incidents/${selectedReport._id}/admin-verify`);
      } else {
        await API.delete(`/incidents/${selectedReport._id}/admin-reject`);
      }
      setFeedbackType(type);
      setFeedbackModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${type} incident`);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatCoords = (incident) => {
    if (incident?.location?.coordinates) {
      const [lng, lat] = incident.location.coordinates;
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    return 'Location unavailable';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min${diff > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(diff / 60);
    return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  };

  const getVerificationProgress = (incident) => {
    const verifications = incident.verified_by?.length || 0;
    const required = 5; // adjust to match your threshold
    return { verifications, required, progress: Math.min((verifications / required) * 100, 100) };
  };

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-slate-400">
        <RefreshCw size={40} className="animate-spin mb-4" />
        <p className="text-[16px] font-semibold">Loading incidents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-slate-400">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-[16px] font-semibold text-slate-600">{error}</p>
        <button
          onClick={fetchReports}
          className="mt-4 px-6 py-2 bg-[#D62828] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex gap-[25px] h-[calc(100vh-150px)]">

        {/* LEFT PANE: INCOMING REPORTS */}
        <div className="w-[400px] flex flex-col shrink-0">
          <div className="mb-[20px] flex justify-between items-start">
            <div>
              <h2 className="m-0 mb-[5px] text-[24px] text-[#1E293B] font-extrabold">Incoming Reports</h2>
              <p className="m-0 text-[#64748B] text-[14px]">
                {reports.length} pending • Awaiting review
              </p>
            </div>
            <button
              onClick={fetchReports}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-[15px] pr-[10px]">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <CheckCircle size={60} className="mb-3" />
                <p className="font-semibold text-slate-400">No pending reports</p>
              </div>
            ) : (
              reports.map((report) => {
                const { verifications, required, progress } = getVerificationProgress(report);
                const isSelected = selectedReportId === report._id;
                return (
                  <div
                    key={report._id}
                    onClick={() => setSelectedReportId(report._id)}
                    className={`bg-white rounded-[18px] p-[20px] cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-[2px] border-[#D62828] shadow-[0_8px_20px_rgba(214,40,40,0.1)]'
                        : 'border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between mb-[12px]">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#D62828] bg-[#FEE2E2] px-[10px] py-[4px] rounded-[8px] uppercase">
                          {report.type}
                        </span>
                        <h3 className="m-0 mt-[5px] text-[16px] text-[#1E293B] font-extrabold">
                          {report.type} Incident
                        </h3>
                      </div>
                      <span className="text-[12px] text-[#94A3B8] font-semibold">
                        {formatTime(report.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px] text-[#64748B] text-[12px] mb-[15px]">
                      <MapPin size={14} /> {formatCoords(report)}
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#475569] font-extrabold mb-[6px]">
                        <span>Citizen Verifications</span>
                        <span>{verifications} / {required}</span>
                      </div>
                      <div className="w-full h-[8px] bg-[#F1F5F9] rounded-[10px] overflow-hidden">
                        <div
                          className={`h-full rounded-[10px] transition-all duration-500 ease-in-out ${
                            progress >= 70 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: REVIEW TERMINAL */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col overflow-hidden">
          {selectedReport ? (
            <>
              {/* Header */}
              <div className="p-[30px] border-b border-[#F1F5F9] flex justify-between items-start bg-[#F8FAFC]">
                <div>
                  <h2 className="m-0 text-[28px] text-[#1E293B] font-[900]">
                    {selectedReport.type} Incident
                  </h2>
                  <div className="flex gap-[15px] text-[#64748B] text-[14px] mt-[5px]">
                    <span className="flex items-center gap-[6px]">
                      <MapPin size={18} /> {formatCoords(selectedReport)}
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <Clock size={18} /> Reported {formatTime(selectedReport.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="m-0 text-[12px] text-[#94A3B8] font-bold">INCIDENT ID</p>
                  <p className="m-0 text-[14px] font-[900] text-[#1E293B] font-mono">
                    {selectedReport._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-[30px] overflow-y-auto">
                {/* Image */}
                <div className="w-full h-[280px] bg-[#F1F5F9] rounded-[20px] mb-[30px] overflow-hidden border border-dashed border-[#CBD5E1]">
                  {selectedReport.image ? (
                    <img
                      src={selectedReport.image}
                      alt="Incident"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center text-[#94A3B8]">
                      <ImageIcon size={48} className="text-[#CBD5E1]" />
                      <span className="text-[14px] font-bold mt-[10px]">No image submitted</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-[30px]">
                  {/* Description */}
                  <div className="flex-[2]">
                    <h3 className="text-[14px] text-[#94A3B8] font-extrabold uppercase mb-[12px] tracking-[1px]">
                      Incident Description
                    </h3>
                    <div className="text-[16px] text-[#1E293B] leading-[1.6] bg-[#F8FAFC] p-[20px] rounded-[15px] border border-[#E2E8F0] font-medium">
                      "{selectedReport.description}"
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1">
                    <h3 className="text-[14px] text-[#94A3B8] font-extrabold uppercase mb-[12px] tracking-[1px]">
                      Report Stats
                    </h3>
                    <div className="bg-[#F8FAFC] p-[20px] rounded-[15px] border border-[#E2E8F0] flex flex-col gap-3">
                      <div>
                        <p className="m-0 text-[12px] text-[#64748B]">Citizen Verifications</p>
                        <p className="m-0 text-[16px] font-extrabold text-[#10B981]">
                          {selectedReport.verified_by?.length || 0}
                        </p>
                      </div>
                      <div className="border-t border-[#E2E8F0] pt-3">
                        <p className="m-0 text-[12px] text-[#64748B]">Marked Inaccurate</p>
                        <p className="m-0 text-[16px] font-extrabold text-[#F59E0B]">
                          {selectedReport.reported_inaccurate_by?.length || 0}
                        </p>
                      </div>
                      <div className="border-t border-[#E2E8F0] pt-3">
                        <p className="m-0 text-[12px] text-[#64748B]">Status</p>
                        <p className="m-0 text-[14px] font-extrabold text-[#D62828]">
                          {selectedReport.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-[25px_30px] border-t border-[#F1F5F9] flex justify-between items-center">
                <button
                  onClick={() => handleAction('reject')}
                  disabled={actionLoading}
                  className="px-[25px] py-[15px] rounded-[12px] border-[1.5px] border-[#FDA4AF] bg-white text-[#E11D48] font-extrabold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle size={20} /> Reject as Spam
                </button>

                <button
                  onClick={() => handleAction('verify')}
                  disabled={actionLoading}
                  className="px-[35px] py-[15px] rounded-[12px] border-none bg-[#10B981] text-white font-extrabold text-[16px] cursor-pointer flex items-center gap-[10px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <ShieldCheck size={22} />
                  {actionLoading ? 'Processing...' : 'Manually Verify Incident'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-[#94A3B8]">
              <CheckCircle size={80} className="opacity-10 mb-[20px]" />
              <h2 className="text-[#94A3B8]">Queue Empty</h2>
              <p>All incoming reports have been processed.</p>
              <button
                onClick={fetchReports}
                className="mt-4 px-6 py-2 bg-[#D62828] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[9999]">
          <div className="bg-white w-full max-w-[400px] rounded-[28px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className={`px-[25px] py-[20px] flex justify-between items-center ${feedbackType === 'verify' ? 'bg-[#F0FDF4]' : 'bg-[#FFF1F2]'}`}>
              <h3 className="m-0 text-[18px] font-[900] text-[#1E293B]">
                {feedbackType === 'verify' ? 'Incident Verified' : 'Report Rejected'}
              </h3>
              <X onClick={closeAndRemoveReport} className="cursor-pointer text-[#64748B] hover:text-slate-800 transition-colors" />
            </div>
            <div className="px-[30px] py-[40px] flex flex-col items-center text-center">
              <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center mb-[20px] ${feedbackType === 'verify' ? 'bg-[#DCFCE7]' : 'bg-[#FFE4E6]'}`}>
                {feedbackType === 'verify'
                  ? <CheckCircle size={40} color="#22C55E" />
                  : <XCircle size={40} color="#EF4444" />
                }
              </div>
              <h3 className="m-0 mb-[10px] text-[20px] font-[900] text-[#1E293B]">
                {feedbackType === 'verify' ? 'Success!' : 'Report Removed'}
              </h3>
              <p className="m-0 text-[14px] text-[#64748B] leading-[1.6]">
                The system has been updated.<br />
                Processing next report in {countdown}s...
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AdminVerificationCenterScreen;