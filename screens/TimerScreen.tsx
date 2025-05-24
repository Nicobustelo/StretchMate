// screens/TimerScreen.tsx

import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getRoutineById, logRoutineUsage } from "../services/routineService";
import { Routine } from "../types/Routine";
import { generateRoutineSteps, RoutineStep } from "../utils/generateRoutineSteps";
import Icon from "react-native-vector-icons/Feather";
import * as Notifications from "expo-notifications";

type Props = NativeStackScreenProps<RootStackParamList, "Timer">;

export default function TimerScreen({ route, navigation }: Props) {
  const { routineId } = route.params;
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const load = async () => {
      const r = await getRoutineById(routineId);
      if (r) {
        setRoutine(r);
        const s = generateRoutineSteps(r);
        setSteps(s);
        setTimeLeft(s[0].duration);
        setCurrentStep(0);
      }
    };
    load();
  }, [routineId]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      goToNextStep();
    }

    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isRunning, timeLeft]);

    // Guardar tiempo de finalización al pausar/salir
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (appState.match(/active/) && nextAppState.match(/inactive|background/)) {
        if (isRunning && timeLeft > 0) {
          const endTime = Date.now() + timeLeft * 1000;
          await AsyncStorage.setItem("timerEndTime", endTime.toString());
          await AsyncStorage.setItem("timerStep", currentStep.toString());
        }
      }
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [isRunning, timeLeft, currentStep, appState]);

  // Al volver a la app, restaurar el tiempo restante
  useEffect(() => {
    const restoreTimer = async () => {
      const endTimeStr = await AsyncStorage.getItem("timerEndTime");
      const stepStr = await AsyncStorage.getItem("timerStep");
      if (endTimeStr && stepStr) {
        const endTime = parseInt(endTimeStr, 10);
        const now = Date.now();
        const remaining = Math.max(0, Math.round((endTime - now) / 1000));
        setCurrentStep(Number(stepStr));
        setTimeLeft(remaining);
        setIsRunning(remaining > 0);
        await AsyncStorage.removeItem("timerEndTime");
        await AsyncStorage.removeItem("timerStep");
      }
    };
    if (appState === "active") {
      restoreTimer();
    }
  }, [appState]);

  const goToNextStep = () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    const next = currentStep + 1;
    if (next < steps.length) {
      setCurrentStep(next);
      setTimeLeft(steps[next].duration);
    } else {
      finishRoutine();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setTimeLeft(steps[prev].duration);
    }
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const finishRoutine = async () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    setIsRunning(false);
    await logRoutineUsage(routineId);

    // Notificación en 3 horas
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de estirar",
        body: `Ya pasaron 3 horas desde tu última rutina "${routine?.name}"`,
      },
      trigger: {
        seconds: 3 * 60 * 60,
        repeats: false,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
    });

    Alert.alert("¡Rutina completada!", "Buen trabajo.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  if (!routine || steps.length === 0) return <Text>Cargando...</Text>;

  const step = steps[currentStep];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{routine.name}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="x" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.stepLabel}>{step.label}</Text>
        <Text style={styles.time}>{timeLeft}s</Text>

        {/* Controles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, currentStep === 0 && styles.disabledBtn]}
            onPress={goToPreviousStep}
            disabled={currentStep === 0}
          >
            <Icon name="rewind" size={24} color={currentStep === 0 ? "#94a3b8" : "#0284c7"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={togglePause}
          >
            <Icon name={isRunning ? "pause" : "play"} size={24} color="#0284c7" />
            <Text style={styles.controlBtnText}>{isRunning ? "Pausar" : "Reanudar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={goToNextStep}
          >
            <Icon name="fast-forward" size={24} color="#0284c7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón finalizar */}
      <TouchableOpacity style={styles.finishBtn} onPress={finishRoutine}>
        <Icon name="flag" size={20} color="white" />
        <Text style={styles.finishBtnText}>Finalizar rutina</Text>
      </TouchableOpacity>
    </View>
  );
}

// Nuevo estilo inspirado en HomeScreen y CreateRoutineScreen
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 24,
    alignItems: "center",
    elevation: 2,
  },
  stepLabel: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  time: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#0284c7",
    marginBottom: 24,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 8,
  },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  controlBtnText: {
    marginLeft: 8,
    color: "#0284c7",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  finishBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 24,
    marginTop: 16,
  },
  finishBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});