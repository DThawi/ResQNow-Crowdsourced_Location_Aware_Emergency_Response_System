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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';

const InputField = ({
  label,
  iconComponent,
  placeholder,
  onChangeText,
  keyboardType,
  multiline,
  required = true,
}) => (
  <View style={{ width: '100%' }}>
    <Text style={styles.label}>
      {label}{required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <View style={[styles.inputBox, multiline && styles.inputBoxMultiline]}>
      {iconComponent && <View style={styles.iconWrap}>{iconComponent}</View>}
      <TextInput
        style={[styles.textInput, multiline && { textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor="#aaaaaa"
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        multiline={multiline || false}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
    </View>
  </View>
);

export default function Register3({ navigation, route }) {
  const { role, name, email, contact_number, nic } = route?.params || {};

  const [organizationType, setOrganizationType] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [position, setPosition] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const handleContinue = () => {
    if (!organizationType || !organizationName || !orgPhone || !position) {
      alert('Please fill in all required fields');
      return;
    }
    navigation.navigate('Register4', {
      role, name, email, contact_number, nic,
      organizationType, organizationName, orgPhone, position, employeeId,
    });
  };

  return (
    <View style={styles.screen}>
      <GradientHeader title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Step indicator */}
        <View style={styles.stepWrap}>
          <Text style={styles.stepText}>Step 2 of 6</Text>
          <View style={styles.stepBar}>
            <View style={[styles.stepFill, { width: '33%' }]} />
          </View>
        </View>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="office-building-outline" size={32} color="#D62828" />
        </View>

        <Text style={styles.title}>Organization Details</Text>
        <Text style={styles.subtitle}>Tell us about your organization and role</Text>

        {/* Fields */}
        <InputField
          label="Organization Type"
          placeholder="e.g., Fire Department, Police, Hospital"
          onChangeText={setOrganizationType}
        />

        <InputField
          label="Organization Name"
          iconComponent={<MaterialCommunityIcons name="office-building-outline" size={18} color="#aaaaaa" />}
          placeholder="e.g., Colombo Fire Department"
          onChangeText={setOrganizationName}
        />

        <InputField
          label="Phone Number"
          iconComponent={<Feather name="phone" size={18} color="#aaaaaa" />}
          placeholder="Enter organization phone number"
          onChangeText={setOrgPhone}
          keyboardType="phone-pad"
        />

        <InputField
          label="Official Position / Role"
          iconComponent={<MaterialCommunityIcons name="badge-account-outline" size={18} color="#aaaaaa" />}
          placeholder="e.g., Field Officer, Paramedic"
          onChangeText={setPosition}
        />

        <InputField
          label="Official ID / Employee Number"
          iconComponent={<MaterialCommunityIcons name="briefcase-outline" size={18} color="#aaaaaa" />}
          placeholder="Optional"
          onChangeText={setEmployeeId}
          required={false}
        />

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
  stepText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
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
    backgroundColor: '#FFE5E5',
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
    marginBottom: 5,
  },
  required: {
    color: '#D62828',
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
    height: 80,
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
