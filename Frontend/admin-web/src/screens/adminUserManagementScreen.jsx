import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Plus, Edit, Trash2, UserX, X, Shield, CheckCircle, AlertCircle, Check
} from 'lucide-react';
import API from '../services/api';

const AdminUserManagementScreen = () => {
  // --- DATA STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- UI STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // --- MODAL STATES ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [successType, setSuccessType] = useState('add'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Citizen', contact_number: '', district: '', organization: '' });
  const [countdown, setCountdown] = useState(3);

  // --- DATA FETCHING ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/admin/users');
      const formatted = res.data.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role === 'Authority' ? 'Responder' : u.role,
        status: u.status || 'Active',
        date: new Date(u.registered_date || u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        avatar: u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??',
        contact_number: u.contact_number || '',
        district: u.district || '',
        organization: u.organization || ''
      }));
      setUsers(formatted);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load system users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- TIMER FOR SUCCESS POPUP ---
  useEffect(() => {
    let timer;
    if (isSuccessModalOpen) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsSuccessModalOpen(false);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccessModalOpen]);

  // --- ACTION HANDLERS ---
  const handleEditClick = (user) => {
    setSelectedUser({ ...user }); 
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const roleMapped = selectedUser.role === 'Responder' ? 'Authority' : selectedUser.role;
      const res = await API.put(`/admin/users/${selectedUser.id}`, {
        name: selectedUser.name,
        role: roleMapped,
        status: selectedUser.status,
        contact_number: selectedUser.contact_number,
        district: selectedUser.role === 'Responder' ? selectedUser.district : undefined,
        organization: selectedUser.role === 'Responder' ? selectedUser.organization : undefined
      });
      
      setUsers(users.map(u => u.id === selectedUser.id ? {
        ...selectedUser,
        date: new Date(res.data.registered_date || res.data.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        avatar: selectedUser.name ? selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'
      } : u));
      
      setIsEditModalOpen(false);
      setSuccessType('edit');
      setIsSuccessModalOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.contact_number) {
      alert('Please fill out all required fields (Name, Email, Password, Contact Number)');
      return;
    }
    try {
      const roleMapped = newUser.role === 'Responder' ? 'Authority' : newUser.role;
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: roleMapped,
        contact_number: newUser.contact_number,
        district: newUser.role === 'Responder' ? newUser.district : undefined,
        organization: newUser.role === 'Responder' ? newUser.organization : undefined
      };
      
      const res = await API.post('/admin/users', payload);
      const createdUser = res.data;
      
      const formattedUser = {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role === 'Authority' ? 'Responder' : createdUser.role,
        status: createdUser.status || 'Active',
        date: new Date(createdUser.registered_date || createdUser.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        avatar: createdUser.name ? createdUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??',
        contact_number: createdUser.contact_number || '',
        district: createdUser.district || '',
        organization: createdUser.organization || ''
      };
      
      setUsers([formattedUser, ...users]);
      setIsAddModalOpen(false);
      setSuccessType('add');
      setIsSuccessModalOpen(true);
      setNewUser({ name: '', email: '', password: '', role: 'Citizen', contact_number: '', district: '', organization: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleStatus = async (id) => {
    const userToToggle = users.find(u => u.id === id);
    if (!userToToggle) return;
    const newStatus = userToToggle.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const roleMapped = userToToggle.role === 'Responder' ? 'Authority' : userToToggle.role;
      await API.put(`/admin/users/${id}`, {
        status: newStatus,
        role: roleMapped
      });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/admin/users/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // --- FILTERING & PAGINATION ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-slate-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D62828] mb-4"></div>
        <p className="text-[16px] font-semibold text-slate-600">Loading system users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-slate-400">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-[16px] font-semibold text-slate-600 mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-6 py-2 bg-[#D62828] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h2 className="m-0 mb-[5px] text-[24px] text-[#1E293B] font-extrabold">System Users</h2>
          <p className="m-0 text-[#64748B] text-[14px]">Manage system users, roles, and access control</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-[#D62828] text-white border-none py-[12px] px-[24px] rounded-[12px] font-extrabold text-[14px] cursor-pointer flex items-center gap-[8px] shadow-[0_4px_12px_rgba(214,40,40,0.2)] hover:bg-red-700 transition-colors"
        >
            <Plus size={18} /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <div className="p-[20px_25px] border-b border-[#F1F5F9] flex justify-between bg-[#F8FAFC]">
            <div className="flex gap-[15px] flex-1">
                <div className="relative w-[320px]">
                    <Search size={18} className="absolute left-[15px] top-[12px] text-[#94A3B8]" />
                    <input 
                      type="text" 
                      placeholder="Search by name, email, or ID..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full py-[10px] pr-[15px] pl-[45px] border border-[#E2E8F0] rounded-[10px] outline-none text-[14px] focus:border-red-400 transition-colors box-border" 
                    />
                </div>
                <div className="relative">
                    <Filter size={18} className="absolute left-[15px] top-[12px] text-[#94A3B8]" />
                    <select 
                      value={roleFilter} 
                      onChange={(e) => setRoleFilter(e.target.value)} 
                      className="appearance-none py-[10px] pr-[35px] pl-[45px] border border-[#E2E8F0] rounded-[10px] outline-none text-[14px] bg-white cursor-pointer focus:border-red-400 transition-colors box-border"
                    >
                        <option value="All Roles">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Responder">Responder</option>
                        <option value="Citizen">Citizen</option>
                    </select>
                </div>
            </div>
            <button className="bg-white border border-[#E2E8F0] py-[10px] px-[20px] rounded-[10px] text-[#475569] font-bold text-[13px] flex items-center gap-[8px] cursor-pointer hover:bg-slate-50 transition-colors">
                <Download size={16} /> Export CSV
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
            <thead>
                <tr className="border-b-[2px] border-[#F1F5F9] bg-white">
                    <th className="p-[15px_25px] w-[40px]">
                        <input type="checkbox" className="accent-[#D62828] w-[16px] h-[16px] cursor-pointer" />
                    </th>
                    <th className="p-[15px_10px] text-[#94A3B8] text-[11px] font-extrabold uppercase">User Info</th>
                    <th className="p-[15px_10px] text-[#94A3B8] text-[11px] font-extrabold uppercase">Role</th>
                    <th className="p-[15px_10px] text-[#94A3B8] text-[11px] font-extrabold uppercase">Status</th>
                    <th className="p-[15px_10px] text-[#94A3B8] text-[11px] font-extrabold uppercase">Joined</th>
                    <th className="p-[15px_25px] text-right text-[#94A3B8] text-[11px] font-extrabold uppercase">Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#F1F5F9] transition-colors duration-200 hover:bg-slate-50">
                        <td className="p-[15px_25px]">
                            <input 
                              type="checkbox" 
                              checked={selectedUserIds.includes(user.id)} 
                              onChange={() => toggleSelectUser(user.id)} 
                              className="accent-[#D62828] w-[16px] h-[16px] cursor-pointer" 
                            />
                        </td>
                        <td className="p-[15px_10px]">
                            <div className="flex items-center gap-[12px]">
                                <div className="w-[36px] h-[36px] rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center font-bold text-[12px]">
                                    {user.avatar}
                                </div>
                                <div>
                                    <div className="text-[14px] text-[#1E293B] font-bold">{user.name} <span className="text-[#94A3B8] font-normal">({user.id})</span></div>
                                    <div className="text-[12px] text-[#64748B]">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-[15px_10px]"><RoleBadge role={user.role} /></td>
                        <td className="p-[15px_10px]"><StatusBadge status={user.status} /></td>
                        <td className="p-[15px_10px] text-[13px] text-[#64748B]">{user.date}</td>
                        <td className="p-[15px_25px] text-right">
                            <div className="flex justify-end gap-[10px]">
                                <button onClick={() => handleEditClick(user)} className="border-none bg-transparent cursor-pointer text-[#94A3B8] p-[6px] hover:text-[#3B82F6] transition-colors" title="Edit">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => toggleStatus(user.id)} className={`border-none bg-transparent cursor-pointer p-[6px] transition-colors ${user.status === 'Active' ? 'text-[#F59E0B] hover:text-amber-600' : 'text-[#10B981] hover:text-emerald-600'}`}>
                                    {user.status === 'Active' ? <UserX size={16} /> : <CheckCircle size={16} />}
                                </button>
                                <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="border-none bg-transparent cursor-pointer text-[#EF4444] p-[6px] hover:text-red-700 transition-colors" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="p-[15px_25px] border-t border-[#F1F5F9] flex justify-between items-center bg-white">
            <span className="text-[13px] text-[#64748B]">Showing {currentUsers.length} entries</span>
            <div className="flex gap-[8px]">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)} 
                  className={`py-[8px] px-[14px] border border-[#E2E8F0] rounded-[8px] bg-white text-[12px] font-bold ${currentPage === 1 ? 'text-[#94A3B8] cursor-not-allowed opacity-50' : 'text-[#475569] cursor-pointer hover:bg-slate-50'}`}
                >
                    Previous
                </button>
                <button className="py-[8px] px-[14px] border-none rounded-[8px] bg-[#D62828] text-white cursor-pointer text-[12px] font-bold">
                    {currentPage}
                </button>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  className={`py-[8px] px-[14px] border border-[#E2E8F0] rounded-[8px] bg-white text-[12px] font-bold ${currentPage === totalPages ? 'text-[#94A3B8] cursor-not-allowed opacity-50' : 'text-[#475569] cursor-pointer hover:bg-slate-50'}`}
                >
                    Next
                </button>
            </div>
        </div>
      </div>

      {/* --- ADD MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[10000]">
            <div className="bg-white w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out]">
                <div className="p-[20px_25px] border-b border-[#F1F5F9] flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="m-0 text-[18px] font-extrabold text-slate-800">Add New System User</h3>
                    <X onClick={() => { setIsAddModalOpen(false); setNewUser({ name: '', email: '', password: '', role: 'Citizen', contact_number: '', district: '', organization: '' }); }} className="cursor-pointer text-[#94A3B8] hover:text-slate-800 transition-colors" />
                </div>
                <div className="p-[30px_25px] flex flex-col gap-[20px]">
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Full Name *</label>
                        <input type="text" placeholder="John Doe" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Email Address *</label>
                        <input type="email" placeholder="john@resqnow.gov" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Password *</label>
                        <input type="password" placeholder="••••••••" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Contact Number *</label>
                        <input type="text" placeholder="0770000000" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.contact_number} onChange={e => setNewUser({...newUser, contact_number: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Assigned Role *</label>
                        <select className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] bg-white cursor-pointer transition-colors" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                            <option value="Citizen">Citizen</option>
                            <option value="Responder">Responder (Authority)</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {newUser.role === 'Responder' && (
                        <>
                            <div>
                                <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">District *</label>
                                <input type="text" placeholder="Colombo" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.district} onChange={e => setNewUser({...newUser, district: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Organization *</label>
                                <input type="text" placeholder="Red Cross" className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" value={newUser.organization} onChange={e => setNewUser({...newUser, organization: e.target.value})} />
                            </div>
                        </>
                    )}
                    <button onClick={handleAddUser} className="w-full mt-[10px] p-[12px_25px] rounded-[12px] border-none bg-[#D62828] text-white font-bold cursor-pointer hover:bg-red-700 transition-colors shadow-[0_4px_12px_rgba(214,40,40,0.2)]">
                        Create User Account
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[10000]">
            <div className="bg-white w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out]">
                <div className="p-[20px_25px] border-b border-[#F1F5F9] flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="m-0 text-[18px] font-extrabold text-slate-800">Edit User Profile</h3>
                        <p className="m-0 text-[13px] text-[#94A3B8]">User ID: {selectedUser.id}</p>
                    </div>
                    <X onClick={() => setIsEditModalOpen(false)} className="cursor-pointer text-[#94A3B8] hover:text-slate-800 transition-colors" />
                </div>
                <div className="p-[30px_25px] flex flex-col gap-[20px]">
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Full Name</label>
                        <input type="text" value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Email Address (Read Only)</label>
                        <input type="text" value={selectedUser.email} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none bg-[#F8FAFC] text-[#64748B]" readOnly />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Contact Number</label>
                        <input type="text" value={selectedUser.contact_number} onChange={e => setSelectedUser({...selectedUser, contact_number: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" />
                    </div>
                    <div className="flex gap-[15px]">
                        <div className="flex-1">
                            <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">System Role</label>
                            <select value={selectedUser.role} onChange={e => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] bg-white cursor-pointer transition-colors">
                                <option value="Admin">Admin</option>
                                <option value="Responder">Responder</option>
                                <option value="Citizen">Citizen</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Account Status</label>
                            <select value={selectedUser.status} onChange={e => setSelectedUser({...selectedUser, status: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] bg-white cursor-pointer transition-colors">
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                    {selectedUser.role === 'Responder' && (
                        <>
                            <div>
                                <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">District</label>
                                <input type="text" value={selectedUser.district} onChange={e => setSelectedUser({...selectedUser, district: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Organization</label>
                                <input type="text" value={selectedUser.organization} onChange={e => setSelectedUser({...selectedUser, organization: e.target.value})} className="w-full p-[12px] rounded-[10px] border border-[#E2E8F0] box-border outline-none focus:border-[#D62828] transition-colors" />
                            </div>
                        </>
                    )}
                </div>
                <div className="p-[20px_25px] border-t border-[#F1F5F9] flex justify-end gap-[12px] bg-[#F8FAFC]">
                    <button onClick={() => setIsEditModalOpen(false)} className="flex-1 p-[12px] rounded-[12px] border border-[#E2E8F0] bg-white font-semibold cursor-pointer hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={handleSaveEdit} className="p-[12px_25px] rounded-[12px] border-none bg-[#D62828] text-white font-bold cursor-pointer hover:bg-red-700 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
      )}

      {/* --- DELETE CONFIRM --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[10000]">
            <div className="bg-white w-[380px] p-[35px] text-center rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="w-[60px] h-[60px] bg-[#FEE2E2] rounded-full flex justify-center items-center mx-auto">
                    <AlertCircle size={32} color="#D62828" />
                </div>
                <h3 className="my-[15px] text-[20px] font-extrabold text-slate-800">Delete User?</h3>
                <p className="text-[#64748B] text-[14px]">Are you sure you want to delete <b className="text-slate-700">{userToDelete?.name}</b>?<br/>This action cannot be undone.</p>
                <div className="flex gap-[12px] mt-[25px]">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 p-[12px] rounded-[12px] border border-[#E2E8F0] bg-white font-semibold cursor-pointer hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 p-[12px_25px] rounded-[12px] border-none bg-[#EF4444] text-white font-bold cursor-pointer hover:bg-red-600 transition-colors">Confirm Delete</button>
                </div>
            </div>
        </div>
      )}

      {/* --- SUCCESS POPUP --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] flex justify-center items-center z-[10000]">
            <div className="bg-white w-[380px] p-[35px] text-center rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="w-[80px] h-[80px] bg-[#DCFCE7] rounded-full flex justify-center items-center mx-auto">
                    <CheckCircle size={40} color="#10B981" />
                </div>
                <h3 className="my-[15px] text-[20px] font-extrabold text-slate-800">{successType === 'add' ? 'User Added!' : 'Changes Saved!'}</h3>
                <p className="text-[#64748B] text-[14px]">The system has been updated successfully.</p>
                <p className="text-[12px] text-[#94A3B8] mt-[10px]">Closing in {countdown}s...</p>
            </div>
        </div>
      )}
    </div>
  );
};

// --- BADGE HELPERS ---
const RoleBadge = ({ role }) => {
    let classes = "";
    if (role === 'Admin') classes = "bg-[#F3E8FF] text-[#6B21A8]";
    else if (role === 'Responder') classes = "bg-[#DBEAFE] text-[#1D4ED8]";
    else classes = "bg-[#F1F5F9] text-[#475569]";
    
    return (
        <span className={`px-[12px] py-[4px] rounded-[20px] text-[11px] font-bold ${classes}`}>
            {role}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const isSuspended = status === 'Suspended';
    return (
        <span className={`px-[12px] py-[4px] rounded-[20px] text-[11px] font-bold inline-flex items-center gap-[4px] ${isSuspended ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-[#DCFCE7] text-[#166534]'}`}>
            <span className={`w-[6px] h-[6px] rounded-full ${isSuspended ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`}></span>{status}
        </span>
    );
};

export default AdminUserManagementScreen;