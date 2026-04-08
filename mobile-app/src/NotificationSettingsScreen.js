import React, { useState } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "./components/layout/header";
import CustomToggle from "./components/symbols/CustomeToggle";


const NotificationSettings = () => {

  // Alert detail toggles (like your UI)
  const [sms, setSms] = useState(false);
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [notification, setNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [criticalAlert, setCriticalAlert] = useState(true);
  const [fireIncidents, setFireIncidents] = useState(true);
  const [trafficAccidents, setTrafficAccidents] = useState(true);
  const [medicalEmergencies, setMedicalEmergencies] = useState(true);
  const [crimeReports, setCrimeReports] = useState(true);
  const [reportVerification, setReportVerification] = useState(true);
  const [reportUpdates, setReportUpdates] = useState(true);
  const [commentReplies, setCommentReplies] = useState(false);

  const ToggleItem = ({ icon, bg, title, subtitle, value, onToggle }) => (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${bg}`}>
          <Ionicons name={icon} size={18} color="white" />
        </View>

        <View className="ml-3">
          <Text className="text-gray-800 font-semibold">{title}</Text>
          <Text className="text-gray-400 text-xs">{subtitle}</Text>
        </View>
      </View>


      <CustomToggle value={value} onToggle={onToggle} />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <GradientHeader title="Profile" type="back" />
    

      <ScrollView
        style={{ paddingHorizontal: 20, marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* General Settings */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-black-700 font-medium text-xl">
            General Settings
          </Text>
        </View>

        {/* CARD */}
        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="notifications-outline"
            bg="bg-red-600"
            title="Push Notifications"
            subtitle="Receive alerts on your device"
            value={notification}
            onToggle={() => setNotification(!notification)}
          />
          <ToggleItem
            icon="mail-outline"
            bg="bg-blue-900"
            title="Email Notifications"
            subtitle="Get updates via email"
            value={emailNotification}
            onToggle={() => setEmailNotification(!emailNotification)}
          />
          <ToggleItem
            icon="chatbubble-outline"
            bg="bg-orange-400"
            title="SMS Alerts"
            subtitle="Critical alerts via text"
            value={sms}
            onToggle={() => setSms(!sms)}
          />

          <ToggleItem
            icon="phone-portrait-outline"
            bg="bg-gray-400"
            title="Vibration"
            subtitle="Vibrate on alerts"
            value={vibration}
            onToggle={() => setVibration(!vibration)}
          />

          <ToggleItem
            icon="volume-high-outline"
            bg="bg-green-500"
            title="Sound"
            subtitle="Play alert sounds"
            value={sound}
            onToggle={() => setSound(!sound)}
          />
        </View>
        {/* General Settings */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-black-700 mt-6 mb-3 font-medium text-xl">
            Alert Types
          </Text>
        </View>

        {/* CARD */}
        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="warning-outline"
            bg="bg-red-600"
            title="Critical Alerts"
            subtitle="Life-threatening emergencies"
            value={criticalAlert}
            onToggle={() => setCriticalAlert(!criticalAlert)}
          />
          <ToggleItem
            icon="flame-outline"
            bg="bg-orange-500"
            title="Fire Incidents"
            subtitle="Building fires and hazards"
            value={fireIncidents}
            onToggle={() => setFireIncidents(!fireIncidents)}
          />
          <ToggleItem
            icon="car-outline"
            bg="bg-yellow-400"
            title="Traffic Accidents"
            subtitle="Road accidents nearby"
            value={trafficAccidents}
            onToggle={() => setTrafficAccidents(!trafficAccidents)}
          />

          <ToggleItem
            icon="heart-outline"
            bg="bg-green-500"
            title="Medical Emergencies"
            subtitle="Health-related incidents"
            value={medicalEmergencies}
            onToggle={() => setMedicalEmergencies(!medicalEmergencies)}
          />

          <ToggleItem
            icon="shield-outline"
            bg="bg-gray-600"
            title="Crime Reports"
            subtitle="Security incidents"
            value={crimeReports}
            onToggle={() => setCrimeReports(!crimeReports)}
          />
        </View>

        {/* Community Updates */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-black-700 mt-6 mb-3 font-medium text-xl">
            Community Updates
          </Text>
        </View>

        {/* CARD */}
        <View className="bg-white rounded-2xl p-4">
          <ToggleItem
            icon="checkmark-done-outline"
            bg="bg-blue-500"
            title="Report Verification"
            subtitle="When others verify your reports"
            value={reportVerification}
            onToggle={() => setReportVerification(!reportVerification)}
          />
          <ToggleItem
            icon="sync-outline"
            bg="bg-purple-500"
            title="Report Updates"
            subtitle="Status changes on your reports"
            value={reportUpdates}
            onToggle={() => setReportUpdates(!reportUpdates)}
          />
          <ToggleItem
            icon="chatbubble-ellipses-outline"
            bg="bg-pink-500"
            title="Comment Replies"
            subtitle="Responses to your comments"
            value={commentReplies}
            onToggle={() => setCommentReplies(!commentReplies)}
          />
        </View>


        <View className="rounded-2xl p-4 flex-row items-start mt-6 mb-10"
          style={{ backgroundColor: "#003049" }}>
          {/* Icon */}
          <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center"
          >
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </View>

          {/* Text */}
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-sm mb-1">
              Stay Informed
            </Text>

            <Text className="text-white text-xs leading-4">
              Critical alerts will always be delivered to ensure your safety,
              regardless of your notification settings.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default NotificationSettings;