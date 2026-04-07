import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const GradientHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#D62828", "#003049"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-row justify-between items-center px-4 py-4"
    >
      <Text className="text-white text-lg font-bold">{title}</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-white">✕</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default GradientHeader;