import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import GradientHeader from '../../components/layout/header';
import API from '../../services/api';

const INCIDENT_TYPES = [
  { id: 'Fire', label: 'Fire', icon: 'flame-outline' },
  { id: 'Medical', label: 'Medical', icon: 'heart-outline' },
  { id: 'Accident', label: 'Accident', icon: 'car-sport-outline' },
  { id: 'Crime', label: 'Crime', icon: 'warning-outline' },
  { id: 'Disaster', label: 'Disaster', icon: 'business-outline' }
];
const URGENCY_LEVELS = ['Low', 'Moderate', 'High', 'Critical'];

export default function ReportIncident() {
  const navigation = useNavigation();
  const [incidentType, setIncidentType] = useState('Fire'); // Defaulting one just to show selected state, or we can leave it null
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting', 'success', 'denied', 'error'
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [urgency, setUrgency] = useState('High');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectLocation = async () => {
    try {
      setIsDetectingLocation(true);
      setLocationStatus('detecting');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('denied');
        Alert.alert(
          'Location Permission Denied',
          'Please grant location permissions in your settings, or enter the location manually.'
        );
        setIsDetectingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const currentCoords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setCoords(currentCoords);

      // Perform reverse geocoding to get a readable address
      const geocode = await Location.reverseGeocodeAsync(currentCoords);
      if (geocode.length > 0) {
        const addr = geocode[0];
        const formattedAddress = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.country,
        ]
          .filter(Boolean)
          .join(', ');
        setLocation(formattedAddress);
        setDetectedAddress(formattedAddress);
      } else {
        const fallbackAddress = `Lat: ${currentCoords.latitude.toFixed(4)}, Lng: ${currentCoords.longitude.toFixed(4)}`;
        setLocation(fallbackAddress);
        setDetectedAddress(fallbackAddress);
      }
      setLocationStatus('success');
    } catch (error) {
      console.error('Error detecting location:', error);
      setLocationStatus('error');
      Alert.alert(
        'Location Detection Error',
        'Could not detect your current location automatically. Please type the location manually.'
      );
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const handleImagePick = async () => {
    Alert.alert(
      "Incident Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Please grant camera access to take a photo.');
              return;
            }
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Please grant media library access to pick a photo.');
              return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      
      let lat = coords?.latitude;
      let lng = coords?.longitude;

      // If user manually changed or typed the address, geocode it
      if (location && location !== detectedAddress) {
        try {
          const geocoded = await Location.geocodeAsync(location);
          if (geocoded.length > 0) {
            lat = geocoded[0].latitude;
            lng = geocoded[0].longitude;
          } else {
            Alert.alert(
              'Invalid Location',
              'Could not resolve the entered address to coordinates. Please enter a valid address or use your current GPS location.'
            );
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          Alert.alert(
            'Geocoding Error',
            'Failed to resolve the location address. Please check your internet connection or enter a valid address.'
          );
          setIsSubmitting(false);
          return;
        }
      }

      if (!lat || !lng) {
        Alert.alert(
          'Location Required',
          'A valid location is required to submit a report. Please wait for GPS detection or type a valid address.'
        );
        setIsSubmitting(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('type', incidentType);
      formData.append('description', description || 'No description provided');
      formData.append('longitude', lng.toString()); 
      formData.append('latitude', lat.toString());
      formData.append('severity', urgency);

      if (image) {
        formData.append('image', {
          uri: image,
          name: 'incident.jpg',
          type: 'image/jpeg',
        });
      }

      console.log('Sending formData...', formData);

      const response = await API.post('/incidents', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      Alert.alert('Success', 'Report submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error("API Error details:", error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <GradientHeader title="Report Incident" type="back" />

      <ScrollView className="flex-1 px-5 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* Incident Type */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Incident Type *</Text>
          <View className="flex-row flex-wrap justify-start" style={{ gap: 12 }}>
            {INCIDENT_TYPES.map((type) => {
              const isSelected = incidentType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setIncidentType(type.id)}
                  style={{ width: '30%', aspectRatio: 1 }}
                  className={`rounded-2xl justify-center items-center border ${
                    isSelected ? 'border-[#003049] bg-[#003049]/5' : 'border-[#E5E5E5] bg-white'
                  }`}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={28} 
                    color={isSelected ? '#003049' : '#8D99AE'} 
                  />
                  <Text className={`text-xs mt-2 ${isSelected ? 'text-[#003049] font-bold' : 'text-[#8D99AE]'}`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Location *</Text>
          <View className="flex-row items-center mb-2">
            <View className="flex-1 border border-[#E5E5E5] rounded-xl px-4 py-3 bg-white">
              <TextInput
                placeholder={isDetectingLocation ? "Detecting location..." : "Enter location address..."}
                placeholderTextColor="#8D99AE"
                value={location}
                onChangeText={setLocation}
                className="text-[#2B2D42] text-sm p-0 m-0"
              />
            </View>
            <TouchableOpacity 
              onPress={detectLocation}
              disabled={isDetectingLocation}
              className={`bg-[#003049] rounded-xl w-12 h-12 justify-center items-center ml-3 ${isDetectingLocation ? 'opacity-70' : ''}`}
            >
              {isDetectingLocation ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="locate-outline" size={22} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            {locationStatus === 'detecting' && (
              <>
                <Ionicons name="time-outline" size={14} color="#FFA000" />
                <Text className="text-[#FFA000] text-xs ml-1">Detecting GPS location...</Text>
              </>
            )}
            {locationStatus === 'success' && (
              <>
                <Ionicons name="checkmark-circle-outline" size={14} color="#2ECC71" />
                <Text className="text-[#2ECC71] text-xs ml-1">GPS location detected</Text>
              </>
            )}
            {locationStatus === 'denied' && (
              <>
                <Ionicons name="close-circle-outline" size={14} color="#D62828" />
                <Text className="text-[#D62828] text-xs ml-1">Location permission denied - enter manually</Text>
              </>
            )}
            {locationStatus === 'error' && (
              <>
                <Ionicons name="alert-circle-outline" size={14} color="#D62828" />
                <Text className="text-[#D62828] text-xs ml-1">GPS location failed - enter manually</Text>
              </>
            )}
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Description</Text>
          <View className="border border-[#E5E5E5] rounded-xl p-4 bg-white min-h-[120px]">
            <TextInput
              placeholder="Provide details about the incident..."
              placeholderTextColor="#8D99AE"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              className="text-[#2B2D42] text-sm p-0 flex-1"
            />
          </View>
        </View>

        {/* Photos */}
        <View className="mb-6">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Photos (Optional)</Text>
          {image ? (
            <View className="relative border border-[#E5E5E5] rounded-xl overflow-hidden h-44 bg-slate-100">
              <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
              >
                <Ionicons name="close-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleImagePick}
              className="border border-[#E5E5E5] rounded-xl h-28 justify-center items-center bg-white" 
              style={{ borderStyle: 'solid' }}
            >
              <Ionicons name="camera-outline" size={32} color="#8D99AE" />
              <Text className="text-[#8D99AE] text-sm mt-2">Tap to add photos</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Urgency Level */}
        <View className="mb-8">
          <Text className="text-[#2B2D42] font-bold text-base mb-3">Urgency Level *</Text>
          <View className="flex-row justify-between" style={{ gap: 12 }}>
            {URGENCY_LEVELS.map((level) => {
              const isSelected = urgency === level;
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setUrgency(level)}
                  className={`flex-1 py-3.5 rounded-xl border items-center justify-center ${
                    isSelected 
                      ? 'bg-[#D62828] border-[#D62828]' 
                      : 'bg-white border-[#E5E5E5]'
                  }`}
                >
                  <Text className={`font-bold ${isSelected ? 'text-white' : 'text-[#8D99AE]'}`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity 
          className={`bg-[#D62828] rounded-xl py-4 items-center justify-center mb-3 ${isSubmitting ? 'opacity-70' : ''}`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text className="text-white text-base font-bold">{isSubmitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>
        <Text className="text-[#8D99AE] text-xs text-center mb-10">
          Your report will be verified by the community
        </Text>

      </ScrollView>
    </View>
  );
}
