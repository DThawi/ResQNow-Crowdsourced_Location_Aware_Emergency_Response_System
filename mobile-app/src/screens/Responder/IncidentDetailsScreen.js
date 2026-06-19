import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';

export default function IncidentDetailsScreen1({ route, navigation }) {
  const [notes, setNotes] = useState('');
  const [readableAddress, setReadableAddress] = useState('Resolving precise incident address landmark...');
  const incident = route?.params?.incident || {};
  const isResolved = incident.status?.toLowerCase() === 'resolved';
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptAssignment = async () => {
    try {
      setIsAccepting(true);
      const token = await AsyncStorage.getItem('token');
      let updatedIncident = { ...incident };

      const response = await API.put(`/incidents/${incident._id}/status`, { status: 'Assigned' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.incident) {
        updatedIncident = response.data.incident;
      }
      
      navigation.navigate('ResponderIncidentDetails2', { incident: updatedIncident });
    } catch (error) {
      console.log('Failed to accept assignment:', error.message);
      Alert.alert(
        'Assignment Error',
        error.response?.data?.message || 'Failed to accept assignment. Please check your connection and try again.'
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const typeText = incident.type || 'Accident';
  const descriptionText = incident.description || 'Multi-vehicle collision on highway, traffic blocked';
  const reporterText = incident.user_id?.name || 'Sahan Madawela';
  
  const getContextMeta = (type) => {
    if (type === 'Fire') return { icon: '🔥', colors: ['#E65100', '#1A1C29'], themeColor: '#E65100' };
    if (type === 'Medical') return { icon: '🏥', colors: ['#D62828', '#11131C'], themeColor: '#D62828' };
    if (type === 'Flood' || type === 'Disaster') return { icon: '🌊', colors: ['#0A4B7C', '#0F172A'], themeColor: '#0A4B7C' };
    return { icon: '🚗', colors: ['#C91818', '#1E202C'], themeColor: '#C91818' };
  };

  const config = getContextMeta(typeText);

  useEffect(() => {
    const statusLower = incident.status?.toLowerCase();
    if (statusLower === 'en route' || statusLower === 'in progress') {
      navigation.replace('ResponderIncidentDetails3', { incident });
    }
  }, [incident.status]);

  useEffect(() => {
    let isMounted = true;
    const resolveLocation = async () => {
      try {
        const coords = incident.location?.coordinates;
        if (!coords || coords.length < 2) {
          if (isMounted) setReadableAddress('Southern Expressway - Kottawa Interchange');
          return;
        }
        const lookup = await Location.reverseGeocodeAsync({ latitude: coords[1], longitude: coords[0] });
        if (lookup && lookup.length > 0) {
          const p = lookup[0];
          const combined = [p.name, p.street, p.city, p.region].filter(Boolean).join(', ');
          if (isMounted) setReadableAddress(combined || `Coordinates Block Locked [${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}]`);
        }
      } catch (err) {
        if (isMounted) setReadableAddress('Panadura, Western Province, Sri Lanka');
      }
    };
    resolveLocation();
    return () => { isMounted = false; };
  }, [incident.location]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View className="flex-1 bg-[#F8FAFC]">
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <GradientHeader title="Incident Overview" type="back" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Top HUD Card */}
          <View className="m-4 rounded-3xl overflow-hidden shadow-md bg-slate-900">
            <LinearGradient colors={config.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 flex-col">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center bg-white/10 px-3 py-1 rounded-full">
                  <Feather name="activity" size={12} color="#FFF" />
                  <Text className="text-white text-xs font-semibold ml-1.5 uppercase tracking-wider">Live Metrics</Text>
                </View>
                <Text style={{ fontSize: 36 }}>{config.icon}</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="bg-white/95 rounded-2xl p-3 flex-1 mr-2 shadow-sm items-center">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase">Distance Space</Text>
                  <Text className="text-slate-800 text-[16px] font-black mt-0.5">0.8 Miles</Text>
                </View>
                <View className="bg-white/95 rounded-2xl p-3 flex-1 ml-2 shadow-sm items-center">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase">Response ETA</Text>
                  <Text className="text-slate-800 text-[16px] font-black mt-0.5">4 Mins</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Alert Banner */}
          <View className="mx-4 mb-4 bg-amber-500 rounded-2xl flex-row items-center p-4 shadow-sm border border-amber-400/20">
            <View className="bg-amber-600/30 p-2 rounded-full mr-3">
              <Feather name="alert-triangle" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-base">Assignment Dispatch Pending</Text>
              <Text className="text-amber-50 text-xs font-medium">Review parameters to commit tracking vectors.</Text>
            </View>
          </View>

          {/* Details Card */}
          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-slate-800 text-xl font-black tracking-tight">{typeText}</Text>
              <View className="bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
                <Text className="text-amber-600 text-xs font-bold uppercase">{incident.status || 'Assigned'}</Text>
              </View>
            </View>

            <Text className="text-slate-500 text-sm leading-relaxed mb-4">{descriptionText}</Text>

            <View className="gap-3 pt-3 border-t border-slate-50">
              <View className="flex-row items-start">
                {/*  Changed inline style to explicit Tailwind className margin logic */}
                <Feather name="map-pin" size={14} color={config.themeColor} className="mt-1" />
                <Text className="text-slate-600 text-xs font-medium ml-2.5 flex-1">{readableAddress}</Text>
              </View>
              <View className="flex-row items-center">
                <Feather name="clock" size={14} color="#64748B" />
                <Text className="text-slate-500 text-xs ml-2.5">Dispatched: {incident.timestamp ? new Date(incident.timestamp).toLocaleTimeString() : 'Just Now'}</Text>
              </View>
              <View className="flex-row items-center">
                <Feather name="user" size={14} color="#64748B" />
                <Text className="text-slate-500 text-xs ml-2.5">Reported via: {reporterText}</Text>
              </View>
            </View>
          </View>

          {/* Live Sync Logs */}
          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <Text className="text-slate-800 text-sm font-black mb-3">Assigned Units Coordination</Text>
            <View className="flex-col gap-2.5">
              <View className="flex-row justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="shield-car" size={16} color="#3B82F6" />
                  <Text className="text-slate-700 text-xs font-bold">Panadura Central Unit 02</Text>
                </View>
                <Text className="text-blue-500 text-[11px] font-bold">En Route</Text>
              </View>
              <View className="flex-row justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="ambulance" size={16} color="#10B981" />
                  <Text className="text-slate-700 text-xs font-bold">Suwa Seriya Ambulance 1990</Text>
                </View>
                <Text className="text-emerald-500 text-[11px] font-bold">Staged Scene</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mx-4 mb-4 flex-col gap-2">
            <TouchableOpacity 
              className={`${isResolved ? 'bg-gray-300' : 'bg-[#D62828]'} py-3.5 rounded-2xl items-center ${isResolved ? '' : 'shadow-sm'}`}
              onPress={handleAcceptAssignment}
              disabled={isResolved || isAccepting}
            >
              <Text className={`${isResolved ? 'text-gray-500' : 'text-white'} font-black text-sm uppercase tracking-wider`}>
                {isAccepting ? 'Accepting...' : 'Accept Assignment'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white py-3.5 rounded-2xl items-center border border-slate-200"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-slate-500 font-bold text-sm uppercase tracking-wider">Decline Dispatch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
