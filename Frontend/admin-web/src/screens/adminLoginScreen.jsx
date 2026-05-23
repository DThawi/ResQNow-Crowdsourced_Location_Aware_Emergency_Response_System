import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { login } from '../services/authService';
import AdminForgotPasswordModal from "../components/adminForgotPasswordModal.jsx";

// Import your custom high-resolution logo asset path dynamically
import logoImg from '../assets/logo.png'; 

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal tracking controller state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      // Synchronize authorization tokens directly into persistent browser memory space
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFB] font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT PANEL: BRAND AREA WITH CENTRAL BADGE LOGO & GEOMETRIC DESIGN         */}
      {/* ========================================================================= */}
      {/* UPDATED: Deep premium dark radial gradient canvas background profile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#1E1E2F] to-[#11111E] relative overflow-hidden flex-col items-center justify-center p-12 text-white selection:bg-[#D62828]/30">
        
        {/* Architectural Brand Glow Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D62828]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-slate-500/5 rounded-full blur-3xl" />

        {/* Central Logo Panel Module Stack */}
        <div className="relative z-10 flex flex-col items-center max-w-md text-center animate-[fadeIn_0.4s_ease-out]">
          
          {/* UPDATED: Square container background/border stripped down to flat borderless layout */}
          <div className="mb-6 transition-transform duration-300 hover:scale-105 select-none pointer-events-none">
            <img 
              src={logoImg} 
              alt="ResQNow Operational Badge Logo" 
              className="w-[260px] h-[260px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
              onError={(e) => {
                // Graceful fallback if the image asset pipeline encounters directory link updates
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div className="w-[260px] h-[260px] bg-[#D62828] rounded-full flex items-center justify-center text-4xl font-black shadow-xl">ResQNow</div>';
              }}
            />
          </div>
          
          <h1 className="text-[30px] font-[900] tracking-tight leading-tight mb-3 text-white">
            ResQNow Authority Portal
          </h1>
          <div className="w-12 h-[3.5px] bg-[#D62828] rounded-full mb-5 mx-auto" />
          <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed opacity-90">
            Command & Control Center — Access the Secure Emergency Command Dashboard.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: TRANSACTIONAL FORM CONTROLLER LAYER                          */}
      {/* ========================================================================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#FAFAFB]">
        <div className="bg-white w-full max-w-[440px] px-8 md:px-10 py-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100/80 flex flex-col">
          
          {/* Header Section */}
          <div className="w-full text-center mb-8">
            <h2 className="text-[#2B2D42] text-[26px] font-[900] m-0 tracking-tight">Admin Dashboard</h2>
            <p className="text-[#8D99AE] text-xs mt-1.5 font-bold tracking-wider uppercase">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col">
            
            {/* Input fields: Admin Email Row */}
            <div className="mb-5">
              <label className="block text-[#2B2D42] font-extrabold text-xs uppercase tracking-wider mb-2 ml-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your admin email"
                  className="w-full py-3 pr-4 pl-12 border border-slate-200 rounded-xl outline-none box-border text-sm font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:border-[#D62828] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input fields: Password Row */}
            <div className="mb-5">
              <label className="block text-[#2B2D42] font-extrabold text-xs uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full py-3 pr-4 pl-12 border border-slate-200 rounded-xl outline-none box-border text-sm font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:border-[#D62828] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Optional Operations: Remember Me & Forgot Password Toggles */}
            <div className="flex justify-between items-center mb-6 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="accent-[#D62828] w-4 h-4 rounded-sm border-slate-300 cursor-pointer" 
                />
                <span className="text-[#8D99AE] text-sm font-medium group-hover:text-slate-600 transition-colors">
                  Remember me
                </span>
              </label>
              <span
                onClick={() => setIsForgotOpen(true)}
                className="text-[#D62828] text-sm font-bold cursor-pointer hover:text-red-700 hover:underline transition-colors"
              >
                Forgot Password?
              </span>
            </div>

            {/* Network Exception Validation Messaging */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-[#B91C1C] text-sm font-semibold flex items-center gap-2 animate-[shake_0.2s_ease-in-out]">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Submission Execution Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D62828] text-white py-3.5 rounded-xl border-none font-bold text-base cursor-pointer shadow-[0_6px_20px_rgba(214,40,40,0.2)] transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating Personnel...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Restricted Operations Slat Information Container */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl flex items-start gap-3 border border-slate-100 text-left w-full box-border">
            <div className="bg-white rounded-xl p-1.5 flex border border-slate-200 shadow-xs shrink-0 mt-0.5">
              <AlertCircle color="#F59E0B" size={15} />
            </div>
            <p className="m-0 text-slate-400 text-xs leading-relaxed font-medium">
              This portal is restricted to authorized personnel only. Unauthorized access configurations or operations are strictly prohibited.
            </p>
          </div>

          {/* Verification Center Account Reset Overlay Modal Component */}
          <AdminForgotPasswordModal
            isOpen={isForgotOpen}
            onClose={() => setIsForgotOpen(false)}
          />

        </div>
      </div>
    </div>
  );
};

export default AdminLoginScreen;
