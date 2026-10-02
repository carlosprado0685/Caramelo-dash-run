import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
function PredioFundo({
  cor = "#c9b8a3",
  altura = 5,
}: {
  cor?: string;
  altura?: number;
}) {
  const janelas = Math.max(2, Math.floor(altura / 1.5));

  return (
  <group>
      {/* corpo principal */}
      <mesh position={[0, altura / 2, 0]} castShadow>
        <boxGeometry args={[3.8, altura, 3]} />
        <meshStandardMaterial color={cor} roughness={0.9} />
      </mesh>

      {/* faixa superior da fachada */}
      <mesh position={[0, altura - 0.28, 1.52]}>
        <boxGeometry args={[3.95, 0.18, 0.08]} />
        <meshStandardMaterial color="#e3d6c4" roughness={0.85} />
      </mesh>

      {/* janelas */}
      {Array.from({ length: janelas }).map((_, row) =>
        [-1.15, 0, 1.15].map((x) => (
          <group
            key={`${row}-${x}`}
            position={[x, 1.05 + row * 1.25, 1.54]}
          >
            <mesh>
              <boxGeometry args={[0.62, 0.7, 0.06]} />
              <meshStandardMaterial
                color="#8fc4d8"
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>

            {/* divisão vertical da janela */}
            <mesh position={[0, 0, 0.035]}>
              <boxGeometry args={[0.06, 0.7, 0.025]} />
              <meshStandardMaterial
                color="#e6ded0"
                roughness={0.8}
              />
            </mesh>

            {/* divisão horizontal da janela */}
            <mesh position={[0, 0, 0.036]}>
              <boxGeometry args={[0.62, 0.06, 0.025]} />
              <meshStandardMaterial
                color="#e6ded0"
                roughness={0.8}
              />
            </mesh>
          </group>
        ))
      )}

      {/* porta */}
      <mesh position={[0, 0.75, 1.54]}>
        <boxGeometry args={[0.72, 1.5, 0.08]} />
        <meshStandardMaterial
          color="#654536"
          roughness={0.85}
        />
      </mesh>

      {/* pequeno toldo da entrada */}
      <mesh
        position={[0, 1.55, 1.75]}
        rotation-x={-0.25}
      >
        <boxGeometry args={[1.05, 0.08, 0.55]} />
        <meshStandardMaterial
          color="#b95743"
          roughness={0.85}
        />
      </mesh>
    </group>
  );
}
function PredioComercial({
  cor = "#d6c2a8",
  altura = 5.5,
}: {
  cor?: string;
  altura?: number;
}) {
  return (
    <group>
      {/* corpo principal */}
      <mesh position={[0, altura / 2, 0]} castShadow>
        <boxGeometry args={[4.2, altura, 3]} />
        <meshStandardMaterial color={cor} roughness={0.9} />
      </mesh>

      {/* faixa comercial */}
      <mesh position={[0, 1.65, 1.55]}>
        <boxGeometry args={[3.75, 1.15, 0.12]} />
        <meshStandardMaterial
          color="#f0e2c8"
          roughness={0.75}
        />
      </mesh>

      {/* vitrine esquerda */}
      <mesh position={[-1.15, 1.7, 1.63]}>
        <boxGeometry args={[1.25, 1.05, 0.08]} />
        <meshStandardMaterial
          color="#77b5c9"
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* vitrine direita */}
      <mesh position={[1.15, 1.7, 1.63]}>
        <boxGeometry args={[1.25, 1.05, 0.08]} />
        <meshStandardMaterial
          color="#77b5c9"
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* faixa da loja */}
      <mesh position={[0, 2.45, 1.63]}>
        <boxGeometry args={[3.65, 0.38, 0.12]} />
        <meshStandardMaterial
          color="#b85c45"
          roughness={0.8}
        />
      </mesh>

      {/* janelas superiores */}
      {[-1.15, 0, 1.15].map((x) => (
        <mesh
          key={x}
          position={[x, 3.55, 1.55]}
        >
          <boxGeometry args={[0.72, 0.82, 0.06]} />
          <meshStandardMaterial
            color="#8fc4d8"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* porta central */}
      <mesh position={[0, 0.72, 1.63]}>
        <boxGeometry args={[0.72, 1.45, 0.1]} />
        <meshStandardMaterial
          color="#5c4033"
          roughness={0.8}
        />
      </mesh>

      {/* cobertura */}
      <mesh position={[0, altura + 0.12, 0]}>
        <boxGeometry args={[4.35, 0.25, 3.2]} />
        <meshStandardMaterial
          color="#665b52"
          roughness={0.85}
        />
      </mesh>
    </group>
  );
}

function PredioEstreito({
  cor = "#d8c4aa",
}: {
  cor?: string;
}) {
  return (
    <group>
      {/* corpo estreito */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[2.8, 5, 2.8]} />
        <meshStandardMaterial
          color={cor}
          roughness={0.9}
        />
      </mesh>

      {/* janelas */}
      {[-0.75, 0.75].map((x) =>
        [1.3, 2.6, 3.9].map((y) => (
          <mesh
            key={`${x}-${y}`}
            position={[x, y, 1.43]}
          >
            <boxGeometry args={[0.58, 0.72, 0.06]} />
            <meshStandardMaterial
              color="#91c5d8"
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        ))
      )}

      {/* porta */}
      <mesh position={[0, 0.75, 1.43]}>
        <boxGeometry args={[0.65, 1.5, 0.08]} />
        <meshStandardMaterial
          color="#624435"
          roughness={0.85}
        />
      </mesh>

      {/* marquise */}
      <mesh position={[0, 1.6, 1.7]}>
        <boxGeometry args={[1.1, 0.08, 0.5]} />
        <meshStandardMaterial
          color="#b85b45"
          roughness={0.85}
        />
      </mesh>

      {/* cobertura */}
      <mesh position={[0, 5.15, 0]}>
        <boxGeometry args={[3, 0.22, 3]} />
        <meshStandardMaterial
          color="#665b52"
          roughness={0.85}
        />
      </mesh>
    </group>
  );
}

function Casa({ cor = "#e8d2b5" }: { cor?: string }) {
  return (
    <group>
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[4.5, 4.2, 3]} />
        <meshStandardMaterial color={cor} roughness={0.9} />
      </mesh>

      {/* telhado */}
      <mesh position={[0, 4.35, 0]}>
        <boxGeometry args={[4.9, 0.22, 3.3]} />
        <meshStandardMaterial color="#9a4a36" roughness={0.85} />
      </mesh>

{/* varanda frontal */}
<mesh position={[0, 2.35, 1.72]}>
  <boxGeometry args={[2.2, 0.12, 0.55]} />
  <meshStandardMaterial
    color="#d6cec3"
    roughness={0.8}
  />
</mesh>

{/* guarda-corpo */}
<mesh position={[0, 2.72, 1.96]}>
  <boxGeometry args={[2.2, 0.08, 0.08]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[-1.0, 2.53, 1.96]}>
  <boxGeometry args={[0.08, 0.42, 0.08]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[-0.5, 2.53, 1.96]}>
  <boxGeometry args={[0.06, 0.42, 0.06]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[0, 2.53, 1.96]}>
  <boxGeometry args={[0.06, 0.42, 0.06]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[0.5, 2.53, 1.96]}>
  <boxGeometry args={[0.06, 0.42, 0.06]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[1.0, 2.53, 1.96]}>
  <boxGeometry args={[0.08, 0.42, 0.08]} />
  <meshStandardMaterial
    color="#555555"
    roughness={0.6}
    metalness={0.2}
  />
</mesh>

<mesh position={[0, 2.45, 1.82]}>
  <boxGeometry args={[1.45, 0.08, 0.06]} />
  <meshStandardMaterial
    color="#6b6b6b"
    roughness={0.65}
    metalness={0.15}
  />
</mesh>

<mesh position={[-0.6, 2.25, 1.82]}>
  <boxGeometry args={[0.06, 0.45, 0.06]} />
  <meshStandardMaterial
    color="#6b6b6b"
    roughness={0.65}
    metalness={0.15}
  />
</mesh>

<mesh position={[0, 2.25, 1.82]}>
  <boxGeometry args={[0.06, 0.45, 0.06]} />
  <meshStandardMaterial
    color="#6b6b6b"
    roughness={0.65}
    metalness={0.15}
  />
</mesh>

<mesh position={[0.6, 2.25, 1.82]}>
  <boxGeometry args={[0.06, 0.45, 0.06]} />
  <meshStandardMaterial
    color="#6b6b6b"
    roughness={0.65}
    metalness={0.15}
  />
</mesh>

      {/* porta */}
      <mesh position={[0, 0.8, 1.52]}>
        <boxGeometry args={[0.75, 1.6, 0.08]} />
        <meshStandardMaterial color="#5a3d2c" roughness={0.8} />
      </mesh>
{/* cobertura do prédio */}
<mesh position={[0, altura + 0.12, 0]} castShadow>
  <boxGeometry args={[4.15, 0.25, 3.25]} />
  <meshStandardMaterial
    color="#75685d"
    roughness={0.85}
  />
</mesh>

{/* volume superior da fachada */}
<mesh position={[0, altura - 0.45, 1.55]}>
  <boxGeometry args={[4.0, 0.18, 0.12]} />
  <meshStandardMaterial
    color="#a64f3e"
    roughness={0.8}
  />
</mesh>

      {/* janelas */}
      {[-1.2, 1.2].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.9, 1.52]}>
            <boxGeometry args={[0.85, 0.85, 0.06]} />
            <meshStandardMaterial color="#9fd4e4" roughness={0.25} metalness={0.15} />
          </mesh>
          <mesh position={[x, 1.7, 1.52]}>
            <boxGeometry args={[0.85, 0.85, 0.06]} />
            <meshStandardMaterial color="#9fd4e4" roughness={0.25} metalness={0.15} />
          </mesh>
        </group>
      ))}

      {/* varanda */}
      <mesh position={[0, 2.25, 1.65]}>
        <boxGeometry args={[2.4, 0.08, 0.5]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0.8} />
      </mesh>

      {/* toldo */}
      <mesh position={[0, 2.55, 1.95]} rotation-x={-0.28}>
        <boxGeometry args={[2.6, 0.08, 0.9]} />
        <meshStandardMaterial color="#d35b42" roughness={0.85} />
      </mesh>
    </group>
  );
}
/** Árvore de praça. */
function Arvore() {
  return (
    <group>
      {/* tronco */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.25, 2.1, 8]} />
        <meshStandardMaterial color="#765238" roughness={0.9} />
      </mesh>

      {/* galho esquerdo */}
      <mesh position={[-0.28, 1.82, 0]} rotation-z={-0.45} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.9, 7]} />
        <meshStandardMaterial color="#765238" roughness={0.9} />
      </mesh>

      {/* galho direito */}
      <mesh position={[0.28, 1.86, 0.04]} rotation-z={0.45} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.9, 7]} />
        <meshStandardMaterial color="#765238" roughness={0.9} />
      </mesh>

      {/* copa única */}
      <mesh
        position={[0, 2.65, 0]}
        scale={[1.45, 1.3, 1.15]}
        castShadow
      >
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#397f42"
          roughness={0.95}
          flatShading={false}
        />
      </mesh>

      {/* pequena irregularidade inferior */}
      <mesh
        position={[0.55, 2.25, 0.35]}
        scale={[0.65, 0.55, 0.6]}
        castShadow
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#438b49"
          roughness={0.95}
          flatShading={false}
        />
      </mesh>
    </group>
  );
}

function ArbustoBaixo() {
  return (
    <group>
      <mesh position={[-0.28, 0.34, 0]} scale={[1.15, 0.9, 0.95]} castShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#4f7f3b"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0.25, 0.38, 0.04]} scale={[1.05, 0.95, 1]} castShadow>
        <dodecahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial
          color="#5d8d43"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0, 0.68, -0.08]} scale={[0.9, 0.8, 0.9]} castShadow>
        <dodecahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          color="#4f8b52"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

function CanteiroBaixo() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.16, 0.65]} />
        <meshStandardMaterial
          color="#8a765f"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[-0.55, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial
          color="#6f9652"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0, 0.32, 0.05]} castShadow>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshStandardMaterial
          color="#5d8d43"
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0.55, 0.27, -0.02]} castShadow>
        <sphereGeometry args={[0.17, 8, 6]} />
        <meshStandardMaterial
          color="#4f7f3b"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

function ArvoreAlta() {
  return (
    <group>
      {/* tronco */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 3.2, 8]} />
        <meshStandardMaterial
          color="#6b4932"
          roughness={0.9}
        />
      </mesh>

      {/* copa inferior */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[1.15, 10, 8]} />
        <meshStandardMaterial
          color="#4f7f3b"
          roughness={0.95}
        />
      </mesh>

      {/* copa superior */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <sphereGeometry args={[0.9, 10, 8]} />
        <meshStandardMaterial
          color="#5d8d43"
          roughness={0.95}
        />
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

function Casa3D() {
  const { scene } = useGLTF("/models/house.glb");

  return <primitive object={scene.clone()} scale={[6, 6, 6]} />;
}

function Casa3D2() {
  const { scene } = useGLTF("/models/house2.glb");

  return <primitive object={scene.clone()} scale={[4.5, 4.5, 4.5]} />;
}

function Comercio3D() {
  const { scene } = useGLTF("/models/comercio.glb");

  return <primitive object={scene.clone()} scale={[4, 4, 4]} />;
}

useGLTF.preload("/models/house.glb");

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

      {/* jardins laterais */}
      {[-1, 1].map((s) => (
        <mesh
          key={`jardim-${s}`}
          position={[s * 7.8, 0.05, -30]}
          receiveShadow
        >
          <boxGeometry args={[4.6, 0.1, 200]} />
          <meshStandardMaterial
            color="#6f9652"
            roughness={0.95}
          />
        </mesh>
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
        {Array.from({ length: 8 }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <group key={i} position={[side * 4.6, 0.28, -i * 6 + 6]}>
              <mesh position={[0, 1.4, 0]}>
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
              {i % 3 === 0 ? (
  <group position={[side * 0.95, 0, 2]}>
    <Arvore />
</group>
) : (
  <mesh position={[side * 0.9, 0.32, 2]}>
  <sphereGeometry args={[0.45, 12, 10]} />
  <meshStandardMaterial color="#4f8b52" roughness={0.9} />
</mesh>
)}
            </group>
          );
        })}
      </group>

      {/* ambientação de bairro (decorativa, sem colisão) */}
    <group ref={cenario}>
<group position={[9.5, 0.28, -38]}>
  <Casa3D />
</group>

<group
  position={[-10.5, 0.28, -78.5]}
  rotation-y={Math.PI / 2}
>
  <Casa3D2 />
</group>

<group position={[-8.7, 0.2, -82]}>
  <ArbustoBaixo />
</group>

<group position={[-7.8, 0.18, -82]}>
  <CanteiroBaixo />
</group>

<group position={[7.8, 0.18, -82]}>
  <CanteiroBaixo />
</group>

<group
  position={[11.5, 0.28, -75]}
  rotation-y={-Math.PI / 2}
>
  <Comercio3D />
</group>

  <group position={[8.8, 0.28, -30]} rotation-y={-Math.PI / 2}>
    <PredioFundo
      cor="#c8b49d"
      altura={6}
    />
  </group>

  <group position={[-8.8, 0.28, -38]} rotation-y={Math.PI / 2}>
    <PredioFundo
      cor="#b9c7b5"
      altura={5.5}
    />
  </group>

<group position={[8.8, 0.28, -54]} rotation-y={-Math.PI / 2}>
   <PredioEstreito
    cor="#d0b89c"
    altura={5.2}
  />
</group>

<group position={[-8.8, 0.28, -66]} rotation-y={Math.PI / 2}>
   <PredioEstreito
    cor="#b8c4d0"
    altura={6.5}
  />
</group>

            {/* muros baixos laterais */}
      {Array.from({ length: 6 }).map((_, i) => {
        const z = -i * 32 - 12;

        return (
          <group key={`muro-baixo-${i}`}>
            <mesh
              position={[-10.2, 0.8, z]}
              castShadow
            >
              <boxGeometry args={[0.35, 1.6, 12]} />
              <meshStandardMaterial
                color="#b9ad9b"
                roughness={0.9}
              />
            </mesh>

            <mesh
              position={[10.2, 0.8, z]}
              castShadow
            >
              <boxGeometry args={[0.35, 1.6, 12]} />
              <meshStandardMaterial
                color="#b9ad9b"
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}

  {Array.from({ length: 4 }).map((_, i) => {
  const z = -i * 24 - 6;
  const lado = i % 2 === 0 ? -1 : 1;

  return (
    <group key={i} position={[0, 0, z]}>
      {i % 2 === 0 && (
        <group position={[0, 0, -4]}>
          <FaixaDePedestres />
        </group>
      )}

      <group position={[lado * 5.6, 0.28, 0]}>
        {i % 2 === 0 ? <BancaDeJornal /> : <Arvore />}
      </group>

<group position={[-6.2, 0.28, -23]}>
  <ArvoreAlta />
</group>

<group position={[6.2, 0.28, -35]}>
  <ArvoreAlta />
</group>

      <group position={[-lado * 5.9, 0.28, -6]}>
        {i % 2 === 0 ? <Arvore /> : <BancaDeJornal />}
      </group>

      <group position={[-lado * 4.5, 0.28, -9]}>
        <Placa
          texto={i % 2 === 0 ? "PARE" : "PADARIA"}
          cor={i % 2 === 0 ? "#b33a2c" : "#2f6f9e"}
        />
      </group>

      {i % 2 === 1 && (
  <group
    position={[lado * 9.4, 0.28, -16]}
    rotation-y={lado === 1 ? -Math.PI / 2 : Math.PI / 2}
  >
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
