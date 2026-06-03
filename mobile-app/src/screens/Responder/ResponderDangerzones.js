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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import GradientHeader from "../../components/layout/header";
import ResponderDangerZoneCard from "../../components/cards/ResponderDangerZoneCard";
import API from "../../services/api";
import {
  buildHistoricalInsights,
  formatClusterToZone,
} from "../../utils/dangerZoneHelpers";

const RISK_FILTERS = [
  { key: "All", label: "All Zones" },
  { key: "Critical", label: "Critical" },
  { key: "High", label: "High" },
  { key: "Medium", label: "Medium" },
  { key: "Low", label: "Low" },
];

const FILTER_CHIP_STYLES = {
  Critical: { border: "#FECACA", bg: "#FEF2F2", text: "#DC2626" },
  High: { border: "#FED7AA", bg: "#FFF7ED", text: "#EA580C" },
  Medium: { border: "#FDE68A", bg: "#FFFBEB", text: "#D97706" },
  Low: { border: "#BBF7D0", bg: "#F0FDF4", text: "#16A34A" },
};

const NEARBY_RADIUS_KM = 25;

export default function ResponderDangerZones({ navigation }) {
  const insets = useSafeAreaInsets();
  const locationSubscription = useRef(null);

  const [zones, setZones] = useState([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const fetchTotalIncidents = async () => {
    try {
      const res = await API.get("/incidents?page=1&limit=1000");
      const data = Array.isArray(res.data) ? res.data : [];
      setTotalIncidents(data.length);
    } catch {
      setTotalIncidents(
        zones.reduce((sum, z) => sum + (z.incidentCount || 0), 0)
      );
    }
  };

  const fetchDangerZones = async (latitude, longitude) => {
    try {
      setLoading(true);
      const res = await API.get("/incidents/clusters", {
        params: { latitude, longitude, radiusKm: NEARBY_RADIUS_KM },
      });

      const formattedZones = (res.data || [])
        .map(formatClusterToZone)
        .filter(Boolean);

      setZones(formattedZones);
    } catch (err) {
      console.log("Error fetching responder risk zones", err);
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) {
          setLocationError(
            "Location permission is required to show nearby risk zones."
          );
          setLoading(false);
        }
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (cancelled) return;

      const { latitude, longitude } = position.coords;
      await Promise.all([
        fetchDangerZones(latitude, longitude),
        fetchTotalIncidents(),
      ]);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 1500,
        },
        (update) => {
          const { latitude: lat, longitude: lng } = update.coords;
          fetchDangerZones(lat, lng);
        }
      );
    };

    startLocationTracking();

    return () => {
      cancelled = true;
      locationSubscription.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (zones.length > 0 && totalIncidents === 0) {
      setTotalIncidents(
        zones.reduce((sum, z) => sum + (z.incidentCount || 0), 0)
      );
    }
  }, [zones, totalIncidents]);

  const filtered = useMemo(() => {
    return zones.filter((z) => {
      if (activeFilter === "All") return true;
      return z.severity === activeFilter.toUpperCase();
    });
  }, [zones, activeFilter]);

  const getFilterCount = (filterKey) => {
    if (filterKey === "All") return zones.length;
    return zones.filter((z) => z.severity === filterKey.toUpperCase()).length;
  };

  const criticalCount = useMemo(
    () => zones.filter((z) => z.severity === "CRITICAL").length,
    [zones]
  );

  const insights = useMemo(() => buildHistoricalInsights(zones), [zones]);

  const renderFilterChip = (filter) => {
    const isActive = activeFilter === filter.key;
    const count = getFilterCount(filter.key);
    const style = FILTER_CHIP_STYLES[filter.key];

    if (isActive) {
      return (
        <TouchableOpacity
          key={filter.key}
          activeOpacity={0.85}
          onPress={() => setActiveFilter(filter.key)}
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-900 mr-2 mb-2"
        >
          <Text className="text-[12px] font-semibold text-white">
            {filter.label} ({count})
          </Text>
        </TouchableOpacity>
      );
    }

    if (style) {
      return (
        <TouchableOpacity
          key={filter.key}
          activeOpacity={0.85}
          onPress={() => setActiveFilter(filter.key)}
          className="px-3 py-1.5 rounded-full border mr-2 mb-2"
          style={{
            backgroundColor: style.bg,
            borderColor: style.border,
          }}
        >
          <Text
            className="text-[12px] font-semibold"
            style={{ color: style.text }}
          >
            {filter.label} ({count})
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={filter.key}
        activeOpacity={0.85}
        onPress={() => setActiveFilter(filter.key)}
        className="px-3 py-1.5 rounded-full border border-[#E5E5E5] bg-white mr-2 mb-2"
      >
        <Text className="text-[12px] font-semibold text-slate-800">
          {filter.label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <>
      <View className="flex-row bg-[#FEE2E2] border border-[#FECACA] mx-4 mt-4 rounded-2xl p-4 gap-3">
        <Ionicons name="warning" size={22} color="#D62828" />
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-800 mb-1">
            Active Danger Zones in Your Area
          </Text>
          <Text className="text-[13px] text-slate-600 leading-5">
            {loading
              ? "Locating nearby zones..."
              : `${zones.length} active zone${zones.length === 1 ? "" : "s"} detected. Stay informed and follow safety instructions.`}
          </Text>
        </View>
      </View>

      <View className="flex-row mx-4 mt-4 gap-3">
        <View className="flex-1 bg-white rounded-2xl p-4 border border-[#FECACA]">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="flame" size={18} color="#D62828" />
            <Text className="text-[12px] text-slate-500 font-semibold">
              Critical Zones
            </Text>
          </View>
          <Text className="text-[28px] font-extrabold text-[#D62828]">
            {criticalCount}
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 border border-[#BFDBFE]">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialCommunityIcons
              name="chart-bar"
              size={18}
              color="#2563EB"
            />
            <Text className="text-[12px] text-slate-500 font-semibold">
              Total Incidents
            </Text>
          </View>
          <Text className="text-[28px] font-extrabold text-[#2563EB]">
            {totalIncidents.toLocaleString()}
          </Text>
        </View>
      </View>

      <View className="px-4 mt-4 mb-1">
        <Text className="text-[13px] text-slate-500 mb-2 font-semibold">
          Filter by Risk Level
        </Text>
        <View className="flex-row flex-wrap">{RISK_FILTERS.map(renderFilterChip)}</View>
      </View>

      <View className="flex-row items-center justify-between px-4 mt-2 mb-1">
        <Text className="text-[16px] font-bold text-slate-900">Risk Zones</Text>
        <Text className="text-[13px] text-slate-500 font-semibold">
          {filtered.length} zone{filtered.length === 1 ? "" : "s"}
        </Text>
      </View>
    </>
  );

  const ListFooter = () => (
    <View className="mx-4 mt-2 mb-4 rounded-2xl overflow-hidden bg-[#003049] p-5">
      <View className="flex-row items-center gap-2 mb-4">
        <MaterialCommunityIcons name="chart-box" size={22} color="white" />
        <Text className="text-white text-[16px] font-bold">
          Historical Insights
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-y-4">
        <InsightItem
          label="Average Incident Density"
          value={`${insights.avgDensity} per km²`}
        />
        <InsightItem
          label="Total Risk Zones Monitored"
          value={String(insights.totalMonitored)}
        />
        <InsightItem
          label="High Priority Zones"
          value={String(insights.highPriority)}
        />
      </View>

      <Text className="text-white/70 text-[11px] mt-4 leading-4">
        Data based on historical incident reports and density analysis. Not AI
        prediction.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <GradientHeader
        title="Risk Analytics"
        type="back"
        navigation={navigation}
      />

      {loading && zones.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item._id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="px-4">
              <ResponderDangerZoneCard
                zone={item}
                onPress={() =>
                  navigation.navigate("ResponderDangerZoneDetails", {
                    zone: item,
                  })
                }
              />
            </View>
          )}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={{
            paddingBottom: 24 + insets.bottom,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <Text className="text-center text-slate-500 mt-6 px-6">
              {locationError ||
                `No risk zones within ${NEARBY_RADIUS_KM} km of your location.`}
            </Text>
          }
        />
      )}
    </View>
  );
}

function InsightItem({ label, value }) {
  return (
    <View className="w-1/2 pr-2">
      <Text className="text-white/70 text-[11px] mb-1">{label}</Text>
      <Text className="text-white text-[15px] font-bold">{value}</Text>
    </View>
  );
}