import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const GradientHeader = ({ title, type = "back", rightComponent }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#D62828", "#003049"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-row items-center px-4 pb-3"
      style={{ paddingTop: insets.top + 12 }}

      

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
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>

      {/* RIGHT: Custom Component */}
      {rightComponent && <View>{rightComponent}</View>}

      {/* RIGHT: Close Icon */}
      {type === "close" && !rightComponent && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

export default GradientHeader;


