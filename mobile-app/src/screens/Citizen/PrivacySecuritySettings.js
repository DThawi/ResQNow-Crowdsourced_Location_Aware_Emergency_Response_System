import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";
import { LinearGradient } from "expo-linear-gradient";
import CustomToggle from "../../components/symbols/CustomeToggle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../services/api";
import * as FileSystem from "expo-file-system/legacy";


/* ================= COMPONENTS ================= */

// Section Card Wrapper


const SectionCard = ({ title, icon, children }) => {
  return (
    <View className="bg-white rounded-2xl mt-5 shadow-sm overflow-hidden">

      {/* 🔴 GRADIENT HEADER */}
      <LinearGradient
        colors={[
          "rgba(214, 40, 40, 0.1)",  // #D62828 at 10%
          "rgba(0, 48, 73, 0.1)",    // #003049 at 10%
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 py-3 flex-row items-center"
      >
        <View className="w-8 h-8 rounded-lg items-center justify-center mr-2">
          {icon}
        </View>
        <Text className="text-black font-semibold text-base">
          {title}
        </Text>
      </LinearGradient>

      {/* CONTENT */}
      <View className="p-4">
        {children}
      </View>
    </View>
  );
};

// Row Item
const SettingItem = ({ title, subtitle, rightComponent, danger, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="py-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className={`font-medium ${danger ? "text-red-500" : "text-gray-800"
              }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
          )}
        </View>

        {rightComponent}
      </View>
    </TouchableOpacity>
  );
};

// Toggle Button
const ToggleSwitch = ({ value, onChange }) => {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#d1d5db", true: "#22c55e" }}
      thumbColor="#fff"
    />
  );
};

// Option Selector (Public / Private)
const OptionSelector = ({ selected, onSelect }) => {
  return (
    <View className="flex-row mt-3">
      {/* Public */}
      <TouchableOpacity
        onPress={() => onSelect("public")}
        className={`flex-1 p-3 rounded-xl mr-2 border ${selected === "public"
            ? "border-red-500 bg-red-50"
            : "border-gray-300"
          }`}
      >
        <View className="items-center">
          <Feather
            name="users"
            size={18}
            color={selected === "public" ? "#ef4444" : "#9ca3af"}
          />
          <Text
            className={`mt-1 text-xs ${selected === "public" ? "text-red-500" : "text-gray-400"
              }`}
          >
            Public
          </Text>
        </View>
      </TouchableOpacity>

      {/* Private */}
      <TouchableOpacity
        onPress={() => onSelect("private")}
        className={`flex-1 p-3 rounded-xl ml-2 border ${selected === "private"
            ? "border-gray-800 bg-gray-100"
            : "border-gray-300"
          }`}
      >
        <View className="items-center">
          <Feather
            name="lock"
            size={18}
            color={selected === "private" ? "#111827" : "#9ca3af"}
          />
          <Text
            className={`mt-1 text-xs ${selected === "private" ? "text-gray-800" : "text-gray-400"
              }`}
          >
            Private
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

/* ================= MAIN SCREEN ================= */

const PrivacySecuritySettings = ({ navigation }) => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [shareReports, setShareReports] = useState(true);
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ────────────────────────────────────────
  // LOAD INITIAL SETTINGS FROM BACKEND
  // ────────────────────────────────────────
  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setInitialLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        const user = res.data;
        setTwoFactor(user.twoFactorEnabled || false);
        setShareLocation(user.shareLocation !== false);
        setShareReports(user.shareReports !== false);
        setVisibility(user.profileVisibility || "public");
      }
    } catch (err) {
      console.log("Error loading privacy settings:", err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  // ────────────────────────────────────────
  // UPDATE SETTING TO BACKEND
  // ────────────────────────────────────────
  const updatePrivacySetting = async (key, value) => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      await API.put("/auth/profile-update", {
        [key]: value,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log(`Error updating ${key}:`, err.message);
      Alert.alert("Error", `Failed to update ${key}`);
    }
  };

  // ────────────────────────────────────────
  // HANDLE TWO-FACTOR TOGGLE
  // ────────────────────────────────────────
  const handleTwoFactor = async (value) => {
    setTwoFactor(value);
    
    if (value) {
      Alert.alert(
        "Enable Two-Factor Authentication",
        "You will need to verify with an SMS code or authenticator app on next login.",
        [
          { text: "Cancel", onPress: () => setTwoFactor(false) },
          { text: "Enable", onPress: () => updatePrivacySetting("twoFactorEnabled", true) },
        ]
      );
    } else {
      updatePrivacySetting("twoFactorEnabled", false);
    }
  };

  // ────────────────────────────────────────
  // HANDLE LOCATION SHARING
  // ────────────────────────────────────────
  const handleShareLocation = async (value) => {
    setShareLocation(value);
    updatePrivacySetting("shareLocation", value);
  };

  // ────────────────────────────────────────
  // HANDLE PROFILE VISIBILITY
  // ────────────────────────────────────────
  const handleVisibilityChange = async (value) => {
    setVisibility(value);
    updatePrivacySetting("profileVisibility", value);
  };

  // ────────────────────────────────────────
  // HANDLE SHARE REPORTS
  // ────────────────────────────────────────
  const handleShareReports = async (value) => {
    setShareReports(value);
    updatePrivacySetting("shareReports", value);
  };

  // ────────────────────────────────────────
  // CHANGE PASSWORD
  // ────────────────────────────────────────
  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  // ────────────────────────────────────────
  // VIEW LOGIN HISTORY
  // ────────────────────────────────────────
  const handleLoginHistory = () => {
    Alert.alert(
      "Login History",
      "Feature coming soon. You will be able to view all devices and locations where your account was accessed."
    );
  };

  // ────────────────────────────────────────
  // DOWNLOAD DATA
  // ────────────────────────────────────────
  const handleDownloadData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      const res = await API.get("/auth/download-data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fileName = `user_data_${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(res.data, null, 2));
      Alert.alert("Success", `Data saved to: ${fileUri}`);
    } catch (err) {
      console.log("Error downloading data:", err.message);
      Alert.alert("Error", "Failed to download your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────
  // DELETE ACCOUNT
  // ────────────────────────────────────────
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem("token");
              
              await API.delete("/auth/account", {
                headers: { Authorization: `Bearer ${token}` },
              });

              await AsyncStorage.multiRemove(["token", "user", "userId"]);
              Alert.alert("Account Deleted", "Your account has been permanently deleted.");
              navigation.replace("Login");
            } catch (err) {
              console.log("Error deleting account:", err.message);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#D62828" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* HEADER */}
      <GradientHeader title="Privacy & Security" type="back" />

      {/* CONTENT */}
      <ScrollView className="px-4 mt-4">
        {/* SECURITY SETTINGS */}
        <SectionCard
          title="Security Settings"
          icon={<Feather name="lock" size={16} color="#ef4444" />}
        >
          <SettingItem
            title="Change Password"
            subtitle="Update your account password"
            onPress={handleChangePassword}
            rightComponent={
              <Feather name="lock" size={18} color="#9ca3af" />
            }
          />

          <SettingItem
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightComponent={
              <CustomToggle
                value={twoFactor}
                onToggle={handleTwoFactor}
              />
            }
          />

          <SettingItem
            title="Login History"
            subtitle="View recent login activity"
            onPress={handleLoginHistory}
            rightComponent={
              <Feather name="smartphone" size={18} color="#9ca3af" />
            }
          />
        </SectionCard>

        {/* PRIVACY SETTINGS */}
        <SectionCard
          title="Privacy Settings"
          icon={<Feather name="shield" size={16} color="#ef4444" />}
        >
          <SettingItem
            title="Share Location"
            subtitle="Allow app to access your location"
            rightComponent={
              <CustomToggle value={shareLocation} onToggle={handleShareLocation} />
            }
          />

          <View className="mt-3">
            <Text className="text-gray-800 font-medium">
              Profile Visibility
            </Text>
            <Text className="text-gray-400 text-xs">
              Control who can see your profile
            </Text>

            <OptionSelector
              selected={visibility}
              onSelect={handleVisibilityChange}
            />
          </View>

          <SettingItem
            title="Share Reports Publicly"
            subtitle="Make your reports visible to all users"
            rightComponent={
              <CustomToggle value={shareReports} onToggle={handleShareReports} />
            }
          />
        </SectionCard>

        {/* DATA MANAGEMENT */}
        <SectionCard
          title="Data Management"
          icon={<Feather name="file-text" size={16} color="#f59e0b" />}
        >
          <SettingItem
            title="Download My Data"
            subtitle="Get a copy of your information"
            onPress={handleDownloadData}
            rightComponent={
              <Feather name="file" size={18} color="#9ca3af" />
            }
          />

          <SettingItem
            title="Delete Account"
            subtitle="Permanently delete your account"
            danger
            onPress={handleDeleteAccount}
            rightComponent={
              <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
            }
          />
        </SectionCard>

        {/* FOOTER */}
        <View className="mt-6 mb-10 flex-row items-start">
          <Feather name="info" size={18} color="#6b7280" />
          <View className="ml-2 flex-1">
            <Text className="text-gray-700 font-medium">
              Your Privacy Matters
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              We are committed to protecting your privacy. Your data is
              encrypted and we never share your personal information without
              consent.
            </Text>
          </View>
        </View>

        {loading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <ActivityIndicator size="large" color="#D62828" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default PrivacySecuritySettings;