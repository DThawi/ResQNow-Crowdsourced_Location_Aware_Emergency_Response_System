// src/screens/admin/AdminProfileScreen.jsx

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Building2,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Anderson",
    phone: "+1 (555) 123-4567",
    email: "john.anderson@resqnow.com",
    department: "Emergency Operations",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    alert("Profile Updated");
  };

  const updatePassword = () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Password Updated");
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="mb-[30px]">
        <h2 className="m-0 mb-[5px] text-[28px] font-extrabold text-[#2B2D42]">
          Profile Settings
        </h2>

        <p className="m-0 text-[#8D99AE] text-[14px]">
          Manage your profile information and security settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-[35px] border-b border-[#E5E7EB] mb-[30px]">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-[12px] text-[15px] font-bold transition ${
            activeTab === "profile"
              ? "text-[#D62828] border-b-2 border-[#D62828]"
              : "text-[#8D99AE]"
          }`}
        >
          My Profile
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`pb-[12px] text-[15px] font-bold transition ${
            activeTab === "password"
              ? "text-[#D62828] border-b-2 border-[#D62828]"
              : "text-[#8D99AE]"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/5 p-[35px] flex gap-[40px]">
          {/* Left */}
          <div className="flex flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-b from-[#D62828] to-[#1D3557] flex items-center justify-center">
              <User color="white" size={45} />
            </div>

            <div className="mt-[20px] bg-[#D62828] text-white py-[8px] px-[18px] rounded-[12px] flex items-center gap-[8px] text-[13px] font-bold">
              <Shield size={15} />
              Admin
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 grid grid-cols-2 gap-[20px]">
            <InputField
              icon={<User size={18} color="#8D99AE" />}
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />

            <InputField
              icon={<Phone size={18} color="#8D99AE" />}
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
            />

            <InputField
              icon={<Mail size={18} color="#8D99AE" />}
              label="Email Address"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />

            <InputField
              icon={<Building2 size={18} color="#8D99AE" />}
              label="Department"
              name="department"
              value={profile.department}
              onChange={handleProfileChange}
            />

            <div className="col-span-2">
              <button
                onClick={saveProfile}
                className="bg-[#D62828] hover:bg-[#b71f1f] text-white py-[12px] px-[24px] rounded-[12px] text-[14px] font-bold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD TAB */}
      {activeTab === "password" && (
        <div className="bg-white rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/5 p-[35px] max-w-[700px]">
          <PasswordField
            label="Current Password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            visible={showCurrent}
            setVisible={setShowCurrent}
          />

          <PasswordField
            label="New Password"
            name="newPass"
            value={passwords.newPass}
            onChange={handlePasswordChange}
            visible={showNew}
            setVisible={setShowNew}
          />

          <PasswordField
            label="Confirm Password"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            visible={showConfirm}
            setVisible={setShowConfirm}
          />

          <button
            onClick={updatePassword}
            className="mt-[25px] bg-[#D62828] hover:bg-[#b71f1f] text-white py-[12px] px-[24px] rounded-[12px] text-[14px] font-bold transition"
          >
            Update Password
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const InputField = ({ icon, label, ...props }) => (
  <div>
    <label className="block mb-[8px] text-[13px] font-semibold text-[#8D99AE]">
      {label}
    </label>

    <div className="bg-[#F5F7FA] rounded-[14px] px-[15px] py-[14px] flex items-center gap-[10px]">
      {icon}

      <input
        {...props}
        className="bg-transparent outline-none w-full text-[14px] text-[#2B2D42]"
      />
    </div>
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  visible,
  setVisible,
}) => (
  <div className="mb-[20px]">
    <label className="block mb-[8px] text-[13px] font-semibold text-[#8D99AE]">
      {label}
    </label>

    <div className="bg-[#F5F7FA] rounded-[14px] px-[15px] py-[14px] flex items-center gap-[10px]">
      <Lock size={18} color="#8D99AE" />

      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none flex-1 text-[14px] text-[#2B2D42]"
      />

      <button onClick={() => setVisible(!visible)}>
        {visible ? (
          <EyeOff size={18} color="#8D99AE" />
        ) : (
          <Eye size={18} color="#8D99AE" />
        )}
      </button>
    </div>
  </div>
);

export default AdminProfileScreen;