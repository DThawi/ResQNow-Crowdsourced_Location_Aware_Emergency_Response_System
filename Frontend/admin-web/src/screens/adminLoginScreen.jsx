import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Mail, Lock, AlertCircle, Shield } from 'lucide-react';

// Import the multi-step modal

import AdminForgotPasswordModal from "../components/adminForgotPasswordModal.jsx";



const AdminLoginScreen = () => {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    // State to control the Forgot Password Modal

    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Check if user is an Admin (optional but recommended for Admin portal)
                if (data.role !== 'Admin') {
                    setErrorMsg('Access denied. Admin role required.');
                    setLoading(false);
                    return;
                }

                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);

                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                setErrorMsg(data.message || 'Login failed');
            }
        } catch (err) {
            setErrorMsg('Network error. Please ensure backend is running.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="bg-[#f3f4f6] min-h-screen flex items-center justify-center p-[20px] font-sans">

            <div className="bg-white w-full max-w-[420px] px-[35px] py-[45px] rounded-[35px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex flex-col items-center">

               

                {/* 1. Header Section */}

                <div className="w-full text-center mb-[35px]">

                    <div className="w-[95px] h-[95px] bg-gradient-to-b from-[#A52426] to-[#2B2D42] rounded-full flex items-center justify-center mx-auto mb-[18px] shadow-[0_8px_20px_rgba(43,45,66,0.2)]">

                        <div className="border-2 border-white/30 rounded-[16px] p-[8px] flex">

                            <Shield color="white" size={38} strokeWidth={2} />

                        </div>

                    </div>

                    <h1 className="text-[#2B2D42] text-[28px] font-extrabold m-0">Admin Dashboard</h1>

                    <p className="text-[#8D99AE] text-[15px] mt-[6px] font-medium">ResQNow Authority Portal</p>

                </div>

                {errorMsg && (
                    <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200 text-center">
                        {errorMsg}
                    </div>
                )}


                <form onSubmit={handleLogin} className="w-full text-left">

                    {/* 2. Admin Email Input */}

                    <div className="mb-[22px]">

                        <label className="block text-[#2B2D42] font-bold text-[14px] mb-[8px] ml-[4px]">Admin Email</label>

                        <div className="relative">

                            <Mail className="absolute left-[16px] top-[15px] text-[#8D99AE]" size={18} />

                            <input

                                type="email"

                                placeholder="Enter your admin email"

                                className="w-full py-[14px] pr-[15px] pl-[48px] border-[1.5px] border-[#edf2f7] rounded-[18px] outline-none box-border text-[14px] text-[#2d3748] focus:border-[#D62828] transition-colors"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                required

                            />

                        </div>

                    </div>



                    {/* 3. Password Input */}

                    <div className="mb-[22px]">

                        <label className="block text-[#2B2D42] font-bold text-[14px] mb-[8px] ml-[4px]">Password</label>

                        <div className="relative">

                            <Lock className="absolute left-[16px] top-[15px] text-[#8D99AE]" size={18} />

                            <input

                                type="password"

                                placeholder="Enter your password"

                                className="w-full py-[14px] pr-[15px] pl-[48px] border-[1.5px] border-[#edf2f7] rounded-[18px] outline-none box-border text-[14px] text-[#2d3748] focus:border-[#D62828] transition-colors"

                                value={password}

                                onChange={(e) => setPassword(e.target.value)}

                                required

                            />

                        </div>

                    </div>



                    {/* 4. Row: Remember Me & Forgot Password */}

                    <div className="flex justify-between items-center mb-[28px] px-[4px]">

                        <div className="flex items-center gap-[8px]">

                            <input type="checkbox" className="accent-[#D62828] w-[16px] h-[16px]" />

                            <span className="text-[#8D99AE] text-[13px] font-medium">Remember me</span>

                        </div>

                        {/* CLICKABLE TRIGGER FOR MODAL */}

                        <span

                            onClick={() => setIsForgotOpen(true)}

                            className="text-[#D62828] text-[13px] font-bold cursor-pointer hover:underline"

                        >

                            Forgot Password?

                        </span>

                    </div>



                    {/* 5. Submit Button */}

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-[#D62828] text-white p-[16px] rounded-[18px] border-none font-bold text-[17px] cursor-pointer shadow-[0_6px_15px_rgba(214,40,40,0.25)] transition-colors duration-200 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"

                    >

                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}

                    </button>

                </form>



                {/* 6. Restricted Access Box */}

                <div className="mt-[35px] bg-[#f8f9fa] p-[18px] rounded-[20px] flex items-start gap-[12px] text-left w-full box-border">

                    <div className="bg-white rounded-full p-[5px] flex border border-[#e9ecef] shrink-0">

                        <AlertCircle color="#f59e0b" size={16} />

                    </div>

                    <p className="m-0 text-[#8D99AE] text-[10.5px] leading-[1.6] font-medium">

                        This portal is restricted to authorized personnel only. Unauthorized access is prohibited.

                    </p>

                </div>



                {/* MODAL COMPONENT */}

                <AdminForgotPasswordModal

                    isOpen={isForgotOpen}

                    onClose={() => setIsForgotOpen(false)}

                />

            </div>

        </div>

    );

};



export default AdminLoginScreen;

