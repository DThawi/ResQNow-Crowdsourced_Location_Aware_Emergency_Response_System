import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import API from '../../services/api';
import Header from '../../components/layout/header';

// ── Moved to top level to avoid "already declared" error ──────────────────────
const InputField = ({
  label,
  iconComponent,
  placeholder,
  onChangeText,
  keyboardType,
  secureTextEntry,
  multiline,
  required = true,
}) => (
  <>
    <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
      {label} {required && <Text className="text-[#D62828]">*</Text>}
    </Text>
    <View
      className={`flex-row items-center border border-gray-200 rounded-xl px-3 bg-white w-full mb-1 ${
        multiline ? 'h-20 items-start pt-3' : 'h-12'
      }`}
    >
      {iconComponent}
      <TextInput
        className="flex-1 text-sm text-black ml-2"
        placeholder={placeholder}
        placeholderTextColor="#999"
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize="none"
      />
    </View>
  </>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function Register2({ navigation, route }) {
  const { role } = route.params || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact_number, setContactNumber] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Admin specific
  const [adminEmail, setAdminEmail] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const ADMIN_SECRET_CODE = 'RESQADMIN2024';

  const handleRequestAdminCode = () => {
    if (!adminEmail) {
      alert('Please enter your email first');
      return;
    }
    setCodeSent(true);
    alert('Please enter the admin secret code provided by your organization');
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (role === 'Citizen') {
      if (!name || !email || !contact_number || !nic || !address || !district) {
        alert('Please fill in all fields');
        return;
      }
    } else if (role === 'Responder') {
      if (!name || !email || !contact_number || !district || !organization) {
        alert('Please fill in all fields');
        return;
      }
    } else if (role === 'Admin') {
      if (!name || !adminEmail || !adminCode) {
        alert('Please fill in all fields');
        return;
      }
      if (adminCode !== ADMIN_SECRET_CODE) {
        alert('Invalid admin code');
        return;
      }
    }

    try {
      await API.post('/auth/register', {
        name,
        email: role === 'Admin' ? adminEmail : email,
        password,
        role: role.toLowerCase(),   // backend expects 'citizen' | 'responder' | 'admin'
        district,
        contact_number,
        organization,
        latitude: 0,
        longitude: 0,
      });
      navigation.navigate('Login');
      alert('Registration successful! Please login.');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  // ── Role-specific field renderers ──────────────────────────────────────────

  const renderCitizenFields = () => (
    <>
      <InputField
        label="Full Name"
        iconComponent={<Ionicons name="person-outline" size={18} color="#999" />}
        placeholder="Enter your full name"
        onChangeText={setName}
      />
      <InputField
        label="Email"
        iconComponent={<Feather name="mail" size={18} color="#999" />}
        placeholder="Enter your email"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputField
        label="Phone Number"
        iconComponent={<Feather name="phone" size={18} color="#999" />}
        placeholder="Enter your phone number"
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <InputField
        label="NIC / Passport Number"
        iconComponent={<MaterialCommunityIcons name="card-account-details-outline" size={18} color="#999" />}
        placeholder="Enter your NIC or Passport Number"
        onChangeText={setNic}
      />
      <InputField
        label="District"
        iconComponent={<Ionicons name="map-outline" size={18} color="#999" />}
        placeholder="Enter your district"
        onChangeText={setDistrict}
      />
      <InputField
        label="Residential Address"
        iconComponent={<Ionicons name="location-outline" size={18} color="#999" />}
        placeholder="Enter your complete address"
        onChangeText={setAddress}
        multiline
      />
    </>
  );

  const renderResponderFields = () => (
    <>
      <InputField
        label="Full Name"
        iconComponent={<Ionicons name="person-outline" size={18} color="#999" />}
        placeholder="Enter your full name"
        onChangeText={setName}
      />
      <InputField
        label="Email"
        iconComponent={<Feather name="mail" size={18} color="#999" />}
        placeholder="Enter your email"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputField
        label="Phone Number"
        iconComponent={<Feather name="phone" size={18} color="#999" />}
        placeholder="Enter your phone number"
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <InputField
        label="District"
        iconComponent={<Ionicons name="map-outline" size={18} color="#999" />}
        placeholder="Enter your district"
        onChangeText={setDistrict}
      />
      <InputField
        label="Organization"
        iconComponent={<Ionicons name="business-outline" size={18} color="#999" />}
        placeholder="Enter your organization name"
        onChangeText={setOrganization}
      />
    </>
  );

  const renderAdminFields = () => (
    <>
      <InputField
        label="Full Name"
        iconComponent={<Ionicons name="person-outline" size={18} color="#999" />}
        placeholder="Enter your full name"
        onChangeText={setName}
      />

      {/* Email + Get Code button */}
      <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
        Email <Text className="text-[#D62828]">*</Text>
      </Text>
      <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white w-full h-12 mb-1">
        <Feather name="mail" size={18} color="#999" />
        <TextInput
          className="flex-1 text-sm text-black ml-2"
          placeholder="Enter your email"
          placeholderTextColor="#999"
          onChangeText={setAdminEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          className="px-3 py-1 rounded-lg bg-[#D62828]"
          onPress={handleRequestAdminCode}
        >
          <Text className="text-white text-xs font-bold">Get Code</Text>
        </TouchableOpacity>
      </View>

      {codeSent && (
        <InputField
          label="Admin Verification Code"
          iconComponent={<Ionicons name="shield-checkmark-outline" size={18} color="#999" />}
          placeholder="Enter the admin secret code"
          onChangeText={setAdminCode}
          keyboardType="number-pad"
        />
      )}
    </>
  );

  // ── Title / icon per role ──────────────────────────────────────────────────

  const getTitle = () => {
    if (role === 'Citizen')   return { title: 'Citizen Registration',  subtitle: 'Please provide your personal details' };
    if (role === 'Responder') return { title: 'Responder Registration', subtitle: 'Please provide your organization details' };
    if (role === 'Admin')     return { title: 'Admin Registration',     subtitle: 'Verify your admin access' };
    return { title: 'Personal Information', subtitle: 'Please provide your details' };
  };

  const getRoleIcon = () => {
    if (role === 'Citizen')   return <Ionicons name="person-outline" size={32} color="#D62828" />;
    if (role === 'Responder') return <FontAwesome5 name="ambulance" size={26} color="#D62828" />;
    if (role === 'Admin')     return <Ionicons name="shield-checkmark-outline" size={32} color="#D62828" />;
    return <Ionicons name="person-outline" size={32} color="#D62828" />;
  };

  const { title, subtitle } = getTitle();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>

        {/* Avatar */}
        <View className="w-[70px] h-[70px] rounded-full bg-[#FFE5E5] justify-center items-center mb-3">
          {getRoleIcon()}
        </View>

        <Text className="text-xl font-bold text-black mb-1">{title}</Text>
        <Text className="text-sm text-gray-400 mb-5">{subtitle}</Text>

        {/* Role-specific fields */}
        {role === 'Citizen'   && renderCitizenFields()}
        {role === 'Responder' && renderResponderFields()}
        {role === 'Admin'     && renderAdminFields()}

        {/* Password — shared across all roles */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white w-full h-12 mb-1">
          <Feather name="lock" size={18} color="#999" />
          <TextInput
            className="flex-1 text-sm text-black ml-2"
            placeholder="Create a strong password"
            placeholderTextColor="#999"
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#999" />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-400 self-start mb-2">
          Minimum 8 characters with letters, numbers and symbols
        </Text>

        {/* Confirm Password */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Confirm Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white w-full h-12 mb-1">
          <Feather name="lock" size={18} color="#999" />
          <TextInput
            className="flex-1 text-sm text-black ml-2"
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View className="flex-row w-full mt-6 mb-4" style={{ gap: 12 }}>
          <TouchableOpacity
            className="flex-1 h-12 rounded-full border-2 border-[#D62828] justify-center items-center flex-row"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text className="text-[#D62828] text-sm font-bold">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-[2] h-12 rounded-full bg-[#D62828] justify-center items-center flex-row"
            onPress={handleRegister}
          >
            <Text className="text-white text-sm font-bold mr-1">Complete Registration</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-6">
          <Text className="text-sm text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-sm text-[#D62828] font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}