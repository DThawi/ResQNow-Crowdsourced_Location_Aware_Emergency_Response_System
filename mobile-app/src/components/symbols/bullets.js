// import React from "react";
// import { View, Text } from "react-native";

// const BulletItem = ({ children }) => (
//   <View className="flex-row items-start mb-1">
//     <Text className="mr-2 ">•</Text>
//     <Text className="flex-1 text-gray-700">{children}</Text>
//   </View>
// );

// export default BulletItem;

import React from "react";
import { View, Text } from "react-native";

const BulletItem = ({
  children,
  bulletClass = "mr-2 text-black",
  textClass = "flex-1 text-gray-700",
  containerClass = "flex-row items-start mb-1",
}) => (
  <View className={containerClass}>
    <Text className={bulletClass}>•</Text>
    <Text className={textClass}>{children}</Text>
  </View>
);

export default BulletItem;