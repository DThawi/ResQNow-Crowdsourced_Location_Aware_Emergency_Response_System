import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import API from '../../services/api';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      await API.post('/auth/login', { email, password });
      navigation.navigate('Home');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View className="flex-1 items-center px-6 pt-16 pb-10">

        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: width * 0.35, height: width * 0.35, borderRadius: width * 0.175 }}
        />

        <Text className="text-2xl font-bold text-black mb-1">Welcome Back</Text>
        <Text className="text-base text-gray-400 mb-8">Sign in to continue to ResQNow</Text>

        <View className="w-full mb-2">
          <Text className="text-sm font-bold text-black mb-1 mt-2">Email Address</Text>
          <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white h-12">
            <Text className="mr-2 text-base">✉️</Text>
            <TextInput
              className="flex-1 text-sm text-black"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text className="text-sm font-bold text-black mb-1 mt-3">Password</Text>
          <View className="flex-row items-center border-2 border-gray-200 rounded-lg px-3 bg-white h-12">
            <Text className="mr-2 text-base">🔒</Text>
            <TextInput
              className="flex-1 text-sm text-black"
              placeholder="Enter your password"
              placeholderTextColor="#999"
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View className="flex-row justify-between items-center w-full my-4">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View className={`w-4 h-4 border-2 mr-2 ${rememberMe ? 'bg-[#D62828] border-[#D62828]' : 'bg-white border-gray-400'}`} />
            <Text className="text-sm text-gray-500">Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword1')}>
            <Text className="text-sm text-[#D62828] font-bold">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#D62828] w-full h-12 rounded-xl justify-center items-center mb-5"
          onPress={handleLogin}
        >
          <Text className="text-white text-base font-bold">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-sm text-gray-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register1')}>
            <Text className="text-sm text-[#D62828] font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}