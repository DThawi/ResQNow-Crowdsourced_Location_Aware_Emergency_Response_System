import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ForgotPasswordModal from '../../components/modals/forgotPasswordModal';

const ForgotPassword1 = () => {
  const [visible, setVisible] = useState(true); // auto open

  return (
    <View className="flex-1 justify-center items-center">

      {/* Modal */}
      <ForgotPasswordModal
        visible={visible}
        onClose={() => setVisible(false)}
      />

    </View>
  );
};

export default ForgotPassword1;