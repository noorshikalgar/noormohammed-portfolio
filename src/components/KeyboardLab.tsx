import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Mesh } from "three";

const rows = [
  ["esc", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I"],
  ["ctrl", "A", "S", "D", "F", "G", "H", "J"],
  ["shift", "Z", "X", "C", "V", "B", "N"],
  ["cmd", "alt", "space", "fn", "enter"],
];

function Keycap({ label, x, y, width = 1 }: { label: string; x: number; y: number; width?: number }) {
  const mesh = useRef<Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const pulse = Math.sin(clock.elapsedTime * 2.4 + x) * 0.015;
    mesh.current.position.z = active ? 0.18 : 0.08 + pulse;
  });

  return (
    <group position={[x, y, 0]}>
      <mesh
        ref={mesh}
        castShadow
        receiveShadow
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <boxGeometry args={[width * 0.82, 0.72, 0.16]} />
        <meshStandardMaterial
          color={active ? "#42dff2" : "#1f2730"}
          emissive={active ? "#00bcd4" : "#05080a"}
          emissiveIntensity={active ? 0.35 : 0.05}
          metalness={0.25}
          roughness={0.55}
        />
      </mesh>
      <Text
        position={[0, -0.02, 0.2]}
        rotation={[0, 0, 0]}
        fontSize={label.length > 4 ? 0.12 : 0.16}
        color={active ? "#071113" : "#dce7ef"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function Keyboard() {
  const group = useRef<Mesh>(null);
  const keys = useMemo(() => {
    return rows.flatMap((row, rowIndex) => {
      const y = 1.6 - rowIndex * 0.78;
      const rowWidth = row.reduce((total, label) => total + (label === "space" ? 3 : label.length > 3 ? 1.35 : 1), 0);
      let cursor = -rowWidth / 2;
      return row.map((label) => {
        const width = label === "space" ? 3 : label.length > 3 ? 1.35 : 1;
        const key = { label, x: cursor + width / 2, y, width };
        cursor += width;
        return key;
      });
    });
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.035;
  });

  return (
    <group ref={group} rotation={[-0.78, 0, -0.18]} position={[0, -0.15, 0]}>
      <mesh receiveShadow position={[0, 0, -0.06]}>
        <boxGeometry args={[8.9, 4.5, 0.18]} />
        <meshStandardMaterial color="#11171d" metalness={0.35} roughness={0.4} />
      </mesh>
      {keys.map((key) => (
        <Keycap key={`${key.label}-${key.x}-${key.y}`} {...key} />
      ))}
    </group>
  );
}

export function KeyboardLab() {
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) {
    return (
      <div className="keyboard-fallback" aria-label="3D keyboard preview">
        {rows.map((row) => (
          <div className="fallback-row" key={row.join("-")}>
            {row.map((key) => (
              <span className={key === "space" ? "fallback-key fallback-key-wide" : "fallback-key"} key={key}>
                {key}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="keyboard-canvas" aria-label="Interactive 3D keyboard">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 7.6], fov: 35 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor("#000000", 0);
          gl.domElement.addEventListener("webglcontextlost", () => setContextLost(true), { once: true });
        }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow />
        <pointLight position={[-3, -2, 3]} intensity={1.8} color="#00bcd4" />
        <group scale={0.86}>
          <Keyboard />
        </group>
        <OrbitControls enablePan={false} minDistance={4.8} maxDistance={8.5} />
      </Canvas>
    </div>
  );
}
