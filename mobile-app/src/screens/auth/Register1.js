import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Header from '../../components/layout/header';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function Register1({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select a role to continue');
      return;
    }
    navigation.navigate('Register2', { role: selectedRole });
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Header title="Create Account" onClose={() => navigation.navigate('Login')} />

      <ScrollView 
        contentContainerStyle={{ 
          alignItems: 'center', 
          padding: 24,
          flexGrow: 1,
          justifyContent: 'center'
        }}
      >
        <Text className="text-2xl font-bold text-black mb-1">Select Your Role</Text>
        <Text className="text-sm text-gray-400 mb-8">Choose how you want to use ResQNow</Text>

        <TouchableOpacity className="w-full mb-4" onPress={() => setSelectedRole('Citizen')}>
          <LinearGradient
            colors={['#261007', '#6D1307']}
            className={`rounded-2xl items-center ${selectedRole === 'Citizen' ? 'border-2 border-white' : ''}`}
            style={{ height: height * 0.30 , justifyContent: 'center' }}
          >
            <Text className="text-4xl mb-2">👥</Text>
            <Text className="text-white text-lg font-bold mb-1">Citizen</Text>
            <Text className="text-[#DDDDDD] text-xs text-center px-6">Report emergencies and help your community</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity className="w-full mb-4" onPress={() => setSelectedRole('Responder')}>
          <LinearGradient
            colors={['#022334', '#001F33']}
            className={`rounded-2xl items-center ${selectedRole === 'Responder' ? 'border-2 border-white' : ''}`}
            style={{ height: height * 0.30, justifyContent: 'center' }}
          >
            <Text className="text-4xl mb-2">🚑</Text>
            <Text className="text-white text-lg font-bold mb-1">Responder</Text>
            <Text className="text-[#DDDDDD] text-xs text-center px-6">Respond to incidents and save lives</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 mb-6 text-center">You can switch roles anytime from settings</Text>

        <TouchableOpacity
          className="bg-[#D62828] w-full h-12 rounded-xl justify-center items-center"
          onPress={handleContinue}
        >
          <Text className="text-white text-base font-bold">→  Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}