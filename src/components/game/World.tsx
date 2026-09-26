import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  CLEAR_BY,
  COIN_POINTS,
  DESPAWN_Z,
  HIT_Z,
  LANE_X,
  SPAWN_Z,
  SPEED_GAIN,
  SPEED_MAX,
  SPEED_START,

  TREAT_POINTS,
  type CollectibleKind,
  type ObstacleKind,
} from "../../game/constants";
import { tocarMoeda, tocarPetisco } from "../../game/audio";
import { runtime } from "../../game/runtime";
import { gameStore } from "../../game/store";
import { CollectibleModel } from "./Collectible";
import { ObstacleModel } from "./Obstacle";

type Entity =
  | { id: number; type: "obstaculo"; kind: ObstacleKind; lane: number; z: number }
  | { id: number; type: "item"; kind: CollectibleKind; lane: number; z: number };

const OBSTACLES: ObstacleKind[] = [
  "cone",
  "cone",
  "caixa",
  "lixeira",
  "pneus",
  "caixa-alta",
  "placa",
  "buraco",
  "bicicleta",
  "moto",
  "carrinho",
  "banco",
];

const OBSTACLES_NO_BURACO: ObstacleKind[] = OBSTACLES.filter(
  (kind) => kind !== "buraco",
);

/** Altura mÃ­nima do pulo para passar por cima de cada obstÃ¡culo. */
const JUMP_CLEAR: Partial<Record<ObstacleKind, number>> = {
  cone: 0.55,
  buraco: 0.45,
  caixa: 0.55,
  lixeira: 0.65,
  pneus: 0.60,
};

/** Altura mÃ¡xima do cachorro para passar por baixo (rolando). */
const ROLL_MAX_Y = 0.25;

let nextId = 1;

function randomInt(n: number) {
  return Math.floor(Math.random() * n);
}

function pick<T>(list: T[]): T {
  return list[randomInt(list.length)]!;
}
const CROSSWALK_BASE_ZS = [-10, -58];
const CROSSWALK_LENGTH = 3.2;

function isCrosswalkNearZ(z: number): boolean {
  const distance = runtime.distance;

  return CROSSWALK_BASE_ZS.some((baseZ) => {
    const currentZ = baseZ + distance;
    const wrappedZ = currentZ - Math.floor((currentZ + 84) / 96) * 96;
    return Math.abs(wrappedZ - z) < CROSSWALK_LENGTH / 2 + 0.8;
  });
}
/**
 * Gera um "pedaÃ§o" de pista.
 * Regras de seguranÃ§a:
 *  - nunca bloqueia as 3 pistas;
 *  - a pista segura fica sempre vizinha da pista segura anterior (alcanÃ§Ã¡vel);
 *  - itens aparecem apenas na pista segura.
 */
function buildChunk(
  baseZ: number,
  difficulty: number,
  prevSafeLane: number,
): { entities: Entity[]; safeLane: number } {
  const out: Entity[] = [];

  // pistas alcanÃ§Ã¡veis a partir da anterior
  const reachable = [prevSafeLane - 1, prevSafeLane, prevSafeLane + 1].filter(
    (l) => l >= 0 && l <= 2,
  );
  const safeLane = pick(reachable);

  const others = [0, 1, 2].filter((l) => l !== safeLane);
  // no mÃ¡ximo 2 obstÃ¡culos, e sÃ³ em dificuldade alta
  const blockCount = difficulty > 0.55 && Math.random() < 0.4 ? 2 : 1;
  const blocked = blockCount >= 2 ? others : [pick(others)];
  const obstaclePool = isCrosswalkNearZ(baseZ)
    ? OBSTACLES_NO_BURACO
    : OBSTACLES;

  for (const lane of blocked) {
    const lanePool =
      lane === 1
        ? OBSTACLES_NO_BURACO
        : obstaclePool;

    out.push({
      id: nextId++,
      type: "obstaculo",
      kind: pick(lanePool),
      lane,
      z: baseZ,
    });
  }

  // Ã s vezes um obstÃ¡culo transponÃ­vel na prÃ³pria pista segura (mais adiante)
  if (difficulty > 0.3 && Math.random() < 0.35) {
    out.push({
      id: nextId++,
      type: "obstaculo",
      kind: pick(["cone", "caixa", "lixeira", "pneus", "placa", "caixa-alta"] as ObstacleKind[]),
      lane: safeLane,
      z: baseZ - 9,
    });
  }

  if (Math.random() < 0.85) {
    const isTreat = Math.random() < 0.18;
    const count = isTreat ? 1 : 3;
    for (let i = 0; i < count; i++) {
      out.push({
        id: nextId++,
        type: "item",
        kind: isTreat ? "petisco" : "moeda",
        lane: safeLane,
        z: baseZ + i * 1.7,
      });
    }
  }
  return { entities: out, safeLane };
}

export function World({ onHit }: { onHit: () => void }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const nextSpawn = useRef(0);
  const scoreAcc = useRef(0);
  const safeLane = useRef(1);
  const running = useRef(true);

  useEffect(() => {
    // Pista inicial (primeiros trechos calmos)
    const initial: Entity[] = [];
    let lane = 1;
    for (let i = 0; i < 8; i++) {
      const chunk = buildChunk(-30 - i * 13, 0, lane);
      lane = chunk.safeLane;
      initial.push(...chunk.entities);
    }
    safeLane.current = lane;
    setEntities(initial);
    nextSpawn.current = 0;
    return () => {
      running.current = false;
    };
  }, []);

  const remove = useCallback((id: number) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useFrame((_, rawDelta) => {
    if (!runtime.alive) return;
    const dt = Math.min(rawDelta, 0.05);

    // AceleraÃ§Ã£o suave: forte no comeÃ§o, quase nula perto do mÃ¡ximo
    const progress = Math.min(
      1,
      Math.max(0, (runtime.speed - SPEED_START) / (SPEED_MAX - SPEED_START)),
    );
    runtime.speed = Math.min(SPEED_MAX, runtime.speed + SPEED_GAIN * (1 - progress * 0.85) * dt);
    runtime.distance += runtime.speed * dt;

    scoreAcc.current += runtime.speed * dt * 0.55;
    if (scoreAcc.current >= 1) {
      const gained = Math.floor(scoreAcc.current);
      scoreAcc.current -= gained;
      runtime.score += gained;
    }

    // Spawn por distÃ¢ncia: espaÃ§o mÃ­nimo cresce com a velocidade (tempo de reaÃ§Ã£o)
    nextSpawn.current -= runtime.speed * dt;
    if (nextSpawn.current <= 0) {
      const reaction = runtime.speed * 0.85;
      nextSpawn.current = Math.max(reaction, 16 - runtime.distance / 400);
      const difficulty = Math.min(1, runtime.distance / 900);
      const chunk = buildChunk(SPAWN_Z, difficulty, safeLane.current);
      safeLane.current = chunk.safeLane;
      setEntities((prev) => [...prev, ...chunk.entities]);
    }
  });


  return (
    <group>
      {entities.map((e) =>
        e.type === "obstaculo" ? (
          <ObstacleEntity key={e.id} entity={e} onHit={onHit} onGone={remove} />
        ) : (
          <ItemEntity key={e.id} entity={e} onGone={remove} />
        ),
      )}
    </group>
  );
}

function useMover(startZ: number) {
  const ref = useRef<THREE.Group>(null);
  const z = useRef(startZ);
  return { ref, z };
}

function ObstacleEntity({
  entity,
  onHit,
  onGone,
}: {
  entity: Extract<Entity, { type: "obstaculo" }>;
  onHit: () => void;
  onGone: (id: number) => void;
}) {
  const { ref, z } = useMover(entity.z);
  const hitDone = useRef(false);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (runtime.alive) z.current += runtime.speed * dt;
    const g = ref.current;
    if (!g) return;
    g.position.set(LANE_X[entity.lane]!, 0, z.current);

    if (
      runtime.alive &&
      !hitDone.current &&
      Math.abs(z.current) < HIT_Z &&
      entity.lane === runtime.lane
    ) {
      const how = CLEAR_BY[entity.kind];

      // Pequena tolerância para deixar o salto natural no celular.
      const jumpHeight = runtime.playerY;
      const jumpClear = JUMP_CLEAR[entity.kind] ?? 0.75;

      const escaped =
        (how === "pular" && jumpHeight >= jumpClear) ||
        (how === "rolar" &&
          runtime.rolling &&
          jumpHeight <= ROLL_MAX_Y);

      if (!escaped) {
        hitDone.current = true;
        onHit();
      }
    }

    if (z.current > DESPAWN_Z) onGone(entity.id);
  });

  return (
    <group ref={ref}>
      <ObstacleModel kind={entity.kind} />
    </group>
  );
}

function ItemEntity({
  entity,
  onGone,
}: {
  entity: Extract<Entity, { type: "item" }>;
  onGone: (id: number) => void;
}) {
  const { ref, z } = useMover(entity.z);
  const taken = useRef(false);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (runtime.alive) z.current += runtime.speed * dt;
    const g = ref.current;
    if (!g) return;
    const bob = Math.sin(state.clock.elapsedTime * 3 + entity.id) * 0.08;
    g.position.set(LANE_X[entity.lane]!, 0.95 + bob, z.current);
    g.rotation.y += dt * 2.6;

    if (
      runtime.alive &&
      !taken.current &&
      Math.abs(z.current) < 1.2 &&
      entity.lane === runtime.lane &&
      runtime.playerY < 1.6
    ) {
      taken.current = true;
      if (entity.kind === "moeda") {
        runtime.coins += 1;
        runtime.score += COIN_POINTS;
        tocarMoeda();
      } else {
        runtime.treats += 1;
        runtime.score += TREAT_POINTS;
        // rabo abanando por um instante
        runtime.wagTimer = 1.1;
        tocarPetisco();
      }
      gameStore.set({
        coins: runtime.coins,
        treats: runtime.treats,
        score: runtime.score,
      });
      onGone(entity.id);
      return;
    }

    if (z.current > DESPAWN_Z) onGone(entity.id);
  });

  return (
    <group ref={ref}>
      <CollectibleModel kind={entity.kind} />
    </group>
  );
}


