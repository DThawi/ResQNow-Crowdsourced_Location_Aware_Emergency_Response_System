import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BaseModal from '../../components/modals/baseModal';

export default function LogoutPopup({ navigation, route }) {
  const [visible, setVisible] = useState(true);
  const accountType = route?.params?.accountType || 'citizen';

  const handleClose = () => setVisible(false);
  const handleLogout = () => {
    setVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 bg-transparent">
      <BaseModal visible={visible} onClose={handleClose}>
        <View className="items-center">
          <Text className="text-2xl mb-4">Logout</Text>
          <Text className="text-gray-600 text-center mb-6">
            Are you sure you want to log out of your {accountType} account?
          </Text>
          <View className="flex-row w-full gap-4">
            <TouchableOpacity
              className="flex-1 py-3 rounded-2xl border border-gray-300 items-center"
              onPress={handleClose}
            >
              <Text className="text-gray-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-2xl bg-red-600 items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BaseModal>
    </View>
  );
}