import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const IncidentCard = ({ 
  type = "Emergency", 
  status = "New Report", 
  description, 
  location, 
  timeAgo, 
  verifications = 0, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* 1. Header: Icon, Title and Status Tag */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="alert-circle-outline" size={26} color="#D32F2F" />
          <Text style={styles.titleText}>{type}</Text>
        </View>
        <View style={styles.statusTag}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* 2. Body: Description Text */}
      <Text style={styles.descriptionText} numberOfLines={2}>
        {description}
      </Text>

      {/* 3. Metadata: Location and Timestamp */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={16} color="#94A3B8" />
          <Text style={styles.metaText}>{location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={16} color="#94A3B8" />
          <Text style={styles.metaText}>{timeAgo}</Text>
        </View>
      </View>

      {/* 4. Footer: Verification Counter */}
      <View style={styles.footer}>
        <Ionicons name="people-outline" size={20} color="#10B981" />
        <Text style={styles.verificationText}>{verifications} verifications</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    // Professional Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statusTag: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  verificationText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
});

export default IncidentCard;
