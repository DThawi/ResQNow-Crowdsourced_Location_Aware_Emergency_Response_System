import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const SEVERITY_COLORS = {
  CRITICAL: "#D62828",
  HIGH: "#EA580C",
  MEDIUM: "#D97706",
  LOW: "#16A34A",
};

const RISK_LABELS = {
  CRITICAL: "Critical Risk",
  HIGH: "High Risk",
  MEDIUM: "Medium Risk",
  LOW: "Low Risk",
};

export default function ResponderDangerZoneCard({ zone, onPress }) {
  const sevColor = SEVERITY_COLORS[zone.severity] || "#D62828";
  const incidentCount = zone.incidentCount ?? zone.incidents?.length ?? 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-[#E5E7EB]"
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${sevColor}18` }}
        >
          <Ionicons name="location" size={20} color={sevColor} />
        </View>

        <View className="flex-1">
          <Text
            className="text-[15px] font-bold text-slate-900 mb-0.5"
            numberOfLines={1}
          >
            {zone.name}
          </Text>
          <Text className="text-[12px] text-slate-500 mb-2">
            {incidentCount} incident{incidentCount === 1 ? "" : "s"}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2 mb-2">
            <View
              className="px-2 py-0.5 rounded-md"
              style={{ backgroundColor: sevColor }}
            >
              <Text className="text-white text-[10px] font-bold">
                {RISK_LABELS[zone.severity] || "Risk Zone"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="chart-bell-curve"
                size={14}
                color="#64748b"
              />
              <Text className="text-[11px] text-slate-500 font-semibold">
                Density: {zone.density ?? "—"} per km²
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons
                name={zone.trendIcon || "remove"}
                size={14}
                color={zone.trendColor || "#64748b"}
              />
              <Text
                className="text-[11px] font-semibold"
                style={{ color: zone.trendColor || "#64748b" }}
              >
                {zone.trendLabel || "Stable Trend"}
              </Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
}