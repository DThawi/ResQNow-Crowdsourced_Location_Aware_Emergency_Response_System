// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/auth/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import Register1 from "../screens/auth/Register1";
import Register2 from "../screens/auth/Register2";
import VerifyIdentity from "../screens/auth/VerifyIdentity";
import SetPassword from "../screens/auth/SetPassword";
import SuccessfulSetPassword from "../screens/auth/SuccessfulSetPassword";
import ForgotPassword1 from "../screens/auth/ForgotPassword1";
import LogoutPopup from "../screens/auth/LogoutPopup";
import PrivacyPolicy from "../screens/Responder/PrivacyPolicy";
import HomeScreen from "../screens/auth/HomeScreen";
import TermsConditions from "../screens/Responder/TermsConditions";
import HelpSupport from "../screens/Citizen/HelpSupport";
import ProfileScreen from "../screens/Citizen/ProfileScreen";
import EditProfileScreen from "../screens/Citizen/EditProfileScreen";
import NotificationSettings from "../screens/Citizen/NotificationSettingsScreen";
import PrivacySecuritySettings from "../screens/Citizen/PrivacySecuritySettings";
import SettingsScreen from "../screens/Responder/Settings";
import AccountSettingsScreen from "../screens/Responder/AccountSettingsScreen";
import ResponderEditProfileScreen from "../screens/Responder/ResponderEditProfileScreen";
import CredentialsCertificationsScreen from "../screens/Responder/CredentialsCertificationsScreen";
import UploadVerificationDocuments from "../screens/Responder/UploadVerificationDocuments";
import ChangePasswordScreen from "../screens/Responder/ChangePasswordScreen";
import BiometricAuthentication from "../screens/Responder/BiometricsAuthentication";
import DeactivateAccountScreen from "../screens/Responder/DeactivateAccountScreen";
import DeleteAccountScreen from "../screens/Responder/DeleteAccountScreen";
import PrivacyPolicy_Citizen from "../screens/Citizen/PrivacyPolicy";
import TermsConditions_Citizen from "../screens/Citizen/TermsConditions";
import HelpSupport_Citizen from "../screens/Citizen/HelpSupport";
import OrganizationDetails_EditScreen from "../screens/Responder/OrganizationDetails_EditScreen";
import ResponderAboutScreen from "../screens/Responder/ResponderAboutScreen";
import CitizenAboutScreen from "../screens/Citizen/CitizenAboutScreen";
import LiveMapScreen from "../screens/Citizen/LiveMapScreen";
import AlertScreen from "../screens/Citizen/AlertScreen";
import ResponderAlertScreen from "../screens/Responder/ResponderAlertScreen";
import DangerZones from "../screens/Citizen/DangerZones";
import DangerZoneDetails from "../screens/Citizen/DangerZoneDetails";
import ReportIncident from "../screens/Citizen/ReportIncident";


import MyReportsScreen from "../screens/Citizen/MyReportsScreen";
import IncidentDetailsScreen from "../screens/Citizen/IncidentDetailsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}> */}

      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        {/* <Stack.Screen name="TestScreen" component={TestScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={Register1} />
        <Stack.Screen name="Register2" component={Register2} />
        <Stack.Screen name="VerifyIdentity" component={VerifyIdentity} />
        <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="SuccessfulSetPassword" component={SuccessfulSetPassword} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPassword1} />
        <Stack.Screen name="LogoutPopup" component={LogoutPopup} />
        <Stack.Screen name="Map" component={LiveMapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlertScreen" component={AlertScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResponderAlert" component={ResponderAlertScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DangerZones" component={DangerZones} options={{ headerShown: false }} />
        <Stack.Screen name="DangerZoneDetails" component={DangerZoneDetails} options={{ headerShown: false }} />



        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ headerShown: false }} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacySecuritySettings" component={PrivacySecuritySettings} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountSettingsScreen" component={AccountSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResponderEditProfileScreen" component={ResponderEditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CredentialsCertificationsScreen" component={CredentialsCertificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UploadVerificationDocuments" component={UploadVerificationDocuments} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BiometricAuthentication" component={BiometricAuthentication} options={{ headerShown: false }} />
        <Stack.Screen name="DeactivateAccountScreen" component={DeactivateAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyPolicy_Citizen" component={PrivacyPolicy_Citizen} options={{ headerShown: false }} />
        <Stack.Screen name="TermsConditions_Citizen" component={TermsConditions_Citizen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpSupport_Citizen" component={HelpSupport_Citizen} options={{ headerShown: false }} />
        <Stack.Screen name="OrganizationDetails_EditScreen" component={OrganizationDetails_EditScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResponderAboutScreen" component={ResponderAboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CitizenAboutScreen" component={CitizenAboutScreen} options={{ headerShown: false }} />

        <Stack.Screen name="MyReports" component={MyReportsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReportIncident" component={ReportIncident} options={{ headerShown: false }} />
        <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} options={{ headerShown: false }} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}






