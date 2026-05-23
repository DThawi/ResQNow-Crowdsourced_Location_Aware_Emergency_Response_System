import React from 'react';
import { View, Text } from 'react-native';
import GradientHeader from '../../components/layout/header';

export default function Register3({ navigation }) {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <GradientHeader title="Create Account" onClose={() => navigation.goBack()} />
      <View className="flex-1 items-center justify-center">
        <Text>Register3</Text>
      </View>
    </View>
  );
}