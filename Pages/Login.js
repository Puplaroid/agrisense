import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const passwordInputRef = useRef(null);


  const handleLogin = async () => {
    setErrorMessage("");
    if (username === "" || password === "") {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {

      let bodyContent = JSON.stringify({
        "username": username,
        "password": password
      });

      // Replace with your actual login API endpoint
      const response = await fetch("http://3.27.146.110/farmer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyContent,
      });

      if (!response.ok) {
        setErrorMessage("Invalid username or password.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const farmerID = data[0].id;
      console.log("farmerID: ",farmerID);

      // Navigate to the HomeScreen
      // navigation.navigate("HomeScreen", farmerID);
      navigation.navigate("RiceFieldInfo", farmerID);

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>AgriSense Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          ref={passwordInputRef}
        />

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",

  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
