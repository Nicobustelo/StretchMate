// screens/HomeScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏠 Home</Text>
      <Button title="Crear rutina" onPress={() => navigation.navigate("CreateRoutine")} />
      <Button title="Ver rutinas guardadas" onPress={() => navigation.navigate("RoutineList")} />
      <Button title="Historial" onPress={() => navigation.navigate("History")} />
      <Button title="Ajustes" onPress={() => navigation.navigate("Settings")} />
    </View>
  );
}
