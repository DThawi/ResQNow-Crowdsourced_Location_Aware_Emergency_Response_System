import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
import ReportCard from '../../components/cards/ReportCard';

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Reports');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token'); // Get your login token
      
      const response = await API.get('/incidents/my-reports', {
        headers: { Authorization: `Bearer ${token}` } // Send token to backend
      });

      // Based on controller, data is in response.data.reports
      setReports(response.data.reports || []);
    } catch (err) {
      console.error("Fetch My Reports Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  // Dynamic Stats Calculation
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    verified: reports.filter(r => r.status === 'Verified' || r.status === 'Assigned').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  const filteredData = reports.filter(item => 
    activeFilter === 'All Reports' ? true : item.status === activeFilter
  );

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      {/* Header matching design */}
      <LinearGradient colors={['#D62828', '#2B2D42']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="pt-14 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-bold">My Reports</Text>
      </LinearGradient>

      {/* Stats Section with specific colors/opacity */}
      <View className="flex-row justify-between px-4 py-5">
        {[
          { label: 'Total', count: stats.total, color: '#2B2D42' },
          { label: 'Pending', count: stats.pending, color: '#F6AA1C' },
          { label: 'Verified', count: stats.verified, color: '#2ECC71' },
          { label: 'Resolved', count: stats.resolved, color: '#2B2D42' },
        ].map((stat, idx) => (
          <View key={idx} className="rounded-xl items-center justify-center py-3 w-[23%]" style={{ backgroundColor: 'rgba(141, 153, 174, 0.2)' }}>
            <Text className="text-[18px] font-bold" style={{ color: stat.color }}>{stat.count}</Text>
            <Text className="text-[12px] text-[#8D99AE] mt-0.5">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <View className="px-4 pb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['All Reports', 'Pending', 'Verified', 'Resolved'].map((label) => (
            <TouchableOpacity 
                key={label} 
                onPress={() => setActiveFilter(label)} 
                className="px-4 py-2 rounded-full mr-2.5" 
                style={{ backgroundColor: activeFilter === label ? '#D62828' : '#F6AA1C' }}
            >
              <Text className="font-medium text-[13px] text-white">{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D62828" className="mt-10"/> 
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-center text-[#8D99AE] mt-10">You haven't reported any incidents yet.</Text>
          }
          renderItem={({ item }) => (
            <ReportCard 
                item={item} 
                onPress={() => navigation.navigate("IncidentDetails", { incident: item })} 
            />
          )}
        />
      )}
    </View>
  );
};

export default MyReportsScreen;
