import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, MapPin, Clock, ShieldCheck, XCircle, Image as ImageIcon, X
} from 'lucide-react';

const AdminVerificationCenterScreen = () => {
  // --- MOCK DATA STATE ---
  const [reports, setReports] = useState([
    { id: 'REP-8492', title: 'Large Brush Fire', type: 'Fire', location: 'Route 66, Mile Marker 42', time: '2 mins ago', verifications: 7, requiredVerifications: 10, reporter: 'Alice J.', description: 'Seeing thick black smoke coming from the dry brush near the highway.', status: 'pending' },
    { id: 'REP-8493', title: 'Multi-Car Collision', type: 'Accident', location: 'Downtown Intersection, 5th Ave', time: '5 mins ago', verifications: 3, requiredVerifications: 5, reporter: 'David L.', description: 'Three cars involved. Looks like one person is trapped.', status: 'pending' },
    { id: 'REP-8494', title: 'Suspicious Activity', type: 'Security', location: 'Central Park South', time: '12 mins ago', verifications: 1, requiredVerifications: 3, reporter: 'Anonymous', description: 'Someone is trying to force open the gates of the closed facility.', status: 'pending' },
  ]);

  const [selectedReportId, setSelectedReportId] = useState('REP-8492');

  // --- MODAL STATE ---
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('verify'); 
  const [countdown, setCountdown] = useState(5); 

  const selectedReport = reports.find(r => r.id === selectedReportId);

  // --- ACTION SEQUENCER ---
  const closeAndRemoveReport = () => {
    setFeedbackModalOpen(false);
    setReports((prevReports) => {
        const updatedReports = prevReports.filter(r => r.id !== selectedReportId);
        if (updatedReports.length > 0) setSelectedReportId(updatedReports[0].id);
        else setSelectedReportId(null);
        return updatedReports;
    });
  };

  useEffect(() => {
    let timer;
    let interval;
    if (feedbackModalOpen) {
      setCountdown(5); // 5-second countdown for smoother UX
      interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      timer = setTimeout(() => { closeAndRemoveReport(); }, 5000); 
    }
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [feedbackModalOpen, selectedReportId]);

  const handleAction = (type) => {
      setFeedbackType(type);
      setFeedbackModalOpen(true);
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex gap-[25px] h-[calc(100vh-150px)]">
          
          {/* LEFT PANE: INCOMING REPORTS */}
          <div className="w-[400px] flex flex-col shrink-0">
              <div className="mb-[20px]">
                <h2 className="m-0 mb-[5px] text-[24px] text-[#1E293B] font-extrabold">Incoming Reports</h2>
                <p className="m-0 text-[#64748B] text-[14px]">Awaiting system threshold or manual review</p>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-[15px] pr-[10px]">
                  {reports.map((report) => {
                      const progress = (report.verifications / report.requiredVerifications) * 100;
                      const isSelected = selectedReportId === report.id;
                      
                      return (
                          <div 
                              key={report.id} 
                              onClick={() => setSelectedReportId(report.id)}
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
                                      <h3 className="m-0 mt-[5px] text-[16px] text-[#1E293B] font-extrabold">{report.title}</h3>
                                  </div>
                                  <span className="text-[12px] text-[#94A3B8] font-semibold">{report.time}</span>
                              </div>
                              <div className="flex items-center gap-[6px] text-[#64748B] text-[12px] mb-[15px]">
                                  <MapPin size={14} /> {report.location}
                              </div>

                              <div>
                                  <div className="flex justify-between text-[11px] text-[#475569] font-extrabold mb-[6px]">
                                      <span>Verifications</span>
                                      <span>{report.verifications} / {report.requiredVerifications}</span>
                                  </div>
                                  <div className="w-full h-[8px] bg-[#F1F5F9] rounded-[10px] overflow-hidden">
                                      <div 
                                        className={`h-full rounded-[10px] transition-all duration-500 ease-in-out ${progress >= 70 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                                        style={{ width: `${progress}%` }}
                                      ></div>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* RIGHT PANE: REVIEW TERMINAL */}
          <div className="flex-1 bg-white rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col overflow-hidden">
              {selectedReport ? (
                  <>
                      <div className="p-[30px] border-b border-[#F1F5F9] flex justify-between items-start bg-[#F8FAFC]">
                          <div>
                              <h2 className="m-0 text-[28px] text-[#1E293B] font-[900]">{selectedReport.title}</h2>
                              <div className="flex gap-[15px] text-[#64748B] text-[14px] mt-[5px]">
                                  <span className="flex items-center gap-[6px]"><MapPin size={18} /> {selectedReport.location}</span>
                                  <span className="flex items-center gap-[6px]"><Clock size={18} /> Reported {selectedReport.time}</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="m-0 text-[12px] text-[#94A3B8] font-bold">REPORT ID</p>
                              <p className="m-0 text-[18px] font-[900] text-[#1E293B]">{selectedReport.id}</p>
                          </div>
                      </div>

                      <div className="flex-1 p-[30px] overflow-y-auto">
                          <div className="w-full h-[320px] bg-[#F1F5F9] rounded-[20px] mb-[30px] flex flex-col justify-center items-center text-[#94A3B8] border border-dashed border-[#CBD5E1]">
                              <ImageIcon size={48} className="text-[#CBD5E1]" />
                              <span className="text-[14px] font-bold mt-[10px]">Citizen Photo / Video Feed</span>
                          </div>

                          <div className="flex gap-[30px]">
                              <div className="flex-[2]">
                                  <h3 className="text-[14px] text-[#94A3B8] font-extrabold uppercase mb-[12px] tracking-[1px]">Incident Description</h3>
                                  <div className="text-[16px] text-[#1E293B] leading-[1.6] bg-[#F8FAFC] p-[20px] rounded-[15px] border border-[#E2E8F0] font-medium">
                                      "{selectedReport.description}"
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <h3 className="text-[14px] text-[#94A3B8] font-extrabold uppercase mb-[12px] tracking-[1px]">Reporter Info</h3>
                                  <div className="bg-[#F8FAFC] p-[20px] rounded-[15px] border border-[#E2E8F0]">
                                      <p className="m-0 mb-[12px] text-[14px]"><strong>Primary:</strong> {selectedReport.reporter}</p>
                                      <div className="border-t border-[#E2E8F0] pt-[10px]">
                                          <p className="m-0 text-[12px] text-[#64748B]">Trust Score</p>
                                          <p className="m-0 text-[14px] font-extrabold text-[#10B981]">High (92%)</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="p-[25px_30px] border-t border-[#F1F5F9] flex justify-between items-center">
                          <button 
                            onClick={() => handleAction('reject')} 
                            className="px-[25px] py-[15px] rounded-[12px] border-[1.5px] border-[#FDA4AF] bg-white text-[#E11D48] font-extrabold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-50 transition-colors"
                          >
                              <XCircle size={20} /> Reject as Spam
                          </button>
                          
                          <button 
                            onClick={() => handleAction('verify')} 
                            className="px-[35px] py-[15px] rounded-[12px] border-none bg-[#10B981] text-white font-extrabold text-[16px] cursor-pointer flex items-center gap-[10px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600 transition-colors"
                          >
                              <ShieldCheck size={22} /> Manually Verify Incident
                          </button>
                      </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col justify-center items-center text-[#94A3B8]">
                      <CheckCircle size={80} className="opacity-10 mb-[20px]" />
                      <h2 className="text-[#94A3B8]">Queue Empty</h2>
                      <p>All incoming reports have been processed.</p>
                  </div>
              )}
          </div>
      </div>

      {/* FEEDBACK POPUP */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[9999]">
          <div className="bg-white w-full max-w-[400px] rounded-[28px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className={`px-[25px] py-[20px] flex justify-between items-center ${feedbackType === 'verify' ? 'bg-[#F0FDF4]' : 'bg-[#FFF1F2]'}`}>
              <h3 className="m-0 text-[18px] font-[900] text-[#1E293B]">
                {feedbackType === 'verify' ? "Incident Verified" : "Report Rejected"}
              </h3>
              <X onClick={closeAndRemoveReport} className="cursor-pointer text-[#64748B] hover:text-slate-800 transition-colors" />
            </div>

            <div className="px-[30px] py-[40px] flex flex-col items-center text-center">
              <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center mb-[20px] ${feedbackType === 'verify' ? 'bg-[#DCFCE7]' : 'bg-[#FFE4E6]'}`}>
                {feedbackType === 'verify' ? <CheckCircle size={40} color="#22C55E" /> : <XCircle size={40} color="#EF4444" />}
              </div>
              <h3 className="m-0 mb-[10px] text-[20px] font-[900] text-[#1E293B]">
                {feedbackType === 'verify' ? "Success!" : "Report Removed"}
              </h3>
              <p className="m-0 text-[14px] text-[#64748B] leading-[1.6]">
                The system has been updated.<br/>Processing next report in {countdown}s...
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