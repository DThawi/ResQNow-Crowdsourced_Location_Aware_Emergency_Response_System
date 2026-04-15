import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

/* ---------------- COMPONENTS ---------------- */

const DeleteItem = ({ text }) => (
  <View className="flex-row items-center gap-3 mb-3">
    <View className="bg-red-100 p-2 rounded-full">
      <Ionicons name="trash-outline" size={14} color="#ef4444" />
    </View>
    <Text className="text-gray-500 flex-1">{text}</Text>
  </View>
);

const WarningBox = () => (
  <View className="border border-red-400 bg-red-50 rounded-xl p-4 flex-row gap-3">
    <Ionicons name="warning-outline" size={20} color="#ef4444" />
    <View className="flex-1">
      <Text className="text-red-600 font-semibold">
        This action cannot be undone!
      </Text>
      <Text className="text-gray-600 text-sm mt-1">
        Permanently deleting your account will erase all your data from ResQNow.
      </Text>
    </View>
  </View>
);

const ConfirmationBox = () => (
  <View className="bg-gray-100 rounded-xl p-4">
    <Text className="text-gray-700 text-sm">
      I understand this action is permanent and cannot be reversed. All my data
      will be permanently deleted.
    </Text>
  </View>
);



const ActionButtons = () => (
  <View className="mt-4">
    <TouchableOpacity className="bg-red-600 py-3 rounded-xl items-center mb-3">
      <Text className="text-white font-medium">Delete Permanently</Text>
    </TouchableOpacity>

    <TouchableOpacity className="border border-gray-300 py-3 rounded-xl items-center">
      <Text className="text-gray-600">Cancel</Text>
    </TouchableOpacity>
  </View>
);

/* ---------------- MAIN SCREEN ---------------- */

const DeleteAccountScreen = () => {
  return (
    <View className="flex-1 bg-white">
      
      {/* Header */}
      <GradientHeader title="Delete Account" type="back" />

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4"
      >
        
        {/* Warning */}
        <WarningBox />

        {/* List */}
        <View className="mt-5">
          <Text className="text-gray-600 text-sm mb-3">
            The following will be permanently deleted:
          </Text>

          <DeleteItem text="Your profile and account information" />
          <DeleteItem text="Incident response history and logs" />
          <DeleteItem text="Certifications and credentials" />
          <DeleteItem text="All messages and communications" />
          <DeleteItem text="Preferences and settings" />
        </View>

        {/* Confirmation */}
        <View className="mt-5">
          <ConfirmationBox />
        </View>

        {/* Buttons */}
        <ActionButtons />

      </ScrollView>
    </View>
  );
};

export default DeleteAccountScreen;