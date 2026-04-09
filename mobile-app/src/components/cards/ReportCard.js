import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const ReportCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      className="bg-white rounded-[16px] p-4 mb-4 flex-row items-start"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left Icon Area */}
      <View 
        className="w-[48px] h-[48px] rounded-[14px] items-center justify-center mr-4 mt-1"
        style={{ backgroundColor: item.typeBgHex }}
      >
        <MaterialCommunityIcons name={item.typeIcon} size={24} color="#FFFFFF" />
      </View>

      {/* Right Content Area */}
      <View className="flex-1">
        {/* Title and Status Row */}
        <View className="flex-row justify-between items-start mb-1.5">
          <Text className="text-[15px] font-bold text-[#2B2D42] flex-1 mr-2 mt-0.5" numberOfLines={2}>
            {item.title}
          </Text>
          <View 
            style={{ backgroundColor: item.statusColor }} 
            className="px-2.5 py-[3px] rounded-full"
          >
            <Text className="text-[#FFFFFF] text-[11px] font-medium">{item.status}</Text>
          </View>
        </View>

        {/* Location Row */}
        <View className="flex-row items-center mb-2.5">
          <Feather name="map-pin" size={12} color="#8D99AE" />
          <Text className="text-[13px] text-[#8D99AE] ml-1.5">{item.location}</Text>
        </View>

        {/* Footer Info Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="clock" size={12} color="#8D99AE" />
            <Text className="text-[13px] text-[#8D99AE] ml-1.5">{item.date}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Feather name="eye" size={14} color="#8D99AE" />
              <Text className="text-[13px] text-[#8D99AE] ml-1">{item.views}</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="thumbs-up" size={14} color="#2ECC71" />
              <Text className="text-[13px] text-[#2ECC71] ml-1">{item.likes}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReportCard;
