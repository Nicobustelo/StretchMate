import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
        <Icon name="settings" size={24} color="#555" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <View style={styles.row}>
            <Icon name="user" size={20} color="#0ea5e9" />
            <Text style={styles.rowLabel}>Nombre de usuario</Text>
            <Text style={styles.rowValue}>Invitado</Text>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.row}>
            <Icon name="bell" size={20} color="#0ea5e9" />
            <Text style={styles.rowLabel}>Recordatorios diarios</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              thumbColor={notifications ? "#0ea5e9" : "#ccc"}
            />
          </View>
        </View>

        {/* Preferencias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <View style={styles.row}>
            <Icon name="moon" size={20} color="#0ea5e9" />
            <Text style={styles.rowLabel}>Modo oscuro</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? "#0ea5e9" : "#ccc"}
            />
          </View>
        </View>

        {/* Acerca de */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <View style={styles.row}>
            <Icon name="info" size={20} color="#0ea5e9" />
            <Text style={styles.rowLabel}>Versión</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.row}>
            <Icon name="mail" size={20} color="#0ea5e9" />
            <Text style={styles.rowLabel}>Contacto y soporte</Text>
          </TouchableOpacity>
        </View>
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
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    gap: 12,
  },
  rowLabel: { flex: 1, color: "#0f172a", fontWeight: "500" },
  rowValue: { color: "#64748b", fontSize: 14 },
});