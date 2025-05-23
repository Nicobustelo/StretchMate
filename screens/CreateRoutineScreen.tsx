import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { saveRoutine, updateRoutine } from "../services/routineService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "CreateRoutine">;

export default function CreateRoutineScreen({ navigation, route }: Props) {
  const editingRoutine = route.params?.routine;

  const [name, setName] = useState(editingRoutine?.name || "");
  const [preparationTime, setPreparationTime] = useState(editingRoutine?.preparationTime?.toString() || "");
  const [workTime, setWorkTime] = useState(editingRoutine?.workTime?.toString() || "");
  const [restTime, setRestTime] = useState(editingRoutine?.restTime?.toString() || "");
  const [sets, setSets] = useState(editingRoutine?.sets?.toString() || "");

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Falta nombre");

    try {
      if (editingRoutine) {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {editingRoutine ? "Editar Rutina" : "Crear Rutina"}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="x" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          {editingRoutine ? "Modifica los datos de tu rutina:" : "Ingrese los datos para su nueva rutina:"}
        </Text>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la rutina</Text>
          <TextInput
            style={styles.input}
            placeholder='Ej: "Rutina de estiramiento matutino"'
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Preparación */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tiempo de preparación (segundos)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 10"
            keyboardType="numeric"
            value={preparationTime}
            onChangeText={setPreparationTime}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Trabajo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duración de cada set (segundos)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 30"
            keyboardType="numeric"
            value={workTime}
            onChangeText={setWorkTime}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Descanso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descanso entre sets (segundos)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 15"
            keyboardType="numeric"
            value={restTime}
            onChangeText={setRestTime}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Sets */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cantidad de sets</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Icon name="save" size={20} color="white" />
          <Text style={styles.primaryButtonText}>
            {editingRoutine ? "GUARDAR CAMBIOS" : "GUARDAR RUTINA"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f9ff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e0f2fe",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0284c7",
  },
  scrollContent: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 1,
  },
  label: {
    color: "#0f172a",
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0f2fe",
    borderRadius: 8,
    padding: 10,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0284c7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});