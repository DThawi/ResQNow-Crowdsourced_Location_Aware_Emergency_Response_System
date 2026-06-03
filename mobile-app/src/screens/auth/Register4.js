import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';

const CERTIFICATIONS = ['First Aid', 'CPR', 'Search & Rescue', 'EMT', 'Lifeguard', 'Disaster Response'];

export default function Register4({ navigation, route }) {
  const params = route?.params || {};

  const [selectedCerts, setSelectedCerts] = useState([]);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [trainingCompleted, setTrainingCompleted] = useState('');

  const toggleCert = (cert) => {
    setSelectedCerts(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleContinue = () => {
    if (!yearsOfExperience) {
      alert('Please enter your years of experience');
      return;
    }
    navigation.navigate('Register5', {
      ...params,
      selectedCerts,
      yearsOfExperience,
      trainingCompleted,
    });
  };

  return (
    <View style={styles.screen}>
      <GradientHeader title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Step indicator */}
        <View style={styles.stepWrap}>
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>Step 4 of 6</Text>
            <Text style={styles.stepLabel}>Skills</Text>
          </View>
          <View style={styles.stepBar}>
            <View style={[styles.stepFill, { width: '66%' }]} />
          </View>
        </View>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="certificate-outline" size={32} color="#D4A017" />
        </View>

        <Text style={styles.title}>Credentials & Skills</Text>
        <Text style={styles.subtitle}>Share your certifications and expertise</Text>

        {/* Certifications */}
        <Text style={styles.label}>
          Relevant Certifications <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.hint}>Select all that apply</Text>

        <View style={styles.certGrid}>
          {CERTIFICATIONS.map((cert) => {
            const selected = selectedCerts.includes(cert);
            return (
              <TouchableOpacity
                key={cert}
                style={[styles.certChip, selected && styles.certChipSelected]}
                onPress={() => toggleCert(cert)}
              >
                <Text style={[styles.certChipText, selected && styles.certChipTextSelected]}>
                  {cert}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Years of Experience */}
        <Text style={styles.label}>
          Years of Experience <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputBox}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#aaaaaa" />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 5"
            placeholderTextColor="#aaaaaa"
            onChangeText={setYearsOfExperience}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Training Completed */}
        <Text style={styles.label}>Training Completed</Text>
        <View style={[styles.inputBox, styles.inputBoxMultiline]}>
          <TextInput
            style={[styles.textInput, { textAlignVertical: 'top' }]}
            placeholder="List any relevant training programs, workshops, or courses you've completed..."
            placeholderTextColor="#aaaaaa"
            onChangeText={setTrainingCompleted}
            multiline
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
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
    backgroundColor: '#FFF8E7',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 4,
  },
  required: {
    color: '#D62828',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  certGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 8,
    marginBottom: 8,
  },
  certChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  certChipSelected: {
    borderColor: '#D62828',
    backgroundColor: '#FFF0F0',
  },
  certChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  certChipTextSelected: {
    color: '#D62828',
    fontWeight: 'bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    width: '100%',
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 4,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  inputBoxMultiline: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  iconWrap: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
    includeFontPadding: false,
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
    height: 48,
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
  continueBtn: {
    flex: 2,
    height: 48,
    borderRadius: 99,
    backgroundColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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