import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, CheckCircle, ArrowLeft, Eye, EyeOff, ShieldCheck, Key, Loader2 
} from 'lucide-react';
import axios from 'axios';

// Update with your active backend URL (e.g., http://localhost:5000/api/auth)
const API_BASE_URL = "http://localhost:5000/api/auth";

const AdminForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email & Master Key, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(10);

  // Handle Resend Timer for Step 2
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Handle Auto-Redirect Timer on Step 4
  useEffect(() => {
    let redirectTimer;
    if (step === 4 && autoRedirectTimer > 0) {
      redirectTimer = setInterval(() => setAutoRedirectTimer(prev => prev - 1), 1000);
    } else if (step === 4 && autoRedirectTimer === 0) {
      handleModalClose();
    }
    return () => clearInterval(redirectTimer);
  }, [step, autoRedirectTimer]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setStep(1);
    setEmail('');
    setAdminSecretKey('');
    setOtp('');
    setPasswords({ new: '', confirm: '' });
    setErrorMsg('');
    setResendTimer(0);
    setAutoRedirectTimer(10);
    onClose();
  };

  // STEP 1: Request OTP with Admin Master Key Verification
  const handleSendOTP = async () => {
    setErrorMsg('');
    if (!email) return setErrorMsg('Please enter your admin email address.');
    if (!adminSecretKey) return setErrorMsg('Please enter the Master System Key.');

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/admin-forgot-password`, {
        email,
        adminSecretKey,
      });
      setResendTimer(30); // 30-second cooldown on resend
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Admin authentication failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP Code
  const handleVerifyOTP = async () => {
    setErrorMsg('');
    if (!otp || otp.length < 6) return setErrorMsg('Please enter the 6-digit OTP code.');

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      setStep(3);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Admin Password
  const handleResetPassword = async () => {
    setErrorMsg('');
    if (passwords.new.length < 8) {
      return setErrorMsg('Password must be at least 8 characters long.');
    }
    if (!/\d/.test(passwords.new)) {
      return setErrorMsg('Password must contain at least one number.');
    }
    if (passwords.new !== passwords.confirm) {
      return setErrorMsg('Passwords do not match.');
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword: passwords.new,
      });
      setStep(4);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = (current) => (
    <div className="flex items-center justify-center gap-[10px] mb-[25px]">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-bold transition-colors duration-300 ${
            current >= num ? 'bg-[#D62828] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
          }`}>
            {num}
          </div>
          {num < 3 && (
            <div className={`w-[40px] h-[2px] ${current > num ? 'bg-[#D62828]' : 'bg-[#F1F5F9]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[3000]">
      <div className="bg-white w-full max-w-[420px] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-[20px] py-[15px] border-b border-[#F1F5F9]">
          {step > 1 && step < 4 ? (
            <button 
              onClick={() => { setErrorMsg(''); setStep(step - 1); }} 
              className="bg-transparent border-none cursor-pointer text-[#64748B] flex items-center hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          ) : <div className="w-[20px]" />}
          
          <h2 className="m-0 text-[18px] font-extrabold text-[#1E293B]">
            {step === 1 && "Admin Security Reset"}
            {step === 2 && "Verify Admin Identity"}
            {step >= 3 && "Set New Admin Password"}
          </h2>
          
          <button onClick={handleModalClose} className="bg-transparent border-none cursor-pointer text-[#64748B] flex items-center hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-[30px]">
          {step < 4 && renderStepIndicator(step)}

          {/* Error Alert Box */}
          {errorMsg !== '' && (
            <div className="mb-[20px] p-[12px] bg-red-50 border border-red-200 text-red-600 rounded-[10px] text-[13px] font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: ENTER EMAIL & MASTER KEY */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Admin Email Address</label>
              <div className="flex items-center px-[15px] border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] focus-within:border-red-400 transition-colors mb-[15px]">
                <Mail size={18} color="#94A3B8" className="mr-[10px]" />
                <input 
                  type="email" 
                  placeholder="admin@resqnow.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px]" 
                />
              </div>

              <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Master System Key</label>
              <div className="flex items-center px-[15px] border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] focus-within:border-red-400 transition-colors">
                <Key size={18} color="#94A3B8" className="mr-[10px]" />
                <input 
                  type="password" 
                  placeholder="Enter System Master Key" 
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px]" 
                />
              </div>

              <p className="text-[12px] text-[#94A3B8] my-[15px] mb-[25px] leading-relaxed">
                Provide your registered Admin email along with the System Master Key to authorize reset code dispatch.
              </p>

              <button 
                onClick={handleSendOTP} 
                disabled={loading}
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[10px] hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Authorize & Send OTP"}
              </button>
            </div>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Verification Code</label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] outline-none text-center text-[20px] tracking-[8px] p-[15px] focus:border-red-400 transition-colors" 
              />
              <div className="flex justify-between mt-[15px] text-[13px]">
                <span className="text-[#64748B]">Didn't receive code?</span>
                <button 
                  type="button"
                  onClick={handleSendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`font-bold bg-transparent border-none p-0 ${resendTimer === 0 ? 'cursor-pointer hover:underline text-[#D62828]' : 'cursor-default text-[#94A3B8]'}`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Now"}
                </button>
              </div>

              <button 
                onClick={handleVerifyOTP} 
                disabled={loading}
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[25px] hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify Security Code"}
              </button>

              <button 
                onClick={() => { setErrorMsg(''); setStep(1); }} 
                className="bg-transparent border-none text-[#D62828] font-bold text-[13px] cursor-pointer mt-[15px] w-full hover:underline"
              >
                Change admin email
              </button>

              <div className="bg-[#F8FAFC] p-[12px] rounded-[8px] text-[11px] text-[#64748B] flex gap-[10px] mt-[20px] items-start">
                <ShieldCheck size={16} className="shrink-0 text-[#D62828]" /> 
                <span>Code expires in 3 minutes for elevated security. Code can only be used once.</span>
              </div>
            </div>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">New Password</label>
              <div className="flex items-center px-[15px] border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] focus-within:border-red-400 transition-colors">
                <Lock size={18} color="#94A3B8" />
                <input 
                  type={showPass ? "text" : "password"} 
                  value={passwords.new}
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px] pl-[10px]" 
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)} 
                  className="bg-transparent border-none cursor-pointer text-[#64748B] flex items-center hover:text-slate-800"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <label className="block text-[13px] font-bold text-[#475569] mb-[8px] mt-[15px]">Confirm Password</label>
              <div className="flex items-center px-[15px] border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] focus-within:border-red-400 transition-colors">
                <Lock size={18} color="#94A3B8" />
                <input 
                  type={showPass ? "text" : "password"} 
                  value={passwords.confirm}
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px] pl-[10px]" 
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>

              <div className="bg-[#F8FAFC] p-[15px] rounded-[10px] mt-[20px] text-[12px] text-[#64748B]">
                <p className="m-0 mb-[5px] font-bold">Password requirements:</p>
                <div className="flex items-center gap-[8px] mt-[5px]">
                  <CheckCircle size={14} color={passwords.new.length >= 8 ? "#10B981" : "#CBD5E1"} /> 
                  At least 8 characters
                </div>
                <div className="flex items-center gap-[8px] mt-[5px]">
                  <CheckCircle size={14} color={/\d/.test(passwords.new) ? "#10B981" : "#CBD5E1"} /> 
                  At least one number
                </div>
              </div>

              <button 
                onClick={handleResetPassword} 
                disabled={loading}
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[25px] hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Reset Admin Password"}
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="animate-[fadeIn_0.3s_ease-out] text-center py-[20px]">
              <div className="w-[80px] h-[80px] bg-[#F0FDF4] rounded-full flex justify-center items-center mx-auto mb-[20px]">
                <CheckCircle size={50} color="#10B981" />
              </div>
              <h2 className="text-[20px] font-extrabold mb-[10px] text-[#1E293B]">Password Reset Successfully!</h2>
              <p className="text-[#64748B] mb-[30px]">Admin credentials updated in MongoDB database.</p>
              <button 
                onClick={handleModalClose} 
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer hover:bg-red-700 transition-colors"
              >
                Continue to Admin Login
              </button>
              <p className="text-[12px] text-[#94A3B8] mt-[15px]">Auto-closing in {autoRedirectTimer} seconds...</p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AdminForgotPasswordModal;