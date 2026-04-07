// src/screens/TestScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import PrivacyPolicy from "./CommonScreens/PrivacyPolicy";

const TestScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temporary Test Screen</Text>

      <Button
        title="Go to HomeScreen"
        onPress={() => navigation.navigate("HomeScreen")}
        />
      <Button
        title="Go to ProfileScreen"
        onPress={() => navigation.navigate("ProfileScreen")}
        />
      <Button
       title="Go to PrivacyPolicy" 
      onPress={() => navigation.navigate("PrivacyPolicy")} 
        />
        <Button
       title="Terms & Conditions" 
      onPress={() => navigation.navigate("TermsConditions")} 
        />

         <Button
       title="Help & Support" 
      onPress={() => navigation.navigate("HelpSupport")} 
        />

       <Button
       title="Profile Screen" 
      onPress={() => navigation.navigate("ProfileScreen")} 
        />

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default TestScreen;