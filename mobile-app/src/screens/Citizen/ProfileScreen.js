import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from "../../services/api";
import GradientHeader from "../../components/layout/header";

// Import your new modals
import BadgeListModal from "../../components/modals/badgeListModal";
import BadgeDetailModal from "../../components/modals/badgeDetailModal";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    all: 0,
    verified: 0,
    flagged: 0,
    heroBadge: 0
  });
  const [loading, setLoading] = useState(true);

  // --- Modal States ---
  const [isBadgeListVisible, setIsBadgeListVisible] = useState(false);
  const [isBadgeDetailVisible, setIsBadgeDetailVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // useFocusEffect ensures data refreshes every time when open this screen
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      // Fetching profile and stats in parallel from actual endpoints
      const [profileRes, statsRes] = await Promise.all([
        API.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/auth/profile-stats", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUser(profileRes.data);
      // Map backend stats keys to the UI-friendly keys
      const s = statsRes.data || {};
      setStats({
        all: s.all || 0,
        verified: s.verifications || 0,
        flagged: s.flagged || 0,
        heroBadge: s.heroBadge || 0,
      });
    } catch (error) {
      console.log("Profile Error:", error.response?.data || error.message);
      // Fallback for user name/email if profile endpoint is pending
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedName) setUser({ name: storedName, email: storedEmail });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  // --- Modal Handlers ---
  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setIsBadgeDetailVisible(true);
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
                uri: user?.profileImage || "https://i.pravatar.cc/150?img=12",
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
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Text className="text-white font-semibold text-base">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Performance Cards - Responsive Counts */}
        <View className="mx-4 mt-5 flex-row justify-between">
          <PerformanceCard label="All" value={stats.all || 0} />
          <PerformanceCard
            label="Verified"
            value={stats.verified || 0}
            valueColor="#FFA500"
          />
          <PerformanceCard
            label="Flagged"
            value={stats.flagged || 0}
            valueColor="#D62828"
          />
          <PerformanceCard
            label="Hero"
            icon="medal-outline"
            value={stats.heroBadge || 0}
            valueColor="#2ECC71"
            onPress={() => setIsBadgeListVisible(true)}
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
            onPress={() => navigation.navigate("PrivacySecuritySettings")}
          />

          <MenuItem
            icon="help-circle-outline"
            text="Help & Support"
            onPress={() => navigation.navigate("HelpSupport_Citizen")}
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

      {/* --- Added Modals --- */}
      <BadgeListModal 
        visible={isBadgeListVisible} 
        onClose={() => setIsBadgeListVisible(false)} 
        onBadgePress={handleBadgePress} 
      />

      {selectedBadge && (
        <BadgeDetailModal
          visible={isBadgeDetailVisible}
          onClose={() => setIsBadgeDetailVisible(false)}
          badgeName={selectedBadge.name}
          description={selectedBadge.description}
          requirement={selectedBadge.requirement}
          progress={selectedBadge.progress}
          total={selectedBadge.total}
          iconName={selectedBadge.icon}
        />
      )}

    </View>
  );
};

/* ---------- Internal Components ---------- */

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
  onPress
}) => (
  <TouchableOpacity 
    className="flex-1 bg-white mx-1 rounded-2xl py-4 items-center justify-center shadow"
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    {icon && (
      <Ionicons
        name={icon}
        size={24}
        color={valueColor}
        style={{ marginBottom: 8 }}
      />
    )}

    {/* Conditionally render value only if it exists so it doesn't show an empty gap */}
    {value !== undefined && value !== null && value !== "" && (
      <Text
        className="text-lg font-bold"
        style={{ color: valueColor }}
      >
        {value}
      </Text>
    )}

    <Text className="text-gray-500 text-sm uppercase" style={{ fontSize: 9 }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default ProfileScreen;
