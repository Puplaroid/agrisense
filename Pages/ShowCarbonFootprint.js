import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ShowCarbonFootprint({ data }) {
  if (!data || data.length === 0) {
    // Handle case when data is empty or undefined
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carbon Credit</Text>
        <Text style={styles.noDataText}>No data available.</Text>
      </View>
    );
  }

  // Find the object with the highest ID in the data array
  const highestIdObject = data.reduce((prev, current) => {
    return prev.id > current.id ? prev : current;
  });

  console.log("Highest ID Object in Carbon Credit: ", highestIdObject);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Credit</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.sourceText}>{highestIdObject.emission || "N/A"} Tons</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: "90%",
  },
  sourceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
