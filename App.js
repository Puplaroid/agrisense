import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import all your screens
import Login from "./Pages/Login";
import HomeScreen from "./Pages/HomeScreen";
import RiceFieldInfo from "./Pages/RiceFieldInfo";
import PipeListScreen from "./Pages/PipeListScreen";
import PipeInfoData from "./Pages/PipeInfoData";
import PumpListScreen from "./Pages/PumpListScreen";
import PumpInfoData from "./Pages/PumpInfoData";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RiceFieldInfo" component={RiceFieldInfo} />
        <Stack.Screen name="PipeListScreen" component={PipeListScreen} />
        <Stack.Screen name="PipeInfoData" component={PipeInfoData} />
        <Stack.Screen name="PumpListScreen" component={PumpListScreen} />
        <Stack.Screen name="PumpInfoData" component={PumpInfoData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
