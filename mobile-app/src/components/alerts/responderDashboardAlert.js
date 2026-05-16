import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
 
export default function ResponderDashboardAlert({ incident, onViewDetails, onDismiss }) {
  if (!incident) return null;
 
  return (
    <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Text className="text-black font-bold text-base mb-1">New Incident Assigned</Text>
      <Text className="text-gray-500 text-xs mb-3">{incident.description}</Text>
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="bg-[#D62828] px-4 py-2 rounded-lg"
          onPress={onViewDetails}
        >
          <Text className="text-white font-bold text-sm">View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-gray-300 px-4 py-2 rounded-lg"
          onPress={onDismiss}
        >
          <Text className="text-gray-500 font-bold text-sm">Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
