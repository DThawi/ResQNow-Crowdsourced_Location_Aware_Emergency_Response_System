import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, CheckCircle, ArrowLeft, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';

const AdminForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [resendTimer, setResendTimer] = useState(7);

  // Handle Resend Timer for Step 2
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const renderStepIndicator = (current) => (
    <div className="flex items-center justify-center gap-[10px] mb-[30px]">
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
      <div className="bg-white w-full max-w-[400px] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-[20px] py-[15px] border-b border-[#F1F5F9]">
          {step > 1 && step < 4 ? (
            <button onClick={() => setStep(step - 1)} className="bg-transparent border-none cursor-pointer text-[#64748B] flex items-center hover:text-slate-900 transition-colors">
                <ArrowLeft size={20} />
            </button>
          ) : <div className="w-[20px]" />}
          
          <h2 className="m-0 text-[18px] font-extrabold text-[#1E293B]">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify Identity"}
            {step >= 3 && "Set New Password"}
          </h2>
          
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-[#64748B] flex items-center hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-[30px]">
          {step < 4 && renderStepIndicator(step)}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <label className="block text-[13px] font-bold text-[#475569] mb-[8px]">Email Address</label>
              <div className="flex items-center px-[15px] border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC] focus-within:border-red-400 transition-colors">
                <Mail size={18} color="#94A3B8" className="mr-[10px]" />
                <input 
                  type="text" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px]" 
                />
              </div>
              <p className="text-[12px] text-[#94A3B8] my-[15px] mb-[25px] leading-relaxed">
                Enter the email address you used to sign up. We'll send you a verification code.
              </p>
              <button 
                onClick={() => setStep(2)} 
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[10px] hover:bg-red-700 transition-colors"
              >
                Send Reset Code
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
                <span className="text-[#64748B]">Didn't receive the code?</span>
                <span 
                    className={`font-bold ${resendTimer === 0 ? 'cursor-pointer hover:underline text-[#D62828]' : 'cursor-default text-[#94A3B8]'}`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Now"}
                </span>
              </div>
              <button 
                onClick={() => setStep(3)} 
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[25px] hover:bg-red-700 transition-colors"
              >
                Verify Code
              </button>
              <button 
                onClick={() => setStep(1)} 
                className="bg-transparent border-none text-[#D62828] font-bold text-[13px] cursor-pointer mt-[15px] w-full hover:underline"
              >
                Change email address
              </button>
              <div className="bg-[#F8FAFC] p-[12px] rounded-[8px] text-[11px] text-[#64748B] flex gap-[10px] mt-[20px] items-start">
                <ShieldCheck size={16} className="shrink-0" /> 
                <span>Code expires in 5 minutes. For security, the code can only be used once.</span>
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
                  className="border-none bg-transparent outline-none py-[12px] w-full text-[14px] pl-[10px]" 
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <button 
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
                    className="border-none bg-transparent outline-none py-[12px] w-full text-[14px] pl-[10px]" 
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
                    One number
                </div>
              </div>

              <button 
                onClick={() => setStep(4)} 
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer mt-[25px] hover:bg-red-700 transition-colors"
              >
                Reset Password
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
              <p className="text-[#64748B] mb-[30px]">Your password has been updated.</p>
              <button 
                onClick={onClose} 
                className="w-full p-[14px] bg-[#D62828] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer hover:bg-red-700 transition-colors"
              >
                Continue to Login
              </button>
              <p className="text-[12px] text-[#94A3B8] mt-[15px]">Auto-redirecting in 10 seconds...</p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AdminForgotPasswordModal;