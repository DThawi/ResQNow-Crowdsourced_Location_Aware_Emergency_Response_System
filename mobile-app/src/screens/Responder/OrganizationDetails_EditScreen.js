import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

const OrganizationDetails_EditScreen = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [form, setForm] = useState({
    organization: "Sri Lanka Police Department",
    responderId: "SLPD-2024-12345",
    region: "Kaduwela, Colombo",
    supervisor: "DIG Sunil Marapana",
  });

  const handleRequestPermission = () => {
    setRequestSent(true);

    Alert.alert(
      "Permission Requested",
      "Your request has been sent to admin for approval."
    );

    setTimeout(() => {
      setIsApproved(true);

      Alert.alert(
        "Approved",
        "Admin approved your request. Now you can edit details."
      );
    }, 3000);
  };

  const handleSave = () => {
    Alert.alert("Saved", "Organization details updated successfully.");
  };

  const handleCancel = () => {
    Alert.alert("Cancelled", "No changes were made.");
  };

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const InputBox = ({ icon, value, editable, onChangeText }) => (
    <View
      className={`rounded-2xl px-4 py-4 flex-row items-center mb-5 ${
        editable ? "bg-gray-100" : "bg-gray-50"
      }`}
    >
      <Ionicons
        name={icon}
        size={20}
        color="#94a3b8"
        style={{ marginRight: 12 }}
      />

      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        className={`flex-1 text-base ${
          editable ? "text-gray-800" : "text-gray-400"
        }`}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <GradientHeader title="Organization Details" type="back" />

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4"
      >
        {/* Status Card */}
        <View
          className={`rounded-2xl p-4 mb-8 border ${
            isApproved
              ? "bg-green-50 border-green-500"
              : requestSent
              ? "bg-blue-50 border-blue-400"
              : "bg-yellow-50 border-yellow-400"
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name={
                isApproved
                  ? "shield-checkmark-outline"
                  : requestSent
                  ? "time-outline"
                  : "lock-closed-outline"
              }
              size={24}
              color={
                isApproved
                  ? "#22c55e"
                  : requestSent
                  ? "#3b82f6"
                  : "#f59e0b"
              }
            />

            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold">
                {isApproved
                  ? "Verified Responder"
                  : requestSent
                  ? "Waiting for Admin Approval"
                  : "Permission Required"}
              </Text>

              <Text className="text-sm text-gray-500 mt-1">
                {isApproved
                  ? "Your account has been verified"
                  : requestSent
                  ? "Admin is reviewing your request"
                  : "Request admin approval before editing"}
              </Text>
            </View>
          </View>
        </View>

        {/* Inputs */}
        <Text className="text-gray-500 mb-2">Organization Name</Text>
        <InputBox
          icon="business-outline"
          value={form.organization}
          editable={isApproved}
          onChangeText={(text) => updateField("organization", text)}
        />

        <Text className="text-gray-500 mb-2">Responder ID</Text>
        <InputBox
          icon="card-outline"
          value={form.responderId}
          editable={isApproved}
          onChangeText={(text) => updateField("responderId", text)}
        />

        <Text className="text-gray-500 mb-2">Assigned Region</Text>
        <InputBox
          icon="location-outline"
          value={form.region}
          editable={isApproved}
          onChangeText={(text) => updateField("region", text)}
        />

        <Text className="text-gray-500 mb-2">Supervisor Name</Text>
        <InputBox
          icon="person-outline"
          value={form.supervisor}
          editable={isApproved}
          onChangeText={(text) => updateField("supervisor", text)}
        />

        {/* Buttons */}
        {!requestSent && !isApproved && (
          <TouchableOpacity
            onPress={handleRequestPermission}
            className="bg-blue-600 rounded-2xl py-4 mt-4"
          >
            <Text className="text-center text-white font-semibold text-base">
              Request Edit Permission
            </Text>
          </TouchableOpacity>
        )}

        {requestSent && !isApproved && (
          <View className="bg-gray-100 rounded-2xl py-4 mt-4">
            <Text className="text-center text-gray-500 font-semibold">
              Waiting for Approval...
            </Text>
          </View>
        )}

        {isApproved && (
          <TouchableOpacity
            onPress={handleSave}
            className="bg-red-600 rounded-2xl py-4 mt-4"
          >
            <Text className="text-center text-white font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleCancel}
          className="border border-gray-300 rounded-2xl py-4 mt-3"
        >
          <Text className="text-center text-gray-700 font-semibold text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OrganizationDetails_EditScreen;