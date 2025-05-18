import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getRoutineHistory } from "../services/routineService";

export default function HistoryScreen() {
  const [history, setHistory] = useState<
    { id: string; routineName: string; timestamp: number }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const data = await getRoutineHistory();
      setHistory(data);
    };
    load();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Rutinas</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.routineName}</Text>
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hiciste ninguna rutina aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 14, color: "#555" },
});
