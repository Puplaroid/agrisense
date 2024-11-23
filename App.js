import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import all your screens
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import HomeScreen from "./Pages/HomeScreen";
import RiceFieldInfo from "./Pages/RiceFieldInfo";
import FieldListScreen from "./Pages/FieldListScreen";
import FieldInfoData from "./Pages/FieldInfoData";
import PipeListScreen from "./Pages/PipeListScreen";
import PipeInfoData from "./Pages/PipeInfoData";
import PumpListScreen from "./Pages/PumpListScreen";
import PumpInfoData from "./Pages/PumpInfoData";
import FarmDetail from "./Pages/FarmDetail";
import FieldDetail from "./Pages/FieldDetail";
import DeviceDetail from "./Pages/DeviceDetail";
import WaterGateControl from "./Pages/WaterGateControl";
import WaterGateControlDetail from "./Pages/WaterGateControlDetail";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RiceFieldInfo" component={RiceFieldInfo} />
        <Stack.Screen name="FieldListScreen" component={FieldListScreen} />
        <Stack.Screen name="FieldInfoData" component={FieldInfoData} />
        <Stack.Screen name="PipeListScreen" component={PipeListScreen} />
        <Stack.Screen name="PipeInfoData" component={PipeInfoData} />
        <Stack.Screen name="PumpListScreen" component={PumpListScreen} />
        <Stack.Screen name="PumpInfoData" component={PumpInfoData} />
        <Stack.Screen name="FarmDetail" component={FarmDetail} />
        <Stack.Screen name="FieldDetail" component={FieldDetail} />
        <Stack.Screen name="DeviceDetail" component={DeviceDetail} />
        <Stack.Screen name="WaterGateControl" component={WaterGateControl} />
        <Stack.Screen name="WaterGateControlDetail" component={WaterGateControlDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
