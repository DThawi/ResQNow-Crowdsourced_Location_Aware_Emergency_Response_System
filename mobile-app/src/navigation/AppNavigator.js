
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
import PrivacyPolicy from "../CommonScreens/PrivacyPolicy";
import HomeScreen from "../screens/auth/HomeScreen";
import TermsConditions from "../CommonScreens/TermsConditions";
import HelpSupport from "../CommonScreens/HelpSupport";
import ProfileScreen from "../ProfileScreen";
import EditProfileScreen from "../EditProfileScreen";
import NotificationSettings from "../NotificationSettingsScreen";
// import HelpSupportScreen from "../HelpSupportScreen";
import ReportIncident from "../screens/Citizen/ReportIncident";
import MyReportsScreen from "../screens/Citizen/MyReportsScreen";
import LiveMapScreen from "../screens/Citizen/LiveMapScreen";
import AlertScreen from "../screens/Citizen/AlertScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        {/* <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={Register1} />
        <Stack.Screen name="Register2" component={Register2} />
        <Stack.Screen name="VerifyIdentity" component={VerifyIdentity} />
        <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="SuccessfulSetPassword" component={SuccessfulSetPassword} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPassword1} />
        <Stack.Screen name="LogoutPopup" component={LogoutPopup} /> */}

        <Stack.Screen name="Map"  component={LiveMapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Alert" component={AlertScreen} options={{ headerShown: false }} /> 




        {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReportIncident" component={ReportIncident} />
        <Stack.Screen name="MyReports" component={MyReportsScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ headerShown: false }} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ headerShown: false }} />
        {/* <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} options={{headerShown:false}} /> */}


      </Stack.Navigator>
    </NavigationContainer>
  );
}