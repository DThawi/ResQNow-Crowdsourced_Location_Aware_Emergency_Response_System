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
import AlertCard from "../../components/cards/AlertCards";

/* Dummy Alerts */

const DUMMY_ALERTS = [
  {
    id: "1",
    type: "Fire",
    title: "Fire Emergency Alert",
    description:
      "A large fire has been reported near the Colombo Fort area.",
    location: "Colombo Fort, Colombo",
    time: "5 mins ago",
    unread: true,
  },
  {
    id: "2",
    type: "Medical",
    title: "Medical Emergency Update",
    description:
      "Medical teams dispatched to Kandy General Hospital.",
    location: "Kandy General Hospital",
    time: "12 mins ago",
    unread: true,
  },
  {
    id: "3",
    type: "Accident",
    title: "Traffic Accident Alert",
    description:
      "Major traffic accident on A2 highway near Galle.",
    location: "A2 Highway, Galle",
    time: "28 mins ago",
    unread: false,
  },
  {
    id: "4",
    type: "Resolved",
    title: "Flood Situation Resolved",
    description:
      "Flood warning for Ratnapura district lifted.",
    location: "Ratnapura District",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "5",
    type: "Weather",
    title: "Severe Weather Warning",
    description:
      "Heavy rainfall expected in Southern Province.",
    location: "Southern Province",
    time: "2 hours ago",
    unread: false,
  },
];

export default function AlertScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState("All");

  /* unread */
  const unreadCount = useMemo(
    () => DUMMY_ALERTS.filter((a) => a.unread).length,
    []
  );

  /* FILTERED LIST */
  const filtered = useMemo(() => {
    if (tab === "Unread") {
      return DUMMY_ALERTS.filter((a) => a.unread);
    }
    return DUMMY_ALERTS;
  }, [tab]);

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header */}
      <GradientHeader
        title="Alerts & Notifications"
        type="back"
        rightComponent={
          <View className="px-2 py-1 rounded-full bg-red-600">
            <Text className="text-white text-xs font-bold">
              {unreadCount}
            </Text>
          </View>
        }
      />

      {/* Tabs */}
      <View className="px-4 mt-3">
        <View className="flex-row gap-3">
          {["All", "Unread"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full items-center ${
                tab === t ? "bg-black" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  tab === t
                    ? "text-white font-semibold"
                    : "text-black"
                }
              >
                {t} {t === "Unread" && `(${unreadCount})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard alert={item} />
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 16 + insets.bottom,
        }}
      />
    </View>
  );
}