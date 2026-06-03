import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader from "../../components/layout/header";
import DangerZoneCard from "../../components/cards/DangerZoneCards";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import API from "../../services/api";

const SEVERITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];
const NEARBY_RADIUS_KM = 10;

export default function DangerZones({ navigation }) {
  const insets = useSafeAreaInsets();
  const locationSubscription = useRef(null);

  const [zones, setZones] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) {
          setLocationError(
            "Location permission is required to show nearby danger zones."
          );
          setLoading(false);
        }
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (cancelled) return;

      const coords = position.coords;
      setUserLocation(coords);
      await fetchDangerZones(coords.latitude, coords.longitude);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 1000,
        },
        (update) => {
          const nextCoords = update.coords;
          setUserLocation(nextCoords);
          fetchDangerZones(nextCoords.latitude, nextCoords.longitude);
        }
      );
    };

    startLocationTracking();

    return () => {
      cancelled = true;
      locationSubscription.current?.remove();
    };
  }, []);

  const fetchDangerZones = async (latitude, longitude) => {
    try {
      setLoading(true);
      const res = await API.get("/incidents/clusters", {
        params: {
          latitude,
          longitude,
          radiusKm: NEARBY_RADIUS_KM,
        },
      });

      const formattedZones = (res.data || [])
        .map((cluster) => {
          const incidents = cluster.incidents || [];
          if (incidents.length === 0) return null;

          const center = incidents[0];
          let coordinates = null;

          if (center?.location?.coordinates?.length === 2) {
            coordinates = center.location.coordinates;
          } else if (center?.location?.lat && center?.location?.lng) {
            coordinates = [center.location.lng, center.location.lat];
          }

          return {
            _id: cluster._id,
            name: center.type ? `${center.type} Zone` : "Danger Zone",
            severity: getSeverity(cluster.count),
            description:
              center.description ||
              "Multiple incidents reported in this area.",
            radius: `${cluster.count * 100} m`,
            affected: `~${cluster.count * 50}`,
            date: center.timestamp
              ? new Date(center.timestamp).toLocaleDateString()
              : "N/A",
            coordinates,
            latitude: coordinates ? coordinates[1] : null,
            longitude: coordinates ? coordinates[0] : null,
            status: cluster.count >= 3 ? "Evacuate" : "Monitor",
            incidents,
            reportedBy: center.reportedBy || "Unknown",
          };
        })
        .filter(Boolean);

      setZones(formattedZones);
    } catch (err) {
      console.log("Error fetching zones", err);
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (count) => {
    if (count >= 5) return "CRITICAL";
    if (count >= 3) return "HIGH";
    if (count >= 2) return "MEDIUM";
    return "LOW";
  };

  const filtered = useMemo(() => {
    return zones.filter((z) => {
      const severityMatch =
        activeFilter === "All" ||
        z.severity === activeFilter.toUpperCase();
      return severityMatch;
    });
  }, [zones, activeFilter]);

  const getFilterCount = (filter) => {
    if (filter === "All") return zones.length;
    return zones.filter((z) => z.severity === filter.toUpperCase()).length;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <GradientHeader
        title="Danger Zones"
        type="back"
        navigation={navigation}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        }
      />

      <View className="flex-row bg-[#FEE2E2] border border-[#FECACA] mx-4 mt-4 rounded-2xl p-4 gap-3">
        <Ionicons name="warning" size={22} color="#D62828" />

        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-800 mb-1">
            Active Danger Zones in Your Area
          </Text>

          <Text className="text-[13px] text-slate-600 leading-5">
            {loading
              ? "Locating nearby zones..."
              : `${filtered.length} active zones within ${NEARBY_RADIUS_KM} km. Stay alert and follow safety guidelines.`}
          </Text>
        </View>
      </View>

      <View className="px-4 mt-4 mb-2">
        <Text className="text-[13px] text-slate-500 mb-2">
          Filter by Severity
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {SEVERITY_FILTERS.map((f) => {
            const isActive = activeFilter === f;
            const count = getFilterCount(f);

            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full border ${
                  isActive
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-[#E5E5E5]"
                }`}
              >
                <Text
                  className={`text-[12px] font-semibold ${
                    isActive ? "text-white" : "text-slate-800"
                  }`}
                >
                  {f} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          extraData={filtered}
          keyExtractor={(item) => String(item._id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DangerZoneCard
              zone={item}
              onPress={() =>
                navigation.navigate("DangerZoneDetails", {
                  zone: item,
                })
              }
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 30 + insets.bottom,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <Text className="text-center text-slate-500 mt-10">
              {locationError ||
                (userLocation
                  ? `No danger zones within ${NEARBY_RADIUS_KM} km of your location`
                  : "Unable to determine your location")}
            </Text>
          }
        />
      )}
    </View>
  );
}
