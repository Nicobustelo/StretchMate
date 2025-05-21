// screens/CreateRoutineScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { saveRoutine, updateRoutine } from "../services/routineService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "CreateRoutine">;

export default function CreateRoutineScreen({ navigation, route }: Props) {
  // Recibe la rutina si viene como parámetro
  const editingRoutine = route.params?.routine;

  // Inicializa el estado con los datos de la rutina si existe
  const [name, setName] = useState(editingRoutine?.name || "");
  const [preparationTime, setPreparationTime] = useState(editingRoutine?.preparationTime?.toString() || "");
  const [workTime, setWorkTime] = useState(editingRoutine?.workTime?.toString() || "");
  const [restTime, setRestTime] = useState(editingRoutine?.restTime?.toString() || "");
  const [sets, setSets] = useState(editingRoutine?.sets?.toString() || "");

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Falta nombre");

    try {
      if (editingRoutine) {
        // Si estamos editando, actualizamos la rutina existente
        await updateRoutine({
          ...editingRoutine,
          name: name.trim(),
          preparationTime: parseInt(preparationTime),
          workTime: parseInt(workTime),
          restTime: parseInt(restTime),
          sets: parseInt(sets),
        });
        Alert.alert("✅ Rutina actualizada", `Nombre: ${name.trim()}`);
      } else {
        // Si no, creamos una nueva
        const routine = await saveRoutine({
          name: name.trim(),
          preparationTime: parseInt(preparationTime),
          workTime: parseInt(workTime),
          restTime: parseInt(restTime),
          sets: parseInt(sets),
        });
        Alert.alert("✅ Rutina guardada", `Nombre: ${routine.name}`);
      }
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error al guardar rutina", error?.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nueva rutina</Text>

      <Text style={{ marginBottom: 10, color: "#555" }}>
        Ingrese los datos para su nueva rutina: nombre, tiempos de preparación, trabajo, descanso y cantidad de sets.
      </Text>
      <Text style={{ marginBottom: 4 }}>Nombre de la rutina:</Text>
      <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
        Ejemplo: "Rutina de estiramiento matutino"
      </Text>
      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
      <Text style={{ marginBottom: 4 }}>Tiempo de preparación:</Text>
      <TextInput style={styles.input} placeholder="Tiempo de preparación (segundos)" keyboardType="numeric" value={preparationTime} onChangeText={setPreparationTime} />
      <Text style={{ marginBottom: 4 }}>Duración de cada set:</Text>
      <TextInput style={styles.input} placeholder="Duración de cada set (segundos)" keyboardType="numeric" value={workTime} onChangeText={setWorkTime} />
      <Text style={{ marginBottom: 4 }}>Descanso entre sets:</Text>
      <TextInput style={styles.input} placeholder="Descanso entre sets (segundos)" keyboardType="numeric" value={restTime} onChangeText={setRestTime} />
      <Text style={{ marginBottom: 4 }}>Cantidad de sets:</Text>
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
