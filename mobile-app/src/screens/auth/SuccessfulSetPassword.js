import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BaseModal from '../../components/modals/baseModal';
import { Feather } from '@expo/vector-icons';

export default function SuccessfulSetPasswordPopup({ navigation }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 bg-transparent">
      <BaseModal visible={visible} onClose={handleClose}>
        <View className="items-center">
          <Feather name="check-circle" size={48} color="#22C55E" className="mb-4" />
          <Text className="text-lg font-semibold text-center mb-2">Password Reset Successfully!</Text>
          <Text className="text-gray-500 text-center mb-6">
            Your password has been updated.
          </Text>

          <TouchableOpacity
            onPress={handleClose}
            className="w-full py-3 rounded-2xl bg-red-600 items-center"
          >
            <Text className="text-white font-semibold">Continue to Login</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    </View>
  );
}