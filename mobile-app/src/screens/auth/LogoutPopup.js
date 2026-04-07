import React, { useState } from 'react';
import { View } from 'react-native';
import LogoutModal from '../../components/modals/logoutModal';

export default function LogoutPopup({ navigation, route }) {
  const [visible, setVisible] = useState(true);
  const accountType = route?.params?.accountType || 'citizen';

  const handleClose = () => {
    setVisible(false);
    navigation.goBack();
  };

  const handleLogout = () => {
    setVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <LogoutModal
        visible={visible}
        onClose={handleClose}
        onLogout={handleLogout}
        accountType={accountType}
      />
    </View>
  );
}