import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";

export default function FieldInfoData({ route }) {
  const { field } = route.params; // Get the selected field details

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Field Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: {field.name}</Text>
        <Text style={styles.infoText}>Size: {field.size}</Text>
        {/* Add more details if necessary */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
});
