// screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getAllRoutines } from "../services/routineService";
import { Routine } from "../types/Routine";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const all = await getAllRoutines();
      const sorted = all
        .filter((r) => r.lastUsed)
        .sort((a, b) => (b.lastUsed ?? 0) - (a.lastUsed ?? 0));
      setRoutines(sorted.slice(0, 3)); // solo mostrar las 3 más recientes
    };
    const unsubscribe = navigation.addListener("focus", fetchRoutines);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitRoutine</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon name="settings" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saludo */}
        <Text style={styles.greeting}>¡Hola!</Text>
        <Text style={styles.subtext}>¿Qué quieres hacer hoy?</Text>

        {/* Botón Crear Rutina */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CreateRoutine")}
        >
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.primaryButtonText}>CREAR RUTINA</Text>
        </TouchableOpacity>

        {/* Acciones Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate("RoutineList")}
          >
            <Icon name="eye" size={20} color="#0ea5e9" />
            <Text style={styles.quickLabel}>Ver Rutinas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate("History")}
          >
            <Icon name="clock" size={20} color="#0ea5e9" />
            <Text style={styles.quickLabel}>Historial</Text>
          </TouchableOpacity>
        </View>

        {/* Rutinas Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rutinas Recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("RoutineList")}>
              <Text style={styles.link}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {routines.length === 0 ? (
            <Text style={styles.emptyText}>No hay rutinas recientes.</Text>
          ) : (
            routines.map((routine) => (
              <View key={routine.id} style={styles.routineCard}>
                <View style={styles.routineIcon}>
                  <Icon name="activity" size={20} color="#0ea5e9" />
                </View>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName}>{routine.name}</Text>
                  <Text style={styles.routineMeta}>
                    {routine.preparationTime + (routine.workTime + routine.restTime) * routine.sets} min •{" "}
                    {formatDistanceToNow(routine.lastUsed!, { locale: es, addSuffix: true })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Timer", { routineId: routine.id })}
                >
                  <Icon name="play" size={20} color="#0ea5e9" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Estadísticas (placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsCard}>
            <Text style={styles.statLabel}>Esta semana</Text>
            <Text style={styles.statValue}>3 rutinas</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtext: {
    color: "#64748b",
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0284c7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    backgroundColor: "#e0f2fe",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: "#0ea5e9",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  link: {
    color: "#0284c7",
    fontSize: 14,
  },
  routineCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  routineIcon: {
    backgroundColor: "#bae6fd",
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontWeight: "600",
    color: "#0f172a",
  },
  routineMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  emptyText: {
    color: "#94a3b8",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  statLabel: {
    color: "#647480",
    fontSize: 14,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0284c7",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
  },
  icon: {
    color: "#0ea5e9",
  },
  iconText: {
    fontSize: 16,
    color: "#0ea5e9",
  },
  iconTextSmall: {
    fontSize: 12,
    color: "#0ea5e9",
  },
  iconTextLarge: {
    fontSize: 20,
    color: "#0ea5e9",
  },
  iconTextMedium: {
    fontSize: 18,
    color: "#0ea5e9",
  },
  iconTextXSmall: {
    fontSize: 10,
    color: "#0ea5e9",
  },
});
