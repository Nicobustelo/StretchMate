// screens/CreateRoutineScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { saveRoutine } from "../services/routineService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "CreateRoutine">;

export default function CreateRoutineScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [preparationTime, setPreparationTime] = useState("5");
  const [workTime, setWorkTime] = useState("30");
  const [restTime, setRestTime] = useState("15");
  const [sets, setSets] = useState("5");

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Falta nombre");

    try {
      const routine = await saveRoutine({
        name: name.trim(),
        preparationTime: parseInt(preparationTime),
        workTime: parseInt(workTime),
        restTime: parseInt(restTime),
        sets: parseInt(sets),
      });

      Alert.alert("✅ Rutina guardada", `Nombre: ${routine.name}`);
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error al guardar rutina", error?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nueva rutina</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Tiempo de preparación (segundos)" keyboardType="numeric" value={preparationTime} onChangeText={setPreparationTime} />
      <TextInput style={styles.input} placeholder="Duración de cada set (segundos)" keyboardType="numeric" value={workTime} onChangeText={setWorkTime} />
      <TextInput style={styles.input} placeholder="Descanso entre sets (segundos)" keyboardType="numeric" value={restTime} onChangeText={setRestTime} />
      <TextInput style={styles.input} placeholder="Cantidad de sets" keyboardType="numeric" value={sets} onChangeText={setSets} />

      <Button title="Guardar rutina" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
});
