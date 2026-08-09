import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator,
  StyleSheet 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../../services/api";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password Input, 4: Password Validated, 5: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Dynamic Validation Rules
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const isPasswordValid = hasMinLength && hasNumber && newPassword === confirmPassword && newPassword !== "";

  // Auto-redirect timer on final success screen
  useEffect(() => {
    let timer;
    if (step === 5 && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 5 && redirectCountdown === 0) {
      handleClose();
    }
    return () => clearInterval(timer);
  }, [step, redirectCountdown]);

  // STEP 1: Request OTP
  const handleSendOTP = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email or mobile number.");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setStep(2);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) return Alert.alert("Error", "Please enter the 6-digit verification code.");
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 & 4: Reset Password
  const handleResetPassword = async () => {
    if (!isPasswordValid) return;
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      setStep(5);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRedirectCountdown(10);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Top Bar: Back & Close Icons */}
          <View style={styles.topHeader}>
            {step > 1 && step < 5 ? (
              <TouchableOpacity onPress={() => setStep(step - 1)}>
                <Ionicons name="arrow-back" size={22} color="#222" />
              </TouchableOpacity>
            ) : <View style={{ width: 22 }} />}

            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          {/* Stepper Progress Bar (Steps 1, 2, 3) */}
          {step <= 4 && (
            <View style={styles.stepperContainer}>
              <View style={[styles.stepDot, step >= 1 && styles.activeDot]}>
                <Text style={styles.dotText}>1</Text>
              </View>
              <View style={[styles.stepLine, step >= 2 && styles.activeLine]} />
              <View style={[styles.stepDot, step >= 2 && styles.activeDot]}>
                <Text style={styles.dotText}>2</Text>
              </View>
              <View style={[styles.stepLine, step >= 3 && styles.activeLine]} />
              <View style={[styles.stepDot, step >= 3 && styles.activeDot]}>
                <Text style={styles.dotText}>3</Text>
              </View>
            </View>
          )}

          {/* ── SCREEN 1: FORGOT PASSWORD ── */}
          {step === 1 && (
            <View>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.label}>Email Address or Mobile Number</Text>
              <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={18} color="#666" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="example@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  style={styles.input}
                />
              </View>
              <Text style={styles.subtext}>
                Enter the email or phone number you used to sign up. We'll send you a verification code.
              </Text>

              <TouchableOpacity
                onPress={handleSendOTP}
                disabled={loading}
                style={styles.redButton}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.redButtonText}>Send Reset Code</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* ── SCREEN 2: VERIFY IDENTITY ── */}
          {step === 2 && (
            <View>
              <Text style={styles.title}>Verify Identity</Text>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Enter 6 - digit code"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#b0b0b0"
                  style={[styles.input, { textAlign: 'center' }]}
                />
              </View>

              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't receive the code?</Text>
                <TouchableOpacity onPress={handleSendOTP}>
                  <Text style={styles.resendText}>Resend</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={loading}
                style={styles.redButton}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.redButtonText}>Verify Code</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(1)} style={styles.linkButton}>
                <Text style={styles.linkText}>Change email/number</Text>
              </TouchableOpacity>

              <View style={styles.infoBanner}>
                <Ionicons name="alert-circle" size={18} color="#888" style={{ marginRight: 8 }} />
                <Text style={styles.infoText}>
                  Code expires in 5 minutes. For security, this code can only be used once
                </Text>
              </View>
            </View>
          )}

          {/* ── SCREEN 3 & 4: SET NEW PASSWORD ── */}
          {(step === 3 || step === 4) && (
            <View>
              <Text style={styles.title}>Set New Password</Text>
              
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChangeText={(val) => {
                    setNewPassword(val);
                    if (val.length >= 8 && /\d/.test(val) && val === confirmPassword) setStep(4);
                    else setStep(3);
                  }}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#b0b0b0"
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (hasMinLength && hasNumber && newPassword === val) setStep(4);
                    else setStep(3);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#b0b0b0"
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.requirementBanner}>
                <Text style={styles.requirementTitle}>Password requirements:</Text>
                
                <View style={styles.requirementRow}>
                  <Ionicons 
                    name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={hasMinLength ? "#2e7d32" : "#999"} 
                  />
                  <Text style={[styles.requirementText, hasMinLength && styles.requirementMetText]}>
                    At least 8 characters
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  <Ionicons 
                    name={hasNumber ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={hasNumber ? "#2e7d32" : "#999"} 
                  />
                  <Text style={[styles.requirementText, hasNumber && styles.requirementMetText]}>
                    One number
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading || !isPasswordValid}
                style={[
                  styles.redButton,
                  !isPasswordValid && styles.disabledRedButton
                ]}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.redButtonText}>Reset Password</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* ── SCREEN 5: SUCCESS CONFIRMATION ── */}
          {step === 5 && (
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <Text style={styles.title}>Set New Password</Text>

              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={36} color="#2e7d32" />
              </View>

              <Text style={styles.successTitle}>Password Reset Successfully!</Text>
              <Text style={styles.subtext}>Your password has been updated.</Text>

              <TouchableOpacity onPress={handleClose} style={styles.redButton}>
                <Text style={styles.redButtonText}>Continue to Login</Text>
              </TouchableOpacity>

              <Text style={styles.redirectText}>
                Auto-redirecting in {redirectCountdown} seconds...
              </Text>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#b71c1c',
  },
  dotText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 45,
    height: 2,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 2,
  },
  activeLine: {
    backgroundColor: '#b71c1c',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  subtext: {
    fontSize: 11,
    color: '#777',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 15,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  resendLabel: {
    fontSize: 11,
    color: '#888',
  },
  resendText: {
    fontSize: 11,
    color: '#b71c1c',
    fontWeight: 'bold',
  },
  redButton: {
    backgroundColor: '#b71c1c',
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  disabledRedButton: {
    backgroundColor: '#e57373',
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    color: '#b71c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    lineHeight: 14,
  },
  requirementBanner: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  requirementTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  requirementText: {
    fontSize: 11,
    color: '#888',
    marginLeft: 6,
  },
  requirementMetText: {
    color: '#2e7d32',
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 4,
  },
  redirectText: {
    fontSize: 10,
    color: '#888',
    marginTop: 12,
  },
});

export default ForgotPasswordModal;