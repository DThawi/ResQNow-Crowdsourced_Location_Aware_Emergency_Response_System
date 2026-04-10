import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

/* Incident Config */

const INCIDENT_CONFIG = {
  Fire: {
    color: "#D62828",
    icon: "fire",
  },
  Medical: {
    color: "#FFA000",
    icon: "medical-bag",
  },
  Accident: {
    color: "#D62828",
    icon: "car",
  },
  Resolved: {
    color: "#2E7D32",
    icon: "check-circle",
  },
  Weather: {
    color: "#FFA000",
    icon: "weather-lightning",
  },
};

const AlertCard = ({ alert }) => {
  const config =
    INCIDENT_CONFIG[alert.type] || INCIDENT_CONFIG.Fire;

  return (
    <View
      className="bg-white rounded-2xl mb-3"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: config.color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="px-4 py-4">

        {/* Header */}
        <View className="flex-row items-center gap-2 mb-2">

          <MaterialCommunityIcons
            name={config.icon}
            size={22}
            color={config.color}
          />

          <Text
            className="text-[15px] font-bold text-slate-800 flex-1"
            numberOfLines={1}
          >
            {alert.title}
          </Text>

          {alert.unread && (
            <View className="w-2.5 h-2.5 rounded-full bg-red-600" />
          )}
        </View>

        {/* Description */}
        <Text
          className="text-[13px] text-slate-600 mb-3"
          numberOfLines={2}
        >
          {alert.description}
        </Text>

        {/* Footer */}
        <View className="flex-row gap-4">

          <View className="flex-row items-center gap-1">
            <Feather name="map-pin" size={14} color="#64748B" />
            <Text className="text-[12px] text-slate-500">
              {alert.location}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Feather name="clock" size={14} color="#64748B" />
            <Text className="text-[12px] text-slate-500">
              {alert.time}
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
};

export default AlertCard;