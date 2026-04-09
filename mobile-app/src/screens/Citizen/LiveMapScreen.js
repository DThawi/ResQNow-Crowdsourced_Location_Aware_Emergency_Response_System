import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons"; // Expo icon library
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";


import MapView, { Marker } from "react-native-maps";
import API from "../../services/api";



const FILTERS = [
  { key: "All", label: "All" },
  { key: "Pending", label: "New" },
  { key: "Verified", label: "Verified" },
  { key: "Resolved", label: "Resolved" },
];

const PIN_COLORS = {
  Pending: "#DC2626",
  Verified: "#F59E0B",
  Resolved: "#1F2937",
};

export default function LiveMapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered =
    filter === "All"
      ? incidents
      : incidents.filter((i) => i.status === filter);

  const getCounts = (key) => {
    if (key === "All") return incidents.length;
    return incidents.filter((i) => i.status === key).length;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* HEADER */}
      <GradientHeader
        title="Live Incident Map"
        type="back"
      />


      {/* FILTER TABS */}
      <View className="flex-row px-3 py-3 bg-white gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;

          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`flex-1 py-2 rounded-full border items-center ${
                isActive
                  ? "bg-red-600 border-red-600"
                  : "bg-white border-gray-300"
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-gray-800"
                }`}
              >
                {f.label}
              </Text>

              <Text
                className={`text-xs ${
                  isActive ? "text-white/80" : "text-gray-500"
                }`}
              >
                ({getCounts(f.key)})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MAP */}
      <View className="flex-1 relative">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 2,
            longitudeDelta: 2,
          }}
        >
          {filtered.map((incident) => {
            const coords = incident.location?.coordinates;
            if (!coords) return null;

            return (
              <Marker
                key={incident._id}
                coordinate={{
                  latitude: coords[1],
                  longitude: coords[0],
                }}
                pinColor={PIN_COLORS[incident.status] || "#DC2626"}
                onPress={() =>
                  navigation.navigate("IncidentDetails", { incident })
                }
              />
            );
          })}
        </MapView>

        {/* MAP CONTROLS */}
        <View className="absolute right-3 top-3 gap-2">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-md">
            <MaterialIcons name="layers" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-md">
            <MaterialIcons name="my-location" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LEGEND HEADER */}
      <View className="flex-row justify-between items-center px-4 pt-3 pb-1 bg-white">
        <Text className="text-base font-bold text-gray-800">
          Map Legend
        </Text>

        <TouchableOpacity>
          <Text className="text-sm font-semibold text-red-600">
            🔻 Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* LEGEND ITEMS */}
      <View
        className="flex-row px-4 pb-4 gap-6 bg-white"
        style={{ paddingBottom: 16 + insets.bottom }}
      >
        {/* New */}
        <View className="flex-row items-center gap-2">
          <View className="w-3.5 h-3.5 rounded-full bg-red-600" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">
              New
            </Text>
            <Text className="text-xs text-gray-500">
              Unverified
            </Text>
          </View>
        </View>

        {/* Verified */}
        <View className="flex-row items-center gap-2">
          <View className="w-3.5 h-3.5 rounded-full bg-amber-500" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">
              Verified
            </Text>
            <Text className="text-xs text-gray-500">
              Active
            </Text>
          </View>
        </View>

        {/* Resolved */}
        <View className="flex-row items-center gap-2">
          <View className="w-3.5 h-3.5 rounded-full bg-gray-800" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">
              Resolved
            </Text>
            <Text className="text-xs text-gray-500">
              Closed
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}