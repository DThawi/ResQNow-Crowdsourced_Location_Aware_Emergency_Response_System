import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import BaseModal from '../../components/modals/baseModal';

export default function SetPasswordPopup({ navigation }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.navigate('SuccessfulSetPasswordPopup');
  };

  return (
    <View className="flex-1 bg-transparent">
      <BaseModal visible={visible} onClose={handleClose}>
        <Text className="text-lg font-semibold text-center mb-4">Set New Password</Text>

        <TextInput
          placeholder="New Password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleClose}
          className="w-full py-3 rounded-2xl bg-red-600 items-center"
        >
          <Text className="text-white font-semibold">Reset Password</Text>
        </TouchableOpacity>
      </BaseModal>
    </View>
  );
}