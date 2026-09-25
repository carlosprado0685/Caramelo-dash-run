import type { ObstacleKind } from "../../game/constants";

/** Modelos cartoon simples para cada obstáculo. */
export function ObstacleModel({ kind }: { kind: ObstacleKind }) {
  switch (kind) {
    case "cone":
      return (
        <group>
          <mesh position={[0, 0.05, 0]} >
            <boxGeometry args={[0.62, 0.1, 0.62]} />
            <meshStandardMaterial color="#2f2f36" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <coneGeometry args={[0.28, 0.9, 16]} />
            <meshStandardMaterial color="#f0621f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.19, 0.22, 0.14, 16]} />
            <meshStandardMaterial color="#f7f2e8" roughness={0.6} />
          </mesh>
        </group>
      );

    case "caixa":
      return (
        <mesh position={[0, 0.42, 0]} >
          <boxGeometry args={[0.9, 0.84, 0.9]} />
          <meshStandardMaterial color="#b3813f" roughness={0.85} />
        </mesh>
      );

    case "caixa-alta":
      return (
        <group>
          <mesh position={[0, 1.75, 0]} >
            <boxGeometry args={[1.5, 0.9, 0.9]} />
            <meshStandardMaterial color="#8e6230" roughness={0.85} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.62, 0.9, 0]}>
              <boxGeometry args={[0.14, 1.8, 0.14]} />
              <meshStandardMaterial color="#5d5f6b" roughness={0.6} />
            </mesh>
          ))}
        </group>
      );

    case "buraco":
      return (
        <group>
          <mesh position={[0, 0.012, 0]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.85, 24]} />
            <meshStandardMaterial color="#191922" roughness={1} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.85, 1, 24]} />
            <meshStandardMaterial color="#6a6a72" roughness={0.9} />
          </mesh>
        </group>
      );

    case "bicicleta":
      return (
        <group rotation-y={Math.PI / 2}>
          {[-0.5, 0.5].map((z) => (
            <mesh key={z} position={[0, 0.35, z]} rotation-y={Math.PI / 2} >
              <torusGeometry args={[0.33, 0.06, 8, 20]} />
              <meshStandardMaterial color="#22222a" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.62, 0]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.045, 0.045, 1, 8]} />
            <meshStandardMaterial color="#1f7fb3" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.62, 0]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.04, 0.04, 1.05, 8]} />
            <meshStandardMaterial color="#1f7fb3" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.85, 0.5]}>
            <boxGeometry args={[0.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#22222a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.82, -0.35]}>
            <boxGeometry args={[0.18, 0.08, 0.3]} />
            <meshStandardMaterial color="#3a2a22" roughness={0.8} />
          </mesh>
        </group>
      );

    case "moto":
      return (
        <group rotation-y={Math.PI / 2}>
          {[-0.62, 0.62].map((z) => (
            <mesh key={z} position={[0, 0.36, z]} rotation-y={Math.PI / 2} >
              <torusGeometry args={[0.32, 0.13, 10, 20]} />
              <meshStandardMaterial color="#191920" roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 0.68, 0]} >
            <boxGeometry args={[0.42, 0.42, 1.1]} />
            <meshStandardMaterial color="#c0392b" roughness={0.4} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.95, -0.15]}>
            <boxGeometry args={[0.38, 0.16, 0.6]} />
            <meshStandardMaterial color="#2b2b33" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.02, 0.55]} rotation-x={0.35}>
            <boxGeometry args={[0.5, 0.28, 0.12]} />
            <meshStandardMaterial color="#e9eef2" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      );

    case "lixeira":
      return (
        <group>
          {/* corpo cilíndrico verde */}
          <mesh position={[0, 0.46, 0]} >
            <cylinderGeometry args={[0.38, 0.32, 0.92, 16]} />
            <meshStandardMaterial color="#2f7d4f" roughness={0.7} />
          </mesh>
          {/* frisos */}
          {[0.3, 0.62].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.06, 16]} />
              <meshStandardMaterial color="#245f3d" roughness={0.8} />
            </mesh>
          ))}
          {/* tampa */}
          <mesh position={[0, 0.98, 0]} >
            <cylinderGeometry args={[0.44, 0.42, 0.14, 16]} />
            <meshStandardMaterial color="#1f5233" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.09, 0]}>
            <sphereGeometry args={[0.09, 12, 10]} />
            <meshStandardMaterial color="#173d26" roughness={0.5} />
          </mesh>
        </group>
      );

    case "placa":
      return (
        <group>
          {/* barra baixa atravessando a pista: passa rolando */}
          <mesh position={[0, 1.15, 0]} >
            <boxGeometry args={[1.5, 0.5, 0.12]} />
            <meshStandardMaterial color="#e0b422" roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.15, 0.08]}>
            <boxGeometry args={[1.24, 0.24, 0.02]} />
            <meshStandardMaterial color="#2b2b33" roughness={0.6} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.68, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 10]} />
              <meshStandardMaterial color="#8c8f9b" roughness={0.5} metalness={0.3} />
            </mesh>
          ))}
        </group>
      );

    case "carrinho":
      return (
        <group>
          {/* cesto inclinado de carrinho de feira */}
          <mesh position={[0, 0.72, 0]} rotation-x={-0.12} castShadow>
            <boxGeometry args={[0.86, 0.52, 1.02]} />
            <meshStandardMaterial color="#9aa3b0" roughness={0.45} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.72, 0]} rotation-x={-0.12} scale={[0.92, 0.86, 0.94]}>
            <boxGeometry args={[0.86, 0.52, 1.02]} />
            <meshStandardMaterial color="#d8dee7" roughness={0.6} />
          </mesh>
          {/* base */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.9]} />
            <meshStandardMaterial color="#6f7683" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* alça */}
          <mesh position={[0, 1.08, 0.5]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 10]} />
            <meshStandardMaterial color="#c0392b" roughness={0.5} />
          </mesh>
          {/* rodinhas */}
          {[
            [-0.28, -0.36],
            [0.28, -0.36],
            [-0.28, 0.36],
            [0.28, 0.36],
          ].map(([x, z]) => (
            <mesh key={`${x}-${z}`} position={[x!, 0.14, z!]}>
              <sphereGeometry args={[0.13, 12, 10]} />
              <meshStandardMaterial color="#2b2b33" roughness={0.8} />
            </mesh>
          ))}
        </group>
      );

    case "banco":
      return (
        <group>
          {/* assento de madeira */}
          <mesh position={[0, 0.62, 0]} castShadow>
            <boxGeometry args={[1.55, 0.12, 0.6]} />
            <meshStandardMaterial color="#a9702f" roughness={0.85} />
          </mesh>
          {/* encosto */}
          <mesh position={[0, 0.98, -0.24]} rotation-x={0.18} castShadow>
            <boxGeometry args={[1.55, 0.42, 0.1]} />
            <meshStandardMaterial color="#b87c36" roughness={0.85} />
          </mesh>
          {/* pés de ferro */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.62, 0.3, 0]} castShadow>
              <boxGeometry args={[0.12, 0.62, 0.5]} />
              <meshStandardMaterial color="#3f4149" roughness={0.6} metalness={0.25} />
            </mesh>
          ))}
        </group>
      );

    case "pneus":
      return (
        <group>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[i === 2 ? 0.06 : 0, 0.18 + i * 0.3, 0]}
              rotation-x={Math.PI / 2}
              rotation-z={i * 0.4}
              castShadow
            >
              <torusGeometry args={[0.36, 0.16, 10, 20]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#26262d" : "#1d1d24"} roughness={0.9} />
            </mesh>
          ))}
        </group>
      );

    default:
      return null;
  }
}

