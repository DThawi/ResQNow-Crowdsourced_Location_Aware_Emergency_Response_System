import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import BaseModal from '../../components/modals/baseModal';

export default function VerifyIdentityPopup({ navigation }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.navigate('SetPasswordPopup');
  };

  return (
    <View className="flex-1 bg-transparent">
      <BaseModal visible={visible} onClose={handleClose}>
        <Text className="text-lg font-semibold text-center mb-4">Verify Identity</Text>
        <Text className="text-gray-500 text-center mb-6">
          Enter the 6-digit verification code sent to your email or phone.
        </Text>

        <TextInput
          placeholder="Enter 6-digit code"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          keyboardType="numeric"
        />

        <TouchableOpacity
          onPress={handleClose}
          className="w-full py-3 rounded-2xl bg-red-600 items-center"
        >
          <Text className="text-white font-semibold">Verify Code</Text>
        </TouchableOpacity>
      </BaseModal>
    </View>
  );
}