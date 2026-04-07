// USAGE EXAMPLE:

// <GradientHeader title="Screen Title" type="back" />
// <GradientHeader title="Screen Title" type="close" />

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GradientHeader = ({ title, type = "back" }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#D62828", "#003049"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-row items-center px-4 pb-3"
      style={{ paddingTop: insets.top + 12}}
    >
      {/* LEFT: Back Arrow */}
      {type === "back" && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      )}

      {/* TITLE */}
      <View className="flex-1 justify-center">
        <Text className="text-white text-lg font-bold">
          {title}
        </Text>
      </View>

      {/* RIGHT: Close Icon */}
      {type === "close" && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default GradientHeader;

