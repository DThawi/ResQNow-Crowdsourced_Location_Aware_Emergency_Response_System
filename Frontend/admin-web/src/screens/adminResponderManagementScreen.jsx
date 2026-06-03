import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Edit2, UserX, X, Check, AlertCircle, Building, Clock, FileText, CheckCircle
} from 'lucide-react';

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
  const [responders, setResponders] = useState([
    { id: 'R001', name: 'John Martinez', email: 'john.m@resqnow.com', phone: '+1234567890', department: 'Fire Department', status: 'active', currentAssignment: 'INC-001' },
    { id: 'R002', name: 'Sarah Chen', email: 'sarah.c@resqnow.com', phone: '+1234567891', department: 'Medical', status: 'active', currentAssignment: '—' },
    { id: 'R003', name: 'Mike Johnson', email: 'mike.j@resqnow.com', phone: '+1234567892', department: 'Police', status: 'active', currentAssignment: 'INC-003' },
    { id: 'R004', name: 'Emily Davis', email: 'emily.d@resqnow.com', phone: '+1234567893', department: 'Fire Department', status: 'inactive', currentAssignment: '—' },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { 
      id: 'REQ-201', 
      name: 'Kavinda Bandara', 
      email: 'kavinda.b@resqnow.com', 
      phone: '+94765432109', 
      department: 'Medical', 
      organization: 'Volunteer Rescue Corps', 
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      uploadedRecords: {
        licenseId: "MED-SRI-8842-X",
        expiryDate: "2029-12-31",
        fileName: "Medical_Practice_Certificate.pdf",
        fileSize: "2.4 MB"
      }
    },
    { 
      id: 'REQ-202', 
      name: 'Suresh Perera', 
      email: 'suresh.p@fire.lk', 
      phone: '+94711223344', 
      department: 'Fire Department', 
      organization: 'Sabaragamuwa Fire Station B', 
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      uploadedRecords: {
        licenseId: "FIRE-SAB-1102-A",
        expiryDate: "2031-05-15",
        fileName: "Firefighting_Advanced_Verification.pdf",
        fileSize: "4.1 MB"
      }
    },
  ]);

  const [newResponder, setNewResponder] = useState({
    name: '', email: '', phone: '', department: 'Medical', status: 'active'
  });

  // --- ACTIONS & OPERATIONS ---
  const handleAddManualResponder = () => {
    if (!newResponder.name || !newResponder.email) return;
    
    const formattedUnit = {
      id: `R00${responders.length + 1}`,
      name: newResponder.name,
      email: newResponder.email,
      phone: newResponder.phone || '—',
      department: newResponder.department,
      status: newResponder.status,
      currentAssignment: '—'
    };

    setResponders([...responders, formattedUnit]);
    setAddModalOpen(false);
    setNewResponder({ name: '', email: '', phone: '', department: 'Medical', status: 'active' });
    
    // Set custom text and open the minimalist pop-up screen
    setSuccessMessage({
      title: 'User Added!',
      sub: 'The system has been updated successfully.'
    });
    setSuccessModalOpen(true);
  };

  const handleUpdateResponder = () => {
    setResponders(responders.map(r => r.id === selectedResponder.id ? selectedResponder : r));
    setEditModalOpen(false);
    setSuccessMessage({
      title: 'Profile Updated!',
      sub: 'Responder configurations saved successfully.'
    });
    setSuccessModalOpen(true);
  };

  const handleApproveRequest = (request) => {
    const approvedUnit = {
      id: `R00${responders.length + 1}`,
      name: request.name,
      email: request.email,
      phone: request.phone,
      department: request.department,
      status: 'active',
      currentAssignment: '—'
    };
    
    setResponders([...responders, approvedUnit]);
    setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
    setSuccessMessage({
      title: 'Request Approved!',
      sub: 'The responder account has been verified and added to the fleet.'
    });
    setSuccessModalOpen(true);
  };

  const handleRejectRequest = (id) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== id));
    setSuccessMessage({
      title: 'Request Declined',
      sub: 'The application request has been removed from the queue.'
    });
    setSuccessModalOpen(true);
  };

  const handleDeleteActiveResponder = (id) => {
    setResponders(responders.filter(r => r.id !== id));
    setSuccessMessage({
      title: 'Unit Removed',
      sub: 'The responder has been removed from active system records.'
    });
    setSuccessModalOpen(true);
  };

  // --- FILTER SCHEMES ---
  const filteredResponders = responders.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredPending = pendingRequests.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All Departments' || p.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-1 animate-[fadeIn_0.2s_ease-out] w-full bg-[#FAFAFB]">
      
      {/* 1. TOP TITLE HEADER SLAT */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* CHANGED: Removed second redundant Responder Management heading and placed context sub-header */}
          <h2 className="text-[26px] font-[900] text-[#1E293B] tracking-tight m-0">Fleet Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage emergency response team members and app registration flows</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="bg-[#D62828] text-white py-2.5 px-5 rounded-xl font-bold text-sm shadow-sm hover:bg-red-700 transition-all flex items-center gap-2 border-none cursor-pointer"
        >
          <Plus size={18} /> Add New Responder
        </button>
      </div>

      {/* 2. TAB TOGGLE NAVIGATION CONTROLLER */}
      <div className="flex border-b border-[#E2E8F0] mb-6 gap-6">
        <button 
          onClick={() => { setActiveTab('fleet'); setSearchTerm(''); }}
          className={`pb-3 text-sm font-bold border-0 bg-transparent cursor-pointer relative transition-all ${
            activeTab === 'fleet' ? 'text-[#D62828]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Fleet ({responders.length})
          {activeTab === 'fleet' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D62828] rounded-full" />}
        </button>
        <button 
          onClick={() => { setActiveTab('pending'); setSearchTerm(''); }}
          className={`pb-3 text-sm font-bold border-0 bg-transparent cursor-pointer relative transition-all flex items-center gap-2 ${
            activeTab === 'pending' ? 'text-[#D62828]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Pending Approvals
          {pendingRequests.length > 0 && (
            <span className="bg-red-100 text-red-600 text-[11px] px-2 py-0.5 rounded-full font-black">
              {pendingRequests.length}
            </span>
          )}
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D62828] rounded-full" />}
        </button>
      </div>

      {/* SUB-HEADER CONTEXT DISPLAY */}
      <div className="mb-4">
        <h3 className="text-base font-[800] text-slate-700 m-0">
          {activeTab === 'fleet' ? 'Fleet Overview' : 'Registration Requests'}
        </h3>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-[16px] border border-[#E2E8F0] shadow-sm mb-6 flex gap-4 items-center">
        <div className="relative w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'fleet' ? "Search by responder name or ID..." : "Search pending by name or organization..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 border border-[#E2E8F0] rounded-xl outline-none text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-red-400 transition-colors"
          />
        </div>

        <select 
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="p-2.5 min-w-[180px] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-600 bg-white cursor-pointer outline-none focus:border-red-400"
        >
          <option>All Departments</option>
          <option>Medical</option>
          <option>Fire Department</option>
          <option>Police</option>
        </select>
      </div>

      {/* 4. CONTENT TABLES CONTAINER */}
      {activeTab === 'fleet' ? (
        /* --- ACTIVE FLEET VIEW --- */
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Responder ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignment</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredResponders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-sm font-medium text-slate-400">No active fleet entities found.</td>
                  </tr>
                ) : (
                  filteredResponders.map((responder) => (
                    <tr key={responder.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 text-sm font-bold text-slate-800">{responder.id}</td>
                      <td className="p-4 text-sm font-bold text-slate-700">{responder.name}</td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-600">{responder.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{responder.phone}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{responder.department}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
                          responder.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {responder.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-500">{responder.currentAssignment}</td>
                      {/* FIXED ACTIONS: Fully functional row event callbacks */}
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedResponder(responder); setViewModalOpen(true); }} className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-0 cursor-pointer transition-colors"><Eye size={16} /></button>
                          <button onClick={() => { setSelectedResponder({ ...responder }); setEditModalOpen(true); }} className="text-blue-500 hover:text-blue-700 p-1 bg-transparent border-0 cursor-pointer transition-colors"><Edit2 size={15} /></button>
                          <button onClick={() => handleDeleteActiveResponder(responder.id)} className="text-red-500 hover:text-red-700 p-1 bg-transparent border-0 cursor-pointer transition-colors"><UserX size={16} /></button>
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
        /* --- PENDING VERIFICATIONS VIEW --- */
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Request ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deployment Target</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Affiliated Agency</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-40">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-sm font-medium text-slate-400">No pending verification entries found.</td>
                  </tr>
                ) : (
                  filteredPending.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-amber-500" /> {req.id}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-700">
                        {req.name}
                        {/* VIEW DOCUMENT POINTER: Safe inline action bridge */}
                        <div className="mt-1">
                          <button 
                            onClick={() => { setSelectedRequest(req); setDocsModalOpen(true); }}
                            className="bg-transparent border-0 p-0 text-xs text-[#D62828] hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileText size={12} /> View Uploaded Records
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-600">{req.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{req.phone}</div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-600">{req.department}</td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Building size={14} className="text-slate-400" /> {req.organization}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-400">
                        {/* RESPONSIVE TIME MATRIX: Fully dynamic data loop integration */}
                        <div className="flex items-center gap-1 text-slate-500 font-medium">
                          <Clock size={13} className="text-slate-400" /> {formatRelativeTime(req.timestamp)}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleApproveRequest(req)}
                            className="bg-green-500 hover:bg-green-600 text-white border-0 py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition-all"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(req.id)}
                            className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 py-1.5 px-2.5 rounded-lg font-bold text-xs cursor-pointer transition-all"
                          >
                            Deny
                          </button>
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

      {/* ========================================================================= */}
      {/* OVERHAULED STYLING: POPUP DIALOGS MATCHING THE PILL/ROUNDED MINI SCHEMA */}
      {/* ========================================================================= */}

      {/* A. MANUAL REGISTRATION DIALOG MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000] animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white w-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-[800] text-base text-slate-800">Register New Responder Account</h3>
              <X onClick={() => setAddModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" size={20} />
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Capt. John Martinez" 
                  value={newResponder.name} 
                  onChange={e => setNewResponder({...newResponder, name: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 box-border outline-none text-sm font-medium focus:border-red-400 transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@resqnow.com" 
                  value={newResponder.email} 
                  onChange={e => setNewResponder({...newResponder, email: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 box-border outline-none text-sm font-medium focus:border-red-400 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+1234567890" 
                  value={newResponder.phone} 
                  onChange={e => setNewResponder({...newResponder, phone: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 box-border outline-none text-sm font-medium focus:border-red-400 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Department</label>
                <select 
                  value={newResponder.department} 
                  onChange={e => setNewResponder({...newResponder, department: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 box-border outline-none bg-white text-sm font-semibold text-slate-700 cursor-pointer focus:border-red-400"
                >
                  <option>Medical</option>
                  <option>Fire Department</option>
                  <option>Police</option>
                </select>
              </div>

              <button 
                onClick={handleAddManualResponder} 
                className="w-full py-3 bg-[#D62828] text-white border-none rounded-xl font-bold text-sm cursor-pointer mt-2 hover:bg-red-700 shadow-sm transition-all"
              >
                Create Account Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. DYNAMIC TIMED SUCCESS DIALOG POPUP OVERLAY */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center z-[20000] animate-[fadeIn_0.12s_ease-out]">
          {/* OVERHAULED STYLE: Rounded-32 configuration mapping image matrix */}
          <div className="bg-white w-[420px] rounded-[32px] p-8 text-center shadow-2xl border border-slate-100 flex flex-col items-center justify-center">
            {/* Pill-Icon Frame Container */}
            <div className="w-24 h-24 bg-[#E8FBF2] text-[#10B981] rounded-full flex justify-center items-center mb-6">
              <Check size={44} strokeWidth={3} />
            </div>
            
            {/* Dynamic Slat Headers */}
            <h3 className="text-[22px] font-[900] text-slate-800 tracking-tight m-0">{successMessage.title}</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 mb-6 max-w-[280px] leading-relaxed">{successMessage.sub}</p>
            
            {/* Countdown Indicator Text */}
            <span className="text-xs font-bold text-slate-400/80 tracking-wide block">
              Closing in {countdown}s...
            </span>
          </div>
        </div>
      )}

      {/* C. ACTIVE FLEET ROW PROFILE VIEW CARD */}
      {viewModalOpen && selectedResponder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000]">
          <div className="bg-white w-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-[800] text-base text-slate-800">Responder Profile Card</h3>
              <X onClick={() => setViewModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" size={20} />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">System Identification Token</span>
                <div className="text-base font-bold text-slate-800 mt-0.5 font-mono">{selectedResponder.id}</div>
              </div>
              <div className="flex flex-col gap-2 pl-1">
                <div className="text-lg font-black text-slate-800">{selectedResponder.name}</div>
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-1">Department: <span className="text-[#D62828] font-bold">{selectedResponder.department}</span></div>
                <div className="text-sm font-medium text-slate-500 mt-1">Email: {selectedResponder.email}</div>
                <div className="text-sm font-medium text-slate-500">Contact Number: {selectedResponder.phone}</div>
                <div className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                  Current Operational Task: 
                  <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${selectedResponder.currentAssignment !== '—' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-400'}`}>
                    {selectedResponder.currentAssignment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. ACTIVE FLEET PROFILE META FIELD EDIT MODAL */}
      {editModalOpen && selectedResponder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000]">
          <div className="bg-white w-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-[800] text-base text-slate-800">Edit Operational Metrics</h3>
              <X onClick={() => setEditModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" size={20} />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Responder Name</label>
                <input 
                  type="text" 
                  value={selectedResponder.name} 
                  onChange={e => setSelectedResponder({...selectedResponder, name: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-red-400" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">Department Assignment</label>
                <select 
                  value={selectedResponder.department} 
                  onChange={e => setSelectedResponder({...selectedResponder, department: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer outline-none focus:border-red-400"
                >
                  <option>Medical</option>
                  <option>Fire Department</option>
                  <option>Police</option>
                </select>
              </div>
              <button 
                onClick={handleUpdateResponder} 
                className="w-full py-3 bg-slate-900 hover:bg-black text-white border-none rounded-xl font-bold text-sm cursor-pointer mt-2 shadow-sm transition-all"
              >
                Save Operational Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E. PENDING REGISTRATION VERIFICATION RECORDS ATTACHMENTS VIEWER */}
      {docsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-[10000] animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white w-[480px] rounded-[32px] overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="m-0 font-[800] text-base text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-[#D62828]" /> Credentials & Verification Records
              </h3>
              <X onClick={() => setDocsModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" size={20} />
            </div>
            <div className="p-6 flex flex-col gap-4 bg-white">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant Frame Context</div>
                <div className="text-base font-bold text-slate-800 mt-1">{selectedRequest.name}</div>
                <div className="text-sm font-semibold text-slate-500 mt-0.5">{selectedRequest.organization}</div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-0.5">Verification Metadata Keys</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">LICENSE ID NUMBER</span>
                    <span className="font-mono font-bold text-slate-700 mt-0.5 block">{selectedRequest.uploadedRecords.licenseId}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">EXPIRY DATE VALUE</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{selectedRequest.uploadedRecords.expiryDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-0.5">Attached Cryptographic Payload</div>
                <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-red-50 text-[#D62828] rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700 truncate w-56">{selectedRequest.uploadedRecords.fileName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{selectedRequest.uploadedRecords.fileSize}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded font-black uppercase tracking-wider">Secure PDF</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => { handleApproveRequest(selectedRequest); setDocsModalOpen(false); }}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white border-0 rounded-xl font-bold text-sm cursor-pointer transition-all shadow-xs"
                >
                  Approve Verification
                </button>
                <button 
                  onClick={() => handleRejectRequest(selectedRequest.id)}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-sm cursor-pointer transition-all"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResponderManagementScreen;
