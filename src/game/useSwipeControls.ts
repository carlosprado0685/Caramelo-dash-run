import { useEffect } from "react";
import { sendCommand, type Command } from "./runtime";

const THRESHOLD = 16; // px — gesto curto já conta
const REARM_MS = 90; // tempo mínimo entre dois comandos do mesmo dedo

/**
 * Controles por deslizar (touch/ponteiro) + teclado para testes no navegador.
 * Reconhece o gesto assim que passa do limite e permite deslizes em sequência
 * sem levantar o dedo.
 */
export function useSwipeControls(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let lastCommandAt = 0;
    let tracking = false;

    const begin = (x: number, y: number) => {
      startX = x;
      startY = y;
      startTime = performance.now();
      tracking = true;
    };

    const track = (x: number, y: number) => {
      if (!tracking) return;
      const dx = x - startX;
      const dy = y - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < THRESHOLD && absY < THRESHOLD) return;
      const now = performance.now();
      if (now - lastCommandAt < REARM_MS) return;
      lastCommandAt = now;

      let cmd: Command;
      if (absX > absY) cmd = dx > 0 ? "direita" : "esquerda";
      else cmd = dy > 0 ? "rolar" : "pular";
      sendCommand(cmd);

      // re-arma a partir da posição atual: permite deslizar de novo na sequência
      startX = x;
      startY = y;
    };

    const finish = (x: number, y: number) => {
      if (!tracking) return;
      const quickTap =
        Math.abs(x - startX) < THRESHOLD &&
        Math.abs(y - startY) < THRESHOLD &&
        performance.now() - startTime < 220 &&
        performance.now() - lastCommandAt > REARM_MS;
      tracking = false;
      if (quickTap) sendCommand("pular"); // toque rápido = pulo
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) begin(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      finish(t?.clientX ?? startX, t?.clientY ?? startY);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // já tratado pelos eventos de toque
      begin(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      track(e.clientX, e.clientY);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      finish(e.clientX, e.clientY);
    };

    const key = (e: KeyboardEvent) => {
      const map: Record<string, Command> = {
        ArrowLeft: "esquerda",
        ArrowRight: "direita",
        ArrowUp: "pular",
        ArrowDown: "rolar",
        a: "esquerda",
        d: "direita",
        w: "pular",
        s: "rolar",
        " ": "pular",
      };
      const cmd = map[e.key];
      if (cmd) {
        e.preventDefault();
        sendCommand(cmd);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", key);
    };
  }, [enabled]);
}
