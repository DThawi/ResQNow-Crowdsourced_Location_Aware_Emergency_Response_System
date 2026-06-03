import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons"; // Expo icon library
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";
import { Linking, Platform } from "react-native";
import * as Location from "expo-location";

import MapView, { Marker, Circle, Callout, Heatmap } from "react-native-maps";
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
  Resolved: "#064092",
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

    console.log("VALID COORDINATES:", coordinates);

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
      console.log("ERROR FETCHING INCIDENTS:", err.message);
    }
  };
  const fetchHeatmapData = async () => {
    try {
      const res = await API.get("/heatmap");

      setHeatmapPoints(res.data || []);
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
          mapType={mapType}
          initialRegion={{
            latitude: 6.9271,
            longitude: 79.8612,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          showsUserLocation={true}
        >

          <Heatmap
  points={heatmapPoints}
  radius={50}
  opacity={0.7}
  gradient={{
    colors: ["#22C55E", "#EAB308", "#F97316", "#DC2626"],
    startPoints: [0.2, 0.4, 0.6, 0.8],
    colorMapSize: 256,
  }}
/>
          {/* Incident Markers */}
          {filtered.map((incident, index) => {
            if (!incident.location || !incident.location.coordinates) {
              return null;
            }

            const [lng, lat] = incident.location.coordinates;

            console.log("MARKER:", lat, lng);

            return (
              <Marker
                key={`marker-${incident._id || index}`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                pinColor={PIN_COLORS[incident.status] || "#DC2626"}
                onPress={() => setSelectedIncident(incident)}
              >
                <Callout>
                  <View style={{ width: 300, padding: 5 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginBottom: 5,
                      }}
                    >
                      {incident.type}
                    </Text>

                    <Text>{incident.description}</Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#DC2626",
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 10,
                      }}
                      onPress={() => openGoogleMaps(lat, lng)}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Navigate
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {selectedIncident && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 15,
              right: 15,
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              elevation: 8,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {selectedIncident.type}
            </Text>

            <Text
              style={{
                color: "#666",
                marginBottom: 15,
              }}
            >
              {selectedIncident.description}
            </Text>

            {/* View Details */}
            <TouchableOpacity
              style={{
                backgroundColor: "#064092",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate("IncidentDetails", {
                  incident: selectedIncident,
                });
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                View Details
              </Text>
            </TouchableOpacity>

            {/* Navigate */}
            <TouchableOpacity
              style={{
                backgroundColor: "#DC2626",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
              onPress={() => {
                const [lng, lat] = selectedIncident.location.coordinates;

                openGoogleMaps(lat, lng);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Navigate
              </Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity onPress={() => setSelectedIncident(null)}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontWeight: "600",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

      {/* LEGEND HEADER */}
      <View className="flex-row justify-between items-center px-4 pt-3 pb-1 bg-white">
        <Text className="text-base font-bold text-gray-800">Map Legend</Text>

        <TouchableOpacity>
          <Text className="text-sm font-semibold text-red-600">🔻 Filter</Text>
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
            <Text className="text-sm font-semibold text-gray-800">New</Text>
            <Text className="text-xs text-gray-500">Unverified</Text>
          </View>
        </View>

        {/* Verified */}
        <View className="flex-row items-center gap-2">
          <View className="w-3.5 h-3.5 rounded-full bg-amber-500" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">
              Verified
            </Text>
            <Text className="text-xs text-gray-500">Active</Text>
          </View>
        </View>

        {/* Resolved */}
        <View className="flex-row items-center gap-2">
          <View className="w-3.5 h-3.5 rounded-full bg-blue-800" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">
              Resolved
            </Text>
            <Text className="text-xs text-gray-500">Closed</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
