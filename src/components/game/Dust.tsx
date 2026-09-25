import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SPEED_START } from "../../game/constants";
import { runtime } from "../../game/runtime";

const COUNT = 14; // leve o suficiente para celular
const LIFE = 0.42; // segundos de vida de cada partícula

type Particle = { x: number; y: number; z: number; vx: number; vy: number; vz: number; t: number };

/**
 * Poeira cartoon atrás das patas. Usa um único instancedMesh (1 draw call)
 * com partículas recicladas — sem alocação por frame.
 */
export function Dust() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const spawnAcc = useRef(0);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        t: 0,
      })),
    [],
  );

  useFrame((_, rawDelta) => {
    const inst = mesh.current;
    if (!inst) return;
    const dt = Math.min(rawDelta, 0.05);

    // No chão e correndo: gera poeira. No ar: pausa.
    const grounded = runtime.playerY < 0.08;
    const rate = runtime.alive && grounded ? 14 : 0;
    spawnAcc.current += rate * dt;

    while (spawnAcc.current >= 1) {
      spawnAcc.current -= 1;
      const p = particles.find((q) => q.t <= 0);
      if (!p) break;
      const side = Math.random() < 0.5 ? -1 : 1;
      p.x = runtime.playerX + side * (0.14 + Math.random() * 0.12);
      p.y = 0.05 + Math.random() * 0.05;
      p.z = 0.35 + Math.random() * 0.25;
      p.vx = side * (0.2 + Math.random() * 0.35);
      p.vy = 0.5 + Math.random() * 0.7;
      p.vz = 1.4 + Math.random() * 1.6 + runtime.speed * 0.04;
      p.t = LIFE;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!;
      if (p.t > 0) {
        p.t -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 1.2 * dt;
      }
      const life = Math.max(0, p.t) / LIFE;
      const scale = p.t > 0 ? 0.055 + (1 - life) * 0.1 : 0;
      dummy.position.set(p.x, p.t > 0 ? p.y : -10, p.z);
      dummy.scale.setScalar(scale * (0.5 + life * 0.5));
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;

    const material = inst.material as THREE.MeshBasicMaterial;
    material.opacity = 0.24 * Math.min(1, runtime.speed / (SPEED_START * 1.4));
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 5]} />
      <meshBasicMaterial color="#efe6d4" transparent opacity={0.24} depthWrite={false} />
    </instancedMesh>
  );
}
