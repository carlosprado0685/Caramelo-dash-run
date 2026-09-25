import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { runtime } from "../../game/runtime";

function makeAsphaltTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#4b4a55";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2200; i++) {
    const g = 60 + Math.random() * 60;
    ctx.fillStyle = `rgba(${g},${g},${g + 8},${0.12 + Math.random() * 0.2})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 24);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Placa simples com texto em português (decorativa). */
function Placa({ texto, cor = "#2f6f9e" }: { texto: string; cor?: string }) {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = cor;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(10, 10, 236, 108);
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, 128, 68);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [texto, cor]);

  return (
    <group>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
        <meshStandardMaterial color="#8d8f99" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.05, 0.04]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshStandardMaterial map={tex} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Banca de jornal de esquina. */
function BancaDeJornal() {
  return (
    <group>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.9, 1.6, 1.3]} />
        <meshStandardMaterial color="#2f6f9e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.7, 0.1]} rotation-x={-0.18}>
        <boxGeometry args={[2.4, 0.1, 1.9]} />
        <meshStandardMaterial color="#e2553f" roughness={0.8} />
      </mesh>
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[0.98, 0.7 + y * 0.5, 0]}>
          <boxGeometry args={[0.06, 0.34, 0.9]} />
          <meshStandardMaterial color="#f2ead6" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Padaria ao fundo. */
function Padaria() {
  return (
    <group>
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[7, 4.4, 4]} />
        <meshStandardMaterial color="#f0dcc0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.3, 2.05]}>
        <boxGeometry args={[5.4, 0.9, 0.12]} />
        <meshStandardMaterial color="#c2452f" roughness={0.8} />
      </mesh>
      {/* toldo listrado */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-2.1 + i * 0.85, 2.5, 2.5]} rotation-x={-0.3}>
          <boxGeometry args={[0.8, 0.08, 1.1]} />
          <meshStandardMaterial color={i % 2 ? "#f4f1e6" : "#c2452f"} roughness={0.85} />
        </mesh>
      ))}
      {/* vitrine */}
      <mesh position={[0, 1.2, 2.04]}>
        <boxGeometry args={[4.6, 1.6, 0.1]} />
        <meshStandardMaterial color="#9fd4e4" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

/** Árvore de praça. */
function Arvore() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 1.8, 8]} />
        <meshStandardMaterial color="#7a5638" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[1.05, 14, 12]} />
        <meshStandardMaterial color="#3f8046" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 1.7, 0.3]} castShadow>
        <sphereGeometry args={[0.6, 12, 10]} />
        <meshStandardMaterial color="#4c9354" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Muro com grafites discretos. */
function MuroGrafitado({ lado }: { lado: number }) {
  return (
    <group>
      <mesh position={[0, 1.2, 0]} receiveShadow>
        <boxGeometry args={[0.3, 2.4, 11]} />
        <meshStandardMaterial color="#d8cdbb" roughness={0.95} />
      </mesh>
      {[
        { c: "#5b9bd5", z: -3.2, y: 1.3, w: 2.4, h: 0.8 },
        { c: "#e2b53f", z: 0.4, y: 1.0, w: 1.8, h: 0.6 },
        { c: "#b0554f", z: 3.4, y: 1.5, w: 2.0, h: 0.7 },
      ].map((g, i) => (
        <mesh key={i} position={[lado * 0.17, g.y, g.z]} rotation-y={lado * Math.PI * 0.5}>
          <planeGeometry args={[g.w, g.h]} />
          <meshStandardMaterial color={g.c} roughness={0.9} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/** Faixa de pedestres (decorativa, sem colisão). */
function FaixaDePedestres() {
  return (
    <group>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-3.2 + i * 0.8, 0.021, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.42, 3.2]} />
          <meshStandardMaterial color="#f4efdf" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Rua rolante com faixas, calçadas, postes e ambientação de bairro. */
export function Road() {
  const asphalt = useMemo(makeAsphaltTexture, []);
  const stripes = useRef<THREE.Group>(null);
  const props = useRef<THREE.Group>(null);
  const cenario = useRef<THREE.Group>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const move = runtime.alive ? runtime.speed * dt : 0;
    if (asphalt) asphalt.offset.y -= move * 0.055;
    for (const g of [stripes.current, props.current, cenario.current]) {
      if (!g) continue;
      g.children.forEach((c) => {
        c.position.z += move;
        if (c.position.z > 12) c.position.z -= 96;
      });
    }
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[7.4, 200]} />
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>

      {/* calçadas */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 5.3, 0.14, -30]} receiveShadow>
            <boxGeometry args={[3.4, 0.28, 200]} />
            <meshStandardMaterial color="#cfc3ae" roughness={0.9} />
          </mesh>
          <mesh position={[s * 3.75, 0.16, -30]}>
            <boxGeometry args={[0.16, 0.34, 200]} />
            <meshStandardMaterial color="#e8dfd0" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* faixas centrais */}
      <group ref={stripes}>
        {Array.from({ length: 32 }).map((_, i) => (
          <mesh key={i} position={[0, 0.02, -i * 3 + 4]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.16, 1.5]} />
            <meshStandardMaterial color="#f2e6bf" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* postes e arbustos da calçada */}
      <group ref={props}>
        {Array.from({ length: 16 }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <group key={i} position={[side * 4.6, 0.28, -i * 6 + 6]}>
              <mesh position={[0, 1.4, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.11, 2.8, 8]} />
                <meshStandardMaterial color="#6a6d78" roughness={0.6} />
              </mesh>
              <mesh position={[side * -0.35, 2.75, 0]}>
                <boxGeometry args={[0.8, 0.14, 0.3]} />
                <meshStandardMaterial color="#6a6d78" roughness={0.6} />
              </mesh>
              <mesh position={[side * -0.7, 2.6, 0]}>
                <sphereGeometry args={[0.17, 12, 10]} />
                <meshStandardMaterial
                  color="#ffe6a3"
                  emissive="#ffcf5c"
                  emissiveIntensity={0.6}
                />
              </mesh>
              <mesh position={[side * 0.9, 0.32, 2]} castShadow>
                <sphereGeometry args={[0.45, 12, 10]} />
                <meshStandardMaterial color="#4f8b52" roughness={0.9} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ambientação de bairro (decorativa, sem colisão) */}
      <group ref={cenario}>
        {Array.from({ length: 4 }).map((_, i) => {
          const z = -i * 24 - 6;
          const lado = i % 2 === 0 ? -1 : 1;
          return (
            <group key={i} position={[0, 0, z]}>
              <group position={[0, 0, -4]}>
                <FaixaDePedestres />
              </group>
              <group position={[lado * 5.6, 0.28, 0]}>
                {i % 2 === 0 ? <BancaDeJornal /> : <Arvore />}
              </group>
              <group position={[-lado * 5.9, 0.28, -6]}>
                {i % 2 === 0 ? <Arvore /> : <Arvore />}
              </group>
              <group position={[lado * 7.4, 0.28, -12]}>
                <MuroGrafitado lado={lado} />
              </group>
              <group position={[-lado * 4.5, 0.28, -9]}>
                <Placa texto={i % 2 === 0 ? "PARE" : "PADARIA"} cor={i % 2 === 0 ? "#b33a2c" : "#2f6f9e"} />
              </group>
              {i % 2 === 1 && (
                <group position={[lado * 11, 0.28, -16]}>
                  <Padaria />
                </group>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
