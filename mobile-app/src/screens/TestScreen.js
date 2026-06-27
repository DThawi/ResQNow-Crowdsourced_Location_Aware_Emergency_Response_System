// src/screens/TestScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const NavButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.leftContent}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#D62828" />
      </View>

      <Text style={styles.cardText}>{title}</Text>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const TestScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="flask" size={26} color="#fff" />
        <Text style={styles.title}>Developer Test Panel</Text>
        <Text style={styles.subtitle}>
          Quick access to all project screens
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Authentication */}
        <SectionTitle title="Authentication" />

        <NavButton
          title="Login Screen"
          icon="log-in-outline"
          onPress={() => navigation.navigate("Login")}
        />

        <NavButton
          title="Register Role Select"
          icon="person-add-outline"
          onPress={() => navigation.navigate("Register1")}
        />

        <NavButton
          title="Register Details"
          icon="create-outline"
          onPress={() => navigation.navigate("Register2")}
        />

        <NavButton
          title="Verify Identity"
          icon="card-outline"
          onPress={() => navigation.navigate("VerifyIdentity")}
        />

        <NavButton
          title="Set Password"
          icon="lock-closed-outline"
          onPress={() => navigation.navigate("SetPassword")}
        />

        <NavButton
          title="Registration Success"
          icon="checkmark-done-outline"
          onPress={() => navigation.navigate("SuccessfulSetPassword")}
        />

        <NavButton
          title="Forgot Password"
          icon="help-circle-outline"
          onPress={() => navigation.navigate("ForgotPassword1")}
        />

        {/* Citizen */}
        <SectionTitle title="Citizen Screens" />

        <NavButton
          title="Home Screen"
          icon="home-outline"
          onPress={() => navigation.navigate("Home")}
        />

        <NavButton
          title="My Reports Screen"
          icon="warning-outline"  
          onPress={() => navigation.navigate("MyReports")}
        />

        <NavButton
          title="Profile Screen"
          icon="person-outline"
          onPress={() => navigation.navigate("ProfileScreen")}
        />

        <NavButton
          title="Edit Profile"
          icon="create-outline"
          onPress={() => navigation.navigate("EditProfileScreen")}
        />

        <NavButton
          title="Notification Settings"
          icon="notifications-outline"
          onPress={() => navigation.navigate("NotificationSettings")}
        />

        <NavButton
          title="Privacy & Security"
          icon="shield-checkmark-outline"
          onPress={() =>
            navigation.navigate("PrivacySecuritySettings")
          }
        />

        <NavButton
          title="Privacy Policy"
          icon="document-text-outline"
          onPress={() =>
            navigation.navigate("PrivacyPolicy_Citizen")
          }
        />

        <NavButton
          title="Terms & Conditions"
          icon="reader-outline"
          onPress={() =>
            navigation.navigate("TermsConditions_Citizen")
          }
        />

        <NavButton
          title="Help & Support"
          icon="help-buoy-outline"
          onPress={() => navigation.navigate("HelpSupport")}
        />
        <NavButton
          title="About us"
          icon="information-circle-outline"
          onPress={() => navigation.navigate("CitizenAboutScreen")} 
        />

        {/* Responder */}
        <SectionTitle title="Responder Screens" />

        <NavButton
          title="Responder Dashboard"
          icon="speedometer-outline"
          onPress={() =>
            navigation.navigate("ResponderDashboard")
          }
        />

        <NavButton
          title="Settings"
          icon="settings-outline"
          onPress={() => navigation.navigate("SettingsScreen")}
        />
         <NavButton
          title="Account Settings"
          icon="settings-outline"
          onPress={() => navigation.navigate("AccountSettingsScreen")}
        />

        <NavButton
          title="Edit Profile"
          icon="create-outline"
          onPress={() =>
            navigation.navigate(
              "ResponderEditProfileScreen"
            )
          }
        />
        <NavButton
          title="Organization Details Edit Screen"
          icon="business-outline"
          onPress={() => navigation.navigate("OrganizationDetails_EditScreen")}
        />

        <NavButton
          title="Credentials"
          icon="school-outline"
          onPress={() =>
            navigation.navigate(
              "CredentialsCertificationsScreen"
            )
          }
        />

        <NavButton
          title="Upload Documents"
          icon="cloud-upload-outline"
          onPress={() =>
            navigation.navigate(
              "UploadVerificationDocuments"
            )
          }
        />

        <NavButton
          title="Change Password"
          icon="lock-closed-outline"
          onPress={() =>
            navigation.navigate("ChangePasswordScreen")
          }
        />

        <NavButton
          title="Biometric Authentication"
          icon="finger-print-outline"
          onPress={() =>
            navigation.navigate(
              "BiometricAuthentication"
            )
          }
        />

        <NavButton
          title="Deactivate Account"
          icon="pause-circle-outline"
          onPress={() =>
            navigation.navigate(
              "DeactivateAccountScreen"
            )
          }
        />

        <NavButton
          title="Delete Account"
          icon="trash-outline"
          onPress={() =>
            navigation.navigate("DeleteAccountScreen")
          }
        />
        <NavButton
          title="Privacy Policy"
          icon="document-text-outline"
          onPress={() =>
            navigation.navigate("PrivacyPolicy_Citizen")
          }
        />
        <NavButton
          title="Terms & Conditions"
          icon="reader-outline"
          onPress={() =>
            navigation.navigate("TermsConditions_Citizen")
          }
        />
        <NavButton
          title="Help & Support"
          icon="help-buoy-outline"
          onPress={() =>
            navigation.navigate("HelpSupport_Citizen")
          }
        />
        <NavButton
          title="About us"
          icon="information-circle-outline"
          onPress={() => navigation.navigate("ResponderAboutScreen")} 
        />

        {/* Admin */}
        <SectionTitle title="Admin Screens" />

        <NavButton
          title="Admin Login"
          icon="shield-outline"
          onPress={() => navigation.navigate("AdminSignIn")}
        />

        <NavButton
          title="Dashboard"
          icon="grid-outline"
          onPress={() => navigation.navigate("Dashboard")}
        />

        <NavButton
          title="User Management"
          icon="people-outline"
          onPress={() =>
            navigation.navigate("UserManagement")
          }
        />

        <NavButton
          title="Responder Management"
          icon="medkit-outline"
          onPress={() =>
            navigation.navigate(
              "ResponderManagement"
            )
          }
        />

        <NavButton
          title="Verification Center"
          icon="checkmark-circle-outline"
          onPress={() =>
            navigation.navigate(
              "VerificationCenter"
            )
          }
        />

        <NavButton
          title="Incident Management"
          icon="warning-outline"
          onPress={() =>
            navigation.navigate(
              "IncidentManagement"
            )
          }
        />

        <NavButton
          title="Danger Zone Management"
          icon="alert-circle-outline"
          onPress={() =>
            navigation.navigate(
              "DangerZoneManagement"
            )
          }
        />

        <NavButton
          title="System Settings"
          icon="settings-outline"
          onPress={() =>
            navigation.navigate("SystemSettings")
          }
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    backgroundColor: "#D62828",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginTop: 4,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginTop: 18,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FDECEC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
    flexShrink: 1,
  },
});