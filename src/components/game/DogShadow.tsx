import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { runtime } from "../../game/runtime";

/** Sombra suave (mancha) sob o cachorro: ajuda a perceber a altura do pulo. */
export function DogShadow() {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const h = Math.max(0, runtime.playerY);
    const k = Math.max(0.35, 1 - h * 0.35);
    m.position.set(runtime.playerX, 0.025, 0);
    m.scale.set(k, k * 1.25, 1);
    if (mat.current) mat.current.opacity = 0.34 * k;
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.025, 0]}>
      <circleGeometry args={[0.5, 24]} />
      <meshBasicMaterial
        ref={mat}
        color="#1b1207"
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </mesh>
  );
}
