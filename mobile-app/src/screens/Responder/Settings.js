import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";


const SettingItem = ({ icon, title, subtitle, iconColor = "#333" }) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
      
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>

        <View>
          <Text className="text-base font-semibold text-gray-800">
            {title}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {subtitle}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
};

const SettingItem2 = ({ icon, title,iconColor }) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
      
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3">
          <Ionicons name={icon} size={23} color={iconColor} />
        </View>

        <View>
          <Text className="text-base font-semibold text-gray-800">
            {title}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const [status, setStatus] = useState("available");

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <GradientHeader title="Settings" type="back" />

      <ScrollView
        className="px-5 mt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Status Card */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="font-semibold text-black mb-3">
            Availability Status
          </Text>

          <View className="flex-row justify-between">
            {/* Available */}
            <TouchableOpacity
              onPress={() => setStatus("available")}
              className={`w-[89px] h-[75px] rounded-2xl items-center justify-center
                ${
                  status === "available"
                    ? "border border-green-500 bg-green-50"
                    : "border border-gray-300"
                }
              `}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={25}
                color={status === "available" ? "green" : "gray"}
              />
              <Text
                className={`text-sm mt-1 font-medium
                  ${status === "available" ? "text-green-600" : "text-gray-500"}
                `}
              >
                Available
              </Text>
            </TouchableOpacity>

            {/* Busy */}
            <TouchableOpacity
              onPress={() => setStatus("busy")}
              className={`w-[89px] h-[75px] rounded-2xl items-center justify-center
                ${
                  status === "busy"
                    ? "border border-yellow-500 bg-yellow-50"
                    : "border border-gray-300"
                }
              `}
            >
              <Ionicons
                name="time-outline"
                size={25}
                color={status === "busy" ? "#f59e0b" : "gray"}
              />
              <Text
                className={`text-sm mt-1
                  ${status === "busy" ? "text-yellow-600" : "text-gray-500"}
                `}
              >
                Busy
              </Text>
            </TouchableOpacity>

            {/* Offline */}
            <TouchableOpacity
              onPress={() => setStatus("offline")}
              className={`w-[89px] h-[75px] rounded-2xl items-center justify-center
                ${
                  status === "offline"
                    ? "border border-red-500 bg-red-50"
                    : "border border-gray-300"
                }
              `}
            >
              <Ionicons
                name="close-circle-outline"
                size={25}
                color={status === "offline" ? "red" : "gray"}
              />
              <Text
                className={`text-sm mt-1
                  ${status === "offline" ? "text-red-600" : "text-gray-500"}
                `}
              >
                Offline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Card */}
        <View className="bg-white rounded-2xl px-4 shadow-sm">
          <SettingItem
            icon="person-outline"
            title="Account Settings"
            subtitle="Manage profile, password & verification"
          />

          <SettingItem
            icon="notifications-outline"
            title="Notification Preferences"
            subtitle="Control alerts & push notifications"
            iconColor="#f59e0b"
          />

          <SettingItem
            icon="settings-outline"
            title="App Settings"
            subtitle="Language, theme & data"
            iconColor="red"
          />
        </View>

        {/* Settings Card 2 */}
        <View className="bg-white rounded-2xl px-4 shadow-sm mt-6">
          <SettingItem2
            icon="shield-outline"
            title="Privacy & Policy"
            iconColor="green"
          />

          <SettingItem2
            icon="document-text-outline"
            title="Terms & Conditions"
            iconColor="gray"
          />

          <SettingItem2
            icon="help-circle-outline"
            title="Help & Support"
            iconColor="black"
          />
        </View>

        {/* 🚪 Logout */}
        <TouchableOpacity className="bg-white rounded-2xl px-4 py-3 shadow-md mt-6 items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="#D62828" />
            </View>
            <Text className="ml-3 text-red-600 font-semibold">Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;