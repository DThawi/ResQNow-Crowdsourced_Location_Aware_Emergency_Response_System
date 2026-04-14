import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";


// 🔹 Reusable Bullet Item
const BulletItem = ({ text }) => (
  <View className="flex-row items-center mb-4">
    <View className="w-5 h-5 rounded-full bg-red-100 items-center justify-center mr-3">
      <View className="w-2 h-2 rounded-full bg-red-500" />
    </View>
    <Text className="text-gray-700 flex-1">{text}</Text>
  </View>
);


// 🔹 Info Card
const InfoCard = ({ icon, title, description, bgColor }) => (
  <View className={`rounded-2xl p-4 mb-4 ${bgColor}`}>
    <View className="flex-row items-start">
      <Ionicons name={icon} size={20} color="#F59E0B" className="mr-2" />
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 mb-1">{title}</Text>
        <Text className="text-gray-500 text-sm">{description}</Text>
      </View>
    </View>
  </View>
);


// 🔹 Button Component
const ActionButton = ({ title, onPress, type = "primary" }) => {
  const styles =
    type === "primary"
      ? "bg-red-600"
      : "bg-white border border-gray-300";

  const textStyles =
    type === "primary" ? "text-white" : "text-gray-700";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-4 rounded-2xl items-center mb-3 ${styles}`}
    >
      <Text className={`font-semibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};


// 🔹 Main Screen
const DeactivateAccountScreen = () => {
  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <GradientHeader title="Deactivate Account" type="back" />
      

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4">

        {/* Warning Box */}
        <View className="border border-red-300 bg-red-50 rounded-2xl p-4 mb-5">
          <Text className="text-gray-800 mb-2">
            Are you sure you want to deactivate your account?
          </Text>
          <Text className="text-gray-500 text-sm">
            This action will temporarily disable your account. You won't be able to:
          </Text>
        </View>

        {/* Bullet List */}
        <BulletItem text="Receive or respond to incident assignments" />
        <BulletItem text="Access the responder dashboard" />
        <BulletItem text="Communicate with other responders or citizens" />

        {/* Info Card */}
        <InfoCard
          icon="information-circle-outline"
          title="Temporary Deactivation"
          description="You can reactivate your account at any time by logging in. Your data and settings will be preserved."
          bgColor="bg-yellow-50"
        />

        {/* Help Box */}
        <View className="bg-gray-200 rounded-2xl p-4 mb-6">
          <Text className="text-gray-600 text-sm">
            Need help? Contact your supervisor or ResQNow support at{" "}
            <Text className="text-red-500">support@resqnow.com</Text>
          </Text>
        </View>

        {/* Buttons */}
        <ActionButton
          title="Deactivate Account"
          onPress={() => console.log("Deactivate")}
          type="primary"
        />

        <ActionButton
          title="Cancel"
          onPress={() => console.log("Cancel")}
          type="secondary"
        />

      </ScrollView>
    </View>
  );
};

export default DeactivateAccountScreen;