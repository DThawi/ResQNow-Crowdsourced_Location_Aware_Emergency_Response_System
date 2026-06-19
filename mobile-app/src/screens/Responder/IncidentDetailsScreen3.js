import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';

export default function IncidentDetailsScreen3({ route, navigation }) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const incident = route?.params?.incident || {};

  const typeText = incident.type || 'Accident';
  const descriptionText = incident.description || 'Multi-vehicle collision on highway, traffic blocked';

  const handleResolve = async () => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      if (incident._id) {
        await API.put(`/incidents/${incident._id}/status`, { status: 'Resolved' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigation.navigate('ResponderIncidentDetails4', { incident: { ...incident, status: 'Resolved' } });
    } catch (error) {
      console.log('Failed to resolve incident:', error.message);
      Alert.alert(
        'Resolution Error',
        error.response?.data?.message || 'Failed to resolve incident. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View className="flex-1 bg-[#F8FAFC]">
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <GradientHeader title="Active Operations" type="back" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <View className="m-4 rounded-3xl overflow-hidden shadow-sm bg-slate-900">
            <LinearGradient colors={['#3B82F6', '#1E3A8A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 items-center justify-center h-36">
              {/* Exchanged style configurations for raw utility spaces */}
              <MaterialCommunityIcons name="satellite-variant" size={32} color="white" className="mb-1" />
              <Text className="text-white text-base font-black uppercase tracking-widest">Unit Transiting Scene</Text>
              <Text className="text-blue-100 text-xs mt-1">Live telemetry streaming to command post.</Text>
            </LinearGradient>
          </View>

          <View className="mx-4 mb-4 bg-emerald-500 rounded-2xl flex-row items-center p-4 shadow-sm">
            <View className="bg-emerald-600/30 p-2 rounded-full mr-3">
              <Feather name="navigation" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-base">In Progress (En Route)</Text>
              <Text className="text-emerald-50 text-xs font-medium">Arriving at coordinated coordinates shortly.</Text>
            </View>
          </View>

          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <Text className="text-slate-800 text-lg font-black mb-1">{typeText}</Text>
            <Text className="text-slate-500 text-xs leading-relaxed">{descriptionText}</Text>
          </View>

          <View className="mx-4 mb-4 flex-col gap-2">
            <TouchableOpacity 
              className="bg-[#10B981] py-3.5 rounded-2xl items-center flex-row justify-center shadow-md"
              onPress={handleResolve}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
              ) : (
                <Feather name="check-square" size={16} color="white" />
              )}
              <Text className="text-white font-black text-sm uppercase tracking-wider ml-2">Mark as Resolved</Text>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <Text className="text-slate-800 text-sm font-black mb-3">Update Mission Parameters</Text>
            <TextInput
              className="border border-slate-100 rounded-2xl p-4 h-24 text-slate-700 text-xs bg-slate-50/50"
              placeholder="Add final situational reports notes..."
              placeholderTextColor="#94A3B8"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
