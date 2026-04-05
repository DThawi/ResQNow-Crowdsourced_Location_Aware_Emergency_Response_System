import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BaseModal from './baseModal'; 

const LogoutModal = ({ visible, onClose, onLogout, accountType = "responder" }) => {
  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false}>
      
      {}
      <View style={styles.container}>
        
        {}
        <View style={styles.iconCircle}>
          {}
          <Feather name="log-out" size={32} color="#D32F2F" />
        </View>

        {}
        <Text style={styles.messageText}>
          Are you sure you want to log out of{'\n'}your {accountType} account?
        </Text>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              onClose();
              if (onLogout) onLogout();
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center', 
  },
  iconCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#FDECEE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  messageText: { 
    fontSize: 16, 
    color: '#4A5568', 
    textAlign: 'center', 
    lineHeight: 24, 
    marginBottom: 30,
    width: '100%' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    gap: 15 
  },
  cancelButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: { 
    color: '#4A5568', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  logoutButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 14, 
    backgroundColor: '#D32F2F', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default LogoutModal;
