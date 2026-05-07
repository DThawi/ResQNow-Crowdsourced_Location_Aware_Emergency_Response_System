import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientHeader from "../../components/layout/header";
import API from "../../services/api";

const EditProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // 1. LOAD EXISTING DATA FROM DATABASE
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = res.data;

      // Setting existing data into the form fields
      setForm({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.contact_number || "",
        address: user.address || "",
      });

      if (user.image) {
        setImage(user.image);
      }
    } catch (error) {
      console.log("Fetch Profile Error:", error);
      Alert.alert("Error", "Could not load existing profile data.");
    } finally {
      setLoading(false);
    }
  };

  // 2. CAMERA / GALLERY ACCESS
  const handleImagePick = async () => {
    Alert.alert(
      "Profile Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return;
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
            if (!result.canceled) uploadImage(result.assets[0].uri);
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;
            let result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
            if (!result.canceled) uploadImage(result.assets[0].uri);
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const uploadImage = async (uri) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      const res = await API.post("/upload/upload", formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      setImage(res.data.imageUrl);
    } catch (error) {
      Alert.alert("Upload Error", "Failed to upload photo to server.");
    } finally {
      setSaving(false);
    }
  };

  // 3. SAVE UPDATED DATA TO DATABASE
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      const updateData = {
        name: form.fullName,
        contact_number: form.phone,
        address: form.address,
        image: image
      };

      await API.put("/auth/profile-update", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage so Profile Screen updates immediately
      await AsyncStorage.setItem('userName', form.fullName);

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#D62828" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <GradientHeader title="Edit Profile" type="back" />

      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View className="items-center mt-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
              <Image 
                source={{ uri: image || "https://i.pravatar.cc/150?img=12" }} 
                className="w-full h-full" 
              />
            </View>
            <TouchableOpacity 
              onPress={handleImagePick}
              className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full border-2 border-white"
            >
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-400 mt-2 text-xs">Tap to change photo</Text>
        </View>

        {/* Input Fields showing EXISTING data */}
        <View className="mt-10">
          
          <Text className="text-[#2B2D42] font-bold mb-2 ml-1">Full Name</Text>
          <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 mb-5 bg-white">
            <Ionicons name="person-outline" size={18} color="#8D99AE" />
            <TextInput
              value={form.fullName}
              onChangeText={(t) => setForm({ ...form, fullName: t })}
              className="ml-3 flex-1 text-[#2B2D42] text-sm"
            />
          </View>

          <Text className="text-[#2B2D42] font-bold mb-2 ml-1">Email Address</Text>
          <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 mb-5 bg-slate-50">
            <Ionicons name="mail-outline" size={18} color="#CBD5E1" />
            <TextInput
              value={form.email}
              editable={false} // Email is usually locked
              className="ml-3 flex-1 text-gray-400 text-sm"
            />
          </View>

          <Text className="text-[#2B2D42] font-bold mb-2 ml-1">Phone Number</Text>
          <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 mb-5 bg-white">
            <Ionicons name="call-outline" size={18} color="#8D99AE" />
            <TextInput
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(t) => setForm({ ...form, phone: t })}
              className="ml-3 flex-1 text-[#2B2D42] text-sm"
            />
          </View>

          <Text className="text-[#2B2D42] font-bold mb-2 ml-1">Address</Text>
          <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 mb-5 bg-white">
            <Ionicons name="location-outline" size={18} color="#8D99AE" />
            <TextInput
              value={form.address}
              onChangeText={(t) => setForm({ ...form, address: t })}
              className="ml-3 flex-1 text-[#2B2D42] text-sm"
            />
          </View>

        </View>

        {/* Action Buttons */}
        <View className="mt-8 mb-12">
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={saving}
            className="bg-[#D62828] py-4 rounded-2xl items-center shadow-md"
          >
            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Save Changes</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 py-2 items-center">
            <Text className="text-red-500 font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
