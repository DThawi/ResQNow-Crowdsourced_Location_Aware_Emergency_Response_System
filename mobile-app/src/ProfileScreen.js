import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100">

      {/* Header */}
      <View className="bg-red-600 pt-14 pb-6 items-center rounded-b-3xl">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          className="w-28 h-28 rounded-full border-4 border-white"
        />
        <Text className="text-white text-xl font-bold mt-3">
          John Doe
        </Text>
        <Text className="text-white text-sm opacity-80">
          johndoe@gmail.com
        </Text>
      </View>

      {/* Menu Card */}
      <View className="mx-4 mt-6 bg-white rounded-2xl p-4 shadow">

        {/* Item */}
        <MenuItem icon="person-outline" text="Edit Profile" />

        <MenuItem icon="shield-checkmark-outline" text="Security Settings" />

        <MenuItem icon="notifications-outline" text="Notifications" />

        <MenuItem icon="document-text-outline" text="Privacy Policy" />

        <MenuItem icon="help-circle-outline" text="Help & Support" />

      </View>

      {/* Logout Button */}
      <TouchableOpacity className="mx-4 mt-6 bg-red-600 py-4 rounded-2xl items-center">
        <Text className="text-white font-semibold text-base">
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProfileScreen;



// 🔹 Reusable Menu Item Component
const MenuItem = ({ icon, text }) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-200">
      
      <View className="flex-row items-center">
        <Ionicons name={icon} size={22} color="#444" />
        <Text className="ml-3 text-gray-700 text-base">{text}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
};