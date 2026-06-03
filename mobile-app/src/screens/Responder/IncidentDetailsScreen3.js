import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import GradientHeader from '../../components/layout/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';

export default function IncidentDetailsScreen({ route, navigation }) {
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const incident = route?.params?.incident || {};

    // Formatted Coordinates
    const coordinatesText = incident.location?.coordinates
        ? `Lng: ${incident.location.coordinates[0].toFixed(4)}, Lat: ${incident.location.coordinates[1].toFixed(4)}`
        : 'Southern Expressway - Kottawa Interchange';

    // Incident Title/Type
    const typeText = incident.type || 'Car Accident';

    // Description
    const descriptionText = incident.description || 'Multi-vehicle collision on highway, traffic blocked';

    // Time
    const timestampText = incident.timestamp
        ? `Reported ${new Date(incident.timestamp).toLocaleString()}`
        : 'Reported Dec 9, 3:15 PM';

    // Reporter
    const reporterText = incident.user_id?.name || (incident.user_id ? `Citizen ${String(incident.user_id).slice(-4)}` : 'Sahan Madawela');

    // Verifications
    const verifiedCount = incident.verified_by?.length !== undefined ? incident.verified_by.length : 15;

    // Flagged
    const flaggedCount = incident.reported_inaccurate_by?.length !== undefined ? incident.reported_inaccurate_by.length : 0;

    const handleSaveNotes = () => {
        Alert.alert("Success", "Notes saved successfully!");
    };

    const handleResolve = async () => {
        try {
            setIsSubmitting(true);
            const token = await AsyncStorage.getItem('token');
            if (incident._id) {
                await API.put(`/incidents/${incident._id}/status`, { status: 'Resolved' }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            navigation.navigate('ResponderIncidentDetails4', { incident: { ...incident, status: 'Resolved' } });
        } catch (error) {
            console.log('Error resolving incident:', error);
            Alert.alert("Notice", error.response?.data?.message || "Failed to update status on server. Navigating to resolved page.");
            navigation.navigate('ResponderIncidentDetails4', { incident: { ...incident, status: 'Resolved' } });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <View className="flex-1 bg-[#F7F7F7]">
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                <GradientHeader title="Incident Details" type="back" />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Top Banner */}
                    <View className="m-4 rounded-xl overflow-hidden shadow-sm">
                        <LinearGradient
                            colors={['#D62828', '#2B2D42']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="h-44 flex-row justify-between items-center px-6"
                        >
                            {/* Distance Card */}
                            <View className="bg-white rounded-2xl px-3 py-3 items-center justify-center shadow-md min-w-[70px]">
                                <Text className="text-[#003049] text-[11px] font-medium mb-1">Distance</Text>
                                <Text className="text-[#003049] text-[15px] font-bold">0.8 mi</Text>
                            </View>

                            {/* Center Icon */}
                            <Text style={{ fontSize: 50 }}>🚗</Text>

                            {/* ETA Card */}
                            <View className="bg-white rounded-2xl px-3 py-3 items-center justify-center shadow-md min-w-[70px]">
                                <Text className="text-[#003049] text-[11px] font-medium mb-1">ETA</Text>
                                <Text className="text-[#003049] text-[15px] font-bold">4 min</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Action Required Banner */}
                    <View className="mx-4 mb-5 bg-[#D62828] rounded-xl flex-row items-center p-4 shadow-sm">
                        <View className="bg-[#B91F1F] p-2.5 rounded-full mr-4">
                            <Feather name="check-circle" size={22} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-bold text-lg leading-tight mb-0.5">Action Required</Text>
                            <Text className="text-white/90 text-[13px]">Respond to this incident</Text>
                        </View>
                    </View>

                    {/* Details Card */}
                    <View className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-[#2B2D42] text-[22px] font-extrabold">{typeText}</Text>
                            <View className="border border-[#003049] rounded-full px-3 py-1">
                                <Text className="text-[#3498DB] text-xs font-semibold">
                                    {incident.status === 'Assigned' ? 'In Progress' : (incident.status || 'In Progress')}
                                </Text>
                            </View>
                        </View>

                        <Text className="text-[#8D99AE] text-[15px] mb-5 leading-6">
                            {descriptionText}
                        </Text>

                        {/* Info Rows */}
                        <View>
                            <View className="flex-row items-start mb-3.5">
                                <Feather name="map-pin" size={18} color="#8D99AE" className="mt-1" />
                                <View className="ml-3.5 flex-1">
                                    <Text className="text-[#8D99AE] text-[14px]">{coordinatesText}</Text>
                                    <Text className="text-[#8D99AE] text-[14px]">Sri Lanka, SL</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center mb-3.5">
                                <Feather name="clock" size={18} color="#8D99AE" />
                                <Text className="text-[#8D99AE] text-[14px] ml-3.5">{timestampText}</Text>
                            </View>

                            <View className="flex-row items-center mb-4">
                                <Feather name="user" size={18} color="#8D99AE" />
                                <Text className="text-[#8D99AE] text-[14px] ml-3.5">Reported by {reporterText}</Text>
                            </View>

                            <View className="flex-row items-center mb-2.5">
                                <Feather name="check-circle" size={18} color="#2ECC71" />
                                <Text className="text-[#2ECC71] text-[14px] font-semibold ml-3.5">{verifiedCount} community verifications</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Feather name="alert-circle" size={18} color="#F6AA1C" />
                                <Text className="text-[#F6AA1C] text-[14px] font-semibold ml-3.5">{flaggedCount} flagged</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="mx-4 mb-6">
                        <TouchableOpacity 
                            className="bg-[#2ECC71] py-3.5 rounded-xl items-center flex-row justify-center mb-3 shadow-md"
                            onPress={handleResolve}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                            ) : (
                                <Feather name="send" size={18} color="white" className="mr-1.5" />
                            )}
                            <Text className="text-white font-bold text-[15px]">Mark as Resolved</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-between">
                            <TouchableOpacity className="bg-white py-3.5 rounded-xl items-center flex-row justify-center border border-[#D62828] shadow-sm flex-1 mr-1.5">
                                <Feather name="phone-call" size={16} color="#D62828" />
                                <Text className="text-[#D62828] font-bold text-[14px] ml-2">Call Reporter</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="bg-white py-3.5 rounded-xl items-center flex-row justify-center border border-[#D62828] shadow-sm flex-1 ml-1.5">
                                <Feather name="send" size={16} color="#D62828" />
                                <Text className="text-[#D62828] font-bold text-[14px] ml-2">Navigate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Responder Notes */}
                    <View className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm">
                        <Text className="text-[#2B2D42] text-[16px] font-bold mb-4">Responder Notes</Text>
                        <TextInput
                            className="border border-[#EBEBEB] rounded-xl p-4 h-32 text-[#2B2D42] text-[14px] bg-white"
                            placeholder="Add notes about this incident..."
                            placeholderTextColor="#8D99AE"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                        <View className="items-center mt-4">
                            <TouchableOpacity className="border border-[#D62828] px-8 py-2 rounded-xl" onPress={handleSaveNotes}>
                                <Text className="text-[#D62828] font-semibold text-[14px]">Save Notes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View className="mx-4 bg-white rounded-2xl p-5 shadow-sm mb-4">
                        <Text className="text-[#2B2D42] text-[16px] font-bold mb-5">Contact Information</Text>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-[#8D99AE] text-[15px] font-medium">Reporter</Text>
                            <TouchableOpacity className="flex-row items-center border border-[#D62828] px-4 py-2 rounded-xl">
                                <Feather name="phone-call" size={14} color="#D62828" />
                                <Text className="text-[#D62828] font-bold ml-2 text-[13px]">Call</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-[#8D99AE] text-[15px] font-medium">Dispatch</Text>
                            <TouchableOpacity className="flex-row items-center border border-[#D62828] px-4 py-2 rounded-xl">
                                <Feather name="phone-call" size={14} color="#D62828" />
                                <Text className="text-[#D62828] font-bold ml-2 text-[13px]">Call</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
