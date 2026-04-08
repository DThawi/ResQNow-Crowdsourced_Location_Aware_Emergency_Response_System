import React from "react";
import { TouchableOpacity, Animated } from "react-native";

const CustomToggle = ({ value, onToggle }) => {
  const translateX = new Animated.Value(value ? 20 : 2);

  const toggleSwitch = () => {
    Animated.timing(translateX, {
      toValue: value ? 2 : 20,
      duration: 200,
      useNativeDriver: true,
    }).start();

    onToggle(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      className={`w-12 h-7 rounded-full justify-center ${
        value ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
        className="w-5 h-5 bg-white rounded-full shadow"
      />
    </TouchableOpacity>
  );
};

export default CustomToggle;