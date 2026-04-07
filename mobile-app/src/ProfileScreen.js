import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "./components/layout/header";

  const ProfileScreen = () => {
    return (
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <GradientHeader title="Profile" type="back" />

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Section */}
          <View className="mx-4 mt-4 bg-white rounded-3xl p-4">
            {/* Top Row */}
            <View className="flex-row items-center">
              {/* Profile Image */}
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                className="w-28 h-28 rounded-full border-4 border-white"
              />

              {/* Name + Email */}
              <View className="ml-4">
                <Text className="text-lg font-bold text-gray-800">
                  John Perera
                </Text>
                <Text className="text-gray-500 mt-1">johnperera@gmail.com</Text>
              </View>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity className="mt-5 bg-red-600 py-4 rounded-2xl items-center">
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Performance Cards */}
          <View className="mx-4 mt-5 flex-row justify-between">
            <PerformanceCard label="All" value={52} />
            <PerformanceCard label="Verifications" value={45} valueColor="#FFA500" />
            <PerformanceCard label="Flagged Reports" value={2} valueColor="#D62828" />
            <PerformanceCard label="Hero Batch" icon="medal-outline" valueColor="#2ECC71" />
          </View>

          {/* 📦 Menu */}
          <View className="px-4 space-y-4 mt-6">
            <MenuItem icon="document-text-outline" text="My Reports" />
            <MenuItem icon="notifications-outline" text="Notifications Settings" />
            <MenuItem
              icon="shield-checkmark-outline"
              text="Privacy and Security"
            />
            
            <MenuItem icon="help-circle-outline" text="Help & Support" />
          </View>

          {/* 🚪 Logout */}
          <TouchableOpacity className="mx-4 mt-5 bg-white rounded-2xl p-4 flex-row items-center justify-between shadow">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#D62828" />
              </View>
              <Text className="ml-3 text-red-600 font-semibold">Logout</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  export default ProfileScreen;



const MenuItem = ({ icon, text }) => (
  <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow mb-5">
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name={icon} size={20} color="#333" />
      </View>
      <Text className="ml-3 text-gray-700 font-medium">{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const PerformanceCard = ({ label, value, icon, valueColor = "#333" }) => (
  <View className="flex-1 bg-white mx-1 rounded-2xl items-center justify-center shadow">
    {icon && (
      <Ionicons
        name={icon}
        size={24}
        color={valueColor}
        style={{ marginBottom:8 }} // Adjust gap between icon and value
      />
    )}
    <Text className="text-lg font-bold" style={{ color: valueColor }}>
      {value}
    </Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </View>
);