import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BaseModal from './baseModal';

const LogoutModal = ({ visible, onClose, onLogout, accountType = "responder" }) => {
  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false}>

      <View className="w-full items-center">

        <View className="w-[70px] h-[70px] rounded-full bg-red-50 justify-center items-center mb-5">
          <Feather name="log-out" size={32} color="#D32F2F" />
        </View>

        <Text className="text-base text-gray-600 text-center leading-6 mb-8 w-full">
          Are you sure you want to log out of{'\n'}your {accountType} account?
        </Text>

        <View className="flex-row justify-between w-full gap-4">
          <TouchableOpacity
            className="flex-1 py-3.5 rounded-2xl border border-slate-200 items-center justify-center"
            onPress={onClose}
          >
            <Text className="text-gray-600 text-base font-bold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-3.5 rounded-2xl bg-red-700 items-center justify-center"
            onPress={() => { onClose(); if (onLogout) onLogout(); }}
          >
            <Text className="text-white text-base font-bold">Logout</Text>
          </TouchableOpacity>
        </View>

      </View>

    </BaseModal>
  );
};

export default LogoutModal;