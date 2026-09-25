import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GRAVITY,
  JUMP_VELOCITY,
  LANE_LERP,
  LANE_X,
  ROLL_DURATION,
} from "../../game/constants";
import { onCommand, runtime } from "../../game/runtime";

const FUR = "#c9803c";
const FUR_LIGHT = "#e6ab6b";
const CREAM = "#f6e2c3";
const NOSE = "#3a2a22";

/** Cachorro caramelo cartoon, montado com primitivas e animado por código. */
export function Dog() {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = useRef<Array<THREE.Group | null>>([null, null, null, null]);

  useEffect(() => {
    const off = onCommand((cmd) => {
      if (!runtime.alive) return;
      if (cmd === "esquerda") runtime.lane = Math.max(0, runtime.lane - 1);
      if (cmd === "direita") runtime.lane = Math.min(2, runtime.lane + 1);
      if (cmd === "pular" && runtime.playerY <= 0.01) {
        runtime.velocityY = JUMP_VELOCITY;
        runtime.rolling = false;
        runtime.rollTimer = 0;
      }
      if (cmd === "rolar") {
        runtime.rolling = true;
        runtime.rollTimer = ROLL_DURATION;
        if (runtime.playerY > 0) runtime.velocityY = -JUMP_VELOCITY * 0.9;
      }
    });
    return () => {
      off();
    };
  }, []);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const g = group.current;
    if (!g) return;

    // Troca de pista
    const targetX = LANE_X[runtime.lane] ?? 0;
    runtime.playerX += (targetX - runtime.playerX) * Math.min(1, LANE_LERP * dt);

    // Pulo
    if (runtime.alive || runtime.playerY > 0) {
      runtime.velocityY -= GRAVITY * dt;
      runtime.playerY = Math.max(0, runtime.playerY + runtime.velocityY * dt);
      if (runtime.playerY === 0 && runtime.velocityY < 0) runtime.velocityY = 0;
    }

    // Rolamento
    if (runtime.rollTimer > 0) {
      runtime.rollTimer -= dt;
      if (runtime.rollTimer <= 0) runtime.rolling = false;
    }

    // Reação ao impacto: recua, gira e tomba ao bater
    if (!runtime.alive) runtime.hitTimer += dt;
    const hit = runtime.alive ? 0 : Math.min(1, runtime.hitTimer / 0.45);

    g.position.set(
      runtime.playerX,
      runtime.playerY + Math.sin(hit * Math.PI) * 0.35,
      hit * 1.5,
    );
    g.rotation.z = (targetX - runtime.playerX) * -0.12 + hit * 0.7;
    g.rotation.x = hit * -0.9;

    // Corpo: abaixa e gira ao rolar
    if (body.current) {
      const rollT = runtime.rolling ? 1 : 0;
      body.current.rotation.x = THREE.MathUtils.lerp(
        body.current.rotation.x,
        rollT * -1.15,
        Math.min(1, 14 * dt),
      );
      const targetY = runtime.rolling ? 0.28 : 0.55;
      body.current.position.y = THREE.MathUtils.lerp(
        body.current.position.y,
        targetY,
        Math.min(1, 14 * dt),
      );
    }

    const t = state.clock.elapsedTime;
    const cadence = runtime.alive ? 14 : 0;

    // Pernas correndo
    legs.current.forEach((leg, i) => {
      if (!leg) return;
      const phase = i % 2 === 0 ? 0 : Math.PI;
      const front = i < 2 ? 0 : Math.PI * 0.5;
      const airborne = runtime.playerY > 0.05;
      leg.rotation.x = airborne
        ? -0.7 + (i < 2 ? 0.4 : -0.2)
        : Math.sin(t * cadence + phase + front) * 0.85;
    });

    // Rabo: abana forte e rápido por um instante ao pegar petisco
    if (runtime.wagTimer > 0) runtime.wagTimer = Math.max(0, runtime.wagTimer - dt);
    const wag = runtime.wagTimer > 0 ? 1 : 0;
    if (tail.current) {
      const freq = 10 + wag * 16;
      const amp = 0.6 + wag * 0.75;
      tail.current.rotation.y = Math.sin(t * freq) * amp;
      tail.current.rotation.x = wag ? -0.35 : 0;
    }
    if (head.current) {
      head.current.rotation.x =
        Math.sin(t * cadence * 0.5) * 0.06 + (wag ? Math.sin(t * 16) * 0.08 : 0);
    }
  });

  return (
    <group ref={group} scale={0.92}>
      <group ref={body} position={[0, 0.55, 0]}>
        {/* tronco */}
        <mesh castShadow rotation-x={Math.PI / 2}>
          <capsuleGeometry args={[0.34, 0.52, 6, 16]} />
          <meshStandardMaterial
  color={FUR}
  roughness={0.72}
  metalness={0}
  envMapIntensity={0.7}
/>
        </mesh>
        {/* barriga clara */}
        <mesh position={[0, -0.18, 0.02]} rotation-x={Math.PI / 2} scale={[0.9, 1, 0.7]}>
          <capsuleGeometry args={[0.28, 0.44, 6, 12]} />
          <meshStandardMaterial color={CREAM} roughness={0.85} />
        </mesh>

        {/* cabeça */}
        <group ref={head} position={[0, 0.3, -0.52]}>
          <mesh castShadow>
            <sphereGeometry args={[0.33, 24, 20]} />
            <meshStandardMaterial color={FUR_LIGHT} roughness={0.7} />
          </mesh>
          {/* focinho */}
          <mesh position={[0, -0.07, -0.28]} rotation-x={-Math.PI / 2}>
            <capsuleGeometry args={[0.14, 0.16, 4, 12]} />
            <meshStandardMaterial color={CREAM} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.05, -0.46]}>
            <sphereGeometry args={[0.075, 16, 12]} />
            <meshStandardMaterial color={NOSE} roughness={0.35} />
          </mesh>
          {/* olhos */}
          {[-0.13, 0.13].map((x) => (
            <group key={x} position={[x, 0.09, -0.24]}>
              <mesh>
                <sphereGeometry args={[0.085, 16, 12]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, -0.055]}>
                <sphereGeometry args={[0.05, 16, 12]} />
                <meshStandardMaterial color={NOSE} roughness={0.2} />
              </mesh>
              <mesh position={[0.02, 0.025, -0.085]}>
                <sphereGeometry args={[0.016, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
          {/* orelhas caídas */}
          {[-1, 1].map((s) => (
            <mesh
              key={s}
              position={[s * 0.28, 0.08, 0.02]}
              rotation={[0.2, 0, s * 0.5]}
              castShadow
            >
              <capsuleGeometry args={[0.09, 0.28, 4, 10]} />
              <meshStandardMaterial color={FUR} roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* cauda */}
        <group ref={tail} position={[0, 0.14, 0.42]}>
          <mesh position={[0, 0.16, 0.1]} rotation-x={-0.7} castShadow>
            <capsuleGeometry args={[0.07, 0.3, 4, 10]} />
            <meshStandardMaterial color={FUR_LIGHT} roughness={0.8} />
          </mesh>
        </group>

        {/* pernas */}
        {([
          [-0.22, -0.42],
          [0.22, -0.42],
          [-0.22, 0.32],
          [0.22, 0.32],
        ] as Array<[number, number]>).map(([x, z], i) => (
          <group
            key={`${x}-${z}`}
            ref={(el) => {
              legs.current[i] = el;
            }}
            position={[x, -0.24, z]}
          >
            <mesh position={[0, -0.14, 0]} castShadow>
              <capsuleGeometry args={[0.075, 0.2, 4, 10]} />
              <meshStandardMaterial color={FUR} roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.28, -0.03]}>
              <sphereGeometry args={[0.085, 12, 10]} />
              <meshStandardMaterial color={CREAM} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
