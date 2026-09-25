import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  carregarPreferenciaSom,
  definirSom,
  iniciarMusica,
  pararMusica,
  tocarImpacto,
  tocarLatido,
} from "../../game/audio";
import { resetRuntime, runtime, vibrar } from "../../game/runtime";
import { gameStore, useGameStore } from "../../game/store";
import { useSwipeControls } from "../../game/useSwipeControls";
import { Dog } from "./Dog";
import { DogShadow } from "./DogShadow";
import { Dust } from "./Dust";
import { HUD } from "./HUD";
import { Road } from "./Road";
import { World } from "./World";

function CameraRig() {
  const { camera } = useThree();

  const time = useRef(0);
  const lastPlayerX = useRef(0);
  const lateralVelocity = useRef(0);

  useEffect(() => {
    camera.position.set(0, 4.6, 9.5);
    camera.lookAt(0, 1.25, -7);
  }, [camera]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    time.current += dt;

    const speedProgress = Math.min(
      1,
      Math.max(0, (runtime.speed - 7.5) / (27 - 7.5)),
    );

    // Detecta a velocidade da mudança de pista.
    const currentX = runtime.playerX;
    
    const dx = currentX - lastPlayerX.current;
    lastPlayerX.current = currentX;

    // Inclinação suave quando o cachorro muda de pista.
    const laneLean = THREE.MathUtils.clamp(dx * -0.45, -0.08, 0.08);

    // Balanço natural da câmera durante a corrida.
    const runBob =
      runtime.alive
        ? Math.sin(time.current * (7 + speedProgress * 3)) *
          (0.018 + speedProgress * 0.012)
        : 0;

    // Pequeno movimento lateral para dar vida à câmera.
    const sideBob =
  runtime.alive
    ? Math.sin(time.current * 3.4) *
      (0.006 + speedProgress * 0.009)
    : 0;

    // A câmera aproxima ligeiramente conforme a velocidade aumenta.
    const targetZ = THREE.MathUtils.lerp(9.5, 8.7, speedProgress);

    // Altura aumenta muito levemente em velocidades maiores.
    const targetY =
      4.6 +
      speedProgress * 0.18 +
      runBob;

    // A câmera acompanha o cachorro, mas sem ficar presa a ele.
    const targetX =
  runtime.playerX * 0.28 +
  sideBob;
    // Suavização da posição.
    camera.position.x +=
      (targetX - camera.position.x) *
      Math.min(1, 7 * dt);

    camera.position.y +=
      (targetY - camera.position.y) *
      Math.min(1, 8 * dt);

    camera.position.z +=
      (targetZ - camera.position.z) *
      Math.min(1, 5 * dt);

    // Tremor do impacto.
    if (runtime.shake > 0) {
      runtime.shake = Math.max(
        0,
        runtime.shake - dt * 3.8,
      );
    }

    const shake = runtime.shake * runtime.shake;

    const shakeX =
      (Math.random() - 0.5) *
      0.55 *
      shake;

    const shakeY =
      (Math.random() - 0.5) *
      0.45 *
      shake;

    const shakeRoll =
      (Math.random() - 0.5) *
      0.10 *
      shake;

    camera.position.x += shakeX;
    camera.position.y += shakeY;

    // Ponto para onde a câmera olha.
    const lookX = runtime.playerX * 0.28;
    const lookY = 1.25 + speedProgress * 0.08;
    const lookZ = -7.5;

    camera.lookAt(lookX, lookY, lookZ);

    // IMPORTANTE:
    // definimos a rotação Z diretamente em vez de usar +=.
    // Isso evita acumular rotação a cada frame.
    const targetRoll =
      laneLean +
      Math.sin(time.current * 3.1) *
        0.004 *
        speedProgress +
      shakeRoll;

    camera.rotation.z = THREE.MathUtils.lerp(
      camera.rotation.z,
      targetRoll,
      Math.min(1, 8 * dt),
    );
  });

  return null;
}


/** Sincroniza a pontuação com a interface algumas vezes por segundo. */
function ScoreSync() {
  const acc = useRef(0);
  useFrame((_, delta) => {
    acc.current += delta;
    if (acc.current < 0.12) return;
    acc.current = 0;
    if (gameStore.get().score !== runtime.score) {
      gameStore.set({ score: runtime.score });
    }
  });
  return null;
}

export function GameCanvas() {
  const { phase } = useGameStore();
  const [runId, setRunId] = useState(0);
  useSwipeControls(phase === "jogando");

  useEffect(() => {
    gameStore.loadBest();
    gameStore.set({ som: carregarPreferenciaSom() });
    const onVisibilityChange = () => {
      if (document.hidden) {
        pararMusica();
      } else if (gameStore.get().phase === "jogando" && gameStore.get().som) {
        iniciarMusica();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      pararMusica();
    };
  }, []);

  const alternarSom = useCallback(() => {
    const novo = !gameStore.get().som;
    definirSom(novo);
    gameStore.set({ som: novo });
  }, []);

  const iniciar = useCallback(() => {
    resetRuntime();
    setRunId((n) => n + 1);
    gameStore.set({ phase: "jogando", score: 0, coins: 0, treats: 0 });
    tocarLatido();
    iniciarMusica();
  }, []);

  const perder = useCallback(() => {
    if (!runtime.alive) return;
    runtime.alive = false;
    // Reação ao impacto: tremor de câmera + tombo do cachorro + vibração
    runtime.shake = 1;
    runtime.hitTimer = 0;
    runtime.wagTimer = 0;
    vibrar([0, 70, 45, 120]);
    tocarImpacto();
    gameStore.saveBest(runtime.score);
    // pequeno atraso para o jogador ver o tombo antes da tela de fim
    window.setTimeout(() => {
      gameStore.set({
        phase: "fim",
        score: runtime.score,
        coins: runtime.coins,
        treats: runtime.treats,
      });
    }, 550);
  }, []);

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-sky touch-none">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.3, 9], fov: 58 }}>
        <color attach="background" args={["#8fd3f0"]} />
        <fog attach="fog" args={["#a9dff5", 45, 105]} />
        <ambientLight intensity={0.75} />
        <hemisphereLight args={["#cbeafd", "#8b7554", 0.6]} />
        <directionalLight
          position={[6, 12, 6]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        <CameraRig />
        <ScoreSync />
        <Road />
        <DogShadow />
        <Dog />
        {phase === "jogando" && <Dust />}
        {phase !== "inicio" && <World key={runId} onHit={perder} />}
      </Canvas>

      <HUD onJogar={iniciar} onAlternarSom={alternarSom} />
    </div>
  );
}
