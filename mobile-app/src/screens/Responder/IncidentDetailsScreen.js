import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';

export default function IncidentDetailsScreen() {
  const [notes, setNotes] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-[#F7F7F7]">
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <GradientHeader title="Incident Details" type="back" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Top Banner */}
          <View className="m-4 rounded-xl overflow-hidden shadow-sm">
            <LinearGradient
              colors={['#D62828', '#2B2D42']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="h-44 flex-row justify-between items-center px-6"
            >
              {/* Distance Card */}
              <View className="bg-white rounded-2xl px-3 py-3 items-center justify-center shadow-md min-w-[70px]">
                <Text className="text-[#003049] text-[11px] font-medium mb-1">Distance</Text>
                <Text className="text-[#003049] text-[15px] font-bold">0.8 mi</Text>
              </View>

              {/* Center Icon */}
              <Text style={{ fontSize: 50 }}>🚗</Text>

              {/* ETA Card */}
              <View className="bg-white rounded-2xl px-3 py-3 items-center justify-center shadow-md min-w-[70px]">
                <Text className="text-[#003049] text-[11px] font-medium mb-1">ETA</Text>
                <Text className="text-[#003049] text-[15px] font-bold">4 min</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Action Required Banner */}
          <View className="mx-4 mb-5 bg-[#D62828] rounded-xl flex-row items-center p-4 shadow-sm">
            <View className="bg-[#B91F1F] p-2.5 rounded-full mr-4">
              <Feather name="check-circle" size={22} color="white" />
            </View>
            <View>
              <Text className="text-white font-bold text-lg leading-tight mb-0.5">Action Required</Text>
              <Text className="text-white/90 text-[13px]">Respond to this incident</Text>
            </View>
          </View>

          {/* Details Card */}
          <View className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[#2B2D42] text-[22px] font-extrabold">Car Accident</Text>
              <View className="border border-[#E67E22] rounded-full px-3 py-1">
                <Text className="text-[#E67E22] text-xs font-semibold">Verified</Text>
              </View>
            </View>

            <Text className="text-[#8D99AE] text-[15px] mb-5 leading-6">
              Multi-vehicle collision on highway, traffic blocked
            </Text>

            {/* Info Rows */}
            <View>
              <View className="flex-row items-start mb-3.5">
                <Feather name="map-pin" size={18} color="#8D99AE" className="mt-1" />
                <View className="ml-3.5 flex-1">
                  <Text className="text-[#8D99AE] text-[14px]">Southern Expressway - Kottawa Interchange</Text>
                  <Text className="text-[#8D99AE] text-[14px]">Sri Lanka, SL</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-3.5">
                <Feather name="clock" size={18} color="#8D99AE" />
                <Text className="text-[#8D99AE] text-[14px] ml-3.5">Reported Dec 9, 3:15 PM</Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Feather name="user" size={18} color="#8D99AE" />
                <Text className="text-[#8D99AE] text-[14px] ml-3.5">Reported by Sahan Madawela</Text>
              </View>

              <View className="flex-row items-center mb-2.5">
                <Feather name="check-circle" size={18} color="#2ECC71" />
                <Text className="text-[#2ECC71] text-[14px] font-semibold ml-3.5">15 community verifications</Text>
              </View>

              <View className="flex-row items-center">
                <Feather name="alert-circle" size={18} color="#F6AA1C" />
                <Text className="text-[#F6AA1C] text-[14px] font-semibold ml-3.5">0 flagged</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mx-4 mb-6">
            <TouchableOpacity className="bg-[#D62828] py-3.5 rounded-xl items-center mb-3 shadow-md">
              <Text className="text-white font-bold text-[15px]">Accept Assignment</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white py-3.5 rounded-xl items-center border border-[#D62828] shadow-sm">
              <Text className="text-[#D62828] font-bold text-[15px]">Decline</Text>
            </TouchableOpacity>
          </View>

          {/* Responder Notes */}
          <View className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-[#2B2D42] text-[16px] font-bold mb-4">Responder Notes</Text>
            <TextInput
              className="border border-[#EBEBEB] rounded-xl p-4 h-32 text-[#2B2D42] text-[14px] bg-white"
              placeholder="Add notes about this incident..."
              placeholderTextColor="#8D99AE"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
            <View className="items-center mt-4">
              <TouchableOpacity className="border border-[#D62828] px-8 py-2 rounded-xl">
                <Text className="text-[#D62828] font-semibold text-[14px]">Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information */}
          <View className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-[#2B2D42] text-[16px] font-bold mb-5">Contact Information</Text>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[#8D99AE] text-[15px] font-medium">Reporter</Text>
              <TouchableOpacity className="flex-row items-center border border-[#D62828] px-4 py-2 rounded-xl">
                <Feather name="phone-call" size={14} color="#D62828" />
                <Text className="text-[#D62828] font-bold ml-2 text-[13px]">Call</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-[#8D99AE] text-[15px] font-medium">Dispatch</Text>
              <TouchableOpacity className="flex-row items-center border border-[#D62828] px-4 py-2 rounded-xl">
                <Feather name="phone-call" size={14} color="#D62828" />
                <Text className="text-[#D62828] font-bold ml-2 text-[13px]">Call</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
