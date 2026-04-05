import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


const BaseModal = ({ visible, onClose, children, showCloseIcon = true, cardStyle }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            {}
            <View style={[styles.card, cardStyle]}> 
              
              {showCloseIcon && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <AntDesign name="close" size={20} color="#A0AEC0" />
                </TouchableOpacity>
              )}

              {children}

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '85%', backgroundColor: 'white', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15, elevation: 8, position: 'relative' },
  closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 4 },
});

export default BaseModal;
