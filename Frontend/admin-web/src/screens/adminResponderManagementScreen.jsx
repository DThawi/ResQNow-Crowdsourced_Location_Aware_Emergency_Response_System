import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Eye, Edit2, UserX, X, Check, AlertCircle, Building, Clock, FileText, CheckCircle, ExternalLink
} from 'lucide-react';
import API from '../services/api';

const AdminResponderManagementScreen = () => {
  // --- NAVIGATION & VIEW TABS ---
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' or 'pending'
  
  // --- SEARCH & FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  
  // --- MODAL TOGGLE CONTROLLERS ---
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', sub: '' });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  
  // --- AUTO-CLOSE TIMER STATE ---
  const [countdown, setCountdown] = useState(3);

  // --- SELECTION TARGET POINTERS ---
  const [selectedResponder, setSelectedResponder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // --- RESPONSIVE DYNAMIC RELATIVE TIME HELPER ---
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  // --- AUTO-CLOSE EFFECT FOR SUCCESS DIALOG ---
  useEffect(() => {
    let timer;
    if (successModalOpen) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSuccessModalOpen(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [successModalOpen]);

  // --- DATA MANAGEMENT ---
  const [responders, setResponders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newResponder, setNewResponder] = useState({
    name: '', email: '', password: '', phone: '', department: 'Medical', district: '', status: 'Active'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [respondersRes, incidentsRes] = await Promise.all([
        API.get('/admin/responders'),
        API.get('/incidents?limit=100').catch(() => ({ data: [] }))
      ]);

      const activeIncidents = Array.isArray(incidentsRes.data)
        ? incidentsRes.data
        : incidentsRes.data?.incidents || [];

      const allResponders = respondersRes.data.map(r => {
        const assignmentIncident = activeIncidents.find(inc => 
          Array.isArray(inc.assignedAuthorities) && inc.assignedAuthorities.includes(r._id) && inc.status !== 'Resolved'
        );
        const currentAssignment = assignmentIncident 
          ? assignmentIncident.type || assignmentIncident._id.slice(-8).toUpperCase()
          : '—';

        const cleanOrganization = r.organization ? r.organization.trim() : 'Emergency Services';
        const cleanDistrict = r.district ? r.district.trim() : '';

        return {
          id: r._id,
          name: r.name ? r.name.trim() : 'Anonymous User',
          email: r.email,
          phone: r.contact_number || '',
          department: cleanOrganization, 
          organization: cleanOrganization, 
          district: cleanDistrict,
          status: r.status || 'Pending',
          currentAssignment,
          isVerified: r.isVerified,
          registered_date: r.registered_date || r.createdAt,
          documents: r.documents || { officialIdPath: null, authLetterPath: null, certCardsPath: null }
        };
      });

      // ── 🎯 ARRANGEMENT SEGREGATION CRITERIA SAFEGUARDED NATIVELY ──
      setResponders(allResponders.filter(r => {
        const stat = r.status ? String(r.status).toLowerCase() : 'pending';
        return stat === 'approved' || stat === 'active';
      }));
      
      setPendingRequests(allResponders.filter(r => {
        const stat = r.status ? String(r.status).toLowerCase() : 'pending';
        return stat === 'pending';
      }));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch responders directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTIONS & OPERATIONS ---
  const handleAddManualResponder = async () => {
    if (!newResponder.name || !newResponder.email || !newResponder.password) {
      alert("Please fill in Name, Email, and Password.");
      return;
    }
    try {
      const payload = {
        name: newResponder.name,
        email: newResponder.email,
        password: newResponder.password,
        contact_number: newResponder.phone || '0770000000',
        organization: newResponder.department,
        district: newResponder.district || 'Kalutara',
        role: "Responder"
      };

      await API.post('/admin/users', payload);
      setAddModalOpen(false);
      setNewResponder({ name: '', email: '', password: '', phone: '', department: 'Medical', district: '', status: 'Active' });
      await fetchData();
      
      setSuccessMessage({
        title: 'User Added!',
        sub: 'The system has been updated successfully.'
      });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create responder account');
    }
  };

  const handleUpdateResponder = async () => {
    try {
      await API.put(`/admin/users/${selectedResponder.id}`, {
        name: selectedResponder.name,
        contact_number: selectedResponder.phone,
        organization: selectedResponder.department,
        district: selectedResponder.district || 'Kalutara',
        status: selectedResponder.status,
        role: "Responder"
      });

      setEditModalOpen(false);
      await fetchData();

      setSuccessMessage({
        title: 'Profile Updated!',
        sub: 'Responder configurations saved successfully.'
      });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update responder profile');
    }
  };

  const handleApproveRequest = async (request) => {
    try {
      await API.put(`/auth/approve-responder/${request.id}`);
      await fetchData();

      setSuccessMessage({
        title: 'Application Approved!',
        sub: 'Verification email link has been dispatched to the responder.'
      });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve registration request');
    }
  };

  const handleRejectRequest = async (id) => {
    if (!window.confirm("Are you sure you want to decline and reject this responder application?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      if (docsModalOpen) setDocsModalOpen(false);
      await fetchData();

      setSuccessMessage({
        title: 'Application Rejected',
        sub: 'The profile request has been removed and an update has been completed.'
      });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject registration request');
    }
  };

  const handleDeleteActiveResponder = async (id) => {
    if (!window.confirm("Are you sure you want to remove this responder from active records?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      await fetchData();

      setSuccessMessage({
        title: 'Unit Removed',
        sub: 'The responder has been removed from active system records.'
      });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove responder unit');
    }
  };

  const openDocumentSecurely = (pathString) => {
    if (!pathString) {
      alert("No attachment file uploaded for this field context.");
      return;
    }
    const targetUrl = pathString.startsWith('http') ? pathString : `http://localhost:5000/${pathString}`;
    window.open(targetUrl, '_blank');
  };

  // --- FILTER SCHEMES ---
  const filteredResponders = responders.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredPending = pendingRequests.filter((p) => {
    const nameStr = p.name ? p.name.toLowerCase() : '';
    const orgStr = p.organization ? p.organization.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase().trim();

    const matchesSearch = nameStr.includes(searchLower) || orgStr.includes(searchLower);
    const matchesDept = deptFilter === 'All Departments' || p.department === deptFilter;
    
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-slate-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D62828] mb-4"></div>
        <p className="text-[16px] font-semibold text-slate-600">Loading responders directory...</p>
      </div>
    );
  }

  return (
    <div className="p-1 animate-[fadeIn_0.2s_ease-out] w-full bg-[#FAFAFB]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[26px] font-[900] text-[#1E293B] tracking-tight m-0">Fleet Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Verify submitted credentials and evaluate deployment permissions</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="bg-[#D62828] text-white py-2.5 px-5 rounded-xl font-bold text-sm shadow-sm hover:bg-red-700 transition-all flex items-center gap-2 border-none cursor-pointer">
          <Plus size={18} /> Add New Responder
        </button>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6 gap-6">
        <button onClick={() => { setActiveTab('fleet'); setSearchTerm(''); }} className={`pb-3 text-sm font-bold border-0 bg-transparent cursor-pointer relative transition-all ${activeTab === 'fleet' ? 'text-[#D62828]' : 'text-slate-400 hover:text-slate-600'}`}>
          Active Fleet ({responders.length})
          {activeTab === 'fleet' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D62828] rounded-full" />}
        </button>
        <button onClick={() => { setActiveTab('pending'); setSearchTerm(''); }} className={`pb-3 text-sm font-bold border-0 bg-transparent cursor-pointer relative transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'text-[#D62828]' : 'text-slate-400 hover:text-slate-600'}`}>
          Pending Approvals
          {pendingRequests.length > 0 && (
            <span className="bg-red-100 text-red-600 text-[11px] px-2 py-0.5 rounded-full font-black">
              {pendingRequests.length}
            </span>
          )}
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D62828] rounded-full" />}
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-[800] text-slate-700 m-0">{activeTab === 'fleet' ? 'Fleet Overview' : 'Registration Requests Queue'}</h3>
      </div>

      <div className="bg-white p-4 rounded-[16px] border border-[#E2E8F0] shadow-sm mb-6 flex gap-4 items-center">
        <div className="relative w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input type="text" placeholder={activeTab === 'fleet' ? "Search fleet units..." : "Search incoming requests..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2.5 pl-10 pr-4 border border-[#E2E8F0] rounded-xl outline-none text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-red-400 transition-colors" />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="p-2.5 min-w-[180px] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-600 bg-white cursor-pointer outline-none focus:border-red-400">
          <option>All Departments</option>
          <option>Medical</option>
          <option>Fire Department</option>
          <option>Police</option>
        </select>
      </div>

      {activeTab === 'fleet' ? (
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Responder ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Organization/Agency</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredResponders.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-sm font-medium text-slate-400">No active responders deployed.</td></tr>
                ) : (
                  filteredResponders.map((responder) => (
                    <tr key={responder.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 text-xs font-bold font-mono text-slate-800">{responder.id}</td>
                      <td className="p-4 text-sm font-bold text-slate-700">{responder.name}</td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-600">{responder.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{responder.phone}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{responder.department}</td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{responder.district}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{responder.status}</span>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedResponder(responder); setViewModalOpen(true); }} className="text-slate-400 p-1 hover:text-slate-600 cursor-pointer bg-transparent border-none"><Eye size={16} /></button>
                          <button onClick={() => { setSelectedResponder({ ...responder }); setEditModalOpen(true); }} className="text-blue-500 p-1 hover:text-blue-700 cursor-pointer bg-transparent border-none"><Edit2 size={15} /></button>
                          <button onClick={() => handleDeleteActiveResponder(responder.id)} className="text-red-500 p-1 hover:text-red-700 cursor-pointer bg-transparent border-none"><UserX size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Request ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Affiliated Agency</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-40">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredPending.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-sm font-medium text-slate-400">No pending requests found.</td></tr>
                ) : (
                  filteredPending.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 text-xs font-bold font-mono text-slate-500 flex items-center gap-1.5"><AlertCircle size={14} className="text-amber-500" /> {req.id}</td>
                      <td className="p-4 text-sm font-bold text-slate-700">
                        {req.name}
                        <div className="mt-1">
                          <button onClick={() => { setSelectedRequest(req); setDocsModalOpen(true); }} className="bg-transparent border-0 p-0 text-xs text-[#D62828] font-bold flex items-center gap-1 cursor-pointer hover:text-red-700"><FileText size={12} /> View Onboarding Credentials</button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-600">{req.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{req.phone}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{req.district}</td>
                      <td className="p-4 text-sm font-medium text-slate-600"><div className="flex items-center gap-1.5 font-semibold text-slate-700"><Building size={14} className="text-slate-400" /> {req.organization}</div></td>
                      <td className="p-4 text-sm font-medium text-slate-400"><div className="flex items-center gap-1 text-slate-500"><Clock size={13} className="text-slate-400" /> {formatRelativeTime(req.registered_date)}</div></td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleApproveRequest(req)} className="bg-green-500 hover:bg-green-600 text-white border-none py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition-all"><Check size={13} /> Approve</button>
                          <button onClick={() => handleRejectRequest(req.id)} className="bg-slate-100 hover:bg-red-50 text-slate-500 font-bold border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-all">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP MODALS SECTION */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000] animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white w-[420px] rounded-[32px] overflow-hidden border border-[#E2E8F0]">
            <div className="p-6 border-b flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-bold text-slate-800">Manual Responder Creation</h3>
              <X onClick={() => setAddModalOpen(false)} className="cursor-pointer" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input type="text" placeholder="C Thushani" value={newResponder.name} onChange={e => setNewResponder({...newResponder, name: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                <input type="email" placeholder="name@resqnow.com" value={newResponder.email} onChange={e => setNewResponder({...newResponder, email: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Contact Phone</label>
                <input type="text" placeholder="0775533274" value={newResponder.phone} onChange={e => setNewResponder({...newResponder, phone: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                <input type="password" placeholder="••••••••" value={newResponder.password} onChange={e => setNewResponder({...newResponder, password: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">District Location</label>
                <input type="text" placeholder="Kalutara" value={newResponder.district} onChange={e => setNewResponder({...newResponder, district: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Organization Affiliation</label>
                <input type="text" placeholder="ABC Hospital" value={newResponder.department} onChange={e => setNewResponder({...newResponder, department: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none" />
              </div>
              <button onClick={handleAddManualResponder} className="w-full py-3 bg-[#D62828] font-bold text-white border-none rounded-xl cursor-pointer">Register Profile</button>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-[20000]">
          <div className="bg-white w-[420px] rounded-[32px] p-8 text-center shadow-2xl flex flex-col items-center">
            <div className="w-24 h-24 bg-[#E8FBF2] text-[#10B981] rounded-full flex justify-center items-center mb-6"><Check size={44} strokeWidth={3} /></div>
            <h3 className="text-xl font-black text-slate-800 m-0">{successMessage.title}</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 mb-6 leading-relaxed">{successMessage.sub}</p>
            <span className="text-xs font-bold text-slate-400/80 tracking-wide block">Closing in {countdown}s...</span>
          </div>
        </div>
      )}

      {docsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000] animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white w-[500px] rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="p-6 border-b flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-[#D62828]" /> Registration Evidence Review</h3>
              <X onClick={() => setDocsModalOpen(false)} className="cursor-pointer" size={20} />
            </div>
            <div className="p-6 flex flex-col gap-4 bg-white">
              <div className="bg-slate-50 p-4 rounded-xl border">
                <div className="text-xs font-bold text-slate-400 uppercase">Applicant Framework Context</div>
                <div className="text-base font-bold text-slate-800 mt-1">{selectedRequest.name}</div>
                <div className="text-sm font-semibold text-slate-500 mt-0.5">{selectedRequest.organization} ({selectedRequest.district} District)</div>
              </div>

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 pl-0.5">Uploaded Multipart Media paths</div>
              
              <div className="flex flex-col gap-2.5">
                <div className="border rounded-xl p-3 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="p-2 bg-red-50 text-[#D62828] rounded-lg"><FileText size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-400 uppercase">Official ID / Employee Badge</div>
                      <div className="text-sm font-medium text-slate-700 truncate mt-0.5">{selectedRequest.documents.officialIdPath ? "Official_ID_Attachment.jpg/pdf" : "No file attached"}</div>
                    </div>
                  </div>
                  {selectedRequest.documents.officialIdPath && (
                    <button onClick={() => openDocumentSecurely(selectedRequest.documents.officialIdPath)} className="p-2 border bg-white rounded-lg cursor-pointer text-slate-500 hover:text-[#D62828]" title="Open Link"><ExternalLink size={14} /></button>
                  )}
                </div>

                <div className="border rounded-xl p-3 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="p-2 bg-red-50 text-[#D62828] rounded-lg"><FileText size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-400 uppercase">Organization Authorization Letter</div>
                      <div className="text-sm font-medium text-slate-700 truncate mt-0.5">{selectedRequest.documents.authLetterPath ? "Authorization_Letter.jpg/pdf" : "No file attached"}</div>
                    </div>
                  </div>
                  {selectedRequest.documents.authLetterPath && (
                    <button onClick={() => openDocumentSecurely(selectedRequest.documents.authLetterPath)} className="p-2 border bg-white rounded-lg cursor-pointer text-slate-500 hover:text-[#D62828]"><ExternalLink size={14} /></button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => { handleApproveRequest(selectedRequest); setDocsModalOpen(false); }} className="flex-1 py-2.5 bg-green-500 text-white border-none font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5"><CheckCircle size={16} /> Approve application (Send Email)</button>
                <button onClick={() => handleRejectRequest(selectedRequest.id)} className="py-2.5 px-4 bg-red-50 text-red-600 font-bold border border-red-200 rounded-xl cursor-pointer hover:bg-red-100">Decline Application</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResponderManagementScreen;
