// navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import CreateRoutineScreen from "../screens/CreateRoutineScreen";
import RoutineListScreen from "../screens/RoutineListScreen";
import TimerScreen from "../screens/TimerScreen";
import RoutineScreen from "../screens/RoutineScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  Home: undefined;
  CreateRoutine: { routine?: import("../types/Routine").Routine } | undefined;
  RoutineList: undefined;
  Timer: { routineId: string };
  Routine: { routineId: string };
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
        <Stack.Screen name="RoutineList" component={RoutineListScreen} options={{ title: "Rutinas" }} />
        <Stack.Screen name="Timer" component={TimerScreen} options={{ title: "Rutina" }} />
        <Stack.Screen name="Routine" component={RoutineScreen} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: "Ver Historial" }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}