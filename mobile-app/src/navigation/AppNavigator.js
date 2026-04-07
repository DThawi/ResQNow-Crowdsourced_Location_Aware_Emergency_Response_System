import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/Register1"; // Assuming Register1 is the first step of registration
import PrivacyPolicy from "../CommonScreens/PrivacyPolicy";
import HomeScreen from "../screens/auth/HomeScreen";
import TermsConditions from "../CommonScreens/TermsConditions";
import HelpSupport from "../CommonScreens/HelpSupport";
import ProfileScreen from "../ProfileScreen";
import TestScreen from "../TestScreen";



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>


       
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="TestScreen" component={TestScreen}/>
      
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}