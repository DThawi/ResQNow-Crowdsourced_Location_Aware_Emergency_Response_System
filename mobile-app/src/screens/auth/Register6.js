import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import GradientHeader from '../../components/layout/header';
import API from '../../services/api';

const UploadBox = ({ file, onPress }) => (
  <TouchableOpacity style={styles.uploadBox} onPress={onPress} activeOpacity={0.7}>
    <Feather name="upload" size={24} color="#D4A017" />
    {file ? (
      <Text style={styles.uploadedFileName} numberOfLines={1}>{file.name}</Text>
    ) : (
      <>
        <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
        <Text style={styles.uploadHint}>PNG, JPG, PDF (max. 10MB)</Text>
      </>
    )}
  </TouchableOpacity>
);

export default function Register6({ navigation, route }) {
  const params = route?.params || {};

  const [officialIdFile, setOfficialIdFile] = useState(null);
  const [authLetterFile, setAuthLetterFile] = useState(null);
  const [certCardsFile, setCertCardsFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async (setter) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/jpeg', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setter(result.assets[0]);
      }
    } catch (err) {
      alert('Failed to pick file');
    }
  };

  const handleSubmit = async () => {
    if (!officialIdFile) {
      alert('Please upload your Official ID / Employee Badge');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/register', {
        ...params,
        latitude: 0,
        longitude: 0,
      });
      navigation.navigate('Login');
      alert('Registration submitted! Our team will review your documents.');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <GradientHeader title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Step indicator */}
        <View style={styles.stepWrap}>
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>Step 6 of 6</Text>
            <Text style={styles.stepLabel}>Verification</Text>
          </View>
          <View style={styles.stepBar}>
            <View style={[styles.stepFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="file-document-outline" size={32} color="#a855f7" />
        </View>

        <Text style={styles.title}>Document Verification</Text>
        <Text style={styles.subtitle}>Upload required documents for verification</Text>

        {/* Important notice */}
        <View style={styles.noticeBox}>
          <View style={styles.noticeRow}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#D4A017" style={{ marginRight: 6, marginTop: 1 }} />
            <Text style={styles.noticeTitle}>Important</Text>
          </View>
          <Text style={styles.noticeText}>
            All documents will be reviewed by our verification team. Please ensure they are clear, readable, and valid.
          </Text>
        </View>

        {/* Official ID */}
        <Text style={styles.label}>
          Official ID / Employee Badge <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.fieldHint}>Upload a clear photo of your official ID or employee badge</Text>
        <UploadBox file={officialIdFile} onPress={() => pickFile(setOfficialIdFile)} />

        {/* Auth Letter */}
        <Text style={styles.label}>Authorization Letter / Appointment Letter</Text>
        <Text style={styles.fieldHint}>Letter from your organization authorizing you as a responder</Text>
        <UploadBox file={authLetterFile} onPress={() => pickFile(setAuthLetterFile)} />

        {/* Cert Cards */}
        <Text style={styles.label}>Certification Cards</Text>
        <Text style={styles.fieldHint}>Upload any relevant certification cards (CPR, EMT, First Aid, etc.)</Text>
        <UploadBox file={certCardsFile} onPress={() => pickFile(setCertCardsFile)} />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.submitBtnText}>
              {loading ? 'Submitting...' : 'Submit for\nVerification'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  stepWrap: {
    width: '100%',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  stepLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  stepBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 99,
  },
  stepFill: {
    height: 4,
    backgroundColor: '#D62828',
    borderRadius: 99,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FAF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
  },
  noticeBox: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4A017',
  },
  noticeText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 4,
  },
  required: {
    color: '#D62828',
  },
  fieldHint: {
    fontSize: 12,
    color: '#9ca3af',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  uploadBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  uploadText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginTop: 6,
  },
  uploadHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  uploadedFileName: {
    fontSize: 13,
    color: '#D62828',
    fontWeight: '600',
    marginTop: 6,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 56,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  backBtnText: {
    color: '#D62828',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitBtn: {
    flex: 2,
    height: 56,
    borderRadius: 99,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  signinText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  signinLink: {
    fontSize: 14,
    color: '#D62828',
    fontWeight: 'bold',
  },
});