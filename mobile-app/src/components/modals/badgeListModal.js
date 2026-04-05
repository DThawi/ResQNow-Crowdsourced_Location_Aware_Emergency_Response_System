import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import BaseModal from './baseModal';

const BadgeListModal = ({ visible, onClose, onBadgePress }) => {
  const badges = [
    { id: 1, name: 'Hero Reporter', description: 'Exceptional dedication to community safety', requirement: 'Submit 10 verified reports', progress: 12, total: 10, icon: 'award' },
    { id: 2, name: 'Quick Responder', description: 'Arrive at the scene quickly', requirement: 'Respond within 5 mins to 5 incidents', progress: 10, total: 5, icon: 'bolt' },
    { id: 3, name: 'Persistent Reporter', description: 'Consistent community reporting', requirement: 'Report 10 valid incidents', progress: 10, total: 10, icon: 'fire' },
    { id: 4, name: 'Crowd Guardian', description: 'Protecting report integrity', requirement: 'Flag inaccurate or duplicate reports responsibly', progress: 4, total: 10, icon: 'shield-alt' },
  ];

  const earnedCount = badges.filter(b => b.progress >= b.total).length;

  return (
    <BaseModal visible={visible} onClose={onClose} showCloseIcon={false} cardStyle={{ padding: 0, width: '90%', maxHeight: '80%', backgroundColor: '#F8FAFC' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Badges</Text>
        <Text style={styles.headerSubtitle}>{earnedCount} of {badges.length} earned</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconBg}>
            <FontAwesome5 name="medal" size={14} color="#2ECC71" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.categoryTitle}>Reporter Badges</Text>
            <Text style={styles.categorySub}>For submitting incident reports</Text>
          </View>
          <Text style={styles.categoryFraction}>{earnedCount}/{badges.length}</Text>
        </View>

        <View style={styles.grid}>
          {badges.map((badge) => {
            const isEarned = badge.progress >= badge.total;
            const percentage = Math.min((badge.progress / badge.total) * 100, 100);

            return (
              <TouchableOpacity key={badge.id} style={[styles.badgeCard, isEarned ? styles.cardEarned : styles.cardLocked]} activeOpacity={0.8} onPress={() => onBadgePress(badge)}>
                <FontAwesome5 name={badge.icon} size={24} color={isEarned ? "white" : "#A0AEC0"} style={{ marginBottom: 10 }} />
                <Text style={[styles.badgeName, isEarned ? { color: 'white' } : { color: '#2D3748' }]}>{badge.name}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: isEarned ? 'white' : '#A0AEC0' }]} />
                </View>
                <Text style={[styles.badgeProgress, isEarned ? { color: 'white' } : { color: '#A0AEC0' }]}>{badge.progress}/{badge.total}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: '#2D3748', paddingTop: 20, paddingBottom: 15, paddingHorizontal: 20, borderTopWidth: 6, borderTopColor: '#D32F2F', width: '100%' },
  closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#A0AEC0', fontSize: 12, marginTop: 2 },
  body: { padding: 20, width: '100%' },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#2ECC71' },
  categoryIconBg: { backgroundColor: '#E8F5E9', padding: 8, borderRadius: 8 },
  categoryTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  categorySub: { fontSize: 10, color: '#A0AEC0' },
  categoryFraction: { fontSize: 12, fontWeight: 'bold', color: '#2ECC71' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeCard: { width: '48%', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardEarned: { backgroundColor: '#2ECC71' },
  cardLocked: { backgroundColor: 'white' },
  badgeName: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, height: 32 },
  barBg: { width: '100%', height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginBottom: 5 },
  barFill: { height: 4, borderRadius: 2 },
  badgeProgress: { fontSize: 10, fontWeight: 'bold' }
});

export default BadgeListModal;
