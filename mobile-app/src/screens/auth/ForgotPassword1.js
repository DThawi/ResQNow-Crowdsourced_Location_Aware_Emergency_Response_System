import React, { useState } from 'react';
import { View } from 'react-native';
import ForgotPasswordModal from '../../components/modals/forgotPasswordModal';

export default function ForgotPassword1({ navigation }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <ForgotPasswordModal visible={visible} onClose={handleClose} />
    </View>
  );
}