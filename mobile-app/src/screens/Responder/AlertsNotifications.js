import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import GradientHeader from '../../components/layout/header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';

const getNotificationStyle = (type) => {
  if (type === 'alert') return { icon: 'alert-circle-outline', iconColor: '#D62828', borderColor: '#D62828' };
  if (type === 'update') return { icon: 'information-circle-outline', iconColor: '#F59E0B', borderColor: '#F59E0B' };
  if (type === 'assignment') return { icon: 'checkmark-circle-outline', iconColor: '#10B981', borderColor: '#10B981' };
  return { icon: 'notifications-outline', iconColor: '#6B7280', borderColor: '#6B7280' };
};

const getTimeAgo = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const filters = ['All', 'Alerts', 'Updates', 'Assignments'];

export default function AlertsNotifications({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await API.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (err) {
      console.log('Error fetching notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.log('Error marking as read:', err.message);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Alerts') return n.type === 'alert';
    if (activeFilter === 'Updates') return n.type === 'update';
    if (activeFilter === 'Assignments') return n.type === 'assignment';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <GradientHeader title="Alerts & Notifications" type="back" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Unread Banner */}
          <View className="mx-4 mt-4 bg-[#D62828] rounded-2xl p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-white text-3xl font-bold">{unreadCount}</Text>
              <Text className="text-white text-sm opacity-90">Unread notifications</Text>
            </View>
            <View className="w-12 h-12 rounded-full border-2 border-white items-center justify-center">
              <Ionicons name="alert-circle-outline" size={24} color="white" />
            </View>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row mx-4 mt-4 gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full border ${
                  activeFilter === filter
                    ? 'bg-[#D62828] border-[#D62828]'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeFilter === filter ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notification Cards */}
          <View className="mx-4 mt-4 mb-6">
            {filteredNotifications.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <Text className="text-gray-400 text-sm">No notifications</Text>
              </View>
            ) : (
              filteredNotifications.map((item) => {
                const style = getNotificationStyle(item.type);
                return (
                  <TouchableOpacity
                    key={item._id}
                    className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
                    style={{ borderLeftWidth: 4, borderLeftColor: style.borderColor }}
                    onPress={() => markAsRead(item._id)}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: style.iconColor + '15' }}
                    >
                      <Ionicons name={style.icon} size={22} color={style.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-black mb-0.5">{item.title}</Text>
                      <Text className="text-xs text-gray-500 mb-1">{item.description}</Text>
                      <Text className="text-xs text-gray-400">{getTimeAgo(item.timestamp)}</Text>
                    </View>
                    <View className="items-center gap-2">
                      {!item.is_read && (
                        <View className="w-2 h-2 rounded-full bg-red-500 mb-1" />
                      )}
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}