import React from "react";
import { View, Text, TouchableOpacity} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const GradientHeader = ({ title, onClose }) => (
  <LinearGradient
    colors={["#D62828", "#003049"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    className="flex-row justify-between items-center px-4 pt-10 pb-4">
    <Text className="text-white text-lg font-bold">{title}</Text>

    <TouchableOpacity onPress={onClose}>
      <Text className="text-white text-lg">✕</Text>
    </TouchableOpacity>
  </LinearGradient>
);

export default GradientHeader;