import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import API from "../services/api";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      console.log(res.data);
      alert("Login successful");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text>Email</Text>
      <TextInput
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Button
        title="Go to Register"
        onPress={() => navigation.navigate("Register")}
      />

    </View>
  );
}