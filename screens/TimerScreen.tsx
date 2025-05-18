// screens/TimerScreen.tsx

import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getRoutineById, logRoutineUsage } from "../services/routineService";
import { Routine } from "../types/Routine";
import { generateRoutineSteps, RoutineStep } from "../utils/generateRoutineSteps";
import * as Notifications from "expo-notifications";

type Props = NativeStackScreenProps<RootStackParamList, "Timer">;

export default function TimerScreen({ route, navigation }: Props) {
  const { routineId } = route.params;
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
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
      <Text style={styles.label}>{step.label}</Text>
      <Text style={styles.time}>{timeLeft}s</Text>

      <View style={styles.controls}>
        <Button title="⏪" onPress={goToPreviousStep} disabled={currentStep === 0} />
        <Button title={isRunning ? "⏸️ Pausar" : "▶️ Reanudar"} onPress={togglePause} />
        <Button title="⏩" onPress={goToNextStep} />
      </View>

      <Button title="Finalizar rutina" onPress={finishRoutine} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  label: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  time: { fontSize: 64, fontWeight: "bold", marginBottom: 30 },
  controls: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
});
