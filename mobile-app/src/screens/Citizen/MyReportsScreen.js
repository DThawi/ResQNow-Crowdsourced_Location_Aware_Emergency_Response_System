import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ReportCard from '../../components/cards/ReportCard';

const mockReports = [
  {
    id: '1',
    title: 'Building Fire Emergency',
    location: 'City Hall, Main Street',
    date: '12/9/2025',
    views: 45,
    likes: 12,
    status: 'Verified',
    statusColor: '#2ECC71',
    typeIcon: 'fire',
    typeBgHex: '#D62828',
  },
  {
    id: '2',
    title: 'Car Accident - Multiple Vehicles',
    location: 'Highway 101, Exit 23',
    date: '12/8/2025',
    views: 34,
    likes: 8,
    status: 'Resolved',
    statusColor: '#2B2D42',
    typeIcon: 'car',
    typeBgHex: '#F6AA1C',
  },
  {
    id: '3',
    title: 'Medical Emergency - Heart Attack',
    location: 'Central Park',
    date: '12/7/2025',
    views: 18,
    likes: 3,
    status: 'Pending',
    statusColor: '#F6AA1C',
    typeIcon: 'alert-outline',
    typeBgHex: '#2ECC71',
  },
  {
    id: '4',
    title: 'Suspicious Activity Reported',
    location: 'New City',
    date: '12/5/2025',
    views: 12,
    likes: 1,
    status: 'Rejected',
    statusColor: '#D62828',
    typeIcon: 'account-cancel-outline',
    typeBgHex: '#2B2D42',
  }
];

const filters = [
  { label: 'All Reports', bg: '#D62828', text: '#FFFFFF' },
  { label: 'Pending', bg: '#F6AA1C', text: '#FFFFFF' },
  { label: 'Verified', bg: '#2ECC71', text: '#FFFFFF' },
  { label: 'Resolved', bg: '#2B2D42', text: '#FFFFFF' },
];

const MyReportsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All Reports');

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <StatusBar barStyle="light-content" backgroundColor="#D62828" />

      {/* Dynamic Header */}
      <LinearGradient
        colors={['#D62828', '#2B2D42']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-14 pb-4 px-4 flex-row items-center"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-bold">My Reports</Text>
      </LinearGradient>

      {/* Stats Section */}
      <View className="flex-row justify-between px-4 py-5 font-bold">
        {[
          { label: 'Total', count: 4, color: '#2B2D42' },
          { label: 'Pending', count: 1, color: '#F6AA1C' },
          { label: 'Verified', count: 1, color: '#2ECC71' },
          { label: 'Resolved', count: 1, color: '#2B2D42' },
        ].map((stat, idx) => (
          <View
            key={idx}
            className="rounded-xl items-center justify-center py-3 w-[23%]"
            style={{ backgroundColor: 'rgba(141, 153, 174, 0.2)' }}
          >
            <Text className="text-[18px] font-bold" style={{ color: stat.color }}>{stat.count}</Text>
            <Text className="text-[12px] text-[#8D99AE] mt-0.5">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <View className="px-4 pb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.label}
              onPress={() => setActiveFilter(filter.label)}
              className="px-4 py-2 rounded-full mr-2.5"
              style={{ backgroundColor: filter.bg }}
            >
              <Text className="font-medium text-[13px]" style={{ color: filter.text }}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cards List */}
      <FlatList
        data={mockReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ReportCard item={item} onPress={() => { }} />}
      />
    </View>
  );
};

export default MyReportsScreen;
