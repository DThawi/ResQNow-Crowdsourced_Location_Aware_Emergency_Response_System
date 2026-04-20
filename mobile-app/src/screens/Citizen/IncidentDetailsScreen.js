import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import IncidentFeedbackModal from '../../components/modals/incidentFeedbackModal';

const IncidentDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Safe extraction of incident data passed via navigation parameters
  const incident = route.params?.incident || {};

  // Formatting strings based on the incident data
  const title = incident.type ? `${incident.type} Emergency` : "Emergency";
  
  // Display coordinate mapping with mock city string as fallback
  const locationString = incident.location?.coordinates 
    ? `Lng: ${incident.location.coordinates[0].toFixed(2)}, Lat: ${incident.location.coordinates[1].toFixed(2)} (City Hall, 5th Avenue, Building 42)`
    : "City Hall, 5th Avenue, Building 42";
    
  const reporterName = incident.user_id?.name || incident.user_id || "John Perera";
  
  const description = incident.description || "Large fire reported at commercial building. Heavy smoke visible from multiple blocks away. Multiple units responding. Building has been evacuated. Traffic being diverted from the area.";

  const getTimeStr = (timestamp) => {
    if (!timestamp) return "5 minutes ago (2:45 PM)";
    const date = new Date(timestamp);
    return `5 minutes ago (${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`;
  };

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      {/* Scrollable Content */}
      <ScrollView bounces={false} className="flex-1" contentContainerStyle={{ paddingBottom: 220 }} showsVerticalScrollIndicator={false}>
        {/* Top Image Section */}
        <View className="relative w-full h-[300px]">
          {/* Using unsplash tools image as a mocked header */}
          <Image 
            source={{ uri: incident.image || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Top Overlays */}
          <View className="absolute top-12 left-0 right-0 px-5 flex-row justify-between items-start">
            <View className="bg-[#F59E0B] px-3.5 py-1.5 rounded-full">
              <Text className="text-white font-bold text-xs">{incident.status || "Verified"}</Text>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-white w-10 h-10 rounded-full items-center justify-center" style={{ elevation: 2 }}>
                <Ionicons name="share-social-outline" size={20} color="#2B2D42" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white w-10 h-10 rounded-full items-center justify-center" style={{ elevation: 2 }}>
                <Ionicons name="flag-outline" size={20} color="#2B2D42" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info Card Section */}
        <View className="bg-white -mt-8 rounded-t-3xl pt-8 px-6 pb-6">
          <Text className="text-[#2B2D42] text-2xl font-bold mb-6">{title}</Text>
          
          <View className="flex-col gap-5">
            {/* Location */}
            <View className="flex-row items-center gap-4">
              <View className="w-[22px] items-center">
                <Ionicons name="location-outline" size={22} color="#D62828" />
              </View>
              <View className="flex-1">
                <Text className="text-[#2B2D42] font-bold text-[15px] mb-0.5">Location</Text>
                <Text className="text-[#8D99AE] text-sm leading-5">{locationString}</Text>
              </View>
            </View>

            {/* Time Reported */}
            <View className="flex-row items-center gap-4">
              <View className="w-[22px] items-center">
                <Ionicons name="time-outline" size={22} color="#D62828" />
              </View>
              <View className="flex-1">
                <Text className="text-[#2B2D42] font-bold text-[15px] mb-0.5">Reported</Text>
                <Text className="text-[#8D99AE] text-sm leading-5">{getTimeStr(incident.timestamp)}</Text>
              </View>
            </View>

            {/* Reporter */}
            <View className="flex-row items-center gap-4">
              <View className="w-[22px] items-center">
                <Ionicons name="person-outline" size={22} color="#D62828" />
              </View>
              <View className="flex-1">
                <Text className="text-[#2B2D42] font-bold text-[15px] mb-0.5">Reporter</Text>
                <Text className="text-[#8D99AE] text-sm leading-5">{reporterName}</Text>
              </View>
            </View>
          </View>

          <View className="h-[1px] bg-[#E5E5E5] w-full my-6" />

          {/* Description */}
          <View>
            <Text className="text-[#2B2D42] font-bold text-[15px] mb-2">Description</Text>
            <Text className="text-[#8D99AE] text-sm leading-[22px]">{description}</Text>
          </View>
        </View>

        {/* Community Verification Box */}
        <View className="bg-[#F7F7F7] px-5 py-6">
          <View className="bg-white rounded-3xl p-5" style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: {height: 2}, shadowRadius: 10 }}>
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[#2B2D42] text-[17px] font-bold">Community Verification</Text>
              <View className="bg-[#E8F8F5] px-2.5 py-1 rounded-md">
                <Text className="text-[#2ECC71] text-xs font-bold">12 Verified</Text>
              </View>
            </View>
            
            <View className="flex-col gap-3">
              {[
                {id: 'U1', name: 'User 1', time: '4 min ago'},
                {id: 'U2', name: 'User 2', time: '5 min ago'},
                {id: 'U3', name: 'User 3', time: '6 min ago'}
              ].map(u => (
                <View key={u.id} className="flex-row items-center justify-between bg-[#F7F7F7] py-2 px-3 rounded-2xl border border-[#F0F0F0]">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-[#D62828] items-center justify-center">
                      <Text className="text-white font-bold">{u.id}</Text>
                    </View>
                    <View>
                      <Text className="font-bold text-[#2B2D42] text-[13px]">{u.name}</Text>
                      <Text className="text-[#8D99AE] mt-0.5 text-[11px]">{u.time}</Text>
                    </View>
                  </View>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#2ECC71" />
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] px-5 pt-4 pb-8" style={{ borderTopWidth: 1, borderColor: '#EEEEEE' }}>
        <TouchableOpacity 
          className="bg-[#2ECC71] h-[52px] rounded-xl flex-row items-center justify-center mb-3"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">Verify This Incident</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-transparent h-[52px] flex-row items-center justify-center rounded-xl border mb-3 border-[#D62828]">
          <Feather name="alert-triangle" size={18} color="#D62828" style={{ marginRight: 8 }} />
          <Text className="text-[#D62828] font-bold text-base">Report Inaccuracy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-transparent h-[52px] flex-row items-center justify-center rounded-xl border border-[#2B2D42]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-[#2B2D42] font-bold text-base">Close</Text>
        </TouchableOpacity>
      </View>

      <IncidentFeedbackModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        actionType="verify" 
      />
    </View>
  );
};

export default IncidentDetailsScreen;
