import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

// Status badge colors
const STATUS_COLORS = {
  'New Report': '#D32F2F',      // Red
  'Pending': '#F59E0B',         // Amber
  'Verified': '#2563EB',        // Blue
  'Assigned': '#8B5CF6',        // Purple
  'En Route': '#06B6D4',        // Cyan
  'In Progress': '#F97316',     // Orange
  'Resolved': '#16A34A',        // Green
  'Rejected': '#6B7280',        // Gray
};

// Function to return badge color
const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#64748B';
};

const IncidentCard = ({
  type = 'Emergency',
  status = 'New Report',
  description,
  location,
  timeAgo,
  verifications = 0,
  reports = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-[20px] p-5 mb-4 border border-slate-100"
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            color="#D32F2F"
          />
          <Text style={styles.titleText}>{type}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.descriptionText} numberOfLines={2}>
        {description}
      </Text>

      {/* Location & Time */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather
            name="map-pin"
            size={14}
            color="#94A3B8"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText} numberOfLines={2}>
            {location}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Feather
            name="clock"
            size={14}
            color="#94A3B8"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>{timeAgo}</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between gap-2 pt-[15px] border-t border-slate-100">
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={20} color="#10B981" />
          <Text className="text-[15px] text-slate-800 font-medium ml-1">
            {verifications} verifications
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#D10000" />
          <Text className="text-[15px] text-slate-800 font-medium ml-1">
            {reports} rejections
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },

  infoRow: {
    marginBottom: 14,
    gap: 8,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 4,
  },

  infoIcon: {
    marginRight: 7,
    marginTop: 2,
  },

  infoText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },

  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },

  verificationText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
});

export default IncidentCard;

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

// const IncidentCard = ({
//   type = "Emergency",
//   status = "New Report",
//   description,
//   location,
//   timeAgo,
//   verifications = 0,
//   reports = 0,
//   onPress
// }) => {
//   return (
//     <TouchableOpacity
//       className="bg-white rounded-[20px] p-5 mb-4 border border-slate-100"
//       onPress={onPress}
//       activeOpacity={0.7}
//       style={{
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.05,
//         shadowRadius: 12,
//         elevation: 4,
//       }}
//     >
//       {/* Header Row: Icon, Title, and Status Badge */}
//       <View style={styles.headerRow}>
//         <View style={styles.titleContainer}>
//           <MaterialCommunityIcons name="alert-outline" size={24} color="#D32F2F" />
//           <Text style={styles.titleText}>{type}</Text>
//         </View>
//         <View style={styles.statusBadge}>
//           <Text style={styles.statusText}>{status}</Text>
//         </View>
//       </View>

//       {/* Description Content */}
//       <Text style={styles.descriptionText} numberOfLines={2}>
//         {description}
//       </Text>

//       {/* Location and date/time use their own rows so long addresses stay aligned. */}
//       <View style={styles.infoRow}>
//         <View style={styles.infoItem}>
//           <Feather name="map-pin" size={14} color="#94A3B8" style={styles.infoIcon} />
//           <Text style={styles.infoText} numberOfLines={2}>{location}</Text>
//         </View>
//         <View style={styles.infoItem}>
//           <Feather name="clock" size={14} color="#94A3B8" style={styles.infoIcon} />
//           <Text style={styles.infoText}>{timeAgo}</Text>
//         </View>
//       </View>

//       {/* 4. Footer: Verification Counter */}
//       <View className="flex-row justify-between gap-2 pt-[15px] border-t border-slate-100">
//         <View className='flex-row items-center'>
//           <Ionicons name="people-outline" size={20} color="#10B981" />
//           <Text className="text-[15px] text-slate-800 font-medium">{verifications} verifications</Text>
//         </View>
//         <View className="flex-row items-center ">
//           <Ionicons name="alert-circle" size={20} color="#D10000" />
//           <Text className="text-[15px] text-slate-800 font-medium">{reports} rejections</Text>
//         </View>
//       </View>

//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 4,
//     // Shadow for iOS
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     // Elevation for Android
//     elevation: 3,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   titleText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E293B',
//   },
//   statusBadge: {
//     backgroundColor: '#D32F2F',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   statusText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   descriptionText: {
//     fontSize: 14,
//     color: '#64748B',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   infoRow: {
//     marginBottom: 14,
//     gap: 8,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     paddingRight: 4,
//   },
//   infoIcon: {
//     marginRight: 7,
//     marginTop: 2,
//   },
//   infoText: {
//     flex: 1,
//     flexShrink: 1,
//     fontSize: 13,
//     color: '#94A3B8',
//     lineHeight: 18,
//   },
//   verificationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//     paddingTop: 12,
//   },
//   verificationText: {
//     fontSize: 14,
//     color: '#1E293B',
//     fontWeight: '500',
//   },
// });

// export default IncidentCard;
