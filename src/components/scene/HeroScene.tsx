"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ProgressBox = { current: number };

function HeroBlob({ progress, lowPower }: { progress: ProgressBox; lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !mesh.current) return;
    const p = progress.current;

    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      p * Math.PI * 0.6,
      0.06
    );
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.15 - p * 0.6;

    const s = 1 + p * 0.35;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.08));

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      6 - p * 2.4,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, lowPower ? 5 : 8]} />
        {lowPower ? (
          // No HDRI on mobile: a mirror-like metal needs environment
          // reflections to read cleanly, and without them it either goes
          // flat/muddy or bands where the GPU can't filter it well. A
          // matte material lit by direct lights stays crisp at any dpr.
          <MeshDistortMaterial
            color="#141414"
            roughness={0.55}
            metalness={0.15}
            distort={0.38}
            speed={1.4}
          />
        ) : (
          <MeshDistortMaterial
            color="#0a0a0a"
            roughness={0.12}
            metalness={0.7}
            distort={0.42}
            speed={1.6}
          />
        )}
      </mesh>
    </group>
  );
}

function Floaters({ progress }: { progress: ProgressBox }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const deepOrbRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;

    const orb = orbRef.current;
    if (orb) {
      orb.position.x = 2.4 + p * 0.8 + Math.sin(t * 0.4) * 0.2;
      orb.position.y = Math.cos(t * 0.5) * 0.4 - p * 0.4;
      orb.rotation.x += delta * 0.25;
      orb.rotation.y += delta * 0.2;
    }

    const ring = ringRef.current;
    if (ring) {
      ring.position.x = -2.4 - p * 0.8 + Math.sin(t * 0.4 + 2) * 0.2;
      ring.position.y = Math.cos(t * 0.5 + 2) * 0.4 - p * 0.4;
      ring.rotation.x -= delta * 0.25;
      ring.rotation.y += delta * 0.2;
    }

    // extra orb set further back for parallax depth
    const deepOrb = deepOrbRef.current;
    if (deepOrb) {
      deepOrb.position.x = 0.6 + Math.sin(t * 0.3 + 1) * 0.5;
      deepOrb.position.y = 1.6 + Math.cos(t * 0.35) * 0.3 - p * 0.3;
      deepOrb.rotation.x += delta * 0.15;
      deepOrb.rotation.y -= delta * 0.18;
    }
  });

  return (
    <>
      <mesh ref={orbRef} position={[2.4, 0.5, -1]}>
        <icosahedronGeometry args={[0.45, 3]} />
        <MeshDistortMaterial color="#ffffff" roughness={0.08} metalness={0.85} distort={0.5} speed={2} />
      </mesh>
      <mesh ref={ringRef} position={[-2.4, -0.4, -0.5]}>
        <torusGeometry args={[0.4, 0.16, 24, 64]} />
        <MeshDistortMaterial color="#0a0a0a" roughness={0.1} metalness={0.75} distort={0.3} speed={1.4} />
      </mesh>
      <mesh ref={deepOrbRef} position={[0.6, 1.6, -3.5]}>
        <icosahedronGeometry args={[0.3, 3]} />
        <MeshDistortMaterial color="#111111" roughness={0.15} metalness={0.7} distort={0.35} speed={1.2} />
      </mesh>
    </>
  );
}

function getInitialReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitialLowPower() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export default function HeroScene() {
  const progress = useMemo<ProgressBox>(() => ({ current: 0 }), []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lowPower, setLowPower] = useState(getInitialLowPower);
  const [reduced, setReduced] = useState(getInitialReduced);
  const [tabVisible, setTabVisible] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onMotionChange);

    const onResize = () => setLowPower(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    if (wrapRef.current) io.observe(wrapRef.current);

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      scrub: 0.5,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => {
      mq.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      st.kill();
    };
  }, [progress]);

  const visible = tabVisible && inView;

  if (reduced) {
    return (
      <div
        aria-hidden
        className="h-full w-full rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #333, #000 70%)",
        }}
      />
    );
  }

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, powerPreference: lowPower ? "low-power" : "high-performance" }}
      >
        <ambientLight intensity={lowPower ? 0.75 : 0.6} />
        <directionalLight position={[3, 4, 5]} intensity={lowPower ? 1.8 : 1.2} />
        <directionalLight position={[-4, -2, -3]} intensity={lowPower ? 0.6 : 0.4} />
        {/* Own Suspense boundary: the HDRI fetch can take several seconds,
            and sharing a boundary with the blob would hide the blob too
            (Suspense hides the whole subtree, not just the slow part). */}
        {!lowPower && (
          <Suspense fallback={null}>
            <Environment preset="studio" />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <HeroBlob progress={progress} lowPower={lowPower} />
          {!lowPower && <Floaters progress={progress} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
