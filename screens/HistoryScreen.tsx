import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRoutineHistory } from "../services/routineService";
import { Ionicons } from "@expo/vector-icons"; // íconos modernos (usando Expo)
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const navigation = useNavigation();

  const [history, setHistory] = useState<
    { id: string; routineName: string; timestamp: number }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const data = await getRoutineHistory();
      // Ordenar por fecha descendente
      const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(sorted);
    };
    load();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0284c7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Rutinas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No hiciste ninguna rutina aún</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.routineName}>{item.routineName}</Text>
                <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
              </View>
              <View style={styles.tagsContainer}>
                <View style={styles.badge}>
                  <Ionicons name="checkmark-done" size={14} color="#fff" />
                  <Text style={styles.badgeText}>Completada</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#e0f2fe",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0284c7",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 10,
  },
  routineName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  date: {
    fontSize: 14,
    color: "#64748b",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
// ...existing code...