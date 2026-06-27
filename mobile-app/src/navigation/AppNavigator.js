import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth & Onboarding Views
import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import Register1 from "../screens/auth/Register1";
import Register2 from "../screens/auth/Register2";
import Register3 from "../screens/auth/Register3";
import Register4 from "../screens/auth/Register4";
import Register5 from "../screens/auth/Register5";
import Register6 from "../screens/auth/Register6";
import Register7 from "../screens/auth/Register7";
import VerifyIdentity from "../screens/auth/VerifyIdentity";
import SetPassword from "../screens/auth/SetPassword";
import SuccessfulSetPassword from "../screens/auth/SuccessfulSetPassword";
import ForgotPassword1 from "../screens/auth/ForgotPassword1";
import LogoutPopup from "../screens/auth/LogoutPopup";
import HomeScreen from "../screens/auth/HomeScreen";

// Core Shared Components Layout Hooks
import PrivacyPolicy from "../screens/Responder/PrivacyPolicy";
import TermsConditions from "../screens/Responder/TermsConditions";
import HelpSupport from "../screens/Citizen/HelpSupport";

// Citizen Screen Features Modules
import ProfileScreen from "../screens/Citizen/ProfileScreen";
import EditProfileScreen from "../screens/Citizen/EditProfileScreen";
import NotificationSettings from "../screens/Citizen/NotificationSettingsScreen";
import PrivacySecuritySettings from "../screens/Citizen/PrivacySecuritySettings";
import PrivacyPolicy_Citizen from "../screens/Citizen/PrivacyPolicy";
import TermsConditions_Citizen from "../screens/Citizen/TermsConditions";
import HelpSupport_Citizen from "../screens/Citizen/HelpSupport";
import CitizenAboutScreen from "../screens/Citizen/CitizenAboutScreen";
import LiveMapScreen from "../screens/Citizen/LiveMapScreen";
import AlertScreen from "../screens/Citizen/AlertScreen";
import DangerZones from "../screens/Citizen/DangerZones";
import DangerZoneDetails from "../screens/Citizen/DangerZoneDetails";
import ReportIncident from "../screens/Citizen/ReportIncident";
import MyReportsScreen from "../screens/Citizen/MyReportsScreen";
import IncidentDetailsScreen from "../screens/Citizen/IncidentDetailsScreen";

// Responder Profile & Identity Management
import SettingsScreen from "../screens/Responder/Settings";
import AccountSettingsScreen from "../screens/Responder/AccountSettingsScreen";
import ResponderEditProfileScreen from "../screens/Responder/ResponderEditProfileScreen";
import CredentialsCertificationsScreen from "../screens/Responder/CredentialsCertificationsScreen";
import UploadVerificationDocuments from "../screens/Responder/UploadVerificationDocuments";
import ChangePasswordScreen from "../screens/Responder/ChangePasswordScreen";
import BiometricAuthentication from "../screens/Responder/BiometricsAuthentication";
import DeactivateAccountScreen from "../screens/Responder/DeactivateAccountScreen";
import DeleteAccountScreen from "../screens/Responder/DeleteAccountScreen";
import OrganizationDetails_EditScreen from "../screens/Responder/OrganizationDetails_EditScreen";
import ResponderAboutScreen from "../screens/Responder/ResponderAboutScreen";
import ResponderLiveMapScreen from "../screens/Responder/ResponderLiveMapScreen";
import ResponderAlertScreen from "../screens/Responder/ResponderAlertScreen";

// Responder Primary Control Dashboard Modules
import ResponderDashboard from "../screens/Responder/ResponderDashboard";
import AlertsNotifications from "../screens/Responder/AlertsNotifications";
import ResponderDangerZone from "../screens/Responder/ResponderDangerzones";
import ResponderDangerZoneDetails from "../screens/Responder/ResponderDangerZoneDetails";
import ResponderHistoryScreen from "../screens/Responder/ResponderHistoryScreen";

// 4-STAGE PIPELINE RESPONSIVE INCIDENT VIEWS
import IncidentDetailsScreen1 from "../screens/Responder/IncidentDetailsScreen";
import IncidentDetailsScreen2 from "../screens/Responder/IncidentDetailsScreen2";
import IncidentDetailsScreen3 from "../screens/Responder/IncidentDetailsScreen3";
import IncidentDetailsScreen4 from "../screens/Responder/IncidentDetailsScreen4";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        
        {/* Auth & Lifecycle Context Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={Register1} />
        <Stack.Screen name="Register2" component={Register2} />
        <Stack.Screen name="Register3" component={Register3} />
        <Stack.Screen name="Register4" component={Register4} />
        <Stack.Screen name="Register5" component={Register5} />
        <Stack.Screen name="Register6" component={Register6} />
        <Stack.Screen name="Register7" component={Register7} />
        <Stack.Screen name="VerifyIdentity" component={VerifyIdentity} />
        <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="SuccessfulSetPassword" component={SuccessfulSetPassword} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPassword1} />
        <Stack.Screen name="LogoutPopup" component={LogoutPopup} />
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Telemetry Maps & Alert Boundaries */}
        <Stack.Screen name="Map" component={LiveMapScreen} />
        <Stack.Screen name="AlertScreen" component={AlertScreen} />
        <Stack.Screen name="ResponderAlert" component={ResponderAlertScreen} />
        <Stack.Screen name="DangerZones" component={DangerZones} />
        <Stack.Screen name="DangerZoneDetails" component={DangerZoneDetails} />
        <Stack.Screen name="ResponderMap" component={ResponderLiveMapScreen} />

        {/* Shared App Utilities */}
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        
        {/* 👥 Citizen Operations Stack Branch */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        <Stack.Screen name="PrivacySecuritySettings" component={PrivacySecuritySettings} />
        <Stack.Screen name="PrivacyPolicy_Citizen" component={PrivacyPolicy_Citizen} />
        <Stack.Screen name="TermsConditions_Citizen" component={TermsConditions_Citizen} />
        <Stack.Screen name="HelpSupport_Citizen" component={HelpSupport_Citizen} />
        <Stack.Screen name="CitizenAboutScreen" component={CitizenAboutScreen} />
        <Stack.Screen name="MyReports" component={MyReportsScreen} />
        <Stack.Screen name="ReportIncident" component={ReportIncident} />
        <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} />

        {/* Responder Identity Configuration Suite */}
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="AccountSettingsScreen" component={AccountSettingsScreen} />
        <Stack.Screen name="ResponderEditProfileScreen" component={ResponderEditProfileScreen} />
        <Stack.Screen name="CredentialsCertificationsScreen" component={CredentialsCertificationsScreen} />
        <Stack.Screen name="UploadVerificationDocuments" component={UploadVerificationDocuments} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="BiometricAuthentication" component={BiometricAuthentication} />
        <Stack.Screen name="DeactivateAccountScreen" component={DeactivateAccountScreen} />
        <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
        <Stack.Screen name="OrganizationDetails_EditScreen" component={OrganizationDetails_EditScreen} />
        <Stack.Screen name="ResponderAboutScreen" component={ResponderAboutScreen} />

        {/* Responder Active Command Suite */}
        <Stack.Screen name="ResponderDashboard" component={ResponderDashboard} />
        <Stack.Screen name="AlertsNotifications" component={AlertsNotifications} />
        <Stack.Screen name="ResponderDangerZone" component={ResponderDangerZone} />
        <Stack.Screen name="ResponderDangerZoneDetails" component={ResponderDangerZoneDetails} />
        
        {/* Mapped Responder Mission History Log */}
        <Stack.Screen name="ResponderHistory" component={ResponderHistoryScreen} />

        {/* RESPOND PILELINE STAGES (1 -> 2 -> 3 -> 4) */}
        <Stack.Screen name="ResponderIncidentDetails" component={IncidentDetailsScreen1} />
        <Stack.Screen name="ResponderIncidentDetails2" component={IncidentDetailsScreen2} />
        <Stack.Screen name="ResponderIncidentDetails3" component={IncidentDetailsScreen3} />
        <Stack.Screen name="ResponderIncidentDetails4" component={IncidentDetailsScreen4} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
