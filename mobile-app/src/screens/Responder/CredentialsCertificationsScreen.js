import React from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

const InputField = ({ label, placeholder }) => {
  return (
    <View className="mb-3">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <TextInput
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2"
      />
    </View>
  );
};

const CertificationCard = ({ title, id, expiry, status }) => {
  const isValid = status === "valid";

  return (
    <View className="bg-gray-100 rounded-xl p-4 mb-3">
      
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-2">
        
        <View className="flex-row items-center flex-1">
          <Ionicons name="school-outline" size={18} color="#374151" />
          <Text className="font-semibold text-gray-900 ml-2 flex-1 text-md">
            {title}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons
            name={isValid ? "checkmark-circle" : "alert-circle"}
            size={16}
            color={isValid ? "#16A34A" : "#F59E0B"}
          />
          <Text
            className={`ml-1 text-sm font-medium ${
              isValid ? "text-green-600" : "text-yellow-500"
            }`}
          >
            {isValid ? "Valid" : "Expiring"}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-500 text-sm ml-1">
        ID: {id}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Ionicons name="calendar-outline" size={17} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1">
          {expiry}
        </Text>
      </View>
    </View>
  );
};

const UploadButton = () => {
  return (
    <TouchableOpacity className="border border-red-500 rounded-lg py-3 items-center mt-2">
      <View className="flex-row items-center">
        <Ionicons name="cloud-upload-outline" size={18} color="#EF4444" />
        <Text className="text-red-500 font-medium ml-2">
          Upload Certificate Document
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const PrimaryButton = ({ title }) => {
  return (
    <TouchableOpacity className="bg-red-600 py-3 rounded-xl items-center mb-3">
      <Text className="text-white font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const SecondaryButton = ({ title }) => {
  return (
    <TouchableOpacity className="py-2 items-center">
      <Text className="text-gray-500">{title}</Text>
    </TouchableOpacity>
  );
};

const CredentialsCertificationsScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
        {/* Header */}
      <GradientHeader title="Credentials & Certifications" type="back" />
      {/* Modal Container */}
      <View className="bg-white rounded-2xl p-5">
        
        

        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Section Title */}
          <Text className="text-gray-500 mb-3 font-semibold">
            Your Certifications
          </Text>

          {/* Cards */}
          <CertificationCard
            title="Emergency Medical Responder"
            id="EMR-2024-001"
            expiry="2025-12-31"
            status="valid"
          />

          <CertificationCard
            title="Crisis Management Training"
            id="CMT-2024-045"
            expiry="2024-03-15"
            status="expiring"
          />

          {/* Add New */}
          <View className="mt-4 border border-gray-200 rounded-xl p-4">
            <Text className="font-semibold mb-3">
              Add New Certification
            </Text>

            <InputField label="Certification Name" placeholder="Enter certification name" />
            <InputField label="Certificate ID" placeholder="Enter certificate ID" />
            <InputField label="Expiry Date" placeholder="YYYY-MM-DD" />

            <UploadButton />
          </View>

          {/* Buttons */}
          <View className="mt-5">
            <PrimaryButton title="Save" />
            <SecondaryButton title="Cancel" />
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

export default CredentialsCertificationsScreen;