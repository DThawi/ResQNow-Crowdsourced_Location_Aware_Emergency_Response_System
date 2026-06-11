import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location'; // 1. IMPORT SENSOR BINDINGS
import API from '../../services/api';
import GradientHeader from '../../components/layout/header';

const InputField = ({
  label, iconComponent, placeholder, onChangeText, keyboardType, secureTextEntry, multiline, required = true,
}) => (
  <View style={{ width: '100%' }}>
    <Text style={styles.label}>
      {label}{required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <View style={[styles.inputBox, multiline && styles.inputBoxMultiline]}>
      <View style={styles.iconWrap}>{iconComponent}</View>
      <TextInput
        style={[styles.textInput, multiline && { textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor="#aaaaaa"
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry || false}
        multiline={multiline || false}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  </View>
);

export default function Register2({ navigation, route }) {
  const rawRole = route?.params?.role;
  const role = rawRole ? rawRole.trim() : '';

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
  const [loading, setLoading] = useState(false); // Add indicator state

  const isCitizen = role === 'Citizen';
  const isResponder = role === 'Authority';

  const handleContinue = async () => {
    if (isCitizen) {
      if (!name || !email || !contact_number || !nic || !address || !district || !password || !confirmPassword) {
        Alert.alert('Required', 'Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Mismatch', 'Passwords do not match');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters');
        return;
      }

      setLoading(true);
      try {
        // 2. REQUEST SMARTPHONE LOCATION SERVICE PERMISSIONS
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required to use ResQNow Emergency dispatch safely.');
          setLoading(false);
          return;
        }

        // 3. CAPTURE HIGH ACCURACY METRICS FROM SMARTPHONE HARDWARE
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // 4. POST LIVE METRICS TO MONGO ENDPOINT
        await API.post('/auth/register', {
          name, 
          email, 
          password,
          role, 
          district, 
          contact_number,
          organization: "-", 
          latitude: location.coords.latitude,   // Live latitude mapping
          longitude: location.coords.longitude, // Live longitude mapping
        });

        Alert.alert('Success', 'Registration successful! Please login.');
        navigation.navigate('Login');
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else if (isResponder) {
      if (!name || !email || !contact_number || !nic) {
        Alert.alert('Required', 'Please fill in all fields');
        return;
      }
      // Pass fields onto step 3 tracking pipeline arrays
      navigation.navigate('Register3', { role, name, email, contact_number, nic, organization: '' });
    }
  };

  const getTitle = () => {
    if (isCitizen) return { title: 'Citizen Registration', subtitle: 'Please provide your personal details' };
    if (isResponder) return { title: 'Responder Registration', subtitle: 'Please provide your personal details' };
    return { title: 'Personal Information', subtitle: 'Please provide your details' };
  };

  const getRoleIcon = () => {
    if (isResponder) return <FontAwesome5 name="ambulance" size={26} color="#D62828" />;
    return <Ionicons name="person-outline" size={32} color="#D62828" />;
  };

  const { title, subtitle } = getTitle();

  const renderCommonFields = () => (
    <>
      <InputField label="Full Name" iconComponent={<Ionicons name="person-outline" size={18} color="#aaaaaa" />} placeholder="Enter your full name" onChangeText={setName} />
      <InputField label="Email" iconComponent={<Feather name="mail" size={18} color="#aaaaaa" />} placeholder="Enter your email" onChangeText={setEmail} keyboardType="email-address" />
      <InputField label="Phone Number" iconComponent={<Feather name="phone" size={18} color="#aaaaaa" />} placeholder="Enter your phone number" onChangeText={setContactNumber} keyboardType="phone-pad" />
      <InputField label="NIC / Passport Number" iconComponent={<MaterialCommunityIcons name="card-account-details-outline" size={18} color="#aaaaaa" />} placeholder="Enter your NIC or Passport Number" onChangeText={setNic} />
    </>
  );

  return (
    <View style={styles.screen}>
      <GradientHeader title="Create Account" onClose={() => navigation.navigate('Register1')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isResponder && (
          <View style={styles.stepWrap}>
            <Text style={styles.stepText}>Step 1 of 6</Text>
            <View style={styles.stepBar}><View style={styles.stepFill} /></View>
          </View>
        )}
        <View style={styles.iconCircle}>{getRoleIcon()}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {renderCommonFields()}

        {isCitizen && (
          <>
            <InputField label="District" iconComponent={<Ionicons name="map-outline" size={18} color="#aaaaaa" />} placeholder="Enter your district" onChangeText={setDistrict} />
            <InputField label="Residential Address" iconComponent={<Ionicons name="location-outline" size={18} color="#aaaaaa" />} placeholder="Enter your complete address" onChangeText={setAddress} multiline />
            <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
            <View style={styles.inputBox}>
              <View style={styles.iconWrap}><Feather name="lock" size={18} color="#aaaaaa" /></View>
              <TextInput style={styles.textInput} placeholder="Create a strong password" placeholderTextColor="#aaaaaa" onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Minimum 8 characters with letters, numbers and symbols</Text>

            <Text style={styles.label}>Confirm Password<Text style={styles.required}> *</Text></Text>
            <View style={styles.inputBox}>
              <View style={styles.iconWrap}><Feather name="lock" size={18} color="#aaaaaa" /></View>
              <TextInput style={styles.textInput} placeholder="Re-enter your password" placeholderTextColor="#aaaaaa" onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} autoCapitalize="none" />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#aaaaaa" />
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={loading}>
            <Text style={styles.continueBtnText}>{loading ? 'Processing...' : isCitizen ? 'Complete Registration' : 'Continue'}</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Keep styles identical to your existing implementation rules
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 24, alignItems: 'center' },
  stepWrap: { width: '100%', marginBottom: 16 },
  stepText: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  stepBar: { width: '100%', height: 4, backgroundColor: '#e5e7eb', borderRadius: 99 },
  stepFill: { width: '16%', height: 4, backgroundColor: '#D62828', borderRadius: 99 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#9ca3af', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, font0weight: 'bold', color: '#000000', alignSelf: 'flex-start', marginTop: 10, marginBottom: 5 },
  required: { color: '#D62828' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, width: '100%', height: 50, paddingHorizontal: 12, marginBottom: 4 },
  inputBoxMultiline: { height: 80, alignItems: 'flex-start', paddingTop: 12 },
  iconWrap: { marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  textInput: { flex: 1, fontSize: 14, color: '#000000', paddingVertical: 0, includeFontPadding: false },
  eyeBtn: { padding: 4 },
  hint: { fontSize: 12, color: '#9ca3af', alignSelf: 'flex-start', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', width: '100%', marginTop: 24, marginBottom: 16, gap: 12 },
  backBtn: { flex: 1, height: 48, borderRadius: 99, borderWidth: 2, borderColor: '#D62828', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#ffffff' },
  backBtnText: { color: '#D62828', fontSize: 14, fontWeight: 'bold' },
  continueBtn: { flex: 2, height: 48, borderRadius: 99, backgroundColor: '#D62828', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  continueBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
