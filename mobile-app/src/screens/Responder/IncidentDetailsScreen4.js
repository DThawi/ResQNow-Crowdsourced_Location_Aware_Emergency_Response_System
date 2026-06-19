import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';

export default function IncidentDetailsScreen4({ route, navigation }) {
  const incident = route?.params?.incident || {};

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <GradientHeader title="Operation Summary" type="back" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="m-4 rounded-3xl overflow-hidden shadow-sm bg-slate-900">
          <LinearGradient colors={['#10B981', '#064E3B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-6 items-center justify-center h-40">
            <MaterialCommunityIcons name="check-circle-double" size={44} color="white" className="mb-2" />
            <Text className="text-white text-xl font-black uppercase tracking-wider">Mission Accomplished</Text>
            <Text className="text-emerald-100 text-xs mt-1">Incident channel closed successfully.</Text>
          </LinearGradient>
        </View>

        {/* Status Confirmation Card */}
        <View className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 items-center">
          <View className="bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1 mb-2">
            <Text className="text-emerald-600 text-xs font-black uppercase">Archived Log</Text>
          </View>
          <Text className="text-slate-800 text-base font-black mb-1">{incident.type || 'Emergency'}</Text>
          <Text className="text-slate-400 text-xs text-center px-4">{incident.description || 'Task closed out cleanly.'}</Text>
        </View>

        {/* Dashboard Return Trigger */}
        <View className="mx-4 mb-4">
          <TouchableOpacity 
            activeOpacity={0.8} 
            className="bg-slate-800 py-3.5 rounded-2xl items-center flex-row justify-center shadow-md"
            onPress={() => navigation.navigate('ResponderDashboard')}
          >
            <Feather name="home" size={16} color="white" className="mr-2" />
            <Text className="text-white font-black text-sm uppercase tracking-wider">Return to Command Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
