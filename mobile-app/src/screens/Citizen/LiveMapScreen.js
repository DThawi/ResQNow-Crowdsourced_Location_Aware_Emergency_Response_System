import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons"; // Expo icon library
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";
import { Linking, Platform } from "react-native";
import { Modal } from "react-native";
import * as Location from "expo-location";

import MapView from "react-native-map-clustering";
import { Marker, Heatmap, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import API from "../../services/api";

const FILTERS = [
  { key: "All", label: "All" },
  { key: "Pending", label: "New" },
  { key: "Verified", label: "Verified" },
  { key: "Assigned", label: "Assigned" },
  { key: "Resolved", label: "Resolved" },
];

const PIN_COLORS = {
  Pending: "#DC2626",
  Verified: "#F59E0B",
  Assigned: "#3B82F6",
  Resolved: "#1F2937",
};

const SEVERITY_CONFIG = {
  low: { color: "rgba(34,197,94,0.25)", radius: 120 },
  moderate: { color: "rgba(234,179,8,0.30)", radius: 200 },
  high: { color: "rgba(249,115,22,0.35)", radius: 300 },
  critical: { color: "rgba(239,68,68,0.40)", radius: 450 },
};

const openGoogleMaps = async (latitude, longitude) => {
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${latitude},${longitude}`,
    android: `google.navigation:q=${latitude},${longitude}`,
  });

  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log("Navigation error:", error);
  }
};

export default function LiveMapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [incidents, setIncidents] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [region, setRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });

  const [mapType, setMapType] = useState("standard");
  const mapRef = useRef(null);

  useEffect(() => {
    fetchIncidents();
    fetchHeatmapData();

    const interval = setInterval(() => {
      fetchIncidents();
      fetchHeatmapData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapRef.current || incidents.length === 0) {
      return;
    }

    const coordinates = incidents
      .filter((incident) => {
        if (
          !incident.location ||
          !Array.isArray(incident.location.coordinates)
        ) {
          return false;
        }

        const lng = Number(incident.location.coordinates[0]);

        const lat = Number(incident.location.coordinates[1]);

        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        );
      })

      .map((incident) => ({
        latitude: Number(incident.location.coordinates[1]),

        longitude: Number(incident.location.coordinates[0]),
      }));

    

    if (coordinates.length > 0) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 100,
            left: 50,
          },

          animated: true,
        });
      }, 1000);
    }
  }, [incidents]);

  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");

      console.log("API DATA:", res.data);

      setIncidents(res.data || []);
    } catch (err) {
      
    }
  };
  const fetchHeatmapData = async () => {
    try {
      const res = await API.get("/heatmap");

      const validPoints = (res.data || [])
        .map((point) => ({
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          weight: point.weight || 1,
        }))
        .filter((point) => !isNaN(point.latitude) && !isNaN(point.longitude));

      setHeatmapPoints(validPoints);
    } catch (err) {
      console.log("HEATMAP ERROR:", err.message);
    }
  };

  const filtered =
    filter === "All"
      ? incidents
      : incidents.filter(
          (i) => i.status?.toLowerCase() === filter.toLowerCase(),
        );

  const getCounts = (key) => {
    if (key === "All") return incidents.length;

    return incidents.filter(
      (i) => i.status?.toLowerCase() === key.toLowerCase(),
    ).length;
  };

  const goToMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const toggleMapType = () => {
    setMapType((prev) => (prev === "standard" ? "satellite" : "standard"));
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* HEADER */}
      <GradientHeader title="Live Incident Map" type="back" />

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
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          mapType={mapType}
          clusteringEnabled={true}
          clusterColor="#DC2626"
          clusterTextColor="#fff"
          clusterFontSize={14}
          // region={region}
          // onRegionChangeComplete={setRegion}
          initialRegion={{
            latitude: 6.9271,
            longitude: 79.8612,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          showsUserLocation={true}
        > 
          {/* Incident Markers */}
          {heatmapPoints.length > 0 && (
            <Heatmap
              points={heatmapPoints}
              radius={50}
              opacity={0.7}
              gradient={{
                colors: ["#22C55E", "#EAB308", "#F97316", "#DC2626"],
                startPoints: [0.2, 0.4, 0.6, 0.8],
              }}
            />
          )}

          {filtered.map((incident, index) => {
            if (
              !incident.location ||
              !incident.location.coordinates ||
              incident.location.coordinates.length < 2
            ) {
              return null;
            }

            const [lng, lat] = incident.location.coordinates;

            // extra validation
            if (
              typeof lat !== "number" ||
              typeof lng !== "number" ||
              isNaN(lat) ||
              isNaN(lng)
            ) {
              return null;
            }

            const severityKey = (incident.severity || "low").toLowerCase();

            const severity =
              SEVERITY_CONFIG[severityKey] ?? SEVERITY_CONFIG.low;
            const config = SEVERITY_CONFIG[severityKey] ?? SEVERITY_CONFIG.low;

            const severityPriority = {
              low: 1,
              moderate: 2,
              high: 3,
              critical: 4,
            };

            return (
              <React.Fragment key={`incident-${incident._id || index}`}>
                {/* Severity Glow */}
                {/* <Circle
                  center={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  radius={config.radius}
                  fillColor={config.color}
                  strokeColor="transparent"
                /> */}

                {/* Status Marker */}
                <Marker
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  pinColor={PIN_COLORS[incident.status] || "#DC2626"}
                  onPress={() => {
                    console.log("MARKER CLICKED:", incident); // 👈 ADD THIS HERE
                    setSelectedIncident(incident);
                  }}
                >
                  {/* <Callout tooltip>
                    <View
                      style={{
                        width: 260,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        padding: 12,
                        elevation: 6,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {incident.type}
                      </Text>

                      <Text style={{ color: "#666", marginTop: 4 }}>
                        {incident.description}
                      </Text>

                      <Text style={{ marginTop: 6, fontWeight: "600" }}>
                        Severity: {incident.severity}
                      </Text>

                      <Text style={{ marginTop: 2 }}>
                        Status: {incident.status}
                      </Text>

                      <TouchableOpacity
                        style={{
                          marginTop: 10,
                          backgroundColor: "#DC2626",
                          padding: 10,
                          borderRadius: 8,
                        }}
                        onPress={() => openGoogleMaps(lat, lng)}
                      >
                        <Text style={{ color: "#fff", textAlign: "center" }}>
                          Navigate
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Callout> */}
                </Marker>
              </React.Fragment>
            );
          })}
        </MapView>

        <Modal
          visible={!!selectedIncident}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedIncident(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {selectedIncident?.type}
              </Text>

              <Text style={{ marginTop: 6 }}>
                {selectedIncident?.description}
              </Text>

              <Text style={{ marginTop: 6 }}>
                Status: {selectedIncident?.status}
              </Text>

              <Text style={{ marginTop: 6 }}>
                Severity: {selectedIncident?.severity}
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: "#DC2626",
                  padding: 12,
                  borderRadius: 10,
                }}
                onPress={() => {
                  if (selectedIncident?.location?.coordinates) {
                    const [lng, lat] = selectedIncident.location.coordinates;
                    openGoogleMaps(lat, lng);
                  }
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Navigate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: "#190297",
                  padding: 12,
                  borderRadius: 10,
                }}
                onPress={() =>
                  navigation.navigate("IncidentDetails", {
                    incident: selectedIncident,
                  })
                }
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => setSelectedIncident(null)}
              >
                <Text style={{ textAlign: "center", color: "gray" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MAP CONTROLS */}
        <View className="absolute right-3 top-3 gap-2">
          <TouchableOpacity
            onPress={toggleMapType}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-md"
          >
            <MaterialIcons name="layers" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToMyLocation}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-md"
          >
            <MaterialIcons name="my-location" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* FIXED LEGEND */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 12 + insets.bottom,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -3 },
        }}
      >
        {/* STATUS LEGEND */}
        <Text className="text-base font-bold text-gray-800 mb-3">
          Incident Status
        </Text>

        <View className="flex-row justify-between mb-5">
          {/* Pending */}
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-red-600 mb-1" />
            <Text className="text-sm font-semibold text-gray-800">Pending</Text>
            <Text className="text-xs text-gray-500">Unverified</Text>
          </View>

          {/* Verified */}
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-amber-500 mb-1" />
            <Text className="text-sm font-semibold text-gray-800">
              Verified
            </Text>
            <Text className="text-xs text-gray-500">Active</Text>
          </View>

          {/* Resolved */}
          <View className="items-center flex-1">
            <View className="w-4 h-4 rounded-full bg-blue-700 mb-1" />
            <Text className="text-sm font-semibold text-gray-800">
              Resolved
            </Text>
            <Text className="text-xs text-gray-500">Closed</Text>
          </View>
        </View>

        {/* DIVIDER */}
        <View className="h-[1px] bg-gray-200 mb-4" />

        {/* SEVERITY LEGEND */}
        <Text className="text-base font-bold text-gray-800 mb-3">
          Severity Levels
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {/* Low */}
          <View className="flex-row items-center mb-3 w-[48%]">
            <View className="w-4 h-4 rounded-full bg-green-500 mr-2 opacity-80" />
            <Text className="text-sm text-gray-700 font-medium">Low</Text>
          </View>

          {/* Moderate */}
          <View className="flex-row items-center mb-3 w-[48%]">
            <View className="w-4 h-4 rounded-full bg-yellow-500 mr-2 opacity-80" />
            <Text className="text-sm text-gray-700 font-medium">Moderate</Text>
          </View>

          {/* High */}
          <View className="flex-row items-center mb-3 w-[48%]">
            <View className="w-4 h-4 rounded-full bg-orange-500 mr-2 opacity-80" />
            <Text className="text-sm text-gray-700 font-medium">High</Text>
          </View>

          {/* Critical */}
          <View className="flex-row items-center mb-1 w-[48%]">
            <View className="w-4 h-4 rounded-full bg-red-800 mr-2 opacity-80" />
            <Text className="text-sm text-gray-700 font-medium">Critical</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
