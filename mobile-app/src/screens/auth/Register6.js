import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/layout/header';
import API from '../../services/api';

// ── Single upload field ───────────────────────────────────────────────────────
const UploadField = ({ label, subtitle, required, file, onPick, onRemove }) => (
  <View className="w-full mb-5">
    <Text className="text-sm font-bold text-black mb-1">
      {label} {required && <Text className="text-[#D62828]">*</Text>}
    </Text>
    {subtitle && (
      <Text className="text-xs text-gray-400 mb-2">{subtitle}</Text>
    )}

    {file ? (
      /* File selected view container */
      <View className="border border-green-400 bg-green-50 rounded-xl px-4 py-3 flex-row items-center">
        <Ionicons name="document-outline" size={20} color="#10B981" />
        <Text className="text-xs text-green-700 font-semibold ml-2 flex-1" numberOfLines={1}>
          {file.name}
        </Text>
        <TouchableOpacity onPress={onRemove} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    ) : (
      /* Empty upload box target element */
      <TouchableOpacity
        onPress={onPick}
        className="border border-dashed border-gray-300 bg-gray-50 rounded-xl py-6 items-center justify-center"
      >
        <Feather name="upload" size={26} color="#F59E0B" style={{ marginBottom: 6 }} />
        <Text style={{ fontFamily: 'sans-serif' }} className="text-sm font-semibold text-gray-500">Click to upload or drag and drop</Text>
        <Text style={{ fontFamily: 'sans-serif' }} className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max. 10MB)</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Main Screen Component ─────────────────────────────────────────────────────
export default function Register6({ navigation, route }) {
  const prevData = route.params || {};

  // Form input authentication data values states tracking arrays
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Core verification structural reference files values states
  const [officialId, setOfficialId] = useState(null);
  const [authLetter, setAuthLetter] = useState(null);
  const [certCards, setCertCards] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async (setter) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File too large', 'Please select a file under 10MB');
          return;
        }
        setter(file);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open file picker');
    }
  };

  const handleSubmit = async () => {
    // 1. Core security authorization password entries validations layer rules
    if (!password) {
      Alert.alert('Required', 'Please enter a password');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    // 2. Mandatory document uploads checkpoints validation layer checks
    if (!officialId) {
      Alert.alert('Required', 'Please upload your Official ID / Employee Badge');
      return;
    }
    if (!authLetter) {
      Alert.alert('Required', 'Please upload your Authorization Letter');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // ── Clean up prior context data properties elements ──
      Object.entries(prevData).forEach(([key, value]) => {
        if (
          value !== undefined && 
          value !== null && 
          key !== 'role' && 
          key !== 'status' && 
          key !== 'organization' &&
          key !== 'latitude' &&
          key !== 'longitude' &&
          key !== 'location'
        ) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      //  FORCE EXPLICIT PARAMETER MAPPINGS (Matches model enum capitalization rules exactly)
      formData.append('role', 'Responder'); 
      formData.append('password', password);
      formData.append('status', 'Pending');   

      //  RESOLVE SPATIAL COORDINATES EXPLICITLY
      // Checks for fallbacks if coordinates are nested inside a sub-object from prior steps
      const latValue = prevData.latitude || prevData.location?.latitude || 0;
      const lngValue = prevData.longitude || prevData.location?.longitude || 0;
      formData.append('latitude', String(latValue));
      formData.append('longitude', String(lngValue));

      // RESOLVE ORGANIZATION NAMING PARAMETERS
      const organizationFallback = 
        prevData.organization || 
        prevData.organizationName || 
        prevData.company || 
        prevData.org || 
        "Emergency Services Provider";
      formData.append('organization', organizationFallback);

      // 🎯 CROSS-PLATFORM URI PARSING SYSTEM LINK FILTER
      const cleanFileUri = (uri) => {
        if (!uri) return '';
        return Platform.OS === 'android' ? uri : uri.replace('file://', '');
      };

      // Append multi-part network attachments document buffers streams
      formData.append('officialId', {
        uri: cleanFileUri(officialId.uri),
        name: officialId.name || 'officialId.jpg',
        type: officialId.mimeType || 'image/jpeg',
      });
      formData.append('authLetter', {
        uri: cleanFileUri(authLetter.uri),
        name: authLetter.name || 'authLetter.jpg',
        type: authLetter.mimeType || 'image/jpeg',
      });
      if (certCards) {
        formData.append('certCards', {
          uri: cleanFileUri(certCards.uri),
          name: certCards.name || 'certCards.jpg',
          type: certCards.mimeType || 'image/jpeg',
        });
      }

      await API.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigation.navigate('Register7');
    } catch (err) {
      // 🎯 REAL MESSAGE REPORTING TOOL
      // Captures exact server responses directly from your Node console log streams
      const backendErrorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      Alert.alert('Registration Error', backendErrorMessage || 'Submission failed. Please try again.');
      console.log("Detailed Network Submit Error Payload ❌:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>

        {/* Step progress loading meter indicator components */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-400 font-semibold">Step 6 of 6</Text>
            <Text className="text-xs text-[#D62828] font-bold">Verification</Text>
          </View>
          <View className="w-full h-1 bg-gray-200 rounded-full">
            <View className="h-1 bg-[#D62828] rounded-full w-full" />
          </View>
        </View>

        {/* Icon titles layout configurations card */}
        <View className="items-center mb-5">
          <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mb-3">
            <Ionicons name="document-text-outline" size={30} color="#7C3AED" />
          </View>
          <Text className="text-xl font-bold text-black mb-1">Document Verification</Text>
          <Text className="text-sm text-gray-400 text-center">
            Upload required documents for verification
          </Text>
        </View>

        {/* System parameters warnings guidelines alert badge */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex-row">
          <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginTop: 1, marginRight: 8 }} />
          <View className="flex-1">
            <Text className="text-xs font-bold text-yellow-800 mb-1">Important</Text>
            <Text className="text-xs text-yellow-700 leading-4">
              All documents will be reviewed by our verification team. Please ensure they are clear, readable, and valid.
            </Text>
          </View>
        </View>

        {/* ── PASSWORD FORM SECTION ── */}
        <Text className="text-sm font-bold text-black mb-1">
          Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="border border-gray-300 rounded-xl bg-white flex-row items-center px-3 h-12 mb-4">
          <TextInput
            className="flex-1 text-black"
            placeholder="Create Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-bold text-black mb-1">
          Confirm Password <Text className="text-[#D62828]">*</Text>
        </Text>
        <View className="border border-gray-300 rounded-xl bg-white flex-row items-center px-3 h-12 mb-6">
          <TextInput
            className="flex-1 text-black"
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {/* ──────────────────────────────────────────────────────────────────────── */}

        {/* Action picker component elements mapping layout cards */}
        <UploadField
          label="Official ID / Employee Badge"
          subtitle="Upload a clear photo of your official ID or employee badge"
          required
          file={officialId}
          onPick={() => pickDocument(setOfficialId)}
          onRemove={() => setOfficialId(null)}
        />

        <UploadField
          label="Authorization Letter / Appointment Letter"
          subtitle="Letter from your organization authorizing you as a responder"
          required
          file={authLetter}
          onPick={() => pickDocument(setAuthLetter)}
          onRemove={() => setAuthLetter(null)}
        />

        <UploadField
          label="Certification Cards"
          subtitle="Upload any relevant certification cards (CPR, EMT, First Aid, etc.)"
          file={certCards}
          onPick={() => pickDocument(setCertCards)}
          onRemove={() => setCertCards(null)}
        />

        {/* Form triggers row actions navigation bars */}
        <View className="flex-row w-full mt-2 mb-4" style={{ gap: 12 }}>
          <TouchableOpacity
            className="flex-1 h-12 rounded-full border-2 border-[#D62828] justify-center items-center flex-row"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text className="text-[#D62828] text-sm font-bold">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-[2] h-12 rounded-full justify-center items-center flex-row ${loading ? 'bg-green-400' : 'bg-green-500'}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="white" style={{ marginRight: 6 }} />
                <Text className="text-white text-sm font-bold">Submit for Verification</Text>
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
