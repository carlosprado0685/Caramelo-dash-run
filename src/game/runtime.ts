import { SPEED_START } from "./constants";

/**
 * Estado mutável compartilhado entre a cena 3D e os controles.
 * Fica fora do React de propósito: é lido/escrito a cada frame.
 */
export const runtime = {
  lane: 1,
  playerX: 0,
  playerY: 0,
  velocityY: 0,
  rolling: false,
  rollTimer: 0,
  speed: SPEED_START,
  distance: 0,
  score: 0,
  coins: 0,
  treats: 0,
  alive: false,
  /** Tempo restante de "rabo abanando" (ao pegar petisco). */
  wagTimer: 0,
  /** Intensidade do tremor de câmera ao bater. */
  shake: 0,
  /** Tempo desde a batida (usado na reação ao impacto). */
  hitTimer: 0,
};

export function resetRuntime() {
  runtime.lane = 1;
  runtime.playerX = 0;
  runtime.playerY = 0;
  runtime.velocityY = 0;
  runtime.rolling = false;
  runtime.rollTimer = 0;
  runtime.speed = SPEED_START;
  runtime.distance = 0;
  runtime.score = 0;
  runtime.coins = 0;
  runtime.treats = 0;
  runtime.wagTimer = 0;
  runtime.shake = 0;
  runtime.hitTimer = 0;
  runtime.alive = true;
}

export type Command = "esquerda" | "direita" | "pular" | "rolar";

const listeners = new Set<(c: Command) => void>();

export function onCommand(fn: (c: Command) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function sendCommand(c: Command) {
  listeners.forEach((fn) => fn(c));
}

/** Vibração curta do aparelho (Android). */
export function vibrar(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    // aparelho sem suporte: ignora
  }
}
