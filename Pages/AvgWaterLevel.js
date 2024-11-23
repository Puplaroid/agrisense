import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export default function WaterLevel({ data }) {
  if (!data || data.length === 0) {
    console.error("Data is invalid or empty:", data);
    return <Text>No data available</Text>;
  }

  // Calculate the average water level
  const totalWaterLevel = data.reduce((sum, current) => sum + (current.water_level || 0), 0);
  const averageWaterLevel = totalWaterLevel / data.length;

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const MAX_LEVEL_CM = 30;
  const TUBE_HEIGHT = SCREEN_HEIGHT * 0.4;
  const TUBE_WIDTH = 80 * 3;
  const WATER_HEIGHT = (averageWaterLevel / MAX_LEVEL_CM) * TUBE_HEIGHT;

  console.log("Rendering Water Level:", { averageWaterLevel, TUBE_HEIGHT, WATER_HEIGHT });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Level Monitor</Text>
      <Svg
        height={TUBE_HEIGHT + 50}
        width={SCREEN_WIDTH * 0.6}
        viewBox={`0 0 ${TUBE_WIDTH + 20} ${TUBE_HEIGHT}`}
        style={styles.svg}
      >
        <Rect
          x="10"
          y="0"
          width={TUBE_WIDTH}
          height={TUBE_HEIGHT}
          stroke="black"
          strokeWidth="2"
          fill="none"
          rx="15"
        />
        <Rect
          x="10"
          y={TUBE_HEIGHT - WATER_HEIGHT}
          width={TUBE_WIDTH}
          height={WATER_HEIGHT}
          fill="#ADD8E6"
          rx="15"
        />
        <SvgText
          x={TUBE_WIDTH / 2 + 10}
          y={TUBE_HEIGHT - WATER_HEIGHT - 10}
          fontSize="12"
          fill="black"
          textAnchor="middle"
        >
          {averageWaterLevel.toFixed(2)} cm
        </SvgText>
      </Svg>
      <Text style={styles.sliderText}>
        Average Water Level: {averageWaterLevel.toFixed(2)} cm
      </Text>
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
  svg: {
    marginBottom: 20,
  },
  sliderText: {
    fontSize: 16,
    marginTop: 10,
  },
});
