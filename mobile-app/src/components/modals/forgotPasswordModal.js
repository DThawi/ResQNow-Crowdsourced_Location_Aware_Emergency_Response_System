import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
    <View className="flex-row items-center justify-center mb-6">
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <View className={`w-6 h-6 rounded-full items-center justify-center ${step >= s ? 'bg-red-700' : 'bg-gray-100'}`}>
            <Text className={`text-xs font-bold ${step >= s ? 'text-white' : 'text-gray-400'}`}>{s}</Text>
          </View>
          {i < 2 && (
            <View className={`w-10 h-0.5 ${step >= s + 1 ? 'bg-red-700' : 'bg-gray-100'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderHeader = (title, showBack) => (
    <View className="flex-row justify-between items-center mb-5">
      {showBack ? (
        <TouchableOpacity onPress={() => setStep(step - 1)} className="w-6 items-center">
          <FontAwesome5 name="arrow-left" size={18} color="#333" />
        </TouchableOpacity>
      ) : <View className="w-6" />}
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      <TouchableOpacity onPress={resetAndClose} className="w-6 items-center">
        <AntDesign name="close" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <BaseModal visible={visible} onClose={resetAndClose} showCloseIcon={false} cardStyle={{ padding: 20, width: '90%' }}>

      {step === 1 && (
        <View className="w-full">
          {renderHeader("Forgot Password", false)}
          {renderStepIndicator()}
          <Text className="text-xs font-semibold text-gray-600 mb-2 mt-2">Email Address or Mobile Number</Text>
          <View className="flex-row items-center border border-slate-200 rounded-xl px-3 h-[50px]">
            <Feather name="phone" size={18} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-700"
              placeholder="Enter email or phone number"
              placeholderTextColor="#AAA"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text className="text-xs text-gray-500 mt-2 mb-5 leading-[18px]">
            Enter the email or phone number you used to sign up. We'll send you a verification code.
          </Text>
          <TouchableOpacity className="bg-red-700 h-[50px] rounded-xl items-center justify-center w-full" onPress={() => setStep(2)}>
            <Text className="text-white font-bold text-[15px]">Send Reset Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View className="w-full">
          {renderHeader("Verify Identity", true)}
          {renderStepIndicator()}
          <Text className="text-xs font-semibold text-gray-600 mb-2 mt-2">Verification Code</Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 h-[50px] text-base text-gray-700 text-center tracking-[2px]"
            placeholder="Enter 6 - digit code"
            placeholderTextColor="#AAA"
            keyboardType="number-pad"
            maxLength={6}
          />
          <View className="flex-row justify-between mt-2 mb-4">
            <Text className="text-xs text-gray-400">Didn't receive the code?</Text>
            <Text className="text-xs text-red-700 font-medium">Resend in 7s</Text>
          </View>
          <TouchableOpacity className="bg-red-700 h-[50px] rounded-xl items-center justify-center w-full" onPress={() => setStep(3)}>
            <Text className="text-white font-bold text-[15px]">Verify Code</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center mt-4 mb-4 py-1" onPress={() => setStep(1)}>
            <Text className="text-xs text-red-700 font-medium">Change email/number</Text>
          </TouchableOpacity>
          <View className="flex-row bg-gray-50 p-3 rounded-lg mt-2">
            <FontAwesome5 name="exclamation-circle" solid size={14} color="#999" style={{ marginTop: 2 }} />
            <Text className="text-[11px] text-gray-500 ml-2 flex-1 leading-4">
              Code expires in 5 minutes. For security, this code can only be used once
            </Text>
          </View>
        </View>
      )}

      {step === 3 && (
        <View className="w-full">
          {renderHeader("Set New Password", true)}
          {renderStepIndicator()}
          <Text className="text-xs font-semibold text-gray-600 mb-2 mt-2">New Password</Text>
          <View className="flex-row items-center border border-slate-200 rounded-xl px-3 h-[50px]">
            <Feather name="lock" size={18} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-700"
              placeholder="Enter New Password"
              secureTextEntry={!showPassword}
              placeholderTextColor="#AAA"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#999" />
            </TouchableOpacity>
          </View>
          <Text className="text-xs font-semibold text-gray-600 mb-2 mt-3">Confirm Password</Text>
          <View className="flex-row items-center border border-slate-200 rounded-xl px-3 h-[50px]">
            <Feather name="lock" size={18} color="#999" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-700"
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#AAA"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#999" />
            </TouchableOpacity>
          </View>
          <View className="bg-gray-50 p-4 rounded-xl mt-4 mb-4">
            <Text className="text-[11px] font-semibold text-gray-700 mb-2">Password requirements:</Text>
            <View className="flex-row items-center mb-1.5">
              <Ionicons name={has8Chars ? "checkmark-circle" : "ellipse-outline"} size={16} color={has8Chars ? "#4CAF50" : "#999"} />
              <Text className={`text-xs ml-2 ${has8Chars ? 'text-green-600 font-medium' : 'text-gray-500'}`}>At least 8 characters</Text>
            </View>
            <View className="flex-row items-center mb-1.5">
              <Ionicons name={hasNumber ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasNumber ? "#4CAF50" : "#999"} />
              <Text className={`text-xs ml-2 ${hasNumber ? 'text-green-600 font-medium' : 'text-gray-500'}`}>One number</Text>
            </View>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="text-[11px] text-red-700 mt-1">Passwords do not match</Text>
            )}
          </View>
          <TouchableOpacity
            className={`bg-red-700 h-[50px] rounded-xl items-center justify-center w-full ${!canSubmitPassword ? 'opacity-60' : 'opacity-100'}`}
            disabled={!canSubmitPassword}
            onPress={() => setStep(4)}
          >
            <Text className="text-white font-bold text-[15px]">Reset Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View className="w-full">
          {renderHeader("Set New Password", false)}
          <View className="items-center py-5">
            <View className="bg-green-50 w-20 h-20 rounded-full items-center justify-center mb-5">
              <FontAwesome5 name="check-circle" size={50} color="#4CAF50" />
            </View>
            <Text className="text-lg font-bold text-gray-700 mb-2">Password Reset Successfully!</Text>
            <Text className="text-[13px] text-gray-500">Your password has been updated.</Text>
            <TouchableOpacity className="bg-red-700 h-[50px] rounded-xl items-center justify-center w-full mt-8" onPress={resetAndClose}>
              <Text className="text-white font-bold text-[15px]">Continue to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetAndClose}>
              <Text className="text-xs text-gray-300 mt-4 italic underline p-1">Auto-redirecting in 10 seconds...</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </BaseModal>
  );
};

export default ForgotPasswordModal;