import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import BaseModal from './baseModal';

const IncidentFeedbackModal = ({ visible, onClose, actionType }) => {
  useEffect(() => {
    let timer;
    if (visible) {
      // Auto-closes the modal after 10 seconds
      timer = setTimeout(() => onClose(), 10000); 
    }
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  const isVerify = actionType === 'verify';
  
  // Dynamic content based on actionType
  const headerTitle = isVerify ? "Verify Incident" : "Report Inaccuracy";
  const mainMessage = isVerify ? "Incident Verified Successfully!" : "Incident Reported Successfully!";
  const subMessage = isVerify ? "Your verification helps the community stay informed." : "Thank you for flagging this. Our team will look into it.";
  
  // Styling based on actionType
  const iconName = isVerify ? "check-circle" : "exclamation-circle";
  const iconColor = isVerify ? "#4CAF50" : "#D32F2F"; 
  const iconBgColor = isVerify ? "#E8F5E9" : "#FDECEE"; 

  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false} cardStyle={{ padding: 0 }}>
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <FontAwesome5 name={iconName} solid={false} size={45} color={iconColor} />
        </View>
        
        <Text style={styles.mainMessage}>{mainMessage}</Text>
        <Text style={styles.subMessage}>{subMessage}</Text>
        
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <View style={[styles.doneButton, { backgroundColor: iconColor }]}>
             <Text style={styles.doneButtonText}>Done</Text>
          </View>
          <Text style={styles.timerText}>Auto-closing in 10 seconds...</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0', 
    width: '100%' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2D3748' 
  },
  closeButton: { 
    padding: 4 
  },
  contentContainer: { 
    alignItems: 'center', 
    paddingTop: 30, 
    paddingBottom: 40, 
    paddingHorizontal: 20, 
    width: '100%' 
  },
  iconCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 25 
  },
  mainMessage: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2D3748', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  subMessage: { 
    fontSize: 13, 
    color: '#A0AEC0', 
    textAlign: 'center', 
    marginBottom: 30,
    lineHeight: 18
  },
  doneButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center'
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  timerText: { 
    fontSize: 12, 
    color: '#A0AEC0',
    textAlign: 'center'
  },
});

export default IncidentFeedbackModal;
