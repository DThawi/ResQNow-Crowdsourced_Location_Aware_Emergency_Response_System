import React, { useMemo } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader from "../../components/layout/header";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const SEVERITY_COLORS = {
  CRITICAL: "#D62828",
  HIGH: "#E53935",
  MEDIUM: "#FFA000",
  LOW: "#43A047",
};

const SAFETY_INSTRUCTIONS = [
  "Evacuate immediately if within the zone",
  "Close all windows and doors",
  "Do not use elevators",
  "Follow designated evacuation routes",
  "Report to assembly point at City Hall Plaza",
];

export default function DangerZoneDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const zone = route?.params?.zone || route?.params?.incident || {};

  const sevColor = useMemo(() => {
    return SEVERITY_COLORS[zone.severity] || "#64748b";
  }, [zone.severity]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 30 + insets.bottom }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-2">
          <View className="flex-row items-center gap-2 flex-1 pr-3">
            <Feather name="alert-triangle" size={20} color={sevColor} />
            <Text className="text-[20px] font-bold text-slate-900 flex-1" numberOfLines={2}>
              {zone.name || zone.type || "Danger Zone"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Severity badge */}
        <View className="self-start ml-5 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: sevColor }}>
          <Text className="text-white text-[11px] font-bold">
            {(zone.severity || "HIGH").toString()} RISK LEVEL
          </Text>
        </View>

        {/* Evacuation alert */}
        <View className="mx-5 rounded-2xl p-4 mb-5 bg-[#D62828]">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color="white"
            />
            <Text className="text-white text-[16px] font-bold">Evacuation Required</Text>
          </View>
          <Text className="text-white/90 text-[13px] leading-5">
            If you are within this zone, evacuate immediately. Follow designated evacuation routes.
          </Text>
        </View>

        {/* Description */}
        <Text className="text-[16px] font-bold text-slate-900 mx-5 mb-2">Description</Text>
        <Text className="text-[14px] text-slate-600 leading-6 mx-5 mb-4">
          {zone.description ||
            "Active danger zone with potential risk. Stay informed and follow safety guidelines."}
        </Text>

        {/* Stats */}
        <View className="flex-row mx-5 gap-3 mb-4">
          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="map-pin" size={18} color="#334155" />
            <Text className="text-[12px] text-slate-500 mt-1">Affected Radius</Text>
            <Text className="text-[16px] font-bold text-slate-900 mt-0.5">
              {zone.radius || "500 m"}
            </Text>
          </View>
          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="users" size={18} color="#334155" />
            <Text className="text-[12px] text-slate-500 mt-1">Affected People</Text>
            <Text className="text-[16px] font-bold text-slate-900 mt-0.5">
              {zone.affected || "~1,200"}
            </Text>
          </View>
        </View>

        {/* Location */}
        <Text className="text-[16px] font-bold text-slate-900 mx-5 mb-2">Location</Text>
        <View className="flex-row items-center gap-3 bg-[#F5F5F5] mx-5 rounded-2xl p-4 mb-4">
          <Feather name="map-pin" size={18} color="#334155" />
          <Text className="text-[14px] text-slate-800 flex-1">
            123 Main Street, New City, Sri Lanka 10001
          </Text>
        </View>

        {/* Safety Instructions */}
        <View className="flex-row items-center mx-5 mb-2">
        <Feather name="info" size={18} color="#0f172a" />
        <Text className="text-[16px] font-bold text-slate-900 ml-2">
        Safety Instructions
        </Text>
        </View>
        {SAFETY_INSTRUCTIONS.map((instruction, index) => (
          <View
            key={`${index}-${instruction}`}
            className="flex-row items-center gap-3 mx-5 bg-[#F5F5F5] rounded-2xl p-3 mb-2"
          >
            <View className="w-7 h-7 rounded-full bg-slate-900 items-center justify-center">
              <Text className="text-white text-[12px] font-bold">{index + 1}</Text>
            </View>
            <Text className="text-[13px] text-slate-800 flex-1">{instruction}</Text>
          </View>
        ))}

        {/* Timestamp Card */}
<View className="mx-5 mt-4 mb-5 rounded-2xl bg-[#F3F4F6] p-4">

  <View className="flex-row justify-between mb-3">
    <View className="flex-row items-center">
      <Feather name="calendar" size={16} color="#475569" />
      <View className="ml-2">
        <Text className="text-[12px] text-slate-500">Created</Text>
        <Text className="text-[14px] font-semibold text-slate-900">
          {zone.date || "12/9/2025"}
        </Text>
      </View>
    </View>

    <View className="flex-row items-center">
      <Feather name="clock" size={16} color="#475569" />
      <View className="ml-2">
        <Text className="text-[12px] text-slate-500">Last Updated</Text>
        <Text className="text-[14px] font-semibold text-slate-900">
          {zone.date || "12/9/2025"}
        </Text>
      </View>
    </View>
  </View>

  <View className="flex-row items-center">
    <Feather name="user" size={16} color="#475569" />
    <View className="ml-2">
      <Text className="text-[12px] text-slate-500">Created By</Text>
      <Text className="text-[14px] font-semibold text-slate-900">
        A.B.C. Perera
      </Text>
    </View>
  </View>

</View>

        {/* Actions */}
        <View className="flex-row mx-5 gap-3 mb-3">
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 h-12 rounded-2xl bg-slate-900 items-center justify-center flex-row">
          
            <Feather name="navigation" size={18} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white text-[14px] font-semibold">Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 h-12 rounded-2xl border border-[#E5E5E5] items-center justify-center"
          >
            <Text className="text-slate-900 text-[14px] font-semibold">Share Alert</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          className="mx-5 h-12 rounded-2xl border border-[#E5E5E5] items-center justify-center"
        >
          <Text className="text-slate-900 text-[14px] font-semibold">Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

