import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../services/api';
import IncidentFeedbackModal from '../../components/modals/incidentFeedbackModal';
import { getIncidentTypeAssets, getStatusDetails } from '../../utils/incidentHelpers';

const IncidentDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [incident, setIncident] = useState(route.params?.incident || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInaccuracyModalVisible, setInaccuracyModalVisible] = useState(false);

  const typeAssets = getIncidentTypeAssets(incident.type);
  const statusInfo = getStatusDetails(incident.status);

  const handleFeedback = async (type) => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      const backendType = type === 'verify' ? 'verify' : 'inaccurate';

      const response = await API.post(`/incidents/${incident._id}/feedback`, {
        feedback_type: backendType 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.incident) {
        setIncident(response.data.incident);
      }
      
      if (type === 'verify') {
        setModalVisible(true);
      } else {
        setInaccuracyModalVisible(true);
      }

    } catch (error) {
      Alert.alert("Notice", error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <ScrollView bounces={false} className="flex-1" contentContainerStyle={{ paddingBottom: 250 }} showsVerticalScrollIndicator={false}>
        
        <View className="relative w-full h-[300px]">
          <Image 
            source={typeAssets.image} 
            className="w-full h-full" 
            resizeMode="cover" 
          />
          <View className="absolute top-12 left-5 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: statusInfo.color }}>
            <Text className="text-white font-bold text-xs uppercase">{statusInfo.label}</Text>
          </View>

          <View className="absolute top-12 right-5 flex-row gap-3">
            <TouchableOpacity className="bg-white/90 w-10 h-10 rounded-full items-center justify-center shadow-sm">
              <Ionicons name="share-social-outline" size={20} color="#2B2D42" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white -mt-8 rounded-t-3xl pt-8 px-6 pb-6 shadow-sm">
          <Text className="text-[#2B2D42] text-2xl font-bold mb-6">{incident.type} Emergency</Text>
          <View className="flex-col gap-5">
            <View className="flex-row items-center gap-4">
              <Ionicons name="location-outline" size={22} color="#D62828" />
              <View className="flex-1">
                <Text className="text-[#2B2D42] font-bold text-[15px]">Location</Text>
                <Text className="text-[#8D99AE] text-sm">
                   {incident.location?.coordinates ? `Lng: ${incident.location.coordinates[0].toFixed(2)}, Lat: ${incident.location.coordinates[1].toFixed(2)}` : "Location Hidden"}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <Ionicons name="time-outline" size={22} color="#D62828" />
              <View className="flex-1">
                <Text className="text-[#2B2D42] font-bold text-[15px]">Reported</Text>
                <Text className="text-[#8D99AE] text-sm">{new Date(incident.timestamp).toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View className="h-[1px] bg-[#E5E5E5] w-full my-6" />
          <Text className="text-[#2B2D42] font-bold text-[15px] mb-2">Description</Text>
          <Text className="text-[#8D99AE] text-sm leading-[22px]">{incident.description}</Text>
        </View>

        {/* Community Feedback Box */}
        <View className="bg-[#F7F7F7] px-5 py-6">
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[#2B2D42] text-[17px] font-bold">Community Feedback</Text>
              <View className="flex-row gap-2">
                <View className="bg-[#E8F8F5] px-2.5 py-1 rounded-md">
                  <Text className="text-[#2ECC71] text-xs font-bold">{incident.verified_by?.length || 0} Verified</Text>
                </View>
                <View className="bg-[#FDE8E8] px-2.5 py-1 rounded-md">
                  <Text className="text-[#E74C3C] text-xs font-bold">{incident.reported_inaccurate_by?.length || 0} Rejected</Text>
                </View>
              </View>
            </View>

            {(() => {
              const verifications = (incident.verified_by || []).map(id => ({ id, type: 'verify' }));
              const inaccuracies = (incident.reported_inaccurate_by || []).map(id => ({ id, type: 'inaccurate' }));
              const allFeedbacks = [...verifications, ...inaccuracies];

              if (allFeedbacks.length === 0) {
                return <Text className="text-[#8D99AE] text-center text-sm py-2">No feedbacks yet.</Text>;
              }

              return (
                <View className="flex-col gap-3">
                  {allFeedbacks.map((f, index) => {
                    const uid = String(f.id);
                    const isVerify = f.type === 'verify';
                    return (
                      <View key={uid + index} className="flex-row items-center justify-between bg-[#F7F7F7] py-2 px-3 rounded-2xl border border-[#F0F0F0]">
                        <View className="flex-row items-center gap-3">
                          <View className={`w-10 h-10 rounded-full ${isVerify ? 'bg-[#2ECC71]' : 'bg-[#E74C3C]'} items-center justify-center`}>
                            <Text className="text-white font-bold">{uid.slice(-2).toUpperCase()}</Text>
                          </View>
                          <View>
                            <Text className="font-bold text-[#2B2D42] text-[13px]">Citizen {uid.slice(-4)}</Text>
                            <Text className="text-[#8D99AE] mt-0.5 text-[11px]">{isVerify ? 'Verified' : 'Reported Inaccurate'}</Text>
                          </View>
                        </View>
                        <Ionicons 
                          name={isVerify ? "checkmark-circle-outline" : "close-circle-outline"} 
                          size={24} 
                          color={isVerify ? "#2ECC71" : "#E74C3C"} 
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })()}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] px-5 pt-4 pb-10 border-t border-[#EEEEEE]">
        <TouchableOpacity 
          className={`bg-[#2ECC71] h-[52px] rounded-xl flex-row items-center justify-center mb-3 ${isSubmitting ? 'opacity-70' : ''}`} 
          onPress={() => handleFeedback('verify')} 
          disabled={isSubmitting}
        >
          {isSubmitting && <ActivityIndicator color="white" style={{marginRight: 8}}/>}
          <Ionicons name="checkmark-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">Verify This Incident</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`bg-transparent h-[52px] flex-row items-center justify-center rounded-xl border mb-3 border-[#D62828] ${isSubmitting ? 'opacity-70' : ''}`} 
          onPress={() => handleFeedback('inaccurate')} 
          disabled={isSubmitting}
        >
          <Feather name="alert-triangle" size={18} color="#D62828" style={{ marginRight: 8 }} />
          <Text className="text-[#D62828] font-bold text-base">Report Inaccuracy</Text>
        </TouchableOpacity>

        <TouchableOpacity className="h-[52px] flex-row items-center justify-center rounded-xl border border-[#2B2D42]" onPress={() => navigation.goBack()}>
          <Text className="text-[#2B2D42] font-bold text-base">Close</Text>
        </TouchableOpacity>
      </View>

      {/* Verify Modal */}
      <IncidentFeedbackModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        actionType="verify" 
      />
      
      {/* Report Modal */}
      <IncidentFeedbackModal 
        visible={isInaccuracyModalVisible} 
        onClose={() => setInaccuracyModalVisible(false)} 
        actionType="report" 
      />
    </View>
  );
};

export default IncidentDetailsScreen;
