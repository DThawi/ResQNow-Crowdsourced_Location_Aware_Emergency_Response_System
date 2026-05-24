import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Header from '../../components/layout/header';
import API from '../../services/api';

export default function Register8({ navigation, route }) {
  // All data collected from Register2 → Register3 → Register4 → Register5 → Register6
  const prevData = route.params || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCompleteRegistration = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Required', 'Please fill in all fields'); return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters'); return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match'); return;
    }
    if (!acceptedTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms and Conditions'); return;
    }

    setLoading(true);
    try {
      // Backend required fields: name, email, password, role, district,
      // longitude, latitude, organization, contact_number
      await API.post('/auth/register', {
        name: prevData.name,
        email: prevData.email,
        password,
        role: 'Authority',          // backend expects 'Authority' for Responders
        district: prevData.district || '',
        organization: prevData.organizationName || prevData.orgName || prevData.organization || '',
        contact_number: prevData.contact_number || '',
        latitude: prevData.latitude || 0,
        longitude: prevData.longitude || 0,
      });

      navigation.navigate('Register7'); // Account Under Review screen
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>

        <Text className="text-xl font-bold text-black mb-1">Account Security</Text>
        <Text className="text-sm text-gray-400 mb-6">Create a strong password for your account</Text>

        {/* Password */}
        <Text className="text-sm font-bold text-black mb-1">
          Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white h-12 mb-1">
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Create a strong password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#999" />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-400 mb-4">
          Minimum 8 characters with letters, numbers and symbols
        </Text>

        {/* Confirm Password */}
        <Text className="text-sm font-bold text-black mb-1">
          Confirm Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="flex-row items-center border border-gray-200 rounded-xl px-3 bg-white h-12 mb-6">
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity
          className="flex-row items-start mb-8"
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          style={{ gap: 10 }}
        >
          <View className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${acceptedTerms ? 'bg-[#D62828] border-[#D62828]' : 'bg-white border-gray-400'}`}>
            {acceptedTerms && <Ionicons name="checkmark" size={12} color="white" />}
          </View>
          <Text className="flex-1 text-sm text-gray-600 leading-5">
            I accept the <Text className="text-[#D62828] font-bold">Terms and Conditions</Text> and <Text className="text-[#D62828] font-bold">Privacy Policy</Text> of ResQNow Emergency Alert System
          </Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View className="flex-row w-full mb-4" style={{ gap: 12 }}>
          <TouchableOpacity
            className="flex-1 h-12 rounded-full border-2 border-[#D62828] justify-center items-center flex-row"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text className="text-[#D62828] text-sm font-bold">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-[2] h-12 rounded-full justify-center items-center flex-row ${loading ? 'bg-red-400' : 'bg-[#D62828]'}`}
            onPress={handleCompleteRegistration}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text className="text-white text-sm font-bold mr-1">Complete Registration</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center mb-6">
          <Text className="text-sm text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-sm text-[#D62828] font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}