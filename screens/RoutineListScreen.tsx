// screens/RoutineListScreen.tsx

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAllRoutines, deleteRoutine } from "../services/routineService";
import { Routine } from "../types/Routine";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "RoutineList">;

export default function RoutineListScreen({ navigation }: Props) {
  const [routines, setRoutines] = useState<Routine[]>([]);

  const load = async () => {
    const data = await getAllRoutines();
    setRoutines(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Routine }) => (
         <View style={styles.routineItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routineName}>{item.name}</Text>
              <Text>{item.sets} sets – {item.workTime}s trabajo / {item.restTime}s descanso</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate("Timer", { routineId: item.id })}
                >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.info}>
                    {item.sets} sets · {item.workTime}s trabajo · {item.restTime}s descanso
                </Text>
                </TouchableOpacity>
            </View>
        </View>
  );

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar rutina", "¿Estás seguro de eliminar esta rutina?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteRoutine(id);
          await load();
        },
      },
    ]);
  };

  const handleEdit = (routine: Routine) => {
    navigation.navigate("CreateRoutine", { routine }); // Le pasamos la rutina a editar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus rutinas</Text>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay rutinas guardadas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  info: { fontSize: 14, color: "#666" },
  routineItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  routineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    marginLeft: 10,
  },
  deleteBtn: {
    marginLeft: 10,
  },
});
