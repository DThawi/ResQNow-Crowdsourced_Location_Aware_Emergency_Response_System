import React, { useEffect } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const logoSize = width < 400 ? 160 : width < 768 ? 200 : 140;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#070000', '#830F11']}
      className="flex-1 items-center justify-center"
    >
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: logoSize, height: logoSize, borderRadius: logoSize / 2, marginBottom: -10 }}
      />

      <Text className="text-white text-3xl font-bold mb-2">ResQNow</Text>
      <Text className="text-white text-base opacity-80">Emergency Response Platform</Text>

      <View className="flex-row absolute bottom-16 gap-2">
        <View className="w-2 h-2 rounded-full bg-white opacity-70" />
        <View className="w-2 h-2 rounded-full bg-white opacity-70" />
        <View className="w-2 h-2 rounded-full bg-white opacity-70" />
      </View>

    </LinearGradient>
  );
}