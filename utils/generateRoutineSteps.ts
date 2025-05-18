// utils/generateRoutineSteps.ts

import { Routine } from "../types/Routine";

export type RoutineStep = {
  label: string;
  duration: number;
};

export function generateRoutineSteps(routine: Routine): RoutineStep[] {
  const steps: RoutineStep[] = [];

  if (routine.preparationTime > 0) {
    steps.push({ label: "Preparación", duration: routine.preparationTime });
  }

  for (let i = 1; i <= routine.sets; i++) {
    steps.push({ label: `Trabajo ${i}`, duration: routine.workTime });
    if (i < routine.sets && routine.restTime > 0) {
      steps.push({ label: `Descanso ${i}`, duration: routine.restTime });
    }
  }

  return steps;
}
