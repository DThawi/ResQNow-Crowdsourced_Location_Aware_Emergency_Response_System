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

  const handleRegister = async () => {
    if (!name || !email || !contact_number || !nic || !address || !password || !confirmPassword || !district) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    try {
      await API.post('/auth/register', {
        name,
        email,
        password,
        role,
        district,
        contact_number,
        organization,
        latitude: 0,
        longitude: 0,
      });
      navigation.navigate('VerifyIdentity');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>

        <View className="w-[70px] h-[70px] rounded-full bg-[#FFE5E5] justify-center items-center mb-3">
          <Text className="text-3xl">👤</Text>
        </View>

        <Text className="text-xl font-bold text-black mb-1">Personal Information</Text>
        <Text className="text-sm text-gray-400 mb-5">Please provide your personal details</Text>

        {/* Full Name */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Full Name <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">👤</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Email <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">✉️</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your email"
            placeholderTextColor="#999"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Phone Number <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">📞</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* NIC */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          NIC / Passport Number <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">💳</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your NIC or Passport Number"
            placeholderTextColor="#999"
            onChangeText={setNic}
          />
        </View>

        {/* District */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          District <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">🗺️</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your district"
            placeholderTextColor="#999"
            onChangeText={setDistrict}
          />
        </View>

        {/* Organization (optional for non-responders) */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Organization <Text className="text-gray-400">(optional)</Text>
        </Text>
        <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white w-full h-12 mb-1">
          <Text className="mr-2">🏢</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your organization"
            placeholderTextColor="#999"
            onChangeText={setOrganization}
          />
        </View>

        {/* Address */}
        <Text className="text-sm font-bold text-black self-start mb-1 mt-2">
          Residential Address <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-start border-2 border-gray-200 rounded-lg px-3 pt-3 bg-white w-full h-20 mb-1">
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Enter your complete address (Street, Building, Landmark)"
            placeholderTextColor="#999"
            onChangeText={setAddress}
            multiline
          />
          <Text className="ml-2">📍</Text>
        </View>

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Buttons */}
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