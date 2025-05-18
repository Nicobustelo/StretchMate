// types/Routine.ts

export interface Routine {
  id: string; // UUID
  name: string;
  preparationTime: number; // en segundos
  workTime: number;        // en segundos
  restTime: number;        // en segundos
  sets: number;
  createdAt: number;       // timestamp
  lastUsed?: number;
}

export type RoutineUsage = {
  id: string;
  routineId: string;
  timestamp: number; // en milisegundos (Date.now())
};

