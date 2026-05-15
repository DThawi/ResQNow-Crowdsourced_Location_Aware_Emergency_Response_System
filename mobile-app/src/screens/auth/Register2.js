import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import API from '../../services/api';
import Header from '../../components/layout/header';

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
        role,
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

  const InputField = ({ label, icon, placeholder, onChangeText, keyboardType, secureTextEntry, multiline, required = true }) => (
    <>
      <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
        {label} {required && <Text className="text-[#D62828]">*</Text>}
      </Text>
      <View className={`flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full mb-1 ${multiline ? 'h-20 items-start pt-3' : 'h-12'}`}>
        <Text className="mr-2">{icon}</Text>
        <TextInput
          className="flex-1 text-sm text-black"
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

  const renderCitizenFields = () => (
    <>
      <InputField label="Full Name" icon="👤" placeholder="Enter your full name" onChangeText={setName} />
      <InputField label="Email" icon="✉️" placeholder="Enter your email" onChangeText={setEmail} keyboardType="email-address" />
      <InputField label="Phone Number" icon="📞" placeholder="Enter your phone number" onChangeText={setContactNumber} keyboardType="phone-pad" />
      <InputField label="NIC / Passport Number" icon="💳" placeholder="Enter your NIC or Passport Number" onChangeText={setNic} />
      <InputField label="District" icon="🗺️" placeholder="Enter your district" onChangeText={setDistrict} />
      <InputField label="Residential Address" icon="📍" placeholder="Enter your complete address" onChangeText={setAddress} multiline />
    </>
  );

  const renderResponderFields = () => (
    <>
      <InputField label="Full Name" icon="👤" placeholder="Enter your full name" onChangeText={setName} />
      <InputField label="Email" icon="✉️" placeholder="Enter your email" onChangeText={setEmail} keyboardType="email-address" />
      <InputField label="Phone Number" icon="📞" placeholder="Enter your phone number" onChangeText={setContactNumber} keyboardType="phone-pad" />
      <InputField label="District" icon="🗺️" placeholder="Enter your district" onChangeText={setDistrict} />
      <InputField label="Organization" icon="🏢" placeholder="Enter your organization name" onChangeText={setOrganization} />
    </>
  );

  const renderAdminFields = () => (
    <>
      <InputField label="Full Name" icon="👤" placeholder="Enter your full name" onChangeText={setName} />

      <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
        Email <Text className="text-[#D62828]">*</Text>
      </Text>
      <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
        <Text className="mr-2">✉️</Text>
        <TextInput
          className="flex-1 text-sm text-black"
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
          icon="🔐"
          placeholder="Enter the admin secret code"
          onChangeText={setAdminCode}
          keyboardType="number-pad"
        />
      )}
    </>
  );

  const getTitle = () => {
    if (role === 'Citizen') return { title: 'Citizen Registration', subtitle: 'Please provide your personal details' };
    if (role === 'Responder') return { title: 'Responder Registration', subtitle: 'Please provide your organization details' };
    if (role === 'Admin') return { title: 'Admin Registration', subtitle: 'Verify your admin access' };
    return { title: 'Personal Information', subtitle: 'Please provide your details' };
  };

  const getIcon = () => {
    if (role === 'Citizen') return '👤';
    if (role === 'Responder') return '🚑';
    if (role === 'Admin') return '🛡️';
    return '👤';
  };

  const { title, subtitle } = getTitle();

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>

        <View className="w-[70px] h-[70px] rounded-full bg-[#FFE5E5] justify-center items-center mb-3">
          <Text className="text-3xl">{getIcon()}</Text>
        </View>

        <Text className="text-xl font-bold text-black mb-1">{title}</Text>
        <Text className="text-sm text-gray-400 mb-5">{subtitle}</Text>

        {role === 'Citizen' && renderCitizenFields()}
        {role === 'Responder' && renderResponderFields()}
        {role === 'Admin' && renderAdminFields()}

        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Create a strong password"
            placeholderTextColor="#999"
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text>👁️</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-400 self-start mb-2">
          Minimum 8 characters with letters, numbers and symbols
        </Text>

        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Confirm Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Text>👁️</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row w-full mt-6 mb-4 gap-3">
          <TouchableOpacity
            className="flex-1 h-12 rounded-xl border-2 border-[#D62828] justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[#D62828] text-sm font-bold">← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-[2] h-12 rounded-xl bg-[#D62828] justify-center items-center"
            onPress={handleRegister}
          >
            <Text className="text-white text-sm font-bold">Complete Registration →</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <Text className="text-sm text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-sm text-[#D62828] font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}