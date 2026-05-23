import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';

const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

const AVAILABILITY_OPTIONS = ['Full Time', 'Part Time', 'On Call', 'Weekends Only'];
const WORK_SCHEDULE = ['Available on Weekdays', 'Available on Weekends'];
const VEHICLES = ['4×4', 'Boat', 'Bike', 'Ambulance', 'Truck'];
const EQUIPMENT = ['First Aid Kit', 'Rope', 'Rain Gear', 'Life Jackets', 'Flashlight', 'Radio'];
const LANGUAGES = ['English', 'Sinhala', 'Tamil'];

const ChipGroup = ({ items, selected, onToggle, single = false }) => (
  <View style={styles.chipGrid}>
    {items.map((item) => {
      const isSelected = single ? selected === item : selected.includes(item);
      return (
        <TouchableOpacity
          key={item}
          style={[styles.chip, isSelected && styles.chipSelected]}
          onPress={() => onToggle(item)}
        >
          <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default function Register5({ navigation, route }) {
  const params = route?.params || {};

  const [district, setDistrict] = useState('');
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [divisionalSecretariat, setDivisionalSecretariat] = useState('');
  const [responseArea, setResponseArea] = useState('');
  const [availability, setAvailability] = useState('');
  const [workSchedule, setWorkSchedule] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [languages, setLanguages] = useState([]);

  const toggleMulti = (setter, current, item) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleContinue = () => {
    if (!district || !divisionalSecretariat || !availability || languages.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    navigation.navigate('Register6', {
      ...params,
      district,
      divisionalSecretariat,
      responseArea,
      availability,
      workSchedule,
      vehicles,
      equipment,
      languages,
    });
  };

  return (
    <View style={styles.screen}>
      <GradientHeader title="Create Account" onClose={() => navigation.navigate('Register1')} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Step indicator */}
        <View style={styles.stepWrap}>
          <View style={styles.stepRow}>
            <Text style={styles.stepText}>Step 5 of 6</Text>
            <Text style={styles.stepLabel}>Location</Text>
          </View>
          <View style={styles.stepBar}>
            <View style={[styles.stepFill, { width: '83%' }]} />
          </View>
        </View>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="location-outline" size={32} color="#22c55e" />
        </View>

        <Text style={styles.title}>Location & Availability</Text>
        <Text style={styles.subtitle}>Define your working areas and schedule</Text>

        {/* District Dropdown */}
        <Text style={styles.label}>District <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setDistrictModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="map-outline" size={18} color="#aaaaaa" />
          </View>
          <Text style={[styles.textInput, { color: district ? '#000000' : '#aaaaaa' }]}>
            {district || 'Select Your District'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#aaaaaa" />
        </TouchableOpacity>

        {/* District Modal */}
        <Modal
          visible={districtModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDistrictModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDistrictModalVisible(false)}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select District</Text>
              <FlatList
                data={DISTRICTS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      district === item && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setDistrict(item);
                      setDistrictModalVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      district === item && styles.modalItemTextSelected,
                    ]}>
                      {item}
                    </Text>
                    {district === item && (
                      <Ionicons name="checkmark" size={18} color="#D62828" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Divisional Secretariat */}
        <Text style={styles.label}>Divisional Secretariat <Text style={styles.required}>*</Text></Text>
        <View style={styles.inputBox}>
          <View style={styles.iconWrap}>
            <Ionicons name="location-outline" size={18} color="#aaaaaa" />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Colombo Central"
            placeholderTextColor="#aaaaaa"
            onChangeText={setDivisionalSecretariat}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Typical Response Area */}
        <Text style={styles.label}>Typical Response Area</Text>
        <View style={styles.inputBox}>
          <View style={styles.iconWrap}>
            <Ionicons name="locate-outline" size={18} color="#aaaaaa" />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Colombo District & surrounding areas"
            placeholderTextColor="#aaaaaa"
            onChangeText={setResponseArea}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Availability */}
        <Text style={styles.label}>Availability <Text style={styles.required}>*</Text></Text>
        <ChipGroup
          items={AVAILABILITY_OPTIONS}
          selected={availability}
          onToggle={(item) => setAvailability(item)}
          single
        />

        {/* Work Schedule */}
        <Text style={styles.label}>Work Schedule <Text style={styles.required}>*</Text></Text>
        {WORK_SCHEDULE.map((item) => {
          const checked = workSchedule.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleMulti(setWorkSchedule, workSchedule, item)}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Ionicons name="checkmark" size={12} color="#ffffff" />}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Vehicle Ownership */}
        <Text style={styles.label}>
          Vehicle Ownership <Text style={styles.optional}>(Optional)</Text>
        </Text>
        <ChipGroup
          items={VEHICLES}
          selected={vehicles}
          onToggle={(item) => toggleMulti(setVehicles, vehicles, item)}
        />

        {/* Equipment Carried */}
        <Text style={styles.label}>
          Equipment Carried <Text style={styles.optional}>(Optional)</Text>
        </Text>
        <ChipGroup
          items={EQUIPMENT}
          selected={equipment}
          onToggle={(item) => toggleMulti(setEquipment, equipment, item)}
        />

        {/* Languages Spoken */}
        <Text style={styles.label}>Languages Spoken <Text style={styles.required}>*</Text></Text>
        <ChipGroup
          items={LANGUAGES}
          selected={languages}
          onToggle={(item) => toggleMulti(setLanguages, languages, item)}
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#D62828" style={{ marginRight: 4 }} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  stepWrap: {
    width: '100%',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  stepLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  stepBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 99,
  },
  stepFill: {
    height: 4,
    backgroundColor: '#D62828',
    borderRadius: 99,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0FFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 6,
  },
  required: {
    color: '#D62828',
  },
  optional: {
    color: '#9ca3af',
    fontWeight: 'normal',
    fontSize: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    width: '100%',
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 4,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  iconWrap: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    borderColor: '#D62828',
    backgroundColor: '#FFF0F0',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#D62828',
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#D62828',
    borderColor: '#D62828',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 99,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemSelected: {
    backgroundColor: '#FFF0F0',
  },
  modalItemText: {
    fontSize: 14,
    color: '#374151',
  },
  modalItemTextSelected: {
    color: '#D62828',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 48,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  backBtnText: {
    color: '#D62828',
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueBtn: {
    flex: 2,
    height: 48,
    borderRadius: 99,
    backgroundColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  signinText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  signinLink: {
    fontSize: 14,
    color: '#D62828',
    fontWeight: 'bold',
  },
});