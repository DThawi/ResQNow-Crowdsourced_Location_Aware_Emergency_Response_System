import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
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
      // File selected
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
      // Empty upload box
      <TouchableOpacity
        onPress={onPick}
        className="border border-dashed border-gray-300 bg-gray-50 rounded-xl py-6 items-center justify-center"
      >
        <Feather name="upload" size={26} color="#F59E0B" style={{ marginBottom: 6 }} />
        <Text className="text-sm font-semibold text-gray-500">Click to upload or drag and drop</Text>
        <Text className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max. 10MB)</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function Register6({ navigation, route }) {
  const prevData = route.params || {};

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

      // Append all registration data collected from previous steps
      Object.entries(prevData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Arrays need to be stringified
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
      formData.append('role', 'responder');

      // Append documents
      formData.append('officialId', {
        uri: officialId.uri,
        name: officialId.name,
        type: officialId.mimeType || 'application/octet-stream',
      });
      formData.append('authLetter', {
        uri: authLetter.uri,
        name: authLetter.name,
        type: authLetter.mimeType || 'application/octet-stream',
      });
      if (certCards) {
        formData.append('certCards', {
          uri: certCards.uri,
          name: certCards.name,
          type: certCards.mimeType || 'application/octet-stream',
        });
      }

      await API.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigation.navigate('Register7');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>

        {/* Step indicator */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-400 font-semibold">Step 6 of 6</Text>
            <Text className="text-xs text-[#D62828] font-bold">Verification</Text>
          </View>
          <View className="w-full h-1 bg-gray-200 rounded-full">
            <View className="h-1 bg-[#D62828] rounded-full w-full" />
          </View>
        </View>

        {/* Icon + Title */}
        <View className="items-center mb-5">
          <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mb-3">
            <Ionicons name="document-text-outline" size={30} color="#7C3AED" />
          </View>
          <Text className="text-xl font-bold text-black mb-1">Document Verification</Text>
          <Text className="text-sm text-gray-400 text-center">
            Upload required documents for verification
          </Text>
        </View>

        {/* Important notice */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex-row">
          <Ionicons name="information-circle" size={18} color="#D97706" style={{ marginTop: 1, marginRight: 8 }} />
          <View className="flex-1">
            <Text className="text-xs font-bold text-yellow-800 mb-1">Important</Text>
            <Text className="text-xs text-yellow-700 leading-4">
              All documents will be reviewed by our verification team. Please ensure they are clear, readable, and valid.
            </Text>
          </View>
        </View>

        {/* Upload fields */}
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

        {/* Buttons */}
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