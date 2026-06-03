import React, { useMemo, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Share,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as Location from "expo-location";

const SEVERITY_COLORS = {
  CRITICAL: "#D62828",
  HIGH: "#E53935",
  MEDIUM: "#FFA000",
  LOW: "#43A047",
};

const getPrecautions = (type) => {
  switch ((type || "").toLowerCase()) {
    case "fire":
      return [
        "Evacuate immediately if within the zone.",
        "Close all windows and doors.",
        "Do not use elevators.",
        "Follow designated evacuation routes.",
        "Report to the nearest assembly point.",
      ];
    case "flood":
      return [
        "Move to higher ground immediately.",
        "Avoid walking or driving through flood water.",
        "Turn off electricity if safe to do so.",
        "Follow official evacuation routes.",
        "Keep emergency supplies ready.",
      ];
    case "accident":
      return [
        "Avoid the immediate area.",
        "Do not crowd the site.",
        "Allow emergency responders full access.",
        "Follow traffic diversion signs.",
        "Report additional hazards to dispatch.",
      ];
    case "gas":
    case "gas leak":
    case "chemical":
    case "hazmat":
      return [
        "Evacuate upwind of the hazard.",
        "Do not use electrical switches or open flames.",
        "Alert others in the vicinity.",
        "Wait for hazmat clearance before re-entry.",
        "Coordinate with incident command.",
      ];
    default:
      return [
        "Stay alert and monitor official updates.",
        "Avoid the affected area unless assigned.",
        "Follow incident command instructions.",
        "Use PPE appropriate to the hazard type.",
        "Document conditions for situational reports.",
      ];
  }
};

export default function ResponderDangerZoneDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const zone = route?.params?.zone || {};

  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    const getAddress = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const currentLocation = await Location.getCurrentPositionAsync({});
        setUserCoords({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (!zone.latitude || !zone.longitude) return;

        const res = await Location.reverseGeocodeAsync({
          latitude: zone.latitude,
          longitude: zone.longitude,
        });

        if (res.length > 0) {
          const addr = res[0];
          const formatted = [
            addr.name,
            addr.street,
            addr.city,
            addr.region,
            addr.country,
          ]
            .filter(Boolean)
            .join(", ");
          setResolvedAddress(formatted);
        }
      } catch (err) {
        console.log("Geocode error:", err);
      }
    };

    getAddress();
  }, [zone.latitude, zone.longitude]);

  const sevColor = useMemo(
    () => SEVERITY_COLORS[zone.severity] || "#64748b",
    [zone.severity]
  );

  const incidentType =
    zone.type || zone.name?.replace(" Zone", "").trim() || "Incident";

  const precautions = getPrecautions(incidentType);

  const createdAt = zone?.timestamp || zone?.created_at || null;
  const updatedAt = zone?.updated_at || zone?.timestamp || null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US") : "N/A";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `
🚨 Danger Zone Alert

Zone: ${zone.name || "Danger Zone"}
Severity: ${zone.severity || "Unknown"}
Location: ${resolvedAddress || "Location unavailable"}
Description: ${zone.description || "No description"}
Incidents: ${zone.incidentCount ?? zone.incidents?.length ?? 0}
        `.trim(),
      });
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  const openGoogleMaps = async () => {
    try {
      if (!userCoords || !zone.latitude || !zone.longitude) return;

      const { latitude: slat, longitude: slng } = userCoords;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${slat},${slng}&destination=${zone.latitude},${zone.longitude}&travelmode=driving`;

      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.log("Google Maps error:", err);
    }
  };

  const creatorName = zone.reportedBy || "Community Reporter";

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 30 + insets.bottom,
        }}
      >
        <View className="flex-row items-center justify-between px-5 pb-2">
          <View className="flex-row items-center gap-2 flex-1 pr-3">
            <Feather name="alert-triangle" size={20} color={sevColor} />
            <Text
              className="text-[20px] font-bold text-slate-900 flex-1"
              numberOfLines={2}
            >
              {zone.name || zone.type || "Danger Zone"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View
          className="self-start ml-5 px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: sevColor }}
        >
          <Text className="text-white text-[11px] font-bold">
            {(zone.severity || "HIGH")} RISK LEVEL
          </Text>
        </View>

        <View className="mx-5 rounded-2xl p-4 mb-5 bg-[#D62828]">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color="white"
            />
            <Text className="text-white text-[16px] font-bold">
              Evacuation Required
            </Text>
          </View>
          <Text className="text-white/90 text-[13px] leading-5">
            If you are within this zone, evacuate immediately. Follow designated
            evacuation routes and incident command.
          </Text>
        </View>

        <Text className="text-[16px] font-bold mx-5 mb-2">Description</Text>
        <Text className="text-[14px] text-slate-600 mx-5 mb-4 leading-5">
          {zone.description || "No description available."}
        </Text>

        <View className="flex-row mx-5 gap-3 mb-4">
          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="map-pin" size={18} color="#64748b" />
            <Text className="text-[12px] mt-1 text-slate-500">
              Affected Radius
            </Text>
            <Text className="font-bold text-slate-800">
              {zone.radius || "N/A"}
            </Text>
          </View>

          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="users" size={18} color="#64748b" />
            <Text className="text-[12px] mt-1 text-slate-500">
              Affected People
            </Text>
            <Text className="font-bold text-slate-800">
              {zone.affected || "N/A"}
            </Text>
          </View>
        </View>

        <Text className="text-[16px] font-bold mx-5 mb-2">Location</Text>
        <View className="flex-row items-center gap-3 bg-[#F5F5F5] mx-5 rounded-2xl p-4 mb-4">
          <Feather name="map-pin" size={18} color="#D62828" />
          <Text className="flex-1 text-[14px] text-slate-700">
            {resolvedAddress
              ? resolvedAddress
              : zone.latitude
              ? "Fetching location..."
              : "Location unavailable"}
          </Text>
        </View>

        <View className="flex-row items-center mx-5 mb-2">
          <Feather name="info" size={18} color="#2563EB" />
          <Text className="text-[16px] font-bold ml-2 text-slate-900">
            Precautions
          </Text>
        </View>

        {precautions.map((step, i) => (
          <View
            key={i}
            className="flex-row items-start gap-3 mx-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-3 mb-2"
          >
            <View className="w-7 h-7 rounded-full bg-[#2563EB] items-center justify-center">
              <Text className="text-white text-xs font-bold">{i + 1}</Text>
            </View>
            <Text className="flex-1 text-[14px] text-slate-700 leading-5 pt-0.5">
              {step}
            </Text>
          </View>
        ))}

        <View className="mx-5 mt-4 mb-5 rounded-2xl bg-[#F3F4F6] p-4">
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <Feather name="calendar" size={16} color="#64748b" />
              <View className="ml-2">
                <Text className="text-xs text-slate-500">Created</Text>
                <Text className="font-semibold text-slate-800">
                  {formatDate(createdAt)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center flex-1">
              <Feather name="clock" size={16} color="#64748b" />
              <View className="ml-2">
                <Text className="text-xs text-slate-500">Last Updated</Text>
                <Text className="font-semibold text-slate-800">
                  {formatDate(updatedAt)}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <Feather name="user" size={16} color="#64748b" />
            <View className="ml-2">
              <Text className="text-xs text-slate-500">Created By</Text>
              <Text className="font-semibold text-slate-800">
                {creatorName}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row mx-5 gap-3 mb-3">
          <TouchableOpacity
            onPress={openGoogleMaps}
            className="flex-1 h-12 bg-[#003049] rounded-2xl items-center justify-center flex-row"
          >
            <Feather name="navigation" size={18} color="white" />
            <Text className="text-white ml-2 font-semibold">Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            className="flex-1 h-12 border border-[#E5E7EB] rounded-2xl items-center justify-center flex-row"
          >
            <Feather name="share-2" size={16} color="#334155" />
            <Text className="text-slate-700 ml-2 font-semibold">Share Alert</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mx-5 h-12 border border-[#E5E7EB] rounded-2xl items-center justify-center"
        >
          <Text className="text-slate-700 font-semibold">Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}