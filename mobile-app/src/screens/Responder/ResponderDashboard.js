import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
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
  if (status === 'Assigned') return 'bg-yellow-100 text-yellow-600';
  if (status === 'In Progress') return 'bg-blue-100 text-blue-600';
  if (status === 'Resolved') return 'bg-green-100 text-green-600';
  if (status === 'Pending') return 'bg-red-100 text-red-600';
  if (status === 'Verified') return 'bg-blue-100 text-blue-600';
  return 'bg-gray-100 text-gray-600';
};

const getTypeIcon = (type) => {
  if (type === 'Fire') return '🔥';
  if (type === 'Medical') return '🏥';
  if (type === 'Flood') return '🌊';
  if (type === 'Accident') return '🚗';
  return '⚠️';
};

const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const StatusBadge = ({ status, colorClass }) => (
  <View className={`px-2 py-0.5 rounded-full ${colorClass.split(' ')[0]}`}>
    <Text className={`text-xs font-semibold ${colorClass.split(' ')[1]}`}>{status}</Text>
  </View>
);

// ── 🎨 PREMIUM REFACTORED INCIDENT CARD COMPONENT ───────────────────────────
const IncidentCard = ({ item, onPress }) => {
  const [readableAddress, setReadableAddress] = useState('Fetching exact location address...');

  useEffect(() => {
    let isMounted = true;
    const resolveLocationToLandmark = async () => {
      try {
        const coords = item.location?.coordinates;
        if (!coords || coords.length < 2) {
          if (isMounted) setReadableAddress('Unknown Location Coordinate');
          return;
        }
        const lng = coords[0];
        const lat = coords[1];

        const reverseLookup = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (reverseLookup && reverseLookup.length > 0) {
          const place = reverseLookup[0];
          const formattedAddress = [
            place.name,
            place.street,
            place.city,
            place.region
          ].filter(Boolean).join(', ');
          
          if (isMounted) setReadableAddress(formattedAddress || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        } else {
          if (isMounted) setReadableAddress(`Position - Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
      } catch (err) {
        if (isMounted) setReadableAddress(`Coordinates Locked: ${item.location?.coordinates?.[1]?.toFixed(4)}, ${item.location?.coordinates?.[0]?.toFixed(4)}`);
      }
    };
    resolveLocationToLandmark();
    return () => { isMounted = false; };
  }, [item.location]);

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100/70 shadow-sm active:opacity-90"
      onPress={onPress}
    >
      {/* Top Title Section */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl">{getTypeIcon(item.type)}</Text>
          <Text className="text-[16px] font-bold text-slate-800 tracking-tight">
            {item.type || 'Emergency'}
          </Text>
        </View>
        <StatusBadge status={item.status || 'Verified'} colorClass={getStatusColor(item.status || 'Verified')} />
      </View>

      {/* Description Content */}
      <Text className="text-xs text-gray-500 leading-relaxed mb-3" numberOfLines={2}>
        {item.description || "No situational context descriptions provided for this incident dispatch."}
      </Text>

      {/* Meta Indicators Sub-Grid */}
      <View className="flex-col gap-1 border-b border-gray-50 pb-2 mb-2">
        <View className="flex-row items-center pr-2">
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          <Text className="text-xs text-gray-400 ml-1 flex-1" numberOfLines={1}>
            {readableAddress}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={13} color="#9CA3AF" />
          <Text className="text-xs text-gray-400 ml-1">
            Ax. Time: {getTimeAgo(item.timestamp)}
          </Text>
        </View>
      </View>

      {/* Dynamic Crowdsourced Validation Footer */}
      <View className="flex-row items-center justify-between mt-1">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center bg-emerald-50 px-2 py-0.5 rounded-md gap-1">
            <Ionicons name="shield-checkmark" size={12} color="#10B981" />
            <Text className="text-[11px] text-emerald-600 font-bold">
              {item.verified_by?.length || 0} verified
            </Text>
          </View>
          
          <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-md gap-1">
            <Ionicons name="flag" size={12} color="#F59E0B" />
            <Text className="text-[11px] text-amber-600 font-bold">
              {item.reported_inaccurate_by?.length || 0} flagged
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward-circle-outline" size={18} color="#D62828" />
      </View>
    </TouchableOpacity>
  );
};

export default function ResponderDashboard({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const [incidents, setIncidents] = useState([]);
  const [nearbyReports, setNearbyReports] = useState([]);
  const [newIncident, setNewIncident] = useState(null);
  const [responder, setResponder] = useState({ name: 'Responder Unit', organization: '' });
  const [stats, setStats] = useState({ assigned: 0, nearby: 0, active: 0, resolved: 0 });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [viewAllAssigned, setViewAllAssigned] = useState(false);
  const [viewAllNearby, setViewAllNearby] = useState(false);

  const [assignedSectionY, setAssignedSectionY] = useState(0);
  const [nearbySectionY, setNearbySectionY] = useState(0);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) setResponder(JSON.parse(userStr));

      const assignedResponse = await API.get('/incidents/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignedData = assignedResponse.data || [];
      setIncidents(assignedData);

      const nearbyResponse = await API.get('/incidents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allIncidents = nearbyResponse.data || [];
      const filteredNearby = allIncidents.filter(inc => inc.status === 'Verified' || inc.status === 'Pending');
      setNearbyReports(filteredNearby);

      try {
        const notificationResponse = await API.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const liveNotifications = notificationResponse.data || [];
        const unreadCount = liveNotifications.filter(n => !n.is_read).length;
        setUnreadNotifications(unreadCount);
      } catch (notifErr) {
        setUnreadNotifications(0);
      }

      setStats({
        assigned: assignedData.filter(i => i.status === 'Assigned').length,
        nearby: filteredNearby.length,
        active: assignedData.filter(i => i.status === 'In Progress' || i.status === 'En Route').length,
        resolved: assignedData.filter(i => i.status === 'Resolved').length,
      });

      const latestActiveDispatch = assignedData.find(i => i.status === 'Assigned');
      if (latestActiveDispatch) {
        const targetId = latestActiveDispatch._id || latestActiveDispatch.id;
        const isLocallyDismissed = await AsyncStorage.getItem(`dismissed_incident_${targetId}`);
        if (isLocallyDismissed === 'true') {
          setNewIncident(null);
        } else {
          setNewIncident(latestActiveDispatch);
        }
      } else {
        setNewIncident(null);
      }

    } catch (err) {
      console.log('Dashboard stream sync error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const interval = setInterval(fetchData, 4000);
      return () => clearInterval(interval);
    }, [])
  );

  const handleDismissAlert = async () => {
    if (newIncident) {
      const targetId = newIncident._id || newIncident.id;
      try {
        await AsyncStorage.setItem(`dismissed_incident_${targetId}`, 'true');
        setNewIncident(null);
      } catch (err) {
        setNewIncident(null);
      }
    }
  };

  const handleStatCardPress = (targetKey) => {
    if (targetKey === 'Assigned' || targetKey === 'Active') {
      setViewAllAssigned(true);
      scrollRef.current?.scrollTo({ y: assignedSectionY - 20, animated: true });
    } else if (targetKey === 'Nearby') {
      setViewAllNearby(true);
      scrollRef.current?.scrollTo({ y: nearbySectionY - 20, animated: true });
    } else if (targetKey === 'Resolved') {
      // ── 🎯 ROUTING SECURITY FIX: Bypasses old citizen components stack
      navigation.navigate('ResponderHistory'); 
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const displayedAssignedIncidents = useMemo(() => {
    if (viewAllAssigned) return incidents;
    return incidents.slice(0, 3);
  }, [incidents, viewAllAssigned]);

  const displayedNearbyReports = useMemo(() => {
    if (viewAllNearby) return nearbyReports;
    return nearbyReports.slice(0, 3);
  }, [nearbyReports, viewAllNearby]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <GradientHeader
        title="Responder Dashboard"
        type="none"
        rightComponent={
          <TouchableOpacity onPress={() => navigation?.navigate('AlertsNotifications')} className="relative p-1" style={{ marginRight: 4 }}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            {unreadNotifications > 0 && (
              <View className="absolute rounded-full items-center justify-center bg-[#D62828]" style={{ top: -2, right: -2, minWidth: 16, height: 16, paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#B71C1C' }}>
                <Text className="text-white text-[9px] font-black text-center">{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D62828" />
        </View>
      ) : (
        <ScrollView ref={scrollRef} className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          
          {/* Top Banner Module */}
          {newIncident && (
            <View className="mx-4 mt-4 bg-white border border-red-100 rounded-2xl p-4 flex-col shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-1.5">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
                  <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">New Incident Assigned</Text>
                </View>
                <TouchableOpacity onPress={handleDismissAlert} className="p-1">
                  <Ionicons name="close" size={16} color="#8D99AE" />
                </TouchableOpacity>
              </View>
              <Text className="text-slate-700 text-sm font-bold mb-1">{newIncident.type} Alert</Text>
              <Text className="text-slate-500 text-xs mb-3">{newIncident.description || 'New Incident Assignment'}</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity className="bg-[#D62828] px-4 py-2 rounded-xl items-center justify-center flex-1" onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: newIncident })}>
                  <Text className="text-white text-xs font-bold">View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-100 px-4 py-2 rounded-xl items-center justify-center" onPress={handleDismissAlert}>
                  <Text className="text-slate-600 text-xs font-bold">Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Identity Card Component */}
          <View className="mx-4 mt-4 bg-[#1a2b3c] rounded-2xl p-4 border border-slate-800 shadow-sm flex-col">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-lg font-bold flex-1">{responder.name}</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('SettingsScreen')} className="p-1">
                <Ionicons name="settings-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-[#28a745]/10 border border-[#28a745]/20 px-2.5 py-1 rounded-full self-start mb-2">
              <Ionicons name="shield" size={12} color="#4ADE80" />
              <Text className="text-green-400 text-xs font-medium ml-1">Verified Responder</Text>
            </View>
            <Text className="text-slate-400 text-xs mb-1">{responder.organization || 'Sri Lanka Police Colombo Division'}</Text>
            <View className="flex-row justify-between items-end">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <Text className="text-green-400 text-xs font-semibold">Active Ready</Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 items-center justify-center">
                <Ionicons name="shield-outline" size={24} color="white" />
              </View>
            </View>
          </View>

          {/* Interactive Statistics Row */}
          <View className="mx-4 mt-4 flex-row justify-between">
            {[
              { label: 'Assigned', value: stats.assigned, color: 'text-[#D62828]' },
              { label: 'Nearby', value: stats.nearby, color: 'text-blue-500' },
              { label: 'Active', value: stats.active, color: 'text-gray-700' },
              { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
            ].map((stat) => (
              <TouchableOpacity 
                key={stat.label} 
                activeOpacity={0.7}
                onPress={() => handleStatCardPress(stat.label)}
                className="bg-white rounded-xl flex-1 mx-1 py-3 items-center shadow-sm border border-gray-100/50"
              >
                <Text className={`text-lg font-bold ${stat.color}`}>{stat.value}</Text>
                <Text className="text-xs text-gray-400">{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Action Pad Grid */}
          <View className="mx-4 mt-4 flex-row flex-wrap justify-between" style={{ gap: 10 }}>
            {[
              { icon: 'navigate-outline', label: 'Navigate', sub: 'To incident scene', color: 'text-[#D62828]', iconColor: '#D62828', bg: 'bg-red-50', route: 'ResponderMap' },
              { icon: 'alert-circle-outline', label: 'Alerts', sub: 'View all notifications', color: 'text-amber-500', iconColor: '#F59E0B', bg: 'bg-amber-50', route: 'AlertsNotifications' },
              // ACTION MATRIX ROUTING ROUTE REBINDING FIX
              { icon: 'time-outline', label: 'Activity', sub: 'Past Actions Log', color: 'text-blue-500', iconColor: '#3B82F6', bg: 'bg-blue-50', route: 'ResponderHistory' },
              { icon: 'checkmark-circle-outline', label: 'Complete', sub: 'Mark task resolved', color: 'text-green-500', iconColor: '#10B981', bg: 'bg-green-50', route: 'Complete' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                className="bg-white rounded-2xl p-4 items-center justify-center shadow-sm border border-gray-100/50"
                style={{ width: '48%', minHeight: 110 }}
                onPress={() => {
                  if (action.route === 'Complete') {
                    const currentActiveTask = incidents.find(i => i.status === 'Assigned' || i.status === 'In Progress');
                    if (currentActiveTask) navigation.navigate('ResponderIncidentDetails', { incident: currentActiveTask });
                    else alert('No active task to mark resolved.');
                  } else {
                    navigation?.navigate(action.route);
                  }
                }}
              >
                <View className={`w-10 h-10 rounded-full ${action.bg} items-center justify-center mb-2`}>
                  <Ionicons name={action.icon} size={22} color={action.iconColor} />
                </View>
                <Text className={`text-sm font-bold ${action.color}`}>{action.label}</Text>
                <Text className="text-xs text-gray-400 mt-0.5 text-center">{action.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Assigned Incidents Section */}
          <View 
            className="mx-4 mt-6"
            onLayout={(event) => setAssignedSectionY(event.nativeEvent.layout.y)}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-black">Assigned Incidents</Text>
              {incidents.length > 3 && (
                <TouchableOpacity onPress={() => setViewAllAssigned(!viewAllAssigned)}>
                  <Text className="text-sm text-[#D62828] font-semibold">{viewAllAssigned ? 'Show Less' : 'View All'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {incidents.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center border border-dashed border-gray-200">
                <Text className="text-gray-400 text-sm">No assignments active at this time.</Text>
              </View>
            ) : (
              displayedAssignedIncidents.map((item) => (
                <IncidentCard key={item._id || item.id} item={item} onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: item })} />
              ))
            )}
          </View>

          {/* Nearby Verified Reports */}
          <View 
            className="mx-4 mt-6 mb-10"
            onLayout={(event) => setNearbySectionY(event.nativeEvent.layout.y)}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-black">Nearby Verified Reports</Text>
              {nearbyReports.length > 3 && (
                <TouchableOpacity onPress={() => setViewAllNearby(!viewAllNearby)}>
                  <Text className="text-sm text-[#D62828] font-semibold">{viewAllNearby ? 'Show Less' : 'View All'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {nearbyReports.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center border border-dashed border-gray-200">
                <Text className="text-gray-400 text-sm">No nearby verified reports unassigned.</Text>
              </View>
            ) : (
              displayedNearbyReports.map((item) => (
                <IncidentCard key={item._id || item.id} item={item} onPress={() => navigation.navigate('ResponderIncidentDetails', { incident: item })} />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
