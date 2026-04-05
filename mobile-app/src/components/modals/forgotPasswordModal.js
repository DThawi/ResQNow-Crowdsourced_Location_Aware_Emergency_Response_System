import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BaseModal from './baseModal';

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (visible && step === 4) {
      timer = setTimeout(() => resetAndClose(), 10000);
    }
    return () => clearTimeout(timer);
  }, [step, visible]);

  const resetAndClose = () => {
    setStep(1); setNewPassword(''); setConfirmPassword(''); onClose();
  };

  const has8Chars = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const canSubmitPassword = has8Chars && hasNumber && passwordsMatch;

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.stepCircle, step >= 1 ? styles.stepActive : styles.stepInactive]}><Text style={[styles.stepText, step >= 1 ? styles.textActive : styles.textInactive]}>1</Text></View>
      <View style={[styles.stepLine, step >= 2 ? styles.lineActive : styles.lineInactive]} />
      <View style={[styles.stepCircle, step >= 2 ? styles.stepActive : styles.stepInactive]}><Text style={[styles.stepText, step >= 2 ? styles.textActive : styles.textInactive]}>2</Text></View>
      <View style={[styles.stepLine, step >= 3 ? styles.lineActive : styles.lineInactive]} />
      <View style={[styles.stepCircle, step >= 3 ? styles.stepActive : styles.stepInactive]}><Text style={[styles.stepText, step >= 3 ? styles.textActive : styles.textInactive]}>3</Text></View>
    </View>
  );

  const renderHeader = (title, showBack) => (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.headerIcon}>
          <FontAwesome5 name="arrow-left" size={18} color="#333" />
        </TouchableOpacity>
      ) : <View style={styles.headerIcon} />}
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={resetAndClose} style={styles.headerIcon}>
        <AntDesign name="close" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <BaseModal visible={visible} onClose={resetAndClose} showCloseIcon={false} cardStyle={{ padding: 20, width: '90%' }}>
      {step === 1 && (
        <View style={styles.fullWidth}>
          {renderHeader("Forgot Password", false)}
          {renderStepIndicator()}
          <Text style={styles.label}>Email Address or Mobile Number</Text>
          <View style={styles.inputContainer}>
            <Feather name="phone" size={18} color="#999" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Enter email or phone number" placeholderTextColor="#AAA" keyboardType="email-address" autoCapitalize="none" />
          </View>
          <Text style={styles.description}>Enter the email or phone number you used to sign up. We'll send you a verification code.</Text>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}><Text style={styles.buttonText}>Send Reset Code</Text></TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.fullWidth}>
          {renderHeader("Verify Identity", true)}
          {renderStepIndicator()}
          <Text style={styles.label}>Verification Code</Text>
          <TextInput style={styles.codeInput} placeholder="Enter 6 - digit code" placeholderTextColor="#AAA" keyboardType="number-pad" maxLength={6} />
          <View style={styles.rowBetween}>
            <Text style={styles.subText}>Didn't receive the code?</Text>
            <Text style={styles.redTextSm}>Resend in 7s</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setStep(3)}><Text style={styles.buttonText}>Verify Code</Text></TouchableOpacity>
          <TouchableOpacity style={styles.centerLink} onPress={() => setStep(1)}><Text style={styles.redTextSm}>Change email/number</Text></TouchableOpacity>
          <View style={styles.infoBox}>
            <FontAwesome5 name="exclamation-circle" solid size={14} color="#999" style={{marginTop: 2}} />
            <Text style={styles.infoText}>Code expires in 5 minutes. For security, this code can only be used once</Text>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.fullWidth}>
          {renderHeader("Set New Password", true)}
          {renderStepIndicator()}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#999" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Enter New Password" secureTextEntry={!showPassword} placeholderTextColor="#AAA" value={newPassword} onChangeText={setNewPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#999" /></TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#999" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Confirm new password" secureTextEntry={!showConfirmPassword} placeholderTextColor="#AAA" value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}><Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#999" /></TouchableOpacity>
          </View>
          <View style={styles.requirementsBox}>
            <Text style={styles.reqTitle}>Password requirements:</Text>
            <View style={styles.reqRow}><Ionicons name={has8Chars ? "checkmark-circle" : "ellipse-outline"} size={16} color={has8Chars ? "#4CAF50" : "#999"} /><Text style={[styles.reqText, has8Chars && {color: '#4CAF50', fontWeight: '500'}]}>At least 8 characters</Text></View>
            <View style={styles.reqRow}><Ionicons name={hasNumber ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasNumber ? "#4CAF50" : "#999"} /><Text style={[styles.reqText, hasNumber && {color: '#4CAF50', fontWeight: '500'}]}>One number</Text></View>
            {confirmPassword.length > 0 && !passwordsMatch && <Text style={{color: '#D32F2F', fontSize: 11, marginTop: 5}}>Passwords do not match</Text>}
          </View>
          <TouchableOpacity style={[styles.button, { opacity: canSubmitPassword ? 1 : 0.6 }]} disabled={!canSubmitPassword} onPress={() => setStep(4)}><Text style={styles.buttonText}>Reset Password</Text></TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={styles.fullWidth}>
          {renderHeader("Set New Password", false)}
          <View style={styles.successContainer}>
            <View style={styles.iconCircle}><FontAwesome5 name="check-circle" solid={false} size={50} color="#4CAF50" /></View>
            <Text style={styles.successTitle}>Password Reset Successfully!</Text>
            <Text style={styles.successSub}>Your password has been updated.</Text>
            <TouchableOpacity style={[styles.button, {marginTop: 30}]} onPress={resetAndClose}><Text style={styles.buttonText}>Continue to Login</Text></TouchableOpacity>
            <TouchableOpacity onPress={resetAndClose}><Text style={styles.timerLink}>Auto-redirecting in 10 seconds...</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
  headerIcon: { width: 24, alignItems: 'center' },
  stepContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: '#D32F2F' },
  stepInactive: { backgroundColor: '#F0F0F0' },
  textActive: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  textInactive: { color: '#999', fontSize: 12, fontWeight: 'bold' },
  stepLine: { width: 40, height: 2 },
  lineActive: { backgroundColor: '#D32F2F' },
  lineInactive: { backgroundColor: '#F0F0F0' },
  label: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  description: { fontSize: 12, color: '#666', marginTop: 10, marginBottom: 20, lineHeight: 18 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#333' },
  codeInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 15, height: 50, fontSize: 16, color: '#333', textAlign: 'center', letterSpacing: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 15 },
  subText: { fontSize: 12, color: '#999' },
  redTextSm: { fontSize: 12, color: '#D32F2F', fontWeight: '500' },
  centerLink: { alignItems: 'center', marginTop: 15, marginBottom: 15, paddingVertical: 5 },
  infoBox: { flexDirection: 'row', backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, marginTop: 10 },
  infoText: { fontSize: 11, color: '#666', marginLeft: 8, flex: 1, lineHeight: 16 },
  requirementsBox: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 10, marginTop: 15, marginBottom: 15 },
  reqTitle: { fontSize: 11, fontWeight: '600', color: '#333', marginBottom: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reqText: { fontSize: 12, color: '#666', marginLeft: 8 },
  button: { backgroundColor: '#D32F2F', height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: '100%' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  iconCircle: { backgroundColor: '#E8F5E9', width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  successSub: { fontSize: 13, color: '#666' },
  timerLink: { fontSize: 12, color: '#AAA', marginTop: 15, fontStyle: 'italic', textDecorationLine: 'underline', padding: 5 },
});

export default ForgotPasswordModal;
