import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import BulletItem from "../../components/symbols/bullets";
import GradientHeader from "../../components/layout/header";

const TermsConditions_Citizen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      // <GradientHeader title="Terms & Conditions" type="close" />
      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4">
        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-500 text-sm mb-2">
          By accessing and using ResQNow Emergency Response Platform, you accept
          and agree to be bound by the terms and provisions of this agreement.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          2. Service Description
        </Text>
        <Text className="text-gray-500 text-sm mb-2">
          ResQNow provides a crowdsourced emergency response platform that
          enables users to report, verify, and receive alerts about emergency
          incidents in their area.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          3. User Responsibilities
        </Text>
        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-black-500 text-lg"
          textClass="flex-1 text-base text-gray-500"
          >
            Report only genuine emergency incidents
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-black-500 text-lg"
          textClass="flex-1 text-base text-gray-500"
        >
          Provide accurate and truthful information
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-black-500 text-lg"
          textClass="flex-1 text-base text-gray-500"
        >
          Respect commuinity guidelines
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-black-500 text-lg"
          textClass="flex-1 text-base text-gray-500"
        >
          Not misuse the platform for false alarms
        </BulletItem>

        <BulletItem
          containerClass="flex-row items-start mb-2 ml-5"
          bulletClass="mr-2 text-black-500 text-lg"
          textClass="flex-1 text-base text-gray-500"
        >
          Maintain confidentiality of account credentials
        </BulletItem>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          4. Account Responsibility
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          Deliberate false reporting or misuse of the platform may result in
          account suspension, termination, and potential legal action. ResQNow
          reserves the right to verify all incident reports.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          5. Emergency Alerts
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          By using this service, you consent to receive emergency alert
          notifications via push notifications, SMS, and email based on your
          location and preferences.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          6. Limitation of Liability
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          ResQNow is not a replacement for official emergency services
          (911/999). Always contact local emergency services in life-threatening
          situations. We are not liable for delays or inaccuracies in
          crowdsourced information.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          7. Account Termination
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          We reserve the right to suspend or terminate accounts that violate
          these terms, engage in harmful behavior, or compromise the safety and
          integrity of our community.
        </Text>

        <Text className="text-xl font-bold text-gray-800 mt-3 mb-2">
          8. Changes to Terms
        </Text>

        <Text className="text-gray-500 text-sm mb-2">
          ResQNow reserves the right to modify these terms at any time.
          Continued use of the service constitutes acceptance of updated terms.
        </Text>

        <TouchableOpacity className="bg-black py-3 rounded-xl items-center mb-3">
          <Text className="text-white font-medium">Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TermsConditions_Citizen;
