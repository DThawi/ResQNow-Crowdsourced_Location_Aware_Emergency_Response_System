import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DangerZoneAlert = ({ totalZones, critical, high, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name="warning-outline" size={28} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Danger Zones Active</Text>
        <Text style={styles.subtitle}>
          {totalZones} active danger zones in your area. Tap for details and safety instructions.
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Critical: {critical}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>High: {high}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, 
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#D32F2F', 
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 9999,
  },
  iconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
    height: 45,
    justifyContent: 'center',
  },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4, lineHeight: 18 },
  badgeRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default DangerZoneAlert;
