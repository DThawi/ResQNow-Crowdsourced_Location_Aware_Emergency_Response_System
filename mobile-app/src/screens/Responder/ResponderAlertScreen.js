import React, { useMemo, useState, useEffect, useCallback } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import GradientHeader from "../../components/layout/header";
import AlertCard from "../../components/cards/AlertCards";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import API from '../../services/api';

const FILTER_CHIPS = ["All", "Alerts", "Updates", "Assignments"];

export default function ResponderAlertsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeChip, setActiveChip] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveAlertFeed = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await API.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data || []);
    } catch (err) {
      console.log('Error syncing live notification arrays:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLiveAlertFeed();
      const pollingInterval = setInterval(fetchLiveAlertFeed, 4000);
      return () => clearInterval(pollingInterval);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLiveAlertFeed();
    setRefreshing(false);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeChip === "All") return notifications;
    // Normalized type filtering to catch custom data objects smoothly
    return notifications.filter((n) => {
      const targetCategory = n.category || n.type || 'Alerts';
      return targetCategory.toLowerCase() === activeChip.toLowerCase() || 
             (activeChip === "Alerts" && targetCategory.toLowerCase() === "alert");
    });
  }, [activeChip, notifications]);

  const mapCategoryToType = (item) => {
    const typeStr = (item.category || item.type || 'Alerts').toLowerCase();
    if (typeStr === 'assignments' || typeStr === 'assignment') return "Resolved";
    if (typeStr === 'updates' || typeStr === 'update') return "Weather";
    return "Fire";
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6', paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <GradientHeader title="Alerts & Notifications" type="back" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item._id || item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 16 + insets.bottom,
          }}
          renderItem={({ item }) => (
            <AlertCard
              alert={{
                title: item.title,
                description: item.description,
                time: formatRelativeTime(item.timestamp || item.createdAt),
                unread: !item.is_read,
                location: item.location || "Sri Lanka",
                type: mapCategoryToType(item),
              }}
            />
          )}
          ListHeaderComponent={
            <View>
              <View className="rounded-2xl overflow-hidden mb-4 shadow-sm">
                <LinearGradient
                  colors={["#D62828", "#B71C1C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="py-6 px-5 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-[40px] text-white font-extrabold">{unreadCount}</Text>
                    <Text className="text-[15px] text-white/90 font-semibold">Unread notifications</Text>
                  </View>
                  <View className="bg-white/20 p-4 rounded-full">
                    <MaterialCommunityIcons name="alert-circle-outline" size={36} color="rgba(255,255,255,0.7)" />
                  </View>
                </LinearGradient>
              </View>

              <View className="flex-row flex-wrap gap-2 mb-4">
                {FILTER_CHIPS.map((chip) => {
                  const isActive = activeChip === chip;
                  return (
                    <TouchableOpacity
                      key={chip}
                      activeOpacity={0.85}
                      onPress={() => setActiveChip(chip)}
                      className={`px-4 py-2 rounded-full ${isActive ? "bg-[#D62828]" : "bg-[#EBEBEB]"}`}
                    >
                      <Text className={`text-[13px] font-semibold ${isActive ? "text-white" : "text-slate-800"}`}>
                        {chip}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          }
          ListEmptyComponent={
            <Text className="text-center text-slate-400 mt-10 font-medium">
              No live system updates located inside this category.
            </Text>
          }
        />
      )}
    </View>
  );
}
