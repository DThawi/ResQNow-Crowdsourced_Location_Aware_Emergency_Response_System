import React, { useState, useCallback } from 'react';
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
// --- THESE TWO LINES WERE MISSING ---
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IncidentCard from '../../components/cards/incidentCards';
import API from '../../services/api';
import HomeHeader from '../../components/HomeHeader';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchIncidents = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (pageNumber === 1 && !isRefresh) setLoading(true);
      if (pageNumber > 1) setLoadingMore(true);

      const limit = 10;
      const [response, storedViewed] = await Promise.all([
        API.get(`/incidents?page=${pageNumber}&limit=${limit}`),
        AsyncStorage.getItem('viewedIncidentIds')
      ]);
      
      const incidentsData = response.data;
      const viewedIds = storedViewed ? JSON.parse(storedViewed) : [];
      
      setHasMore(incidentsData.length === limit);

      setIncidents(prevIncidents => {
        const newData = pageNumber === 1 ? incidentsData : [...prevIncidents, ...incidentsData];
        // Calculate unread based on the currently loaded data
        const unread = newData.filter(i => !viewedIds.includes(i._id)).length;
        setUnreadCount(unread);
        return newData;
      });
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      if (!isRefresh) setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchIncidents(1, true);
    setRefreshing(false);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchIncidents(page + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIncidents(1);
    }, [])
  );

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#D62828" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Pass the dynamic count to the Header */}
      <HomeHeader unreadCount={unreadCount} />
      
      <TouchableOpacity 
        className="bg-[#D62828] h-[50px] rounded-[10px] flex-row justify-center items-center m-5"
        onPress={() => navigation.navigate('ReportIncident')}
      >
        <Text className="text-white font-bold text-lg">Request Emergency help</Text>
      </TouchableOpacity>
      
      <Text className="text-[20px] font-bold my-2 ml-5">Recent Incidents</Text>
      
      {incidents.length === 0 && !loading ? (
        <Text className="text-slate-500 text-center mt-5">No incidents found.</Text>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item: incident }) => (
            <IncidentCard
              type={incident.type}
              status={incident.status}
              description={incident.description}
              location={incident.location?.coordinates ? `Lng: ${incident.location.coordinates[0].toFixed(2)}, Lat: ${incident.location.coordinates[1].toFixed(2)}` : "Unknown"}
              timeAgo={getTimeAgo(incident.timestamp)}
              verifications={incident.verified_by ? incident.verified_by.length : 0}
              reports={incident.reported_inaccurate_by ? incident.reported_inaccurate_by.length : 0}
              onPress={() => navigation.navigate("IncidentDetails", { incident })}
            />
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#D62828" 
              colors={["#D62828"]} 
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#D62828" style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;
