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
    const wave = Math.sin(clock.elapsedTime * 3.2 + x * 0.8 + y * 1.4);
    const autoPress = wave > 0.92 ? -0.09 : 0;
    const float = Math.sin(clock.elapsedTime * 2.1 + x) * 0.01;
    mesh.current.position.z = active ? -0.1 : 0.08 + autoPress + float;
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
        <boxGeometry args={[width * 0.82, 0.72, 0.12]} />
        <meshStandardMaterial
          color={active ? "#00e5ff" : "#0b151b"}
          emissive={active ? "#00e5ff" : "#00333b"}
          emissiveIntensity={active ? 0.45 : 0.12}
          metalness={0.15}
          roughness={0.42}
          transparent
          opacity={active ? 0.9 : 0.68}
        />
      </mesh>
      <Text
        position={[0, -0.02, 0.18]}
        rotation={[0, 0, 0]}
        fontSize={label.length > 4 ? 0.12 : 0.16}
        color={active ? "#071113" : "#9bf7ff"}
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
        camera={{ position: [0, 0.5, 7.6], fov: 34 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor("#000000", 0);
          gl.domElement.addEventListener("webglcontextlost", () => setContextLost(true), { once: true });
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} castShadow />
        <pointLight position={[-3, -2, 3]} intensity={2.2} color="#00e5ff" />
        <group scale={0.86}>
          <Keyboard />
        </group>
        <OrbitControls enablePan={false} minDistance={4.8} maxDistance={8.5} />
      </Canvas>
    </div>
  );
}
