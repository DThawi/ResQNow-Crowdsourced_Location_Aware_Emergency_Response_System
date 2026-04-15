import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import GradientHeader from "../../components/layout/header";


const PrivacyPolicy_Citizen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">

      {/* Header */}
      <GradientHeader title="Privacy Policy" type="close" />
      
      

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4">

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          1. Information We Collect
        </Text>
        <Text className="text-gray-700 text-md  mb-2">
          We collect the following information: Personal Information (name, email, phone number), Location data (address, GPS coordinates), Identity verification (NIC number), Incident reports and photos, Device and usage information
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          2. How We Use Your Information
        </Text>
        <Text className="text-gray-700 text-md mb-2">
          Provide emergency alert services, Verify and manage incident reports, Send location-based emergency notifications, Improve platform safety and functionality, Prevent fraud and abuse, Comply with legal obligations
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          3. Information Sharing
        </Text>
        <Text className="text-gray-700 text-md mb-2">
          We share your information with emergency services, local authorities, and verified community members only when necessary to provide emergency response services. We never sell your personal data to third parties.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          4. Location Data
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          Your location data is used to provide relevant emergency alerts and enable incident reporting. You can control location permissions through your device settings, but this may limit functionality.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          5. Data Security
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. However, no system is completely secure.
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          6. Data Retention
        </Text>

        <Text className="text-gray-700 text-md mb-2">
        We retain your data for as long as your account is active and for a reasonable period thereafter for legal and safety purposes. Incident reports may be retained longer for community safety records.
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          7. Your Rights
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          Access your personal data, Request data correction or deletion, Opt-out of non-essential communications, Export your data, Withdraw consent (where applicable)
        </Text>

         <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
         8. Cookies and Tracking
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          We use essential cookies and tracking technologies to maintain sessions, analyze usage, and improve our services. You can manage cookie preferences in your browser settings.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
         9. Children's Privacy
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          Our service is not intended for users under 13 years of age. We do not knowingly collect information from children under 13. If we discover such data, we will delete it promptly.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
        10. Contact Us
        </Text>

        <Text className="text-gray-700 text-md mb-2">
          For privacy concerns or data requests, contact us at privacy@resqnow.com or through the app's support section.
        </Text>

        <TouchableOpacity className="bg-black py-3 rounded-xl items-center mb-3">
              <Text className="text-white font-medium">Close</Text>
            </TouchableOpacity>
        

      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy_Citizen;