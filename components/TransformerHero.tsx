"use client";

import {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances, Environment } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { partT, lerp } from "./useTransformScroll";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PartDef {
  carPos: [number, number, number];
  carRot: [number, number, number];
  carScale: [number, number, number];
  robotPos: [number, number, number];
  robotRot: [number, number, number];
  robotScale: [number, number, number];
  offset: number;
  width: number;
  color?: string;
  emissive?: boolean;
  geometry?: "box" | "cylinder" | "sphere";
  cylinderArgs?: [number, number, number, number];
}

// ─── Part definitions: car geometry → robot geometry ──────────────────────────

const PARTS: Record<string, PartDef> = {
  // Chassis / body → torso
  chassis: {
    carPos: [0, 0, 0],
    carRot: [0, 0, 0],
    carScale: [2.2, 0.5, 4.0],
    robotPos: [0, -0.3, 0],
    robotRot: [0, 0, 0],
    robotScale: [1.6, 2.2, 0.8],
    offset: 0.0, width: 0.35,
    color: "#ff2244", // High-Vis Crimson Red
  },
  // Hood → chest plate
  hood: {
    carPos: [0, 0.28, -1.5],
    carRot: [0.1, 0, 0],
    carScale: [2.0, 0.15, 1.4],
    robotPos: [0, 0.3, 0.45],
    robotRot: [0, 0, 0],
    robotScale: [1.4, 0.8, 0.12],
    offset: 0.12, width: 0.28,
    color: "#f59e0b", emissive: true, // Gleaming Gold Chest Plate
  },
  // Roof → head
  roof: {
    carPos: [0, 0.85, 0.3],
    carRot: [0, 0, 0],
    carScale: [1.5, 0.6, 2.0],
    robotPos: [0, 1.95, 0],
    robotRot: [0, 0, 0],
    robotScale: [0.95, 0.85, 0.75],
    offset: 0.22, width: 0.22,
    color: "#ff1e42", // High-Vis Crimson Head
  },
  // Left door → left arm
  doorL: {
    carPos: [-1.12, 0.38, 0.1],
    carRot: [0, 0, 0],
    carScale: [0.08, 0.65, 1.5],
    robotPos: [-1.15, 0.1, 0],
    robotRot: [0, 0, 0.15],
    robotScale: [0.32, 1.6, 0.32],
    offset: 0.15, width: 0.28,
    color: "#38bdf8", // Bright Electric Cyan Arm
  },
  // Right door → right arm
  doorR: {
    carPos: [1.12, 0.38, 0.1],
    carRot: [0, 0, 0],
    carScale: [0.08, 0.65, 1.5],
    robotPos: [1.15, 0.1, 0],
    robotRot: [0, 0, -0.15],
    robotScale: [0.32, 1.6, 0.32],
    offset: 0.15, width: 0.28,
    color: "#38bdf8", // Bright Electric Cyan Arm
  },
  // Front-left wheel → left shoulder pad
  wheelFL: {
    carPos: [-1.1, -0.02, -1.3],
    carRot: [Math.PI / 2, 0, Math.PI / 2],
    carScale: [0.65, 0.3, 0.65],
    robotPos: [-1.18, 0.95, 0],
    robotRot: [0, 0, 0],
    robotScale: [0.55, 0.25, 0.55],
    offset: 0.05, width: 0.3,
    color: "#f8fafc", // Gleaming Chrome Silver
    geometry: "cylinder",
    cylinderArgs: [0.5, 0.5, 0.3, 12],
  },
  // Front-right wheel → right shoulder pad
  wheelFR: {
    carPos: [1.1, -0.02, -1.3],
    carRot: [Math.PI / 2, 0, Math.PI / 2],
    carScale: [0.65, 0.3, 0.65],
    robotPos: [1.18, 0.95, 0],
    robotRot: [0, 0, 0],
    robotScale: [0.55, 0.25, 0.55],
    offset: 0.05, width: 0.3,
    color: "#f8fafc", // Gleaming Chrome Silver
    geometry: "cylinder",
    cylinderArgs: [0.5, 0.5, 0.3, 12],
  },
  // Rear-left wheel → left foot
  wheelRL: {
    carPos: [-1.1, -0.02, 1.3],
    carRot: [Math.PI / 2, 0, Math.PI / 2],
    carScale: [0.65, 0.3, 0.65],
    robotPos: [-0.45, -1.75, 0.1],
    robotRot: [0, 0, 0],
    robotScale: [0.6, 0.28, 0.6],
    offset: 0.25, width: 0.28,
    color: "#e2e8f0", // Bright Chrome Foot
    geometry: "cylinder",
    cylinderArgs: [0.5, 0.5, 0.3, 12],
  },
  // Rear-right wheel → right foot
  wheelRR: {
    carPos: [1.1, -0.02, 1.3],
    carRot: [Math.PI / 2, 0, Math.PI / 2],
    carScale: [0.65, 0.3, 0.65],
    robotPos: [0.45, -1.75, 0.1],
    robotRot: [0, 0, 0],
    robotScale: [0.6, 0.28, 0.6],
    offset: 0.25, width: 0.28,
    color: "#e2e8f0", // Bright Chrome Foot
    geometry: "cylinder",
    cylinderArgs: [0.5, 0.5, 0.3, 12],
  },
  // Left leg
  legL: {
    carPos: [-0.45, -0.25, 0.5],
    carRot: [0, 0, 0],
    carScale: [0.38, 0.1, 0.38],
    robotPos: [-0.45, -0.95, 0],
    robotRot: [0, 0, 0],
    robotScale: [0.38, 1.4, 0.38],
    offset: 0.3, width: 0.28,
    color: "#00f0ff", // Vibrant Energon Cyan Leg
  },
  // Right leg
  legR: {
    carPos: [0.45, -0.25, 0.5],
    carRot: [0, 0, 0],
    carScale: [0.38, 0.1, 0.38],
    robotPos: [0.45, -0.95, 0],
    robotRot: [0, 0, 0],
    robotScale: [0.38, 1.4, 0.38],
    offset: 0.3, width: 0.28,
    color: "#00f0ff", // Vibrant Energon Cyan Leg
  },
  // Windshield → visor/face panel
  windshield: {
    carPos: [0, 0.7, -0.65],
    carRot: [-0.55, 0, 0],
    carScale: [1.4, 0.5, 0.08],
    robotPos: [0, 1.97, 0.38],
    robotRot: [0, 0, 0],
    robotScale: [0.7, 0.28, 0.05],
    offset: 0.24, width: 0.2,
    color: "#00ffaa", emissive: true, // Neon Energon Green Visor
  },
  // Left headlight → left eye
  headlightL: {
    carPos: [-0.65, 0.18, -1.92],
    carRot: [0, 0, 0],
    carScale: [0.3, 0.18, 0.06],
    robotPos: [-0.22, 2.1, 0.42],
    robotRot: [0, 0, 0],
    robotScale: [0.2, 0.14, 0.06],
    offset: 0.28, width: 0.18,
    color: "#00ffaa", emissive: true, // Neon Green Eye
    geometry: "sphere",
  },
  // Right headlight → right eye
  headlightR: {
    carPos: [0.65, 0.18, -1.92],
    carRot: [0, 0, 0],
    carScale: [0.3, 0.18, 0.06],
    robotPos: [0.22, 2.1, 0.42],
    robotRot: [0, 0, 0],
    robotScale: [0.2, 0.14, 0.06],
    offset: 0.28, width: 0.18,
    color: "#00ffaa", emissive: true, // Neon Green Eye
    geometry: "sphere",
  },
};

// ─── Single animated part ──────────────────────────────────────────────────────

function TransformPart({ def, t, name }: { def: PartDef; t: number; name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Adjust t to account for rotation phase (0-0.25)
  // Transformation only happens from t=0.25 to t=1.0
  // Map t: 0-0.25 → adjustedT=0, 0.25-1.0 → adjustedT scales from 0-1
  const adjustedT = t < 0.25 ? 0 : (t - 0.25) / 0.75;
  const pt = partT(adjustedT, def.offset, def.width);

  // Materials
  const mat = useMemo(() => {
    const isEmissive = def.emissive;
    const baseColor = def.color ?? "#ff2244";
    if (isEmissive) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(baseColor),
        emissive: new THREE.Color(baseColor === "#f59e0b" ? "#ffaa00" : "#00ffaa"),
        emissiveIntensity: 0.8,
        metalness: 0.85,
        roughness: 0.15,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.9,
      roughness: 0.12,
      envMapIntensity: 1.8,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.color, def.emissive]);

  // Geometries
  const geo = useMemo(() => {
    if (def.geometry === "cylinder" && def.cylinderArgs) {
      return new THREE.CylinderGeometry(...def.cylinderArgs);
    }
    if (def.geometry === "sphere") {
      return new THREE.SphereGeometry(0.5, 12, 8);
    }
    return new THREE.BoxGeometry(1, 1, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.geometry]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Interpolate position
    mesh.position.set(
      lerp(def.carPos[0], def.robotPos[0], pt),
      lerp(def.carPos[1], def.robotPos[1], pt),
      lerp(def.carPos[2], def.robotPos[2], pt),
    );

    // Interpolate rotation — parts "swing" outward mid-transform
    const swing = Math.sin(pt * Math.PI) * 0.6; // arc motion
    const baseRotX = lerp(def.carRot[0], def.robotRot[0], pt);
    const baseRotY = lerp(def.carRot[1], def.robotRot[1], pt);
    const baseRotZ = lerp(def.carRot[2], def.robotRot[2], pt);
    // Add extra outward swing based on X direction for arms/doors
    const swingBoost = name.includes("L") ? -swing * 0.4 : name.includes("R") ? swing * 0.4 : 0;
    mesh.rotation.set(baseRotX, baseRotY + swing * 0.15, baseRotZ + swingBoost);

    // Interpolate scale
    mesh.scale.set(
      lerp(def.carScale[0], def.robotScale[0], pt),
      lerp(def.carScale[1], def.robotScale[1], pt),
      lerp(def.carScale[2], def.robotScale[2], pt),
    );

    // Emissive intensity ramps up as robot forms (use adjustedT)
    if (def.emissive && mat instanceof THREE.MeshStandardMaterial) {
      mat.emissiveIntensity = lerp(0, 1.8, Math.max(0, (adjustedT - 0.65) / 0.35));
    }
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} castShadow receiveShadow />;
}

// ─── Holographic 3D Rotating Target Rings ──────────────────────────────────────

function HoloTargetRings({ t }: { t: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const mat1 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00ffaa"),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  const mat2 = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffaa00"),
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.8;
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1;
      mat1.opacity = lerp(0.1, 0.45, t);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.6;
      ring2Ref.current.rotation.x = Math.PI / 2 + Math.cos(time * 0.5) * 0.1;
      mat2.opacity = lerp(0.05, 0.35, t);
    }
  });

  return (
    <group position={[0, lerp(-0.2, 0.4, t), 0]}>
      {/* Outer Chest Target Ring */}
      <mesh ref={ring1Ref} material={mat1}>
        <ringGeometry args={[1.8, 2.0, 32]} />
      </mesh>
      {/* Inner Energy Target Ring */}
      <mesh ref={ring2Ref} material={mat2}>
        <ringGeometry args={[1.2, 1.35, 24]} />
      </mesh>
    </group>
  );
}

// ─── Dynamic camera + lighting ────────────────────────────────────────────────

function SceneController({ t }: { t: number }) {
  const { camera } = useThree();
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    // Camera orbit: arc from slight right to slight left as t goes 0→1
    const angle = lerp(-0.3, 0.3, t) * Math.PI;
    const radius = lerp(8.5, 7.0, t);
    const camY = lerp(0.8, 1.8, t);
    camera.position.set(
      Math.sin(angle) * radius,
      camY,
      Math.cos(angle) * radius,
    );
    camera.lookAt(0, lerp(0.2, 0.5, t), 0);

    // Key light: warm white → cyan
    if (keyLightRef.current) {
      keyLightRef.current.color.setRGB(
        lerp(1.0, 0.0, t),
        lerp(0.92, 0.83, t),
        lerp(0.9, 1.0, t),
      );
      keyLightRef.current.intensity = lerp(6.0, 9.0, t);
    }

    // Fill light: accent glow grows as robot forms
    if (fillLightRef.current) {
      fillLightRef.current.intensity = lerp(0.0, 5.0, Math.max(0, (t - 0.6) / 0.4));
      fillLightRef.current.color.setRGB(
        lerp(0, 1.0, Math.max(0, (t - 0.6) / 0.4)),
        lerp(0, 0.67, Math.max(0, (t - 0.6) / 0.4)),
        0,
      ); // orange accent
    }
  });

  return (
    <>
      {/* Main Key Light - Bright and dramatic */}
      <spotLight
        ref={keyLightRef}
        position={[6, 15, 10]}
        angle={0.5}
        penumbra={0.3}
        intensity={20}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Fill Light - Warm golden glow */}
      <pointLight ref={fillLightRef} position={[0, 3, 6]} color="#fbbf24" intensity={8} />
      
      {/* Energon Cyan accent lights - Left and right */}
      <pointLight position={[-8, 5, 5]} color="#00ffaa" intensity={12} />
      <pointLight position={[8, 5, 5]} color="#ff2244" intensity={12} />
      
      {/* Back rim light - Electric blue highlight */}
      <pointLight position={[0, 8, -8]} color="#38bdf8" intensity={10} />
      
      {/* Top down spotlight - Heroic presentation */}
      <spotLight
        position={[0, 20, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={15}
        color="#ffffff"
        castShadow
      />
      
      {/* Underlight - Dramatic floor glow */}
      <pointLight position={[0, -2, 0]} color="#00f0ff" intensity={6} />
      
      {/* Ambient light - Boost overall visibility */}
      <ambientLight intensity={3.5} color="#e0f7ff" />
    </>
  );
}

// ─── Ground reflection plane ──────────────────────────────────────────────────

function GroundPlane({ t }: { t: number }) {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#04080f"),
        metalness: 0.6,
        roughness: 0.8,
        transparent: true,
        opacity: 0.6,
      }),
    [],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <primitive object={mat} />
    </mesh>
  );
}

// ─── Grid floor ───────────────────────────────────────────────────────────────

function GridFloor() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const size = 10;
    const step = 0.8;
    for (let i = -size; i <= size; i += step) {
      verts.push(-size, 0, i, size, 0, i);
      verts.push(i, 0, -size, i, 0, size);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#00d4ff"),
        transparent: true,
        opacity: 0.04,
      }),
    [],
  );

  return <lineSegments args={[geo, mat]} position={[0, -2.3, 0]} />;
}

// ─── HUD callout overlays ─────────────────────────────────────────────────────

function HudCallouts({ t }: { t: number }) {
  const callouts = [
    { label: "SYSTEM", value: "ONLINE", threshold: 0.5, x: "62%", y: "20%" },
    { label: "DATE", value: "08.OCT.2026", threshold: 0.6, x: "66%", y: "35%" },
    { label: "VENUE", value: "Sairam Engineering College", threshold: 0.7, x: "62%", y: "50%" },
    { label: "DEPT", value: "AI & Data Science", threshold: 0.78, x: "62%", y: "65%" },
    { label: "ENTRY", value: "FREE", threshold: 0.85, x: "66%", y: "78%" },
  ];

  return (
    <>
      {callouts.map((c) => {
        const visible = t >= c.threshold;
        const fadeT = visible
          ? Math.min(1, (t - c.threshold) / 0.08)
          : 0;
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: `translateX(${lerp(20, 0, fadeT)}px)`,
              opacity: fadeT,
              transition: "none",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {/* Connector line */}
            <div
              style={{
                position: "absolute",
                left: -30,
                top: "50%",
                width: 28,
                height: 1,
                background: "rgba(0,212,255,0.5)",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                background: "rgba(4,8,20,0.85)",
                border: "1px solid rgba(0,212,255,0.35)",
                borderRadius: 4,
                padding: "4px 10px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "rgba(0,212,255,0.7)",
                  fontFamily: "var(--font-heading)",
                  textTransform: "uppercase",
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#e6f7ff",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.05em",
                }}
              >
                {c.value}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── The 3D scene (inner) ─────────────────────────────────────────────────────

function ModelGroup({ t }: { t: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    
    // Phase 1 (t=0 to t=0.25): Full 360° rotation of car before transformation
    // Phase 2 (t=0.25 to t=1.0): Transform into robot with subtle idle rotation
    if (t < 0.25) {
      // During first 25% of scroll: Complete 360° rotation (2π radians)
      const rotationProgress = t / 0.25; // 0 → 1 over first 25%
      groupRef.current.rotation.y = rotationProgress * Math.PI * 2; // 0 → 2π
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.08; // Subtle hover
    } else {
      // After rotation complete: Idle rotation + yaw movement during transformation
      groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.18 + (t - 0.5) * 0.5;
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {Object.entries(PARTS).map(([name, def]) => (
        <TransformPart key={name} name={name} def={def} t={t} />
      ))}
      <HoloTargetRings t={t} />
    </group>
  );
}

function TransformScene({ t }: { t: number }) {
  return (
    <>
      <SceneController t={t} />
      <GridFloor />
      <GroundPlane t={t} />

      <ModelGroup t={t} />

      {/* Sparks component removed - was causing unattractive rain effect */}
    </>
  );
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────

function ScrollProgressBar({ t }: { t: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: t < 0.98 ? 1 : 0,
        transition: "opacity 0.5s",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "rgba(0,212,255,0.5)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {t < 0.02
          ? "SCROLL TO TRANSFORM"
          : t > 0.98
          ? "TRANSFORMATION COMPLETE"
          : `TRANSFORMING ${Math.round(t * 100)}%`}
      </div>
      <div
        style={{
          width: 160,
          height: 2,
          background: "rgba(0,212,255,0.12)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${t * 100}%`,
            background: "linear-gradient(90deg, #00d4ff, #ffaa00)",
            borderRadius: 2,
            boxShadow: "0 0 6px rgba(0,212,255,0.6)",
            transition: "none",
          }}
        />
      </div>
    </div>
  );
}

// ─── Car idle title overlay ───────────────────────────────────────────────────

function CarTitleOverlay({ t }: { t: number }) {
  const visible = t < 0.15;
  const opacity = visible ? Math.max(0, 1 - t / 0.15) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity,
        pointerEvents: opacity < 0.1 ? "none" : "auto",
        transition: "none",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          color: "rgba(0,212,255,0.6)",
          fontFamily: "var(--font-heading)",
          marginBottom: 8,
        }}
      >
        CYBERTRON COMMAND
      </div>
      <h1
        style={{
          fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
          fontWeight: 900,
          fontFamily: "var(--font-heading)",
          background: "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        AIRO 6.0
      </h1>
      <p
        style={{
          fontSize: "0.8rem",
          color: "rgba(144,175,197,0.8)",
          fontFamily: "var(--font-heading)",
          letterSpacing: "0.1em",
          marginBottom: 20,
        }}
      >
        TRANSFORM · INNOVATE · COMPETE
      </p>
      <div
        style={{
          fontSize: "0.7rem",
          color: "rgba(0,212,255,0.4)",
          letterSpacing: "0.15em",
          fontFamily: "var(--font-heading)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ display: "inline-block", animation: "scrollBounce 1.5s ease-in-out infinite" }}>↓</span>
        SCROLL TO TRANSFORM
      </div>
    </div>
  );
}

// ─── Robot complete CTA ───────────────────────────────────────────────────────

function RobotCompleteCTA({ t }: { t: number }) {
  const visible = t >= 0.92;
  const opacity = visible ? Math.min(1, (t - 0.92) / 0.08) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "5%",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity,
        pointerEvents: opacity < 0.1 ? "none" : "auto",
        transition: "none",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color: "#00d4ff",
          fontFamily: "var(--font-heading)",
          marginBottom: 8,
        }}
      >
        ● SYSTEMS ONLINE
      </div>
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          fontWeight: 900,
          fontFamily: "var(--font-heading)",
          color: "#e6f7ff",
          lineHeight: 1.15,
          marginBottom: 8,
        }}
      >
        AUTOBOT,
        <br />
        ROLL OUT.
      </h2>
      <p style={{ fontSize: "0.8rem", color: "rgba(144,175,197,0.7)", marginBottom: 20 }}>
        Dept. of AI &amp; Data Science
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link
          href="/register"
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}
        >
          ⚡ Transform Now
        </Link>
        <Link
          href="/events"
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
        >
          View Events →
        </Link>
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

interface TransformerHeroInnerProps {
  t: number;
}

function TransformerHeroInner({ t }: TransformerHeroInnerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 50%, #050508 100%)",
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        camera={{ fov: 35, near: 0.1, far: 100 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <TransformScene t={t} />
        </Suspense>
      </Canvas>

      {/* HTML overlays */}
      <CarTitleOverlay t={t} />
      <HudCallouts t={t} />
      <RobotCompleteCTA t={t} />
      <ScrollProgressBar t={t} />

      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(6,8,12,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  );
}

// ─── Exported wrapper — full page fixed background animation ─────────────────

export default function TransformerHero() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(maxScroll, 1)));
      setT(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <TransformerHeroInner t={t} />
    </div>
  );
}
