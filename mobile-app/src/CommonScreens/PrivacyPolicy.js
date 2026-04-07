import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import BulletItem from "../components/symbols/bullets";
import GradientHeader from "../components/layout/header";


const PrivacyPolicy = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">

      {/* Header */}
      <GradientHeader title="Privacy Policy" type="close" />
      
      

      {/* Content */}
      <ScrollView className="p-4">

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          1. Information We Collect
        </Text>

       <BulletItem
        containerClass="flex-row items-start mb-2 ml-5"
        bulletClass="mr-2 text-red-600 text-lg"
        textClass="flex-1 text-base text-gray-800">
           <Text className="font-bold">Personal Information:</Text> Name, email, phone number, profile photo
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Location Data:</Text> Real-time GPS coordinates during active emergency response operations
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Professional Information:</Text> Organization details, credentials, certifications, and specialization
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Usage Analytics(Optional):</Text> App interaction patterns to improve service quality
        </BulletItem>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          2. How We Use Your Data
        </Text>

       <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Emergency Coordination:</Text> To dispatch and coordinate emergency responders efficiently
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Real-Time Communication:</Text> To send critical incident alerts and updates
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Performance Improvement:</Text> To analyze system performance and enhance response times
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Verification:</Text> To authenticate responder credentials and maintain platform security
        </BulletItem>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          3. Data Protection & Security
        </Text>

       <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Encryption:</Text> All data is encrypted both in transit (TLS/SSL) and at rest (AES-256)
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Access Control:</Text> Restricted access limited to authorized personnel only
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Data Retention:</Text> Personal data retained only as long as necessary for emergency operations
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Regular Audits:</Text> Security protocols reviewed and updated regularly
        </BulletItem>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          4. Your Rights
        </Text>

       <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Access Your Data:</Text> Request a copy of all personal information we hold
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Data Correction:</Text> Update or correct inaccurate information
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800" >
          <Text className="font-bold">Data Deletion:</Text> Request permanent deletion of your account and associated data
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Opt-Out:</Text> Disable optional analytics and non-critical data collection
        </BulletItem>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          5. Data Sharing
        </Text>

        <Text className="text-gray-700 text-sm mb-2">
          We do not sell or share your personal data with third parties for marketing purposes. Information may only be shared with authorized emergency response agencies and authorities when necessary for public safety operations.
        </Text>

        {/* Card */}
        <View className="bg-gray-200 p-4 rounded-xl mt-4">
          <Text className="font-bold text-black-800 mb-1 text-lg">
            Questions About Privacy?
          </Text>
          <Text className="text-gray-700 text-sm mb-2">
            Contact our Privacy Team:
          </Text>

          <Text className="text-red-600 font-semibold">
            privacy@resqnow.com
          </Text>
        </View>
        <Text className="text-center text-gray-400 text-xs mt-6">
          Last Updated: February 17, 2026
        </Text>

      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;