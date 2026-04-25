import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import DeactivateAccountScreen from "./DeactivateAccountScreen";
import DeleteAccountScreen from "./DeleteAccountScreen";

const SettingItem = ({
  icon,
  title,
  subtitle,
  danger,
  noBorder,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 ${
        !noBorder && "border-b border-gray-200"
      }`}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3">
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

const SectionCard = ({ title, children }) => (
  <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
    <Text className="text-lg font-bold text-gray-800 mb-3">{title}</Text>
    {children}
  </View>
);

const AccountSettingsScreen = () => {
  const navigation = useNavigation();

  const deactivateAccount = () => {
    Alert.alert(
      "Deactivate Account",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await axios.post("http://YOUR_IP:5000/api/user/deactivate");
            Alert.alert("Account Deactivated");
          },
        },
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone.",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await axios.delete("http://YOUR_IP:5000/api/user/delete");
            Alert.alert("Account Deleted");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <GradientHeader title="Account Settings" type="back" />

      <ScrollView className="px-4 mt-4">

        <SectionCard title="Profile Information">
          <SettingItem
            icon="create-outline"
            title="Edit Profile"
            subtitle="Update name, photo, and bio"
            noBorder
            onPress={() => navigation.navigate("ResponderEditProfileScreen")}
          />
        </SectionCard>

        <SectionCard title="Verification Status">
          <SettingItem
            icon="business-outline"
            title="Organization Details"
            subtitle="Police Department"
            onPress={() => navigation.navigate("OrganizationDetails_EditScreen")}
          />

          <SettingItem
            icon="school-outline"
            title="Credentials & Certifications"
            subtitle="View certificates"
            onPress={() => navigation.navigate("CredentialsCertificationsScreen")}
          />

          <SettingItem
            icon="cloud-upload-outline"
            title="Update Documents"
            subtitle="Upload new documents"
            noBorder
            onPress={() => navigation.navigate("UploadVerificationDocuments")}
          />
        </SectionCard>

        <SectionCard title="Security">
          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update password"
            onPress={() => navigation.navigate("ChangePasswordScreen")}
          />

          <SettingItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Enable Face ID"
            noBorder
            onPress={() => navigation.navigate("BiometricAuthentication")}
          />

          {/* <SettingItem
            icon="time-outline"
            title="Login History"
            subtitle="Recent activity"
            noBorder
            onPress={() => navigation.navigate("LoginHistory")}
          /> */}
        </SectionCard>

        <SectionCard title="Danger Zone">
          <SettingItem
            icon="pause-circle-outline"
            title="Deactivate Account"
            subtitle="Temporarily disable account"
            danger
            onPress={() => navigation.navigate("DeactivateAccountScreen")}
          />

          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Delete permanently"
            danger
            noBorder
            onPress={() => navigation.navigate("DeleteAccountScreen")}
          />
        </SectionCard>

      </ScrollView>
    </View>
  );
};

export default AccountSettingsScreen;