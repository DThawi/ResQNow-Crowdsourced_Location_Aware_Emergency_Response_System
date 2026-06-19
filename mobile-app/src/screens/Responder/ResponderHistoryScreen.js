import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientHeader from '../../components/layout/header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import API from '../../services/api';

const getStatusColor = (status) => {
  if (status === 'In Progress') return 'bg-blue-100 text-blue-600';
  if (status === 'Resolved') return 'bg-green-100 text-green-600';
  return 'bg-gray-100 text-gray-600';
};

const getTypeIcon = (type) => {
  if (type === 'Fire') return '🔥';
  if (type === 'Medical') return '🏥';
  if (type === 'Flood') return '🌊';
  if (type === 'Accident') return '🚗';
  return '⚠️';
};

const formatDetailsTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HistoryCard = ({ item, onPress }) => {
  const [readableAddress, setReadableAddress] = useState('Resolving scene location...');

  useEffect(() => {
    let isMounted = true;
    const resolveLocation = async () => {
      try {
        const coords = item.location?.coordinates;
        if (!coords || coords.length < 2) {
          if (isMounted) setReadableAddress('Unknown Coordinates');
          return;
        }
        const reverseLookup = await Location.reverseGeocodeAsync({ 
          latitude: coords[1], 
          longitude: coords[0] 
        });
        if (reverseLookup && reverseLookup.length > 0) {
          const place = reverseLookup[0];
          const formatted = [place.name, place.street, place.city].filter(Boolean).join(', ');
          if (isMounted) setReadableAddress(formatted || `Lat: ${coords[1].toFixed(4)}, Lng: ${coords[0].toFixed(4)}`);
        }
      } catch (err) {
        if (isMounted) setReadableAddress('Location Coordinates Split Locked');
      }
    };
    resolveLocation();
    return () => { isMounted = false; };
  }, [item.location]);

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100/80" 
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl">{getTypeIcon(item.type)}</Text>
          <Text className="text-base font-bold text-slate-800">{item.type || 'Emergency'}</Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
          <Text className="text-xs font-bold">{item.status}</Text>
        </View>
      </View>
      
      <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
        {item.description}
      </Text>
      
      <Text className="text-[11px] text-gray-400 mb-1">📍 {readableAddress}</Text>
      <Text className="text-[11px] text-gray-400">📅 Closed: {formatDetailsTime(item.timestamp)}</Text>
    </TouchableOpacity>
  );
};

export default function ResponderHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActionHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await API.get('/incidents/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data || []);
    } catch (err) {
      console.log('Error syncing action log details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActionHistory();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchActionHistory();
    setRefreshing(false);
  }, []);

  const stats = useMemo(() => {
    return {
      total: history.length,
      active: history.filter(i => i.status === 'In Progress' || i.status === 'En Route').length,
      resolved: history.filter(i => i.status === 'Resolved').length
    };
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (activeFilter === 'All') return history;
    if (activeFilter === 'Active') return history.filter(i => i.status === 'In Progress' || i.status === 'En Route');
    return history.filter(i => i.status === activeFilter);
  }, [activeFilter, history]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <GradientHeader title="Past Actions Log" type="back" />

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
          <View className="flex-row mx-4 mt-4 justify-between gap-2">
            <View className="bg-white rounded-xl flex-1 py-3 items-center shadow-sm border border-gray-100/50">
              <Text className="text-xl font-black text-slate-700">{stats.total}</Text>
              <Text className="text-[11px] text-gray-400 font-medium">Total Tasks</Text>
            </View>
            <View className="bg-white rounded-xl flex-1 py-3 items-center shadow-sm border border-gray-100/50">
              <Text className="text-xl font-black text-blue-500">{stats.active}</Text>
              <Text className="text-[11px] text-gray-400 font-medium">Active</Text>
            </View>
            <View className="bg-white rounded-xl flex-1 py-3 items-center shadow-sm border border-gray-100/50">
              <Text className="text-xl font-black text-green-600">{stats.resolved}</Text>
              <Text className="text-[11px] text-gray-400 font-medium">Resolved</Text>
            </View>
          </View>

          <View className="flex-row mx-4 mt-5 gap-2">
            {['All', 'Active', 'Resolved'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full border ${
                  activeFilter === filter ? 'bg-[#D62828] border-[#D62828]' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-xs font-semibold ${activeFilter === filter ? 'text-white' : 'text-gray-500'}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mx-4 mt-4 mb-8">
            {filteredHistory.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center border border-dashed border-gray-200">
                <Ionicons name="folder-open-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs font-medium mt-2 text-center">
                  No past dispatches recorded under this category filter.
                </Text>
              </View>
            ) : (
              filteredHistory.map((item) => (
                <HistoryCard 
                  key={item._id || item.id} 
                  item={item} 
                  onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: item })}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
