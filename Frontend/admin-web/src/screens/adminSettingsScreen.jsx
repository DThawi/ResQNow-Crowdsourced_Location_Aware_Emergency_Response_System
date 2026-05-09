import React, { useState } from 'react';
import { 
  Save, Upload, RefreshCw, ArrowRightLeft, AlertTriangle, 
} from 'lucide-react';

const AdminSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('General');
  
  // --- SETTINGS STATE ---
  const [systemName, setSystemName] = useState('ResQNow Emergency Response');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [handoverTarget, setHandoverTarget] = useState('');

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
        
        {/* TAB NAVIGATION */}
        <div className="flex gap-[5px] bg-white p-[5px] rounded-[12px] border border-[#E5E7EB] mb-[25px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-[1000px] mx-auto">
            {['General', 'Notifications', 'Security', 'Zones', 'API Integrations'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 p-[12px] rounded-[8px] border-none cursor-pointer text-[13px] font-bold transition-all duration-200 ${
                        activeTab === tab ? 'bg-[#D62828] text-white' : 'bg-transparent text-[#64748B] hover:bg-slate-50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-[16px] p-[35px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E5E7EB] max-w-[1000px] mx-auto">
            
            {/* 1. GENERAL SETTINGS */}
            {activeTab === 'General' && (
                <div className="animate-[fadeIn_0.3s_ease]">
                    <SectionTitle title="General Settings" subtitle="Configure basic system identity" />
                    <div className="flex flex-col gap-[25px]">
                        <div className="max-w-[500px]">
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">System Name</label>
                            <input 
                              type="text" 
                              value={systemName} 
                              onChange={(e) => setSystemName(e.target.value)} 
                              className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828]" 
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Organization Logo</label>
                            <div className="flex items-center gap-[20px] mt-[10px]">
                                <div className="w-[80px] h-[80px] bg-[#F3F4F6] rounded-[12px] flex justify-center items-center border-[2px] border-dashed border-[#D1D5DB] text-[24px] font-extrabold text-[#9CA3AF]">
                                    R
                                </div>
                                <button className="py-[10px] px-[15px] bg-white border border-[#D1D5DB] rounded-[8px] text-[12px] font-bold text-[#4B5563] cursor-pointer flex items-center gap-[5px] hover:bg-slate-50 transition-colors">
                                    <Upload size={16} /> Upload New Logo
                                </button>
                            </div>
                        </div>
                        <div className="max-w-[500px]">
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Contact Email</label>
                            <input 
                              type="email" 
                              defaultValue="admin@resqnow.gov" 
                              className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828]" 
                            />
                        </div>
                        <button className="w-fit py-[12px] px-[25px] bg-[#D62828] text-white border-none rounded-[8px] font-bold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-700 transition-colors">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* 2. NOTIFICATION SETTINGS */}
            {activeTab === 'Notifications' && (
                <div className="animate-[fadeIn_0.3s_ease]">
                    <SectionTitle title="Notification Settings" subtitle="Manage alert thresholds and delivery channels" />
                    <div className="flex flex-col gap-[15px]">
                        <ToggleRow label="Email Alerts" desc="Send notifications for critical incidents" active={emailAlerts} onClick={() => setEmailAlerts(!emailAlerts)} />
                        <ToggleRow label="SMS Alerts" desc="Send SMS notifications to responders" active={smsAlerts} onClick={() => setSmsAlerts(!smsAlerts)} />
                        <ToggleRow label="Push Notifications" desc="Send real-time alerts to the citizen app" active={pushNotifications} onClick={() => setPushNotifications(!pushNotifications)} />
                        
                        <div className="mt-[20px]">
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Range Execution Threshold (km)</label>
                            <input type="range" min="1" max="10" defaultValue="5" className="w-full mt-[10px] accent-[#D62828]" />
                            <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-[5px]">
                                <span>1km</span><span>5km</span><span>10km</span>
                            </div>
                        </div>
                        <button className="w-fit mt-[10px] py-[12px] px-[25px] bg-[#D62828] text-white border-none rounded-[8px] font-bold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-700 transition-colors">
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* 3. SECURITY & ADMIN HANDOVER */}
            {activeTab === 'Security' && (
                <div className="animate-[fadeIn_0.3s_ease]">
                    <SectionTitle title="Security Settings" subtitle="Passwords, MFA, and Administrative Handover" />
                    <div className="flex flex-col gap-[25px]">
                        <div className="bg-[#FEF2F2] border border-[#FEE2E2] p-[15px] rounded-[10px] text-[12px] text-[#991B1B] flex items-center gap-[10px]">
                            <AlertTriangle size={16} /> Security Notice: Changing credentials will affect all active admin sessions.
                        </div>
                        <div className="grid grid-cols-2 gap-[20px]">
                            <div>
                                <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">New Password</label>
                                <input type="password" className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828]" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Confirm Password</label>
                                <input type="password" className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828]" />
                            </div>
                        </div>
                        <ToggleRow label="Two-Factor Authentication" desc="Require a mobile code for every login" active={twoFactor} onClick={() => setTwoFactor(!twoFactor)} />
                        
                        <hr className="border-none border-t border-[#E5E7EB] my-[10px]" />

                        {/* ADMIN HANDOVER FEATURE */}
                        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-[12px] p-[25px]">
                            <div className="flex gap-[15px]">
                                <div className="text-[#EA580C]"><ArrowRightLeft size={24} /></div>
                                <div>
                                    <h4 className="m-0 mb-[5px] text-[15px] text-[#9A3412] font-extrabold">Position Handover</h4>
                                    <p className="m-0 mb-[15px] text-[13px] text-[#C2410C] leading-[1.4]">
                                        Transfer full Super Admin rights to another staff member. Your access will be revoked immediately upon their acceptance.
                                    </p>
                                    <div className="flex gap-[10px]">
                                        <select 
                                            value={handoverTarget} 
                                            onChange={(e) => setHandoverTarget(e.target.value)} 
                                            className="flex-1 py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] bg-white focus:border-[#EA580C]"
                                        >
                                            <option value="">Select New Admin...</option>
                                            <option value="1">Sarah Williams</option>
                                            <option value="2">Mike Thompson</option>
                                        </select>
                                        <button className="py-[12px] px-[25px] bg-[#EA580C] text-white border-none rounded-[8px] font-bold text-[14px] cursor-pointer hover:bg-orange-700 transition-colors">
                                            Transfer Rights
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. ZONE CONFIGURATION */}
            {activeTab === 'Zones' && (
                <div className="animate-[fadeIn_0.3s_ease]">
                    <SectionTitle title="Zone Logic Configuration" subtitle="Define how the system identifies and scales hazards" />
                    <div className="flex flex-col gap-[30px]">
                        <div className="max-w-[500px]">
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Default Zone Radius (Meters)</label>
                            <input type="number" defaultValue="500" className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828]" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Severity Level Scaling (%)</label>
                            <div className="flex flex-col gap-[20px] mt-[15px]">
                                <SeveritySlider label="Critical Threshold" color="#DC2626" defaultValue="85" />
                                <SeveritySlider label="High Threshold" color="#EA580C" defaultValue="60" />
                                <SeveritySlider label="Medium Threshold" color="#D97706" defaultValue="40" />
                            </div>
                        </div>
                        <div className="max-w-[500px]">
                            <label className="block text-[13px] font-bold text-[#4B5563] mb-[8px]">Auto-Expiry Timer</label>
                            <select className="w-full py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[14px] box-border focus:border-[#D62828] bg-white cursor-pointer">
                                <option>2 Hours</option>
                                <option>6 Hours</option>
                                <option>12 Hours</option>
                            </select>
                        </div>
                        <button className="w-fit py-[12px] px-[25px] bg-[#D62828] text-white border-none rounded-[8px] font-bold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-700 transition-colors">
                            <Save size={18} /> Save Config
                        </button>
                    </div>
                </div>
            )}

            {/* 5. API & INTEGRATIONS */}
            {activeTab === 'API Integrations' && (
                <div className="animate-[fadeIn_0.3s_ease]">
                    <SectionTitle title="System Integrations" subtitle="Connect external data providers" />
                    <div className="flex flex-col gap-[25px]">
                        <ApiRow label="Google Maps Platform" keyVal="AIzaSyA4J...98342" status="Active" />
                        <ApiRow label="Twilio SMS Gateway" keyVal="SK9023...j20k1" status="Active" />
                        <div className="flex gap-[15px]">
                            <button className="py-[12px] px-[25px] bg-[#D62828] text-white border-none rounded-[8px] font-bold text-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-red-700 transition-colors">
                                <Save size={18} /> Save Keys
                            </button>
                            <button className="py-[10px] px-[15px] bg-white border border-[#D1D5DB] rounded-[8px] text-[12px] font-bold text-[#4B5563] cursor-pointer flex items-center gap-[5px] hover:bg-slate-50 transition-colors">
                                <RefreshCw size={16} /> Restore Defaults
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-[30px]">
        <h2 className="m-0 mb-[5px] text-[20px] text-[#2B2D42] font-extrabold">{title}</h2>
        <p className="m-0 text-[14px] text-[#8D99AE]">{subtitle}</p>
    </div>
);

const SeveritySlider = ({ label, color, defaultValue }) => (
    <div className="w-full">
        <div className="flex justify-between mb-[8px]">
            <span className="text-[13px] font-bold text-[#4B5563]">{label}</span>
            <span className="text-[13px] font-extrabold" style={{ color }}>{defaultValue}%</span>
        </div>
        <div className="w-full h-[8px] bg-[#E5E7EB] rounded-[4px] overflow-hidden">
            <div className="h-full" style={{ width: `${defaultValue}%`, backgroundColor: color }}></div>
        </div>
    </div>
);

const ToggleRow = ({ label, desc, active, onClick }) => (
    <div className="flex justify-between items-center p-[15px] bg-[#FAFAFA] rounded-[12px] border border-[#F3F4F6]">
        <div>
            <div className="text-[14px] font-bold text-[#2B2D42]">{label}</div>
            <div className="text-[12px] text-[#8D99AE] mt-0.5">{desc}</div>
        </div>
        <div 
            onClick={onClick} 
            className={`w-[45px] h-[24px] rounded-[20px] relative cursor-pointer transition-colors duration-300 ${
                active ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'
            }`}
        >
            <div 
                className="w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-sm"
                style={{ left: active ? '24px' : '3px' }}
            ></div>
        </div>
    </div>
);

const ApiRow = ({ label, keyVal, status }) => (
    <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-[20px]">
        <div className="flex-1">
            <div className="text-[13px] font-bold text-[#4B5563] mb-[8px]">{label}</div>
            <div className="flex gap-[10px]">
                <input 
                  type="password" 
                  value={keyVal} 
                  readOnly 
                  className="flex-1 py-[12px] px-[15px] border border-[#D1D5DB] rounded-[8px] outline-none text-[12px] bg-[#F9FAFB] text-[#4B5563]" 
                />
                <button className="py-[10px] px-[15px] bg-white border border-[#D1D5DB] rounded-[8px] text-[12px] font-bold text-[#4B5563] cursor-pointer flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <RefreshCw size={14} />
                </button>
            </div>
        </div>
        <div className="w-[120px] text-right">
            <span className="text-[11px] font-bold text-[#10B981] flex items-center justify-end gap-[5px]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#10B981]"></div> {status}
            </span>
        </div>
    </div>
);

export default AdminSettingsScreen;