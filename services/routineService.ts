// services/routineService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, RoutineUsage } from "../types/Routine";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ROUTINES_KEY = "ROUTINES";

export async function saveRoutine(routine: Omit<Routine, "id" | "createdAt">): Promise<Routine> {
  const all = await getAllRoutines();
  const newRoutine: Routine = {
    ...routine,
    id: uuidv4(),
    createdAt: Date.now(),
  };
  await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify([...all, newRoutine]));
  return newRoutine;
}

export async function getAllRoutines(): Promise<Routine[]> {
  const json = await AsyncStorage.getItem(ROUTINES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function getRoutineById(id: string): Promise<Routine | undefined> {
  const all = await getAllRoutines();
  return all.find((r) => r.id === id);
}

export async function deleteRoutine(id: string): Promise<void> {
  const all = await getAllRoutines();
  const newRoutines = all.filter((r) => r.id !== id);
  await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
}

export async function logRoutineUsage(id: string): Promise<void> {
  const all = await getAllRoutines();
  const routine = all.find((r) => r.id === id);
  if (routine) {
    routine.lastUsed = Date.now();
    await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(all));
  }
}

export async function getRoutineHistory(): Promise<(RoutineUsage & { routineName: string })[]> {
    const all = await getAllRoutines();
    const history: RoutineUsage[] = [];
    for (const routine of all) {
        if (routine.lastUsed) {
        history.push({
            id: uuidv4(),
            routineId: routine.id,
            timestamp: routine.lastUsed,
        });
        }
    }
    return history.map((h) => ({
        ...h,
        routineName: all.find((r) => r.id === h.routineId)?.name || "Desconocida",
    }));
}

export async function updateRoutine(routine: Routine): Promise<void> {
    const all = await getAllRoutines();
    const index = all.findIndex((r) => r.id === routine.id);
    if (index !== -1) {
        all[index] = routine;
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(all));
    }
}
