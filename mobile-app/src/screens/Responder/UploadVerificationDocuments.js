import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

// 🔹 Input Field
const InputField = ({ label, placeholder }) => (
  <View className="mb-5">
    <Text className="text-md font-semibold text-gray-600 mb-2 mt-5">{label}</Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      className="w-full px-4 py-3 rounded-xl border border-gray-200"
    />
  </View>
);

// 🔹 Upload Box
const UploadBox = () => (
  <View className="border-2 border-dashed border-gray-200 rounded-2xl p-8 items-center mb-5">
    <Ionicons name="cloud-upload-outline" size={36} color="#9CA3AF" />

    <Text className="text-gray-700 font-medium mt-3">
      Drag & drop your file here
    </Text>

    <Text className="text-sm text-gray-400 mt-1">
      or <Text className="text-blue-500">click to browse</Text>
    </Text>

    <Text className="text-xs text-gray-400 mt-2">
      Supported: PDF, JPG, PNG (Max 10MB)
    </Text>
  </View>
);

// 🔹 Upload from Gallery Button
const UploadGalleryButton = () => (
  <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-gray-100 py-3 rounded-xl mb-5">
    <Ionicons name="image-outline" size={20} color="#4B5563" />
    <Text className="text-gray-700">Upload from Gallery</Text>
  </TouchableOpacity>
);

// 🔹 Info Box
const InfoBox = () => (
  <View className="bg-yellow-100 p-4 rounded-xl mb-6">
    <Text className="text-gray-700 text-sm text-center">
      Documents will be reviewed by ResQNow administrators within 24–48 hours.
    </Text>
  </View>
);

// 🔹 Buttons
const PrimaryButton = ({ text }) => (
  <TouchableOpacity className="bg-red-600 py-4 rounded-xl items-center mb-3">
    <Text className="text-white font-semibold">{text}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ text }) => (
  <TouchableOpacity className="py-3 items-center">
    <Text className="text-gray-600">{text}</Text>
  </TouchableOpacity>
);

// 🔹 Main Screen
const UploadVerificationDocuments = ({ navigation }) => {
  return (
    <View className="flex-1 bg-white">
      
      {/* Header */}
      <GradientHeader title="Upload Verification Documents" type="back" />

      {/* 🔸 Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
      >
        {/* Input */}
        <InputField label="Document Type" placeholder="" />

        {/* Upload Box */}
        <UploadBox />

        {/* Upload from Gallery */}
        <UploadGalleryButton />

        {/* Info */}
        <InfoBox />

        {/* Buttons */}
        <PrimaryButton text="Submit" />
        <SecondaryButton text="Cancel" />
      </ScrollView>
    </View>
  );
};

export default UploadVerificationDocuments;