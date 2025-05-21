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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Rutinas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {history.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>No hiciste ninguna rutina aún</Text>
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
                {/* Podés agregar más badges como tipo o duración si lo registrás */}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  routineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  date: {
    fontSize: 14,
    color: "#666",
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
});
