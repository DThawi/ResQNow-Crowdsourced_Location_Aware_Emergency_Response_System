import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import BaseModal from './baseModal';

const BadgeDetailModal = ({ 
  visible, onClose, badgeName = "Loading...", description = "Please wait...", 
  requirement = "", progress = 0, total = 1, iconName = "award" 
}) => {
  const safeTotal = total > 0 ? total : 1; 
  const isUnlocked = progress >= safeTotal;
  const percentage = Math.min((progress / safeTotal) * 100, 100);

  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false} cardStyle={{ padding: 0 }}>
      {/* HEADER */}
      <View style={[styles.header, isUnlocked ? styles.headerUnlocked : styles.headerLocked]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color={isUnlocked ? "white" : "#333"} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, isUnlocked ? styles.circleUnlocked : styles.circleLocked]}>
            <FontAwesome5 name={iconName} size={35} color={isUnlocked ? "white" : "#A0AEC0"} />
          </View>
          {isUnlocked && (
            <>
              <AntDesign name="staro" size={16} color="#F59E0B" style={[styles.star, { top: -10, left: -30 }]} />
              <AntDesign name="staro" size={24} color="#F59E0B" style={[styles.star, { top: -20, right: -40 }]} />
              <AntDesign name="staro" size={14} color="#F59E0B" style={[styles.star, { bottom: 10, left: -40 }]} />
            </>
          )}
        </View>

        <Text style={[styles.title, isUnlocked ? { color: 'white' } : { color: '#2D3748' }]}>
          {badgeName} {isUnlocked && <Text style={{fontSize: 14}}>✨</Text>}
        </Text>
        <Text style={[styles.description, isUnlocked ? { color: 'rgba(255,255,255,0.9)' } : { color: '#A0AEC0' }]}>
          {description}
        </Text>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <Text style={styles.reqLabel}>Requirement</Text>
        <Text style={styles.reqText}>{requirement}</Text>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={[styles.progressCount, isUnlocked ? { color: '#2ECC71' } : { color: '#2D3748' }]}>
            {progress}/{total}
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: isUnlocked ? '#2ECC71' : '#2D3748' }]} />
        </View>

        {isUnlocked ? (
          <Text style={styles.earnedText}>✓ Badge earned!</Text>
        ) : (
          <Text style={styles.moreToUnlockText}>{total - progress} more to unlock</Text>
        )}

        <View style={[styles.statusButton, isUnlocked ? styles.statusBtnUnlocked : styles.statusBtnLocked]}>
          <Text style={[styles.statusButtonText, isUnlocked ? { color: '#059669' } : { color: '#718096' }]}>
            {isUnlocked ? "🎉 Unlocked!" : "🔒 Locked"}
          </Text>
        </View>

        {isUnlocked && (
          <>
            <Text style={styles.shareTitle}>Share Badge</Text>
            <View style={styles.shareRow}>
              {/* Twitter */}
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#E1F0FA' }]}>
                <AntDesign name="twitter" size={24} color="#1DA1F2" />
                <Text style={[styles.shareBtnText, { color: '#1DA1F2' }]}>Twitter</Text>
              </TouchableOpacity>
              
              {/* Facebook */}
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#E7F0FF' }]}>
                <FontAwesome5 name="facebook" size={24} color="#1877F2" />
                <Text style={[styles.shareBtnText, { color: '#1877F2' }]}>Facebook</Text>
              </TouchableOpacity>
              
              {/* WhatsApp */}
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
                <Text style={[styles.shareBtnText, { color: '#25D366' }]}>WhatsApp</Text>
              </TouchableOpacity>
              
              {/* Copy */}
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#F1F5F9' }]}>
                <Feather name="copy" size={24} color="#64748B" />
                <Text style={[styles.shareBtnText, { color: '#64748B' }]}>Copy</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.actionBtnOutline} onPress={onClose}>
          <Text style={styles.actionBtnTextOutline}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={onClose}>
          <Text style={styles.actionBtnTextOutline}>Close</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 25, paddingHorizontal: 20, position: 'relative', width: '100%' },
  headerUnlocked: { backgroundColor: '#2ECC71' },
  headerLocked: { backgroundColor: '#F8FAFC' },
  closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  iconContainer: { position: 'relative', marginBottom: 15 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  circleUnlocked: { backgroundColor: 'rgba(255,255,255,0.3)' },
  circleLocked: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  star: { position: 'absolute', opacity: 0.8 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 12, textAlign: 'center' },
  body: { padding: 20, width: '100%' },
  reqLabel: { fontSize: 11, color: '#A0AEC0', marginBottom: 2 },
  reqText: { fontSize: 14, color: '#2D3748', fontWeight: '500', marginBottom: 15 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  progressLabel: { fontSize: 12, color: '#A0AEC0' },
  progressCount: { fontSize: 12, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: 5 },
  progressBarFill: { height: 6, borderRadius: 3 },
  earnedText: { fontSize: 11, color: '#A0AEC0', marginBottom: 15 },
  moreToUnlockText: { fontSize: 11, color: '#A0AEC0', marginBottom: 15 },
  statusButton: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  statusBtnUnlocked: { backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#A7F3D0' },
  statusBtnLocked: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  statusButtonText: { fontWeight: 'bold', fontSize: 14 },
  shareTitle: { textAlign: 'center', fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  shareBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, flex: 1, marginHorizontal: 4 },
  shareBtnText: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  actionBtnOutline: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  actionBtnTextOutline: { color: '#64748B', fontWeight: 'bold' },
});

export default BadgeDetailModal;
