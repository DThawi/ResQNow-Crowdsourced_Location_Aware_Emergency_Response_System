import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import GradientHeader from "../../components/layout/header";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="border-b border-gray-200 py-3">
      {/* QUESTION ROW */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center"
      >
        <Text className="text-gray-700 flex-1 pr-2">{question}</Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="gray"
        />
      </TouchableOpacity>

      {/* ANSWER (only show when open) */}
      {open && (
        <Text className="text-gray-500 text-sm mt-2 leading-5">{answer}</Text>
      )}
    </View>
  );
};

const HelpSupport = () => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      // <GradientHeader title="Help & Support" type="close" />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4 pt-4">
        {/* CONTACT US */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow">
          <Text className="font-semibold text-gray-800 mb-3">Contact Us</Text>

          {/* Live Chat */}
          <View className="flex-row items-center mb-4">
            <View className="bg-red-100 p-3 rounded-xl mr-3">
              <Ionicons name="chatbubble-outline" size={18} color="red" />
            </View>
            <View>
              <Text className="font-medium">Live Chat</Text>
              <Text className="text-gray-400 text-sm">Get instant help</Text>
            </View>
          </View>

          {/* Call */}
          <View className="flex-row items-center mb-4">
            <View className="bg-gray-200 p-3 rounded-xl mr-3">
              <Feather name="phone" size={18} color="gray" />
            </View>
            <View>
              <Text className="font-medium">Call Support</Text>
              <Text className="text-gray-400 text-sm">1-800-RESQNOW</Text>
            </View>
          </View>

          {/* Email */}
          <View className="flex-row items-center">
            <View className="bg-yellow-100 p-3 rounded-xl mr-3">
              <MaterialIcons name="email" size={18} color="orange" />
            </View>
            <View>
              <Text className="font-medium">Email Us</Text>
              <Text className="text-gray-400 text-sm">support@resqnow.com</Text>
            </View>
          </View>
        </View>
        {/* RESOURCES */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow">
          <Text className="font-semibold text-gray-800 mb-3">Resources</Text>

          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 p-3 rounded-xl mr-3">
              <Feather name="video" size={18} color="green" />
            </View>
            <View>
              <Text className="font-medium">Video Tutorials</Text>
              <Text className="text-gray-400 text-sm">
                Learn how to use ResQNow
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="bg-gray-200 p-3 rounded-xl mr-3">
              <Feather name="file-text" size={18} color="gray" />
            </View>
            <View>
              <Text className="font-medium">User Guide</Text>
              <Text className="text-gray-400 text-sm">
                Complete documentation
              </Text>
            </View>
          </View>
        </View>
        {/* FAQ */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow">
          <Text className="font-semibold text-gray-800 mb-3">
            Frequently Asked Questions
          </Text>

          <FAQItem
            question="How do I update my profile information?"
            answer="GPS helps responders locate incidents quickly and ensures accurate emergency response."
          />
          <FAQItem
            question="Why is GPS location required?"
            answer="GPS location is required to ensure accurate and timely emergency response."
          />
          <FAQItem
            question="How do I reset my password?"
            answer="You can reset your password by clicking on the 'Forgot Password' link on the login screen."
          />
          <FAQItem
            question="Why am I not receiving notifications?"
            answer="Make sure your notification settings are enabled and your device is connected to the internet."
          />
          <FAQItem
            question="How do I change my availability status?"
            answer="You can change your availability status from your profile settings."
          />
        </View>
        {/* BUTTON */}
        <TouchableOpacity className="bg-red-600 p-4 rounded-2xl items-center mb-4">
          <Text className="text-white font-semibold">
            Submit a Support Request
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View className="bg-white rounded-2xl p-3 items-center shadow">
          <Image
            source={require("../../../assets/logo-clean.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />

          <Text className="font-semibold text-xl text-gray-800">ResQNow</Text>
          <Text className="text-gray-400 text-sm mb-3">Version 1.0.0</Text>

          <View className="flex-row">
            <Text className="text-gray-400 text-xs">Terms of Service</Text>
            <Text className="mx-2 text-gray-400">•</Text>
            <Text className="text-gray-400 text-xs">Privacy Policy</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupport;
