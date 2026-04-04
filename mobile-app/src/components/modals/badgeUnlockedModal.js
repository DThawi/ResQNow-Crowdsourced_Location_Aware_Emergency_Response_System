import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import BaseModal from './baseModal';

const BadgeUnlockedModal = ({ visible, badgeName, description, progress, total, onClose }) => {
  const percentage = Math.min((progress / total) * 100, 100);

  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false} cardStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Feather name="award" size={40} color="white" />
        </View>
        <Text style={styles.badgeName}>{badgeName}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Requirement: Submit {total} verified reports</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressCount}>{progress}/{total}</Text>
      </View>

      <View style={styles.unlockedBadge}>
        <Text style={styles.unlockedText}>🎉 Unlocked!</Text>
      </View>

      <Text style={styles.shareText}>Share Badge</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#E1F0FA' }]}>
            <AntDesign name="twitter" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#E7F0FF' }]}>
            <FontAwesome5 name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#F1F5F9' }]}>
            <Feather name="copy" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: '#4CAF50', padding: 30, alignItems: 'center', width: '100%' },
  iconWrapper: { marginBottom: 10 },
  badgeName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  description: { color: 'white', fontSize: 12, opacity: 0.9, marginTop: 5 },
  progressContainer: { padding: 20, width: '100%' },
  progressLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#4CAF50', borderRadius: 3 },
  progressCount: { textAlign: 'right', fontSize: 12, fontWeight: 'bold', color: '#4CAF50', marginTop: 4 },
  unlockedBadge: { backgroundColor: '#E8F5E9', alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8, alignItems: 'center', width: '90%' },
  unlockedText: { color: '#4CAF50', fontWeight: 'bold' },
  shareText: { textAlign: 'center', marginTop: 20, fontWeight: 'bold', color: '#333' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 15, paddingHorizontal: 20 },
  socialBtn: { padding: 12, borderRadius: 12, alignItems: 'center', flex: 1 },
  closeBtn: { borderTopWidth: 1, borderColor: '#EEE', padding: 15, alignItems: 'center', width: '100%' },
  closeBtnText: { color: '#999', fontWeight: 'bold' },
});

export default BadgeUnlockedModal;
