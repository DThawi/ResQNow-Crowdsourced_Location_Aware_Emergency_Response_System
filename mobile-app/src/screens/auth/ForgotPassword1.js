// components/ForgotPasswordPopup.js

import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import ForgotPasswordModal from "../../components/modals/forgotPasswordModal";

export default function ForgotPasswordPopup() {
  const [visible, setVisible] = useState(false);

  return (
    <View>

      {/* Trigger Button (you can remove this if needed) */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text className="text-red-700 text-sm">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <ForgotPasswordModal
        visible={visible}
        onClose={() => setVisible(false)}
      />

    </View>
  );
}