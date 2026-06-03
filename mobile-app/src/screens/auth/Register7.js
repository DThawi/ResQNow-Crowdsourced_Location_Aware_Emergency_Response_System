import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Register7({ navigation }) {
  return (
    <View className="flex-1 bg-white items-center justify-center px-8">

      {/* Shield icon */}
      <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
        <Ionicons name="shield-checkmark-outline" size={48} color="#10B981" />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-black mb-3 text-center">
        Account Under Review
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-8 leading-5">
        Thank you for registering as an emergency responder. Your account is currently under verification.
      </Text>

      {/* Status steps */}
      <View className="w-full bg-gray-50 rounded-2xl p-5 mb-6" style={{ gap: 16 }}>

        {/* Application Received */}
        <View className="flex-row items-start" style={{ gap: 12 }}>
          <Ionicons name="checkmark-circle" size={22} color="#10B981" style={{ marginTop: 1 }} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-black">Application Received</Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              Your registration has been submitted successfully
            </Text>
          </View>
        </View>

        {/* Under Verification */}
        <View className="flex-row items-start" style={{ gap: 12 }}>
          <Ionicons name="time-outline" size={22} color="#F59E0B" style={{ marginTop: 1 }} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-black">Under Verification</Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              Our team is reviewing your credentials
            </Text>
          </View>
        </View>

        {/* Expected Response Time */}
        <View className="flex-row items-start" style={{ gap: 12 }}>
          <Feather name="mail" size={20} color="#6B7280" style={{ marginTop: 1 }} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-black">Expected Response Time</Text>
            <Text className="text-xs text-gray-400 mt-0.5">24–48 hours</Text>
          </View>
        </View>

      </View>

      {/* Email note */}
      <Text className="text-xs text-gray-400 text-center mb-8">
        You will receive an email at once your account is verified.
      </Text>

      {/* Continue button */}
      <TouchableOpacity
        className="bg-[#D62828] w-full h-12 rounded-full justify-center items-center"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white text-base font-bold">Continue</Text>
      </TouchableOpacity>

    </View>
  );
}