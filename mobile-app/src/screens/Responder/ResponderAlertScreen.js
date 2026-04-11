import React, { useMemo, useState } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import GradientHeader from "../../components/layout/header";
import AlertCard from "../../components/cards/AlertCards";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const FILTER_CHIPS = ["All", "Alerts", "Updates", "Assignments"];

const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Emergency Alert",
    description:
      "A fire emergency has been reported near Colombo Fort. Immediate response required from all available units.",
    time: "2 mins ago",
    category: "Alerts",
    unread: true,
  },
  {
    id: "2",
    title: "Incident Verified",
    description:
      "The medical emergency at Kandy General Hospital has been verified by authorities. Dispatch confirmed.",
    time: "15 mins ago",
    category: "Updates",
    unread: true,
  },
  {
    id: "3",
    title: "Unit Assigned to Flood Zone",
    description:
      "You have been assigned to respond to the flooding situation in Ratnapura district. Check route details.",
    time: "32 mins ago",
    category: "Assignments",
    unread: false,
  },
  {
    id: "4",
    title: "Traffic Accident Report",
    description:
      "Major collision reported on A2 highway near Galle. Multiple casualties. Additional units requested.",
    time: "1 hour ago",
    category: "Alerts",
    unread: false,
  },
  {
    id: "5",
    title: "Weather Update",
    description:
      "Heavy rainfall warning issued for Southern Province. All field teams should exercise caution.",
    time: "2 hours ago",
    category: "Updates",
    unread: false,
  },
  {
    id: "6",
    title: "Rescue Team Assignment",
    description:
      "You have been assigned to the earthquake relief operation in Badulla. Report to base camp by 0800.",
    time: "3 hours ago",
    category: "Assignments",
    unread: false,
  },
];

export default function ResponderAlertsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeChip, setActiveChip] = useState("All");

  /* Unread Counter */
  const unreadCount = useMemo(
    () => DUMMY_NOTIFICATIONS.filter((n) => n.unread).length,
    []
  );

  /* Filter Logic */
  const filtered = useMemo(() => {
    if (activeChip === "All") return DUMMY_NOTIFICATIONS;
    return DUMMY_NOTIFICATIONS.filter((n) => n.category === activeChip);
  }, [activeChip]);

  /* Convert category → AlertCard type */
  const mapCategoryToType = (category) => {
    switch (category) {
      case "Alerts":
        return "Fire";
      case "Updates":
        return "Weather";
      case "Assignments":
        return "Resolved";
      default:
        return "Fire";
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <GradientHeader title="Alerts & Notifications" type="back" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 16 + insets.bottom,
        }}

        /* ✅ USING ALERT CARD COMPONENT */
        renderItem={({ item }) => (
          <AlertCard
            alert={{
              title: item.title,
              description: item.description,
              time: item.time,
              unread: item.unread,
              location: "Sri Lanka", // placeholder location
              type: mapCategoryToType(item.category),
            }}
          />
        )}

        /* Header Section */
        ListHeaderComponent={
          <View>

            


    {/* Unread Summary */}
    <View className="rounded-2xl overflow-hidden mb-4 shadow-sm">
        <LinearGradient
            colors={["#D62828", "#B71C1C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-6 px-5 flex-row items-center justify-between">

        {/* LEFT SIDE */}
        <View>
        <Text className="text-[40px] text-white font-extrabold">
        {unreadCount}
        </Text>

        <Text className="text-[15px] text-white/90 font-semibold">
        Unread notifications
        </Text>
        </View>

        {/* RIGHT SIDE ICON */}
        <View className="bg-white/20 p-4 rounded-full">
        <MaterialCommunityIcons
         name="alert-circle-outline"
         size={36}
         color="rgba(255,255,255,0.7)"
        />
        </View>

        </LinearGradient>
    </View>

            {/* Filter Chips */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              {FILTER_CHIPS.map((chip) => {
                const isActive = activeChip === chip;

                return (
                  <TouchableOpacity
                    key={chip}
                    activeOpacity={0.85}
                    onPress={() => setActiveChip(chip)}
                    className={`px-4 py-2 rounded-full ${
                      isActive ? "bg-[#D62828]" : "bg-[#EBEBEB]"
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-semibold ${
                        isActive ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>
        }

        ListEmptyComponent={
          <Text className="text-center text-slate-500 mt-10">
            No notifications found
          </Text>
        }
      />
    </View>
  );
}