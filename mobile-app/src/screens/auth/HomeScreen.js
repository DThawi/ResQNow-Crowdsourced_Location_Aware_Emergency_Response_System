import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import IncidentCard from '../../components/cards/incidentCards';
import API from '../../services/api';
import HomeHeader from '../../components/HomeHeader';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const [response, storedViewed] = await Promise.all([
        API.get('/incidents'),
        AsyncStorage.getItem('viewedIncidentIds')
      ]);
      
      const incidentsData = response.data;
      const viewedIds = storedViewed ? JSON.parse(storedViewed) : [];
      
      // Calculate how many incidents haven't been "viewed" yet
      const unread = incidentsData.filter(i => !viewedIds.includes(i._id)).length;
      
      setIncidents(incidentsData);
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIncidents();
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
      
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {incidents.length === 0 ? (
          <Text className="text-slate-500 text-center mt-5">No incidents found.</Text>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident._id}
              type={incident.type}
              status={incident.status}
              description={incident.description}
              location={incident.location?.coordinates ? `Lng: ${incident.location.coordinates[0].toFixed(2)}, Lat: ${incident.location.coordinates[1].toFixed(2)}` : "Unknown"}
              timeAgo={getTimeAgo(incident.timestamp)}
              verifications={incident.verified_by ? incident.verified_by.length : 0}
              reports={incident.reported_inaccurate_by ? incident.reported_inaccurate_by.length : 0}
              onPress={() => navigation.navigate("IncidentDetails", { incident })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
