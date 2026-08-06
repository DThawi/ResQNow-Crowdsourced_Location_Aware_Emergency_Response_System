import React, { useState } from "react";
import { View } from "react-native";
import ForgotPasswordModal from "../../components/modals/forgotPasswordModal";

const ForgotPassword1 = () => {
  const [visible, setVisible] = useState(true);

  return (
    <View className="flex-1 justify-center items-center">
      <ForgotPasswordModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ForgotPassword1;