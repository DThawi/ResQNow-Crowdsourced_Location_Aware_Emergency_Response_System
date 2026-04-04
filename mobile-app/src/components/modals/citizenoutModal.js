import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import BaseModal from './baseModal'; 
const CitizenoutModal = ({ visible, onClose, onLogout, userName = "John Anderson" }) => {
  const [step, setStep] = useState(1);
  const [hasRead, setHasRead] = useState(false);
  const [confirmText, setConfirmText] = useState('');

 
  const requiredString = `${userName}/Logout`;

 
  useEffect(() => {
    if (visible) {
      setStep(1);
      setHasRead(false);
      setConfirmText('');
    }
  }, [visible]);

  const handleClose = () => {
    setStep(1);
    setHasRead(false);
    setConfirmText('');
    onClose();
  };

  return (
    
    <BaseModal 
      visible={visible} 
      onClose={handleClose} 
      showCloseIcon={false} 
      cardStyle={{ padding: 0, overflow: 'hidden' }}
    >
      
     
      <View style={styles.header}>
        <View style={styles.headerIconSpacer} />
        <Text style={styles.headerTitle}>Logout {userName}</Text>
        
       
        {step === 2 ? (
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <AntDesign name="close" size={18} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIconSpacer} />
        )}
      </View>

      {/* ----------------- STEP 1: WARNING ----------------- */}
      {step === 1 && (
        <View style={styles.content}>
          <View style={styles.warningBox}>
            <FontAwesome5 name="exclamation-triangle" size={16} color="#D32F2F" />
            <Text style={styles.warningText}>
              Unexpected bad things will happen if you don't read this!
            </Text>
          </View>

          <Text style={styles.bodyText}>
            This will log you out of your ResQNow account and you will need to login again to:
          </Text>

          <View style={styles.listContainer}>
            {[
              'Report emergency incidents', 
              'Receive real-time emergency alerts', 
              'Access your reports and verifications', 
              'View incident history and live map'
            ].map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setHasRead(!hasRead)} activeOpacity={0.7}>
            <Ionicons name={hasRead ? "checkbox" : "square"} size={20} color={hasRead ? "#D32F2F" : "#E2E8F0"} />
            <Text style={styles.checkboxText}>I have read and understand these effects</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.continueBtn, !hasRead && styles.disabledBtn]} 
              disabled={!hasRead}
              onPress={() => setStep(2)}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ----------------- STEP 2: CONFIRMATION ----------------- */}
      {step === 2 && (
        <View style={styles.content}>
          <Text style={styles.instructionText}>
            To confirm logout, type <Text style={styles.boldRedText}>"{requiredString}"</Text> in the box below:
          </Text>

          <TextInput
            style={styles.input}
            placeholder={requiredString}
            placeholderTextColor="#A0AEC0"
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity 
            style={[styles.logoutBtn, confirmText !== requiredString && styles.disabledBtn]} 
            disabled={confirmText !== requiredString}
            onPress={() => {
              handleClose();
              if(onLogout) onLogout();
            }}
          >
            <Text style={styles.logoutBtnText}>Logout from Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  // Header
  header: { backgroundColor: '#D32F2F', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  headerIconSpacer: { width: 20 },
  closeBtn: { padding: 4 },

  content: { padding: 20, width: '100%' },

  // Step 1 Styles
  warningBox: { backgroundColor: '#FDECEE', borderLeftWidth: 4, borderLeftColor: '#D32F2F', padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderRadius: 4 },
  warningText: { color: '#D32F2F', fontSize: 12, fontWeight: 'bold', marginLeft: 10, flex: 1, lineHeight: 18 },
  bodyText: { fontSize: 13, color: '#4A5568', lineHeight: 18, marginBottom: 10 },
  
  listContainer: { marginBottom: 20, paddingLeft: 5 },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D32F2F', marginRight: 10 },
  listText: { fontSize: 12, color: '#718096' },

  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxText: { marginLeft: 10, fontSize: 12, color: '#4A5568', fontWeight: '500' },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { color: '#718096', fontWeight: 'bold', fontSize: 14 },
  continueBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#D32F2F', alignItems: 'center' },
  continueBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  // Step 2 Styles
  instructionText: { fontSize: 13, color: '#4A5568', lineHeight: 20, marginBottom: 15 },
  boldRedText: { color: '#D32F2F', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 14, color: '#2D3748', marginBottom: 20 },
  logoutBtn: { backgroundColor: '#D32F2F', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  logoutBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  disabledBtn: { opacity: 0.5 },
});

export default CitizenoutModal;
