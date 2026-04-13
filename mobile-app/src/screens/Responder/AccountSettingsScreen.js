import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

const SettingItem = ({ icon, title, subtitle, danger, noBorder }) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-4 ${
        !noBorder && "border-b border-gray-200"
      }`}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3 "
        >
          <Ionicons
            name={icon}
            size={20}
            color={danger ? "#DC2626" : "#374151"}
          />
        </View>

        <View>
          <Text
            className={`text-base font-semibold ${
              danger ? "text-red-600" : "text-gray-800"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500">{subtitle}</Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const SectionCard = ({ title, children }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-3">{title}</Text>
      {children}
    </View>
  );
};

const VerifiedBadge = () => {
  return (
    <View className="border border-green-500 bg-green-50 rounded-xl p-4 mb-4">
      <View className="flex-row items-center mb-1">
        <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
        <Text className="text-green-600 font-semibold ml-2">
          Verified Responder
        </Text>
      </View>
      <Text className="text-gray-500 text-sm">
        Your account has been verified by ResQNow administrators
      </Text>
    </View>
  );
};

const AccountSettingsScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <GradientHeader title=" Account Settings" type="back" />

      <ScrollView
        className="px-4 mt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile */}
        <SectionCard title="Profile Information">
          <SettingItem
            icon="create-outline"
            title="Edit Profile"
            subtitle="Update name, photo, and bio"
            noBorder
          />
        </SectionCard>

        {/* Verification */}
        <SectionCard title="Verification Status">
          <VerifiedBadge />

          <SettingItem
            icon="business-outline"
            title="Organization Details"
            subtitle="Police Department"
          />

          <SettingItem
            icon="school-outline"
            title="Credentials & Certifications"
            subtitle="View and update certificates"
          />

          <SettingItem
            icon="cloud-upload-outline"
            title="Update Documents"
            subtitle="Upload new verification documents"
            noBorder
          />
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security">
          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your account password"
          />

          <SettingItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Enable Face ID or Touch ID"
          />

          <SettingItem
            icon="phone-portrait-outline"
            title="Active Devices"
            subtitle="Manage logged in devices"
          />

          <SettingItem
            icon="time-outline"
            title="Login History"
            subtitle="View recent login activity"
            noBorder
          />
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone">
          <SettingItem
            icon="pause-circle-outline"
            title="Deactivate Account"
            subtitle="Temporarily disable your account"
            danger
          />

          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            danger
            noBorder
          />
        </SectionCard>
      </ScrollView>
    </View>
  );
};

export default AccountSettingsScreen;