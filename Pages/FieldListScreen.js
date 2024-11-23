import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../components/Header";

export default function FieldListScreen({ navigation }) {
  // Mock data for fields
  const fields = [
    { id: "1", name: "Field A", size: "10 acres" },
    { id: "2", name: "Field B", size: "15 acres" },
    { id: "3", name: "Field C", size: "8 acres" },
  ];

  // Render a single field item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fieldItem}
      onPress={() => navigation.navigate("FieldInfoData", { field: item })}
    >
      <Text style={styles.fieldName}>{item.name}</Text>
      <Text style={styles.fieldSize}>Size: {item.size}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Field List</Text>
      <FlatList
        data={fields}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    paddingBottom: 20,
  },
  fieldItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  fieldSize: {
    fontSize: 14,
    color: "#555",
  },
});
