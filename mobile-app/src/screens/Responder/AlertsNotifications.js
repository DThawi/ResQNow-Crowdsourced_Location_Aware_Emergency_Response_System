import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import GradientHeader from '../../components/layout/header';
import { Ionicons } from '@expo/vector-icons';
 
const notifications = [
  {
    id: 1,
    type: 'alert',
    icon: 'alert-circle-outline',
    iconColor: '#D62828',
    borderColor: '#D62828',
    title: 'New Emergency Alert',
    description: 'Building fire reported 0.5 miles from your location',
    time: '6h ago',
    unread: true,
  },
  {
    id: 2,
    type: 'update',
    icon: 'information-circle-outline',
    iconColor: '#F59E0B',
    borderColor: '#F59E0B',
    title: 'Incident Verified',
    description: 'Your reported incident has been verified by 5 users',
    time: '7h ago',
    unread: true,
  },
  {
    id: 3,
    type: 'assignment',
    icon: 'checkmark-circle-outline',
    iconColor: '#10B981',
    borderColor: '#10B981',
    title: 'Responder Assigned',
    description: 'Emergency services are en route to your reported incident',
    time: '7h ago',
    unread: false,
  },
];
 
const filters = ['All', 'Alerts', 'Updates', 'Assignments'];
 
export default function AlertsNotifications({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
 
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Alerts') return n.type === 'alert';
    if (activeFilter === 'Updates') return n.type === 'update';
    if (activeFilter === 'Assignments') return n.type === 'assignment';
    return true;
  });
 
  const unreadCount = notifications.filter((n) => n.unread).length;
 
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <GradientHeader title="Alerts & Notifications" type="back" />
 
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
 
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
          {filteredNotifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm"
              style={{ borderLeftWidth: 4, borderLeftColor: item.borderColor }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: item.iconColor + '15' }}
              >
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-black mb-0.5">{item.title}</Text>
                <Text className="text-xs text-gray-500 mb-1">{item.description}</Text>
                <Text className="text-xs text-gray-400">{item.time}</Text>
              </View>
              <View className="items-center gap-2">
                {item.unread && (
                  <View className="w-2 h-2 rounded-full bg-red-500 mb-1" />
                )}
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
 
      </ScrollView>
    </View>
  );
}