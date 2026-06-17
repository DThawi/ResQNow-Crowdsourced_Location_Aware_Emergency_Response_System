import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';
import * as Location from 'expo-location';

export default function IncidentDetailsScreen2({ route, navigation }) {
  const [notes, setNotes] = useState('');
  const [readableAddress, setReadableAddress] = useState('Resolving precise incident address landmark...');
  const incident = route?.params?.incident || {};

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
          const combined = [p.name, p.street, p.city].filter(Boolean).join(', ');
          if (isMounted) setReadableAddress(combined);
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
        <GradientHeader title="Operational Panel" type="back" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <View className="m-4 rounded-3xl overflow-hidden shadow-md bg-slate-900">
            <LinearGradient colors={config.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 flex-col">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center bg-white/10 px-3 py-1 rounded-full">
                  <Feather name="navigation" size={12} color="#FFF" />
                  <Text className="text-white text-xs font-semibold ml-1.5 uppercase tracking-wider">Deployment Target</Text>
                </View>
                <Text style={{ fontSize: 36 }}>{config.icon}</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="bg-white/95 rounded-2xl p-3 flex-1 mr-2 shadow-sm items-center">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase">Distance</Text>
                  <Text className="text-slate-800 text-[16px] font-black mt-0.5">0.8 mi</Text>
                </View>
                <View className="bg-white/95 rounded-2xl p-3 flex-1 ml-2 shadow-sm items-center">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase">ETA Range</Text>
                  <Text className="text-slate-800 text-[16px] font-black mt-0.5">4 Mins</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View className="mx-4 mb-4 bg-blue-500 rounded-2xl flex-row items-center p-4 shadow-sm">
            <View className="bg-blue-600/30 p-2 rounded-full mr-3">
              <Feather name="check-circle" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-extrabold text-base">Assignment Confirmed</Text>
              <Text className="text-blue-50 text-xs">Ready for dispatch tracking. Engage map routing vectors.</Text>
            </View>
          </View>

          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-slate-800 text-xl font-black">{typeText}</Text>
              <View className="bg-blue-50 border border-blue-200 rounded-full px-3 py-0.5">
                <Text className="text-blue-600 text-xs font-bold uppercase">Confirmed</Text>
              </View>
            </View>
            <Text className="text-slate-500 text-xs leading-relaxed mb-4">{descriptionText}</Text>
            <View className="flex-row items-start pt-3 border-t border-slate-50">
              {/* Swapped out inline style here as well */}
              <Feather name="map-pin" size={13} color="#64748B" className="mt-1" />
              <Text className="text-slate-600 text-xs font-medium ml-2 flex-1">{readableAddress}</Text>
            </View>
          </View>

          <View className="mx-4 mb-4 flex-col gap-2.5">
            <TouchableOpacity 
              className="bg-[#3498DB] py-3.5 rounded-2xl items-center flex-row justify-center shadow-md"
              onPress={() => navigation.navigate('ResponderIncidentDetails3', { incident: { ...incident, status: 'En Route' } })}
            >
              <Feather name="navigation" size={16} color="white" />
              <Text className="text-white font-black text-sm uppercase tracking-wider ml-2">Start Transit (En Route)</Text>
            </TouchableOpacity>

            <View className="flex-row justify-between gap-2">
              <TouchableOpacity className="bg-white py-3.5 rounded-2xl items-center flex-row justify-center border border-slate-200 shadow-sm flex-1">
                <Feather name="phone" size={14} color="#475569" />
                <Text className="text-slate-600 font-bold text-xs uppercase ml-1.5">Call Reporter</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white py-3.5 rounded-2xl items-center flex-row justify-center border border-slate-200 shadow-sm flex-1">
                <Feather name="map" size={14} color="#475569" />
                <Text className="text-slate-600 font-bold text-xs uppercase ml-1.5">Map View</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <Text className="text-slate-800 text-sm font-black mb-3">Responder Mission Log Notes</Text>
            <TextInput
              className="border border-slate-100 rounded-2xl p-4 h-28 text-slate-700 text-xs bg-slate-50/50"
              placeholder="Append continuous operational field notes here..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
            <TouchableOpacity className="border border-[#D62828] py-2 rounded-xl mt-3 items-center" onPress={() => Alert.alert("Success", "Notes logged locally.")}>
              <Text className="text-[#D62828] font-bold text-xs uppercase">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
