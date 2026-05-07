import React, { useMemo, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader from "../../components/layout/header";
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as Location from "expo-location";
import { Linking } from "react-native";

/* ---------- Severity Colors ---------- */
const SEVERITY_COLORS = {
  CRITICAL: "#D62828",
  HIGH: "#E53935",
  MEDIUM: "#FFA000",
  LOW: "#43A047",
};

/* ---------- Dynamic Safety Instructions ---------- */
const getSafetyInstructions = (type) => {
  switch ((type || "").toLowerCase()) {
    case "fire":
      return [
        "Evacuate immediately",
        "Avoid smoke inhalation",
        "Use stairs, not elevators",
        "Call emergency services",
      ];

    case "flood":
      return [
        "Move to higher ground",
        "Avoid walking in water",
        "Turn off electricity",
        "Follow evacuation routes",
      ];

    case "accident":
      return [
        "Avoid the area",
        "Do not crowd the site",
        "Allow emergency responders access",
      ];

    case "gas":
    case "gas leak":
      return [
        "Do not use electrical switches",
        "Evacuate immediately",
        "Avoid open flames",
        "Call authorities",
      ];

    default:
      return [
        "Stay alert and monitor updates",
        "Avoid the affected area",
        "Follow official instructions",
      ];
  }
};

export default function DangerZoneDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const zone = route?.params?.zone || {};

  const [resolvedAddress, setResolvedAddress] = useState(null);

  const [showDirections, setShowDirections] = useState(false);

  const [userCoords, setUserCoords] = useState(null);
  const [reporter, setReporter] = useState(null);

useEffect(() => {
  const getAddress = async () => {
    try {

      // ✅ REQUEST LOCATION PERMISSION
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      // ✅ GET USER LOCATION
      const currentLocation =
        await Location.getCurrentPositionAsync({});

      setUserCoords({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // ✅ CHECK INCIDENT LOCATION
      if (!zone.latitude || !zone.longitude) return;

      // ✅ GET ADDRESS FROM COORDINATES
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
}, [zone]);


useEffect(() => {

  const fetchReporter = async () => {

    try {

      console.log("ZONE DATA:", zone);

      // ✅ GET USER ID FROM FIRST INCIDENT
      const reporterId = zone?.incidents?.[0]?.user_id;

      if (!reporterId) {
        console.log("No reporter ID found");
        return;
      }

      console.log("Fetching user:", reporterId);

      const response = await fetch(
        `http://10.158.11.118:5000/api/auth/user/${reporterId}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.log("HTTP ERROR:", response.status);
        return;
      }

      const data = await response.json();

      console.log("REPORTER DATA:", data);

      setReporter(data);

    } catch (err) {

      console.log("Reporter fetch error:", err);

    }

  };

  fetchReporter();

}, [zone]);

  const sevColor = useMemo(() => {
    return SEVERITY_COLORS[zone.severity] || "#64748b";
  }, [zone.severity]);

  /* ---------- Derived Data ---------- */

  
  const incidentType =
  zone.type ||
  zone.name?.replace(" Zone", "").trim();

const instructions =
  getSafetyInstructions(incidentType);

  const locationName =
    zone.locationName ||
    zone.address ||
    "Location details unavailable";

  //const createdAt = zone.createdAt || zone.timestamp;
  //const updatedAt = zone.updatedAt || zone.timestamp;

const createdAt = zone?.timestamp || zone?.created_at || null;

const updatedAt = zone?.updated_at || zone?.timestamp || null;

// const formatDate = (date) => {
//   if (!date) return "N/A";
//   return new Date(date).toLocaleString();
// };

  //

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "N/A";

  const handleShare = async () => {
  try {
    await Share.share({
      message: `
🚨 Danger Zone Alert

Type: ${zone.name || "Danger Zone"}

Severity: ${zone.severity || "Unknown"}

Location:
${resolvedAddress || "Location unavailable"}

Description:
${zone.description || "No description"}
      `,
    });
  } catch (err) {
    console.log("Share error:", err);
  }
};


const openGoogleMaps = async () => {
  try {
    if (!userCoords || !zone.latitude || !zone.longitude) return;

    const { latitude: slat, longitude: slng } = userCoords;
    const dlat = zone.latitude;
    const dlng = zone.longitude;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${slat},${slng}&destination=${dlat},${dlng}&travelmode=driving`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Google Maps not supported");
    }
  } catch (err) {
    console.log("Google Maps error:", err);
  }
};

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
        {/* ---------- Header ---------- */}
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

        {/* ---------- Severity ---------- */}
        <View
          className="self-start ml-5 px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: sevColor }}
        >
          <Text className="text-white text-[11px] font-bold">
            {(zone.severity || "HIGH")} RISK LEVEL
          </Text>
        </View>

        {/* ---------- Alert ---------- */}
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
            Follow the safety instructions immediately.
          </Text>
        </View>

        {/* ---------- Description ---------- */}
        <Text className="text-[16px] font-bold mx-5 mb-2">
          Description
        </Text>
        <Text className="text-[14px] text-slate-600 mx-5 mb-4">
          {zone.description || "No description available."}
        </Text>

        {/* ---------- Stats ---------- */}
        <View className="flex-row mx-5 gap-3 mb-4">
          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="map-pin" size={18} />
            <Text className="text-[12px] mt-1">Radius</Text>
            <Text className="font-bold">{zone.radius || "N/A"}</Text>
          </View>

          <View className="flex-1 bg-[#F5F5F5] rounded-2xl p-4 items-center">
            <Feather name="users" size={18} />
            <Text className="text-[12px] mt-1">Affected</Text>
            <Text className="font-bold">{zone.affected || "N/A"}</Text>
          </View>
        </View>

        {/* ---------- Location (NAME, NOT COORDS) ---------- */}
        <Text className="text-[16px] font-bold mx-5 mb-2">
          Location
        </Text>
        <View className="flex-row items-center gap-3 bg-[#F5F5F5] mx-5 rounded-2xl p-4 mb-4">
          <Feather name="map-pin" size={18} />
          <Text className="flex-1">
            {resolvedAddress
              ? resolvedAddress
              : zone.latitude
              ? "Fetching location..."
              : "Location unavailable"}
          </Text>
        </View>

        {/* ---------- Dynamic Instructions ---------- */}
        <View className="flex-row items-center mx-5 mb-2">
          <Feather name="info" size={18} />
          <Text className="text-[16px] font-bold ml-2">
            Safety Instructions
          </Text>
        </View>

        {instructions.map((ins, i) => (
          <View
            key={i}
            className="flex-row items-center gap-3 mx-5 bg-[#F5F5F5] rounded-2xl p-3 mb-2"
          >
            <View className="w-7 h-7 rounded-full bg-black items-center justify-center">
              <Text className="text-white text-xs">{i + 1}</Text>
            </View>
            <Text className="flex-1">{ins}</Text>
          </View>
        ))}

        {/* ---------- Metadata ---------- */}
        {/* <View className="mx-5 mt-4 mb-5 rounded-2xl bg-[#F3F4F6] p-4">

          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} />
              <View className="ml-2">
                <Text className="text-xs">Created</Text>
                <Text className="font-semibold">
                  {formatDate(createdAt)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Feather name="clock" size={16} />
              <View className="ml-2">
                <Text className="text-xs">Updated</Text>
                <Text className="font-semibold">
                  {formatDate(updatedAt)}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <Feather name="user" size={16} />
            <View className="ml-2">
              <Text className="text-xs">Reported By</Text>
              <Text className="font-semibold">
                <Text className="font-semibold">
                   {reporter?.name || "Loading..."}
                </Text>
              </Text>
            </View>
          </View>
        </View> */}


        <View className="mx-5 mt-4 mb-5 rounded-2xl bg-[#F3F4F6] p-4">

  {/* Created & Updated */}
  <View className="flex-row justify-between mb-3">

    <View className="flex-row items-center flex-1">
      <Feather name="calendar" size={16} />
      <View className="ml-2">
        <Text className="text-xs">Created</Text>
        <Text className="font-semibold">
          {formatDate(createdAt)}
        </Text>
      </View>
    </View>

    <View className="flex-row items-center flex-1">
      <Feather name="clock" size={16} />
      <View className="ml-2">
        <Text className="text-xs">Updated</Text>
        <Text className="font-semibold">
          {formatDate(updatedAt)}
        </Text>
      </View>
    </View>

  </View>

  {/* Reported By */}
  <View className="flex-row items-center mt-2">
    <Feather name="user" size={16} />
    <View className="ml-2">
      <Text className="text-xs">Reported By</Text>
      <Text className="font-semibold">
        {reporter?.name ||
          reporter?.fullName ||
          reporter?.email ||
          "Unknown User"}
      </Text>
    </View>
  </View>

</View>

        {/* ---------- Actions ---------- */}
        <View className="flex-row mx-5 gap-3 mb-3">
          <TouchableOpacity
              onPress={openGoogleMaps}
              className="flex-1 h-12 bg-black rounded-2xl items-center justify-center flex-row"
         >
            <Feather name="navigation" size={18} color="white" />
            <Text className="text-white ml-2">Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
             onPress={handleShare}
             className="flex-1 h-12 border rounded-2xl items-center justify-center"
  >
            <Text>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mx-5 h-12 border rounded-2xl items-center justify-center"
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </ScrollView>


      
    </View>
  );
}