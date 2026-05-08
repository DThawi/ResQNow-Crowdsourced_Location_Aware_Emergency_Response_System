import React, { useMemo, useState } from "react";
import {
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

const SEVERITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

const MOCK_ZONES = [
  {
    _id: "z1",
    name: "Downtown Fire Zone",
    severity: "CRITICAL",
    description:
      "Active building fire with spreading risk. Multiple structures affected.",
    radius: "500 m",
    date: "12/9/2025",
    affected: "~1,200",
    status: "Evaluate",
  },
  {
    _id: "z2",
    name: "Chemical Spill - Highway 95",
    severity: "HIGH",
    description:
      "Tanker truck overturned, chemical spill contained but hazardous fumes present.",
    radius: "300 m",
    date: "12/9/2025",
    affected: "~450",
  },
  {
    _id: "z3",
    name: "Civil Unrest - Broadway District",
    severity: "MEDIUM",
    description:
      "Large gathering with potential for escalation. Police presence increased.",
    radius: "400 m",
    date: "12/9/2025",
    affected: "~800",
  },
  {
    _id: "z4",
    name: "Gas Leak Detection Zone",
    severity: "LOW",
    description:
      "Minor gas leak detected. Utility crews on site conducting repairs.",
    radius: "150 m",
    date: "12/9/2025",
    affected: "~100",
  },
];

export default function DangerZones({ navigation }) {
  const insets = useSafeAreaInsets();

  const [zones] = useState(MOCK_ZONES);
  const [activeFilter, setActiveFilter] = useState("All");

  /* ---------- Filter Logic ---------- */
  const filtered = useMemo(() => {
    if (activeFilter === "All") return zones;
    return zones.filter(
      (z) => z.severity === activeFilter.toUpperCase()
    );
  }, [activeFilter, zones]);

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* ---------- Header ---------- */}
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

      {/* ---------- Banner ---------- */}
      <View className="flex-row bg-[#FEE2E2] border border-[#FECACA] mx-4 mt-4 rounded-2xl p-4 gap-3">
        <Ionicons name="warning" size={22} color="#D62828" />

        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-800 mb-1">
            Active Danger Zones in Your Area
          </Text>

          <Text className="text-[13px] text-slate-600 leading-5">
            {zones.length} active zones detected. Stay informed and follow
            safety instructions.
          </Text>
        </View>
      </View>

      {/* ---------- Filters ---------- */}
      <View className="px-4 mt-4 mb-2">
        <Text className="text-[13px] text-slate-500 mb-2">
          Filter by Severity
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {SEVERITY_FILTERS.map((f) => {
            const isActive = activeFilter === f;

            const count =
              f === "All"
                ? zones.length
                : zones.filter(
                    (z) => z.severity === f.toUpperCase()
                  ).length;

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

      {/* ---------- Danger Zones List ---------- */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
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
        }}
        ListEmptyComponent={
          <Text className="text-center text-slate-500 mt-10">
            No danger zones in your area
          </Text>
        }
      />
    </View>
  );
}