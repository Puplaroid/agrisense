import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function HourlyLightGraph({ data }) {
  const screenWidth = Dimensions.get("window").width;
  const [isMobile, setIsMobile] = useState(Dimensions.get("window").width < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(Dimensions.get("window").width < 768);
    };
    Dimensions.addEventListener("change", handleResize);

    return () => Dimensions.removeEventListener("change", handleResize);
  }, []);

  // Define fixed x-axis labels for 24 hours
  const fixedLabels = [
    "12 AM","3 AM", "6 AM", "9 AM",
    "12 PM","3 PM", "6 PM", "9 PM","12 AM",
  ];

  // Prepare data for the fixed x-axis
  const prepareLightData = () => {
    const LightData = new Array(24).fill(null); // Initialize with null for all 24 hours
    const today = new Date().toISOString().split("T")[0]; // Today's date

    data.forEach((item) => {
      if (item.date.startsWith(today)) {
        const itemHour = new Date(item.date).getHours(); // Get the hour of the data point
        LightData[itemHour] = item.sunlight; // Assign the temperature to the correct hour
      }
    });

    // Replace any null values with 0 or leave them as null for no plot
    return LightData.map((value) => (value === null ? 0 : value));
  };

  const LightData = prepareLightData();

  const chartData = {
    labels: fixedLabels,
    datasets: [
      {
        data: LightData,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
    legend: ["Light (Lux)"], // Legend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light Over Time</Text>
      {LightData.length > 0 ? (
        <LineChart
          data={chartData}
          width={isMobile ? screenWidth * 0.9 : screenWidth * 0.45}
          height={250}
          chartConfig={{
            backgroundGradientFrom: "#f0f0f0",
            backgroundGradientTo: "#f0f0f0",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#3b82f6",
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No light data available for today.</Text>
      )}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
