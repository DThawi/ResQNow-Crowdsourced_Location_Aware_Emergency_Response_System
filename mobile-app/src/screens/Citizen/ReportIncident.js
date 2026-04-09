import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientHeader from '../../components/layout/header';

const INCIDENT_TYPES = [
  { id: 'Fire', label: 'Fire', icon: 'flame-outline' },
  { id: 'Medical', label: 'Medical', icon: 'heart-outline' },
  { id: 'Accident', label: 'Accident', icon: 'car-sport-outline' },
  { id: 'Crime', label: 'Crime', icon: 'warning-outline' },
  { id: 'Disaster', label: 'Disaster', icon: 'business-outline' }
];

const URGENCY_LEVELS = ['Low', 'Medium', 'High'];

export default function ReportIncident() {
  const navigation = useNavigation();
  const [incidentType, setIncidentType] = useState('Fire'); // Defaulting one just to show selected state, or we can leave it null
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('High');

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <GradientHeader title="Report Incident" type="back" />

      <ScrollView className="flex-1 px-5 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* Incident Type */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Incident Type *</Text>
          <View className="flex-row flex-wrap justify-start" style={{ gap: 12 }}>
            {INCIDENT_TYPES.map((type) => {
              const isSelected = incidentType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setIncidentType(type.id)}
                  style={{ width: '30%', aspectRatio: 1 }}
                  className={`rounded-2xl justify-center items-center border ${
                    isSelected ? 'border-[#003049] bg-[#003049]/5' : 'border-[#E5E5E5] bg-white'
                  }`}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={28} 
                    color={isSelected ? '#003049' : '#8D99AE'} 
                  />
                  <Text className={`text-xs mt-2 ${isSelected ? 'text-[#003049] font-bold' : 'text-[#8D99AE]'}`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Location *</Text>
          <View className="flex-row items-center mb-2">
            <View className="flex-1 border border-[#E5E5E5] rounded-xl px-4 py-3 bg-white">
              <TextInput
                placeholder="Detecting location..."
                placeholderTextColor="#8D99AE"
                value={location}
                onChangeText={setLocation}
                className="text-[#2B2D42] text-sm p-0 m-0"
              />
            </View>
            <TouchableOpacity className="bg-[#003049] rounded-xl w-12 h-12 justify-center items-center ml-3">
              <Ionicons name="send-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#2ECC71" />
            <Text className="text-[#2ECC71] text-xs ml-1">GPS location detected</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Description</Text>
          <View className="border border-[#E5E5E5] rounded-xl p-4 bg-white min-h-[120px]">
            <TextInput
              placeholder="Provide details about the incident..."
              placeholderTextColor="#8D99AE"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              className="text-[#2B2D42] text-sm p-0 flex-1"
            />
          </View>
        </View>

        {/* Photos */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Photos (Optional)</Text>
          <TouchableOpacity className="border border-[#E5E5E5] rounded-xl h-28 justify-center items-center bg-white" style={{ borderStyle: 'solid' }}>
            {/* Note: Figma looks solid but standard is dotted. I will use solid but we can add dash if needed. */}
            <Ionicons name="camera-outline" size={32} color="#8D99AE" />
            <Text className="text-[#8D99AE] text-sm mt-2">Tap to add photos</Text>
          </TouchableOpacity>
        </View>

        {/* Urgency Level */}
        <View className="mb-8">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Urgency Level *</Text>
          <View className="flex-row justify-between" style={{ gap: 12 }}>
            {URGENCY_LEVELS.map((level) => {
              const isSelected = urgency === level;
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setUrgency(level)}
                  className={`flex-1 py-3.5 rounded-xl border items-center justify-center ${
                    isSelected 
                      ? 'bg-[#D62828] border-[#D62828]' 
                      : 'bg-white border-[#E5E5E5]'
                  }`}
                >
                  <Text className={`font-bold ${isSelected ? 'text-white' : 'text-[#8D99AE]'}`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity className="bg-[#D62828] rounded-xl py-4 items-center justify-center mb-3">
          <Text className="text-white text-base font-bold">Submit Report</Text>
        </TouchableOpacity>
        <Text className="text-[#8D99AE] text-xs text-center mb-10">
          Your report will be verified by the community
        </Text>

      </ScrollView>
    </View>
  );
}
