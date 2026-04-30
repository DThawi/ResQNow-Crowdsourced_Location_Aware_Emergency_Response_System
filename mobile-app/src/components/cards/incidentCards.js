import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const IncidentCard = ({
  type = "Emergency",
  status = "New Report",
  description,
  location,
  timeAgo,
  verifications = 0,
  reports = 0,
  onPress
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-[20px] p-5 mb-4 border border-slate-100"
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* 1. Header: Icon, Title and Status Tag */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2.5">
          <MaterialCommunityIcons name="alert-circle-outline" size={26} color="#D32F2F" />
          <Text className="text-lg font-bold text-slate-800">{type}</Text>
        </View>
        <View className="bg-[#D32F2F] px-3 py-1.5 rounded-full">
          <Text className="text-white text-[11px] font-bold">{status}</Text>
        </View>
      </View>

      {/* 2. Body: Description Text */}
      <Text className="text-[15px] text-slate-500 leading-[22px] mb-[18px]" numberOfLines={2}>
        {description}
      </Text>

      {/* 3. Metadata: Location and Timestamp */}
      <View className="flex-row gap-[25px] mb-[15px]">
        <View className="flex-row items-center gap-1.5">
          <Feather name="map-pin" size={16} color="#94A3B8" />
          <Text className="text-sm text-slate-400">{location}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Feather name="clock" size={16} color="#94A3B8" />
          <Text className="text-sm text-slate-400">{timeAgo}</Text>
        </View>
      </View>

      {/* 4. Footer: Verification Counter */}
      <View className="flex-row justify-between gap-2 pt-[15px] border-t border-slate-100">
        <View className='flex-row items-center'>
          <Ionicons name="people-outline" size={20} color="#10B981" />
          <Text className="text-[15px] text-slate-800 font-medium">{verifications} verifications</Text>
        </View>
        <View className="flex-row items-center ">
          <Ionicons name="alert-circle" size={20} color="#D10000" />
          <Text className="text-[15px] text-slate-800 font-medium">{reports} rejections</Text>
        </View>
      </View>

    </TouchableOpacity>
  );
};

export default IncidentCard;