import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

const ResponderEditProfileScreen = () => {
  const [image, setImage] = useState(
    "https://i.pravatar.cc/150?img=12" // sample image (replace with user image)
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <GradientHeader title="Edit Profile" type="back" />
     

      <ScrollView className="px-5">
        {/* Profile Image */}
        <View className="items-center mt-6">
          <View className="relative">
            <Image
              source={{ uri: image }}
              className="w-28 h-28 rounded-full"
            />

            {/* Camera Icon */}
            <TouchableOpacity className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 mt-2 text-sm">
            Tap to change photo
          </Text>
        </View>

        {/* Form */}
        <View className="mt-6 space-y-4">
          {/* Full Name */}
          <View className="pb-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Full Name
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3 py-3">
              <Ionicons name="person-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="Officer Upul Jayasooriya"
                className="ml-3 flex-1 text-gray-700"
              />
            </View>
          </View>
          {/* Phone */}
          <View className="pb-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Phone Number
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3 py-3">
              <Ionicons name="call-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="+94 77 123 4567"
                className="ml-3 flex-1 text-gray-700"
              />
            </View>
          </View>

          {/* Email */}
          <View className="pb-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Email Address
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3 py-3">
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="upul.jayasooriya@police.gov"
                className="ml-3 flex-1 text-gray-700"
              />
            </View>
          </View>

          

          {/* Address */}
          <View className="pb-4">
            <Text className="text-gray-700 mb-2 font-medium">
              Role
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3 py-3">
              <TextInput
                placeholder="Responder"
                className="ml-3 flex-1 text-gray-700"
              />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="mt-3">
          <TouchableOpacity className="bg-red-600 py-4 rounded-xl items-center">
            <Text className="text-white font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-4 border border-red-500 py-4 rounded-xl items-center">
            <Text className="text-red-500 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResponderEditProfileScreen;