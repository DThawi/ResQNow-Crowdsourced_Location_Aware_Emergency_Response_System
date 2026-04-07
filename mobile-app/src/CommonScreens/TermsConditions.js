import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import BulletItem from "../components/symbols/bullets";
import GradientHeader from "../components/layout/header";

const TermsConditions = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">

      {/* Header */}
      <GradientHeader 
        title="Terms & Conditions" 
        onClose={() => navigation.goBack()} 
      />

      {/* Content */}
      <ScrollView className="p-4">

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-400 text-sm mb-2">
          By accessing and using ResQNow, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use immediately.
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          2. Use of Service
        </Text>

       <BulletItem
        containerClass="flex-row items-start mb-2 ml-5"
        bulletClass="mr-2 text-red-600 text-lg"
        textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Authorized Users Only:</Text> ResQNow is restricted to verified emergency responders including police, fire & rescue, ambulance services, NGOs, and authorized volunteers
        </BulletItem>

        <BulletItem
        containerClass="flex-row items-start mb-2 ml-5"
        bulletClass="mr-2 text-red-600 text-lg"
        textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Responsible Use:</Text> Users must utilize the platform responsibly and only for legitimate emergency coordination and response operations
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Professional Conduct:</Text> All interactions must maintain professional standards and comply with emergency service protocols
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">No Misuse:</Text> Prohibited activities include false reporting, unauthorized access, data manipulation, or any action that compromises system integrity
        </BulletItem>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          3. Account Responsibility
        </Text>

       <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Login Security:</Text> You are responsible for maintaining the confidentiality of your account credentials and all activities under your account
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Accurate Information:</Text> All profile information, credentials, and certifications must be current, complete, and truthful
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Verification Required:</Text> Users must maintain valid verification documentation and update credentials before expiration
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Account Sharing Prohibited:</Text> Individual accounts may not be shared, transferred, or accessed by unauthorized persons
        </BulletItem>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          4. System Availability & Maintenance
        </Text>

       <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Service Continuity:</Text> We strive to maintain 24/7 availability but cannot guarantee uninterrupted service at all times
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Scheduled Maintenance:</Text> Periodic maintenance windows may temporarily limit functionality. Users will be notified in advance when possible
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Emergency Procedures:</Text> Users should maintain backup communication channels and follow established emergency protocols
        </BulletItem>


        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          5. Limitation of Liability
        </Text>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Support Tool:</Text> ResQNow is a coordination and communication platform that supports emergency response but does not replace official emergency authorities or protocols
        </BulletItem>

         <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Professional Judgment:</Text> Responders must exercise independent professional judgment and follow established emergency response procedures
        </BulletItem>

         <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">No Warranty:</Text> The service is provided "as is" without warranties of any kind, express or implied
        </BulletItem>

         <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-red-600 text-lg"
          textClass="flex-1 text-base text-gray-800">
          <Text className="font-bold">Limitation:</Text> ResQNow shall not be liable for any indirect, incidental, or consequential damages arising from service use
        </BulletItem>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          6. Account Termination
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          ResQNow reserves the right to suspend or terminate accounts that violate these terms, provide false information, or engage in activities that compromise platform security or public safety. Users may deactivate their accounts at any time through account settings.
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          7. Changes to Terms
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          We may update these Terms & Conditions periodically. Users will be notified of material changes via email or in-app notification. Continued use after changes constitutes acceptance of updated terms.
        </Text>

        {/* Card */}
        <View className="bg-gray-200 p-4 rounded-xl mt-4">
          <Text className="font-bold text-black-800 mb-1 text-lg">
            Questions About Terms?
          </Text>
          <Text className="text-gray-700 text-sm mb-2">
            Contact our Leagal Team:
          </Text>

          <Text className="text-red-600 font-semibold">
            legal@resqnow.com
          </Text>
        </View>
        <Text className="text-center text-gray-400 text-xs mt-6">
          Last Updated: February 17, 2026
        </Text>

      </ScrollView>
    </View>
  );
};

export default TermsConditions;