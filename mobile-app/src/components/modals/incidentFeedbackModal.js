import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import BaseModal from './baseModal';

const IncidentFeedbackModal = ({ visible, onClose, actionType }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => onClose(), 10000); 
    }
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  const isVerify = actionType === 'verify';
  const headerTitle = isVerify ? "Verify Incident" : "Report Incident";
  const mainMessage = isVerify ? "Incident Verified Successfully!" : "Incident Reported Successfully!";
  const iconColor = isVerify ? "#4CAF50" : "#D32F2F"; 
  const iconBgColor = isVerify ? "#E8F5E9" : "#FDECEE"; 

  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false} cardStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <FontAwesome5 name="check-circle" solid={false} size={45} color={iconColor} />
        </View>
        <Text style={styles.mainMessage}>{mainMessage}</Text>
        <Text style={styles.subMessage}>Your contribution has been updated.</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.timerText}>Auto-redirecting in 10 seconds...</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', width: '100%' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  closeButton: { padding: 4 },
  contentContainer: { alignItems: 'center', paddingTop: 30, paddingBottom: 40, paddingHorizontal: 20, width: '100%' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  mainMessage: { fontSize: 16, fontWeight: 'bold', color: '#2D3748', marginBottom: 10, textAlign: 'center' },
  subMessage: { fontSize: 13, color: '#A0AEC0', textAlign: 'center', marginBottom: 30 },
  timerText: { fontSize: 12, color: '#A0AEC0' },
});

export default IncidentFeedbackModal;
