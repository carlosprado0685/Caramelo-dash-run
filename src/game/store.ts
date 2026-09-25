import { useSyncExternalStore } from "react";
import { BEST_SCORE_KEY } from "./constants";

export type Phase = "inicio" | "jogando" | "fim";

type State = {
  phase: Phase;
  score: number;
  coins: number;
  treats: number;
  best: number;
  som: boolean;
};

let state: State = { phase: "inicio", score: 0, coins: 0, treats: 0, best: 0, som: true };
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export const gameStore = {
  get: () => state,
  set,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  loadBest() {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(BEST_SCORE_KEY);
    const best = raw ? Number.parseInt(raw, 10) : 0;
    if (Number.isFinite(best) && best > 0) set({ best });
  },
  saveBest(score: number) {
    if (score <= state.best) return;
    set({ best: score });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    }
  },
};

export function useGameStore() {
  return useSyncExternalStore(
    (fn) => {
      const unsub = gameStore.subscribe(fn);
      return () => {
        unsub();
      };
    },
    () => state,
    () => state,
  );
}

