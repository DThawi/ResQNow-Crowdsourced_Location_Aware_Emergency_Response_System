import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import API from "../../services/api";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: Request OTP
  const handleSendOTP = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      Alert.alert("Success", "OTP sent to your email!");
      setStep(2);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) return Alert.alert("Error", "Please enter the OTP");
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp });
      Alert.alert("Success", "OTP verified!");
      setStep(3);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) return Alert.alert("Error", "Please enter a new password");
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      setStep(4);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Reset state on modal close
  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg">

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <View>
              <Text className="text-xl font-bold mb-2">Forgot Password</Text>
              <Text className="text-gray-600 mb-4">Enter your registered email address to receive an OTP.</Text>
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 p-3 rounded-xl mb-4"
              />
              <TouchableOpacity
                onPress={handleSendOTP}
                disabled={loading}
                className="bg-blue-600 p-3 rounded-xl items-center"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Send OTP</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <View>
              <Text className="text-xl font-bold mb-2">Verify OTP</Text>
              <Text className="text-gray-600 mb-4">Enter the 6-digit code sent to {email}.</Text>
              <TextInput
                placeholder="6-Digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                className="border border-gray-300 p-3 rounded-xl mb-4 text-center text-lg font-bold"
              />
              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={loading}
                className="bg-blue-600 p-3 rounded-xl items-center mb-2"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Verify Code</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)} className="items-center py-2">
                <Text className="text-gray-500">Back to Email</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <View>
              <Text className="text-xl font-bold mb-2">Set New Password</Text>
              <Text className="text-gray-600 mb-4">Create a strong new password for your account.</Text>
              <TextInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="border border-gray-300 p-3 rounded-xl mb-4"
              />
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                className="bg-green-600 p-3 rounded-xl items-center"
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Update Password</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <View className="items-center py-4">
              <Text className="text-2xl font-bold text-green-600 mb-2">Success!</Text>
              <Text className="text-gray-600 text-center mb-6">Your password has been reset successfully.</Text>
              <TouchableOpacity
                onPress={handleClose}
                className="bg-blue-600 w-full p-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Close / Cancel Button */}
          {step !== 4 && (
            <TouchableOpacity onPress={handleClose} className="mt-4 items-center">
              <Text className="text-red-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
