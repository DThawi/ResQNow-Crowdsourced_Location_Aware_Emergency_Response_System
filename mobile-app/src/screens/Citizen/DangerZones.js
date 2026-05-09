import React, { useEffect, useMemo, useState } from "react";
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
import * as Location from "expo-location";


const SEVERITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];




export default function DangerZones({ navigation }) {
  const insets = useSafeAreaInsets();


  const [zones, setZones] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  useEffect(() => {
  getUserLocation();
  fetchDangerZones();
}, []);


const getUserLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return;


  let loc = await Location.getCurrentPositionAsync({});
  setUserLocation(loc.coords);
};


const fetchDangerZones = async () => {


  try {
    const res = await fetch("http://10.158.11.118:5000/api/incidents/clusters");
    const data = await res.json();
   


  const formattedZones = data.map((cluster) => {
  const incidents = cluster.incidents || [];
  if (incidents.length === 0) return null;


  const center = incidents[0];


  let coordinates = null;


// Case 1: GeoJSON format
if (center?.location?.coordinates?.length === 2) {
  coordinates = center.location.coordinates;
}


// Case 2: lat/lng format (common mistake)
else if (center?.location?.lat && center?.location?.lng) {
  coordinates = [center.location.lng, center.location.lat];
}


  return {
    _id: cluster._id,


    // ✅ MATCH CARD EXPECTATION
    name: center.type ? `${center.type} Zone` : "Danger Zone",


    severity: getSeverity(cluster.count),


    description:
      center.description ||
      "Multiple incidents reported in this area.",


    // ✅ FIXED FORMATTING
    radius: `${cluster.count * 100} m`,


    affected: `~${cluster.count * 50}`,


    date: center.timestamp
      ? new Date(center.timestamp).toLocaleDateString()
      : "N/A",


    // ✅ IMPORTANT
    coordinates,
      latitude: coordinates ? coordinates[1] : null,
      longitude: coordinates ? coordinates[0] : null,


    // ✅ THIS FIXES CARD STYLE
    status: cluster.count >= 3 ? "Evacuate" : "Monitor",


    // extra
    incidents,
    reportedBy: center.reportedBy || "Unknown",
  };
}).filter(Boolean);


    setZones(formattedZones);


  } catch (err) {
    console.log("Error fetching zones", err);
  }
};


const getSeverity = (count) => {
  if (count >= 5) return "CRITICAL";
  if (count >= 3) return "HIGH";
  if (count >= 2) return "MEDIUM";
  return "LOW";
};


const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;


  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);


  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};


  /* ---------- Filter Logic ---------- */
const filtered = useMemo(() => {
  if (!userLocation) return [];


  return zones.filter((z) => {
    // ❌ skip invalid coordinates
    if (!z.coordinates || z.coordinates.length !== 2) return false;


    const [lng, lat] = z.coordinates;


    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      return false;
    }


    const dist = getDistance(
      userLocation.latitude,
      userLocation.longitude,
      lat,
      lng
    );


    // ✅ DEBUG (optional)
    console.log(z.name, "Distance (km):", dist);


    // ✅ 100 meters = 0.1 km  
    //const withinRange = true; // --------------- for testing of all danger zones regardless of distance
    const withinRange = dist <= 1; // 1 km radius  <standard code>


    // ✅ apply severity filter ALSO
    const severityMatch =
      activeFilter === "All" ||
      z.severity === activeFilter.toUpperCase();


    return withinRange && severityMatch;
  });


}, [zones, userLocation, activeFilter]);


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
            {filtered.length} active zones detected. Stay alert and follow safety guidelines.
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
        extraData={filtered}
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