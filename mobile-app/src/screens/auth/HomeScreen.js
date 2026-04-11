import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import IncidentCard from '../../components/cards/incidentCards';
import API from '../../services/api';
import HomeHeader from '../../components/HomeHeader';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchIncidents = async () => {
      try {
        const response = await API.get('/incidents');
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Simple helper to format time ago strings
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMins = Math.floor((now - past) / 60000);

    if (diffInMins < 60) return `${diffInMins}m ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* <StatusBar barStyle="light-content" backgroundColor="#D62828" /> */}
      <HomeHeader />
      <TouchableOpacity className="bg-[#D62828] h-[50px] rounded-[10px] flex-row justify-center items-center m-5"
        onPress={() => navigation.navigate('ReportIncident')}>
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
              type={incident.type || "Emergency"}
              status={incident.status || "Pending"}
              description={incident.description}
              location={
                incident.location?.coordinates
                  ? `Lng: ${incident.location.coordinates[0].toFixed(2)}, Lat: ${incident.location.coordinates[1].toFixed(2)}`
                  : "Location Unknown"
              }
              timeAgo={getTimeAgo(incident.timestamp)}
              verifications={0}
              onPress={() => console.log("Card pressed", incident._id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;