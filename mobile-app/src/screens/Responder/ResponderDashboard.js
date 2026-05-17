import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import GradientHeader from '../../components/layout/header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
 
const StatusBadge = ({ status, colorClass }) => (
  <View className={`px-2 py-0.5 rounded-full border ${colorClass.split(' ')[0]} ${colorClass.split(' ').find(c => c.startsWith('border-')) || ''}`}>
    <Text className={`text-[10px] font-medium ${colorClass.split(' ')[1]}`}>{status}</Text>
  </View>
);

const getStatusColor = (status) => {
  if (status === 'Assigned') return 'bg-white text-gray-700 border-gray-400';
  if (status === 'Resolved') return 'bg-white text-green-500 border-green-300';
  if (status === 'In Progress') return 'bg-white text-blue-400 border-blue-200';
  if (status === 'Pending') return 'bg-red-100 text-red-600 border-red-200';
  if (status === 'Verified') return 'bg-white text-yellow-600 border-yellow-400';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const getTypeIcon = (type) => {
  if (type === 'Fire') return '🔥';
  if (type === 'Medical') return '🏥';
  if (type === 'Flood') return '🌊';
  if (type === 'Accident') return '🚗';
  return '⚠️';
};

const getTimeAgo = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const IncidentCard = ({ item, onPress }) => {
  const addressText = item.location?.address || `${item.location?.coordinates?.[1]?.toFixed(4)}, ${item.location?.coordinates?.[0]?.toFixed(4)}`;
  const assignedOrg = item.assignedAuthorities?.[0]?.organization || 'Unassigned';

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl">{getTypeIcon(item.type)}</Text>
          <Text className="text-base font-bold text-[#2C3E50]">{item.type}</Text>
        </View>
        <StatusBadge status={item.status} colorClass={getStatusColor(item.status)} />
      </View>
      
      <Text className="text-xs text-gray-400 mb-3" numberOfLines={2}>{item.description}</Text>
      
      <View className="flex-row items-center mb-3">
        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
        <Text className="text-xs text-gray-400 ml-1" numberOfLines={1} style={{ maxWidth: '60%' }}>
          {addressText}
        </Text>
        <Ionicons name="time-outline" size={14} color="#9CA3AF" style={{ marginLeft: 8 }} />
        <Text className="text-xs text-gray-400 ml-1">{getTimeAgo(item.timestamp)}</Text>
      </View>
      
      <View className="flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center mb-1">
            <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
            <Text className="text-xs text-green-500 ml-1">{item.verified_by?.length || 0} verified</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="warning-outline" size={14} color="#F59E0B" />
            <Text className="text-xs text-yellow-500 ml-1">{item.reported_inaccurate_by?.length || 0} flagged</Text>
          </View>
        </View>
        <View className="flex-row items-center ml-2 flex-1 justify-end">
          <Ionicons name="person-outline" size={14} color="#4B5563" />
          <Text className="text-xs text-gray-600 ml-1" numberOfLines={2} style={{ flexShrink: 1, textAlign: 'right' }}>
            Assigned to {assignedOrg}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
 
export default function ResponderDashboard({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState(null);
  const [responder, setResponder] = useState({ name: 'Responder', organization: '' });
  const [stats, setStats] = useState({ assigned: 0, nearby: 0, active: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
 
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setResponder(JSON.parse(userStr));
 
      const response = await API.get('/incidents/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      const data = response.data;
      setIncidents(data);
      setStats({
        assigned: data.filter(i => i.status === 'Assigned').length,
        nearby: data.length,
        active: data.filter(i => i.status === 'Assigned').length,
        resolved: data.filter(i => i.status === 'Resolved').length,
      });
 
      const latest = data.find(i => i.status !== 'Resolved');
      if (latest) setNewIncident(latest);
 
    } catch (err) {
      console.log('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);
 
  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <GradientHeader
        title="Responder Dashboard"
        type="none"
        rightComponent={
          <TouchableOpacity onPress={() => navigation?.navigate('AlertsNotifications')}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        }
      />
 
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
          {/* Dynamic Top Banner (Bypasses missing standalone component) */}
          {newIncident && (
            <View className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-1 pr-2">
                <Text className="text-red-700 font-bold text-sm mb-0.5">🚨 Critical Active Task</Text>
                <Text className="text-gray-700 text-xs numberOfLines={1}">{newIncident.description || 'New Incident Assignment'}</Text>
              </View>
              <TouchableOpacity 
                className="bg-[#D62828] px-3 py-1.5 rounded-lg"
                onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: newIncident })}
              >
                <Text className="text-white text-xs font-bold">View</Text>
              </TouchableOpacity>
            </View>
          )}
 
          {/* Profile Card */}
          <View className="mx-4 mt-4 bg-[#1A2B3C] rounded-2xl p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-bold">{responder.name}</Text>
              <Text className="text-gray-400 text-xs mb-2">{responder.organization || 'Responder'}</Text>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-green-400" />
                <Text className="text-green-400 text-xs">Active</Text>
              </View>
            </View>
            <View className="w-10 h-10 rounded-full bg-gray-600 items-center justify-center">
              <Ionicons name="person" size={20} color="white" />
            </View>
          </View>
 
          {/* Stats Row */}
          <View className="mx-4 mt-4 flex-row justify-between">
            {[
              { label: 'Assigned', value: stats.assigned, color: 'text-[#D62828]' },
              { label: 'Nearby', value: stats.nearby, color: 'text-blue-500' },
              { label: 'Active', value: stats.active, color: 'text-gray-700' },
              { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
            ].map((stat) => (
              <View key={stat.label} className="bg-white rounded-xl flex-1 mx-1 py-3 items-center shadow-sm">
                <Text className={`text-lg font-bold ${stat.color}`}>{stat.value}</Text>
                <Text className="text-xs text-gray-400">{stat.label}</Text>
              </View>
            ))}
          </View>
 
          {/* Quick Actions */}
          <View className="mx-4 mt-4 flex-row flex-wrap gap-3">
            {[
              { icon: '🧭', label: 'Navigate', sub: 'To incident', color: 'text-[#D62828]' },
              { icon: '🔔', label: 'Alerts', sub: 'View all', color: 'text-yellow-500' },
              { icon: '🕐', label: 'Activity', sub: 'View log', color: 'text-blue-500' },
              { icon: '✅', label: 'Complete', sub: 'Mark resolved', color: 'text-green-500' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                className="bg-white rounded-2xl p-4 items-center justify-center shadow-sm"
                style={{ width: '47%' }}
                onPress={() => {
                  if (action.label === 'Alerts') navigation?.navigate('AlertsNotifications');
                  if (action.label === 'Navigate') navigation?.navigate('ResponderMap');
                }}
              >
                <Text className="text-2xl mb-1">{action.icon}</Text>
                <Text className={`text-sm font-bold ${action.color}`}>{action.label}</Text>
                <Text className="text-xs text-gray-400">{action.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
 
          {/* Assigned Incidents */}
          <View className="mx-4 mt-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-black">Assigned Incidents</Text>
              <TouchableOpacity>
                <Text className="text-sm text-[#D62828] font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            {incidents.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <Text className="text-gray-400 text-sm">No assigned incidents</Text>
              </View>
            ) : (
              incidents.map((item) => (
                <IncidentCard
                  key={item._id || item.id}
                  item={item}
                  onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: item })}
                />
              ))
            )}
          </View>
 
          <View className="h-6" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
