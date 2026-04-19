import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";
import CustomToggle from "../../components/symbols/CustomeToggle";
import API from "../../services/api"; // axios instance
// import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    sms: false,
    vibration: true,
    sound: true,
    notification: true,
    emailNotification: true,
    criticalAlert: true,
    fireIncidents: true,
    trafficAccidents: true,
    medicalEmergencies: true,
    crimeReports: true,
    reportVerification: true,
    reportUpdates: true,
    commentReplies: false,
  });

  // ----------------------------
  // FETCH SETTINGS FROM BACKEND
  // ----------------------------
  const fetchSettings = async () => {
    try {
      setLoading(true);

      // if token manually needed:
      // const token = await AsyncStorage.getItem("token");

      const res = await API.get("/notification-settings");

      setSettings(res.data);
    } catch (error) {
      console.log("Fetch settings error:", error);
      Alert.alert("Error", "Failed to load notification settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ----------------------------
  // UPDATE SINGLE TOGGLE
  // ----------------------------
  const updateSetting = async (key, value) => {
    try {
      setSaving(true);

      // optimistic UI update
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));

      await API.put("/notification-settings", {
        [key]: value,
      });
    } catch (error) {
      console.log("Update error:", error);

      // rollback if failed
      setSettings((prev) => ({
        ...prev,
        [key]: !value,
      }));

      Alert.alert("Error", "Failed to save setting.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // TOGGLE ITEM
  // ----------------------------
  const ToggleItem = ({
    icon,
    bg,
    title,
    subtitle,
    value,
    settingKey,
  }) => (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center flex-1">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${bg}`}
        >
          <Ionicons name={icon} size={18} color="white" />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-gray-800 font-semibold">{title}</Text>
          <Text className="text-gray-400 text-xs">{subtitle}</Text>
        </View>
      </View>

      <CustomToggle
        value={value}
        onToggle={() => updateSetting(settingKey, !value)}
      />
    </View>
  );

  // ----------------------------
  // LOADING
  // ----------------------------
  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#D62828" />
        <Text className="mt-3 text-gray-500">Loading settings...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <GradientHeader title="Notifications" type="back" />

      {saving && (
        <View className="bg-blue-100 py-2">
          <Text className="text-center text-blue-700 text-xs">
            Saving changes...
          </Text>
        </View>
      )}

      <ScrollView
        style={{ paddingHorizontal: 20, marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* GENERAL */}
        <Text className="text-xl font-semibold mb-4">General Settings</Text>

        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="notifications-outline"
            bg="bg-red-600"
            title="Push Notifications"
            subtitle="Receive alerts on your device"
            value={settings.notification}
            settingKey="notification"
          />

          <ToggleItem
            icon="mail-outline"
            bg="bg-blue-900"
            title="Email Notifications"
            subtitle="Get updates via email"
            value={settings.emailNotification}
            settingKey="emailNotification"
          />

          <ToggleItem
            icon="chatbubble-outline"
            bg="bg-orange-400"
            title="SMS Alerts"
            subtitle="Critical alerts via text"
            value={settings.sms}
            settingKey="sms"
          />

          <ToggleItem
            icon="phone-portrait-outline"
            bg="bg-gray-400"
            title="Vibration"
            subtitle="Vibrate on alerts"
            value={settings.vibration}
            settingKey="vibration"
          />

          <ToggleItem
            icon="volume-high-outline"
            bg="bg-green-500"
            title="Sound"
            subtitle="Play alert sounds"
            value={settings.sound}
            settingKey="sound"
          />
        </View>

        {/* ALERT TYPES */}
        <Text className="text-xl font-semibold mt-6 mb-4">Alert Types</Text>

        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="warning-outline"
            bg="bg-red-600"
            title="Critical Alerts"
            subtitle="Life-threatening emergencies"
            value={settings.criticalAlert}
            settingKey="criticalAlert"
          />

          <ToggleItem
            icon="flame-outline"
            bg="bg-orange-500"
            title="Fire Incidents"
            subtitle="Building fires and hazards"
            value={settings.fireIncidents}
            settingKey="fireIncidents"
          />

          <ToggleItem
            icon="car-outline"
            bg="bg-yellow-400"
            title="Traffic Accidents"
            subtitle="Road accidents nearby"
            value={settings.trafficAccidents}
            settingKey="trafficAccidents"
          />

          <ToggleItem
            icon="heart-outline"
            bg="bg-green-500"
            title="Medical Emergencies"
            subtitle="Health-related incidents"
            value={settings.medicalEmergencies}
            settingKey="medicalEmergencies"
          />

          <ToggleItem
            icon="shield-outline"
            bg="bg-gray-600"
            title="Crime Reports"
            subtitle="Security incidents"
            value={settings.crimeReports}
            settingKey="crimeReports"
          />
        </View>

        {/* COMMUNITY */}
        <Text className="text-xl font-semibold mt-6 mb-4">
          Community Updates
        </Text>

        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="checkmark-done-outline"
            bg="bg-blue-500"
            title="Report Verification"
            subtitle="When others verify your reports"
            value={settings.reportVerification}
            settingKey="reportVerification"
          />

          <ToggleItem
            icon="sync-outline"
            bg="bg-purple-500"
            title="Report Updates"
            subtitle="Status changes on your reports"
            value={settings.reportUpdates}
            settingKey="reportUpdates"
          />

          <ToggleItem
            icon="chatbubble-ellipses-outline"
            bg="bg-pink-500"
            title="Comment Replies"
            subtitle="Responses to your comments"
            value={settings.commentReplies}
            settingKey="commentReplies"
          />
        </View>

        {/* INFO CARD */}
        <View
          className="rounded-2xl p-4 flex-row items-start mt-6 mb-10"
          style={{ backgroundColor: "#003049" }}
        >
          <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
            <Ionicons
              name="notifications-outline"
              size={18}
              color="#fff"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-sm mb-1">
              Stay Informed
            </Text>

            <Text className="text-white text-xs leading-4">
              Critical alerts will always be delivered for your safety.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettings;