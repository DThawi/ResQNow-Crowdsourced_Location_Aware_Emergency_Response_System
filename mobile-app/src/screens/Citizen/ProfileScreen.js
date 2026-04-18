import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import API from "../../services/api";
import GradientHeader from "../../components/layout/header";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    all: 0,
    verified: 0,
    flagged: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        API.get("/users/profile"),
        API.get("/users/profile-stats"),
      ]);

      setUser(profileRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.log("Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.replace("LoginScreen");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#D62828" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <GradientHeader title="Profile" type="back" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Section */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4">
          <View className="flex-row items-center">
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  "https://i.pravatar.cc/150?img=12",
              }}
              className="w-28 h-28 rounded-full border-4 border-white"
            />

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {user?.name || "User Name"}
              </Text>

              <Text className="text-gray-500 mt-1">
                {user?.email || "user@email.com"}
              </Text>
            </View>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            className="mt-5 bg-red-600 py-4 rounded-2xl items-center"
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text className="text-white font-semibold text-base">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance Cards */}
        <View className="mx-4 mt-5 flex-row justify-between">
          <PerformanceCard label="All" value={stats.all} />
          <PerformanceCard
            label="Verified"
            value={stats.verified}
            valueColor="#FFA500"
          />
          <PerformanceCard
            label="Flagged"
            value={stats.flagged}
            valueColor="#D62828"
          />
          <PerformanceCard
            label="Hero"
            icon="medal-outline"
            value="1"
            valueColor="#2ECC71"
          />
        </View>

        {/* Menu Items */}
        <View className="px-4 mt-6">
          <MenuItem
            icon="document-text-outline"
            text="My Reports"
            onPress={() => navigation.navigate("MyReports")}
          />

          <MenuItem
            icon="notifications-outline"
            text="Notifications Settings"
            onPress={() => navigation.navigate("NotificationSettings")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            text="Privacy and Security"
            onPress={() => navigation.navigate("SecuritySettings")}
          />

          <MenuItem
            icon="help-circle-outline"
            text="Help & Support"
            onPress={() => navigation.navigate("HelpSupport")}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mx-4 mt-2 bg-white rounded-2xl p-4 flex-row items-center justify-between shadow"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#D62828"
              />
            </View>

            <Text className="ml-3 text-red-600 font-semibold">
              Logout
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

/* ---------- Components ---------- */

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow mb-4"
  >
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name={icon} size={20} color="#333" />
      </View>

      <Text className="ml-3 text-gray-700 font-medium">
        {text}
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={20}
      color="#999"
    />
  </TouchableOpacity>
);

const PerformanceCard = ({
  label,
  value,
  icon,
  valueColor = "#333",
}) => (
  <View className="flex-1 bg-white mx-1 rounded-2xl py-4 items-center justify-center shadow">
    {icon && (
      <Ionicons
        name={icon}
        size={24}
        color={valueColor}
        style={{ marginBottom: 8 }}
      />
    )}

    <Text
      className="text-lg font-bold"
      style={{ color: valueColor }}
    >
      {value}
    </Text>

    <Text className="text-gray-500 text-sm">
      {label}
    </Text>
  </View>
);