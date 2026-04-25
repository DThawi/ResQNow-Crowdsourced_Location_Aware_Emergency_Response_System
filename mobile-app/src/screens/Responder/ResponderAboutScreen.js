import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ResponderAboutScreen = ({ navigation }) => {
  const features = [
    {
      icon: "flash-outline",
      title: "Fast Dispatch",
      subtitle: "Receive incidents instantly",
    },
    {
      icon: "map-outline",
      title: "Live Navigation",
      subtitle: "Reach scene quickly",
    },
    {
      icon: "shield-outline",
      title: "Verified Cases",
      subtitle: "Trusted emergency reports",
    },
    {
      icon: "chatbox-ellipses-outline",
      title: "Secure Communication",
      subtitle: "Team coordination",
    },
    {
      icon: "document-text-outline",
      title: "Case Tracking",
      subtitle: "Update incident status",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-slate-800">
            About Responder App
          </Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View className="items-center">
          <View className="w-24 h-24 rounded-3xl bg-blue-700 items-center justify-center">
            <Ionicons name="medkit-outline" size={42} color="white" />
          </View>

          <Text className="text-4xl font-bold text-slate-800 mt-4">
            ResQNow
          </Text>

          <Text className="text-gray-500 mt-1 text-center px-6">
            Professional emergency response platform
          </Text>
        </View>

        {/* Overview */}
        <View className="mx-5 mt-8 bg-white rounded-3xl p-5">
          <Text className="text-xl font-bold text-slate-800 mb-3">
            App Overview
          </Text>

          <Text className="text-gray-500 leading-6">
            Built for police, ambulance, fire and rescue teams to receive
            verified incidents, coordinate faster, and manage emergencies
            efficiently.
          </Text>
        </View>

        {/* Mission */}
        <View className="mx-5 mt-6">
          <Text className="text-xl font-bold text-slate-800 mb-3">
            Our Mission
          </Text>

          <View className="border-l-4 border-blue-600 pl-4">
            <Text className="text-gray-500 leading-6">
              Enable responders with smart tools, live data, and seamless
              coordination to protect lives.
            </Text>
          </View>
        </View>

        {/* Features */}
        <View className="mx-5 mt-8">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            Core Features
          </Text>

          {features.map((item, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
            >
              <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center">
                <Ionicons name={item.icon} size={22} color="#2563EB" />
              </View>

              <View className="ml-4">
                <Text className="font-semibold text-slate-800">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className="text-center text-gray-400 my-8">
          © 2026 ResQNow Emergency Systems
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResponderAboutScreen;