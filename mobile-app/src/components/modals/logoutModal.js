import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BaseModal from './baseModal';

const LogoutModal = ({ visible, onClose, onLogout, accountType = "responder" }) => {
  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false}>
      <View className="w-full items-center">
        {/* Icon */}
        <View className="w-16 h-16 rounded-full bg-red-100 justify-center items-center mb-5">
          <Feather name="log-out" size={32} color="#D32F2F" />
        </View>

        {/* Message */}
        <Text className="text-base text-gray-700 text-center leading-6 mb-7 w-full">
          Are you sure you want to log out of{'\n'}your {accountType} account?
        </Text>

        {/* Buttons */}
        <View className="flex-row justify-between w-full space-x-4">
          <TouchableOpacity
            className="flex-1 py-3.5 rounded-xl border border-gray-300 justify-center items-center"
            onPress={onClose}
          >
            <Text className="text-gray-700 text-base font-bold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-3.5 rounded-xl bg-red-700 justify-center items-center"
            onPress={() => {
              onClose();
              if (onLogout) onLogout();
            }}
          >
            <Text className="text-white text-base font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
};

export default LogoutModal;