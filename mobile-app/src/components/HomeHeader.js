import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#830F11', '#1D0304']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        borderWidth: 1,
        borderColor: '#000',
      }}
      className="p-8"
    >
      {/* Top Row: Logo/Title and Icons */}
      <View className="flex-row justify-between items-center mt-5 mb-6">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 bg-gray-300 rounded-full" />
          <Text className="text-white text-2xl font-bold">ResQNow</Text>
        </View>
        <View className="flex-row items-center gap-5 pr-2">
          <TouchableOpacity onPress={() => navigation.navigate('AlertScreen')}>
            <Ionicons name="notifications-outline" size={26} color="white" />
            <View className="absolute -top-1.5 -right-2 bg-amber-500 rounded-full px-[5px] py-[1px] items-center justify-center">
              <Text className="text-[10px] font-bold text-slate-900">3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Feather name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtitle */}
      <Text className="text-white/95 text-[17px] mb-5 pl-1 tracking-wide">Stay safe and informed</Text>

      {/* Action Buttons Row */}
      <View className="flex-row justify-between gap-2">
        {/* Button 1: My Reports */}
        <TouchableOpacity
          className="bg-white rounded-[20px] w-[31%] py-4 items-center"
          style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
          onPress={() => navigation.navigate('MyReports')}
        >
          <View className="w-[42px] h-[42px] rounded-full bg-[#D32F2F] items-center justify-center mb-2.5">
            <Feather name="alert-circle" size={22} color="white" />
          </View>
          <Text className="text-slate-800 text-[11px] font-bold">My Reports</Text>
        </TouchableOpacity>

        {/* Button 2: Live Map */}
        <TouchableOpacity className="bg-white rounded-[20px] w-[31%] py-4 items-center" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
          onPress={() => navigation.navigate('Map')}>
          <View className="w-[42px] h-[42px] rounded-full bg-[#0B2C42] items-center justify-center mb-2.5">
            <Feather name="map" size={20} color="white" />
          </View>
          <Text className="text-slate-800 text-[11px] font-bold">Live Map</Text>
        </TouchableOpacity>

        {/* Button 3: Alerts */}
        <TouchableOpacity className="bg-white rounded-[20px] w-[31%] py-4 items-center" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
          onPress={() => navigation.navigate('AlertScreen')}
        >
          <View className="w-[42px] h-[42px] rounded-full bg-[#F59E0B] items-center justify-center mb-2.5">
            <Ionicons name="pulse" size={22} color="white" />
          </View>
          <Text className="text-slate-800 text-[11px] font-bold">Alerts</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

export default HomeHeader;
