import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CollectibleKind } from "../../game/constants";

/** Moeda dourada e petisco (ossinho) em estilo cartoon, com brilho leve. */
export function CollectibleModel({ kind }: { kind: CollectibleKind }) {
  const coinMat = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coinMat.current) {
      coinMat.current.emissiveIntensity = 0.35 + (Math.sin(t * 6) * 0.5 + 0.5) * 0.55;
    }
    if (glow.current && glowMat.current) {
      const p = Math.sin(t * 4) * 0.5 + 0.5;
      const s = 1 + p * 0.22;
      glow.current.scale.set(s, s, s);
      glowMat.current.opacity = 0.18 + p * 0.22;
      glow.current.rotation.z = t * 0.8;
    }
  });

  if (kind === "moeda") {
    return (
      <group>
        <mesh rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.07, 20]} />
          <meshStandardMaterial
            ref={coinMat}
            color="#ffc93c"
            emissive="#ffb200"
            emissiveIntensity={0.35}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
        {/* halo de brilho */}
        <mesh ref={glow}>
          <sphereGeometry args={[0.38, 14, 12]} />
          <meshBasicMaterial
            ref={glowMat}
            color="#ffe9a0"
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group rotation-z={0.4}>
      <mesh rotation-z={Math.PI / 2} castShadow>
        <capsuleGeometry args={[0.09, 0.34, 4, 10]} />
        <meshStandardMaterial
          color="#f6e7c8"
          emissive="#8a5a1e"
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
      {[-0.28, 0.28].map((x) =>
        [-0.1, 0.1].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0]}>
            <sphereGeometry args={[0.12, 12, 10]} />
            <meshStandardMaterial color="#fff3da" roughness={0.6} />
          </mesh>
        )),
      )}
      {/* destaque pulsante do petisco */}
      <mesh ref={glow} rotation-z={-0.4}>
        <torusGeometry args={[0.36, 0.045, 8, 20]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#ffd27a"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
