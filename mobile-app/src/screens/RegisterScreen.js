import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import API from "../services/api";

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {

      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful");
      navigation.navigate("Login");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text>Name</Text>
      <TextInput onChangeText={setName} style={{ borderWidth: 1 }} />

      <Text>Email</Text>
      <TextInput onChangeText={setEmail} style={{ borderWidth: 1 }} />

      <Text>Password</Text>
      <TextInput secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1 }} />

      <Button title="Register" onPress={handleRegister} />

    </View>
  );
}