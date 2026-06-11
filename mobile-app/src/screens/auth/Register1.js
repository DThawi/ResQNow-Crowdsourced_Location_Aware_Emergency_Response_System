import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Header from '../../components/layout/header';
import { LinearGradient } from 'expo-linear-gradient';
// Reusing your existing vector icon sets to avoid extra dependencies
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function Register1({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select a role to continue');
      return;
    }
    navigation.navigate('Register2', { role: selectedRole });
  };

  return (
    <View style={styles.screen}>
      <Header title="Create Account" onClose={() => navigation.navigate('Login')} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Inner Card Base Container matching image_1c80a7.png */}
        <View style={styles.mainCard}>
          
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>Choose how you want to use ResQNow</Text>

          {/* ==================== CITIZEN ROLE SELECTION CARD ==================== */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => setSelectedRole('Citizen')}
          >
            <LinearGradient
              colors={['#261007', '#6D1307']}
              style={[
                styles.roleGradientCard,
                selectedRole === 'Citizen' ? styles.selectedCitizenBorder : styles.inactiveBorder,
                selectedRole && selectedRole !== 'Citizen' && styles.dimmedOpacity
              ]}
            >
              {/* Checkmark badge indicator */}
              {selectedRole === 'Citizen' && (
                <View style={[styles.checkBadge, { backgroundColor: '#E63946' }]}>
                  <Ionicons name="checkmark" color="white" size={12} fontWeight="900" />
                </View>
              )}
              
              <View style={[styles.iconCircle, { backgroundColor: '#E63946' }]}>
                <Ionicons name="people" color="white" size={30} />
              </View>
              <Text style={styles.roleTitle}>Citizen</Text>
              <Text style={styles.roleDescription}>
                Report emergencies and help your community
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ==================== RESPONDER ROLE SELECTION CARD ==================== */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => setSelectedRole('Authority')}
          >
            <LinearGradient
              colors={['#022334', '#001F33']}
              style={[
                styles.roleGradientCard,
                selectedRole === 'Authority' ? styles.selectedResponderBorder : styles.inactiveBorder,
                selectedRole && selectedRole !== 'Authority' && styles.dimmedOpacity
              ]}
            >
              {/* Checkmark badge indicator */}
              {selectedRole === 'Authority' && (
                <View style={[styles.checkBadge, { backgroundColor: '#0077B6' }]}>
                  <Ionicons name="checkmark" color="white" size={12} fontWeight="900" />
                </View>
              )}

              <View style={[styles.iconCircle, { backgroundColor: '#0077B6' }]}>
                <FontAwesome5 name="ambulance" color="white" size={24} />
              </View>
              <Text style={styles.roleTitle}>Responder</Text>
              <Text style={styles.roleDescription}>
                Respond to incidents and save lives
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hintText}>You can switch roles anytime from settings</Text>

          {/* ==================== CONTINUE ACTION BUTTON ==================== */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.continueBtn,
              !selectedRole && styles.disabledBtn
            ]}
            onPress={handleContinue}
          >
            <View style={styles.btnInnerLayout}>
              <Text style={styles.continueBtnText}>→   Continue</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  roleGradientCard: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: height * 0.23,
  },
  inactiveBorder: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCitizenBorder: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#6D1307',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  selectedResponderBorder: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#001F33',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  dimmedOpacity: {
    opacity: 0.45,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  roleDescription: {
    color: '#E2E8F0',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 18,
    fontWeight: '400',
    opacity: 0.85,
  },
  checkBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  hintText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  continueBtn: {
    backgroundColor: '#D62828',
    width: '100%',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D62828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnInnerLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
