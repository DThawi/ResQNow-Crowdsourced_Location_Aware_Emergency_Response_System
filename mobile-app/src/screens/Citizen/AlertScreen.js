import React, { useState, useCallback, useMemo } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GradientHeader from "../../components/layout/header";
import AlertCard from "../../components/cards/AlertCards";
import API from "../../services/api";


const getTimeAgo = (timestamp) => {
  if (!timestamp) return "Just now";
  const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export default function AlertScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const [incidentsRes, storedViewed] = await Promise.all([
        API.get('/incidents'),
        AsyncStorage.getItem('viewedIncidentIds')
      ]);
      
      const parsedViewed = storedViewed ? JSON.parse(storedViewed) : [];
      setViewedIds(parsedViewed);
      setIncidents(incidentsRes.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const handleAlertPress = async (incident) => {
    const newViewed = [...new Set([...viewedIds, incident._id])];
    await AsyncStorage.setItem('viewedIncidentIds', JSON.stringify(newViewed));
    setViewedIds(newViewed);
    navigation.navigate("IncidentDetails", { incident });
  };

  const formattedAlerts = useMemo(() => {
    return incidents.map(item => ({
      id: item._id,
      type: item.type,
      title: `${item.type} Emergency Alert`,
      description: item.description,
      location: item.location?.coordinates ? `Lng: ${item.location.coordinates[0].toFixed(2)}` : "Unknown",
      time: getTimeAgo(item.timestamp), 
      unread: !viewedIds.includes(item._id),
      raw: item
    }));
  }, [incidents, viewedIds]);

  const unreadCount = formattedAlerts.filter(a => a.unread).length;

  const filtered = useMemo(() => {
    return tab === "Unread" ? formattedAlerts.filter(a => a.unread) : formattedAlerts;
  }, [tab, formattedAlerts]);

  if (loading) return <View className="flex-1 justify-center"><ActivityIndicator color="#D32F2F" /></View>;

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <GradientHeader
        title="Alerts & Notifications"
        type="back"
        rightComponent={
          <View className="px-2 py-1 rounded-full bg-red-600">
            <Text className="text-white text-xs font-bold">{unreadCount}</Text>
          </View>
        }
      />

      <View className="px-4 mt-3">
        <View className="flex-row gap-3">
          {["All", "Unread"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full items-center ${tab === t ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={tab === t ? "text-white font-semibold" : "text-black"}>
                {t} {t === "Unread" && `(${unreadCount})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAlertPress(item.raw)}>
             <AlertCard alert={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
      />
    </View>
  );
}
