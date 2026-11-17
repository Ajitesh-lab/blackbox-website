"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

// The hash chain: ledger blocks on an ellipse around the recorder, linked in sequence.
const COUNT = 30;
const RADIUS_X = 2.05;
const RADIUS_Z = 1.75;
const HEIGHT = 0.5; // with the tilt, the front of the orbit crosses mid-ribs, clear of the label
const SPIN = 0.1; // radians per second
const WRITE_ANGLE = Math.PI / 2; // the recorder's front face (+z in rig space)
const BROKEN = 7; // block displaced when integrity fails
// Tilt the orbit so it reads as an ellipse from the camera rather than a flat band.
const TILT: [number, number, number] = [0.38, 0, -0.14];
const DIM = new THREE.Color("#3a3a3a");
const LIT = new THREE.Color(2.2, 2.2, 2.2);
const RED = new THREE.Color("#ff3b30").multiplyScalar(1.4);
const LINK = new THREE.Color("#4a4a4a");

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

/** 0..1 brightness: a sharp flash at the write head and a short fading trail after it. */
function writeLevel(angle: number) {
  const d = wrap(angle - WRITE_ANGLE);
  const head = Math.exp(-d * d * 40);
  const trail = d > 0 ? 0.32 * Math.exp(-d * 1.8) : 0;
  return Math.min(1, head + trail);
}

export function ChainHalo({ fault }: { fault: MutableRefObject<number> }) {
  const blocks = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);
  const assets = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.2, 0.055, 0.018);
    const material = new THREE.MeshBasicMaterial({ toneMapped: false });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 6), 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(COUNT * 6), 3));
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6, toneMapped: false });
    return {
      geometry, material, lineGeometry, lineMaterial,
      lines: new THREE.LineSegments(lineGeometry, lineMaterial),
      dummy: new THREE.Object3D(),
      points: Array.from({ length: COUNT }, () => new THREE.Vector3()),
      levels: new Float32Array(COUNT),
      color: new THREE.Color(),
    };
  }, []);
  useEffect(() => () => {
    assets.geometry.dispose(); assets.material.dispose();
    assets.lineGeometry.dispose(); assets.lineMaterial.dispose();
  }, [assets]);
  // instanceColor must exist before the first compile so the shader includes it.
  useLayoutEffect(() => {
    const mesh = blocks.current;
    if (!mesh) return;
    for (let i = 0; i < COUNT; i++) mesh.setColorAt(i, DIM);
  }, []);

  useFrame((_, delta) => {
    const mesh = blocks.current;
    if (!mesh || !mesh.instanceColor) return;
    const t = (elapsed.current += Math.min(delta, 0.05));
    const f = fault.current;
    const { dummy, points, levels, color } = assets;
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + t * SPIN;
      const push = i === BROKEN ? 1 + 0.2 * f : 1;
      const p = points[i].set(Math.cos(angle) * RADIUS_X * push, HEIGHT + (i === BROKEN ? 0.14 * f : 0), Math.sin(angle) * RADIUS_Z * push);
      const tx = -Math.sin(angle) * RADIUS_X;
      const tz = Math.cos(angle) * RADIUS_Z;
      dummy.position.copy(p);
      dummy.rotation.set(i === BROKEN ? 0.5 * f : 0, Math.atan2(-tz, tx), i === BROKEN ? 0.35 * f : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      levels[i] = writeLevel(angle) * (1 - 0.6 * f);
      color.copy(DIM).lerp(LIT, levels[i]);
      if (i === BROKEN) color.lerp(RED, f);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    const position = assets.lineGeometry.getAttribute("position") as THREE.BufferAttribute;
    const colors = assets.lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const j = (i + 1) % COUNT;
      position.setXYZ(i * 2, points[i].x, points[i].y, points[i].z);
      position.setXYZ(i * 2 + 1, points[j].x, points[j].y, points[j].z);
      color.copy(LINK).lerp(LIT, 0.45 * Math.max(levels[i], levels[j]));
      if (i === BROKEN || j === BROKEN) color.lerp(RED, f);
      colors.setXYZ(i * 2, color.r, color.g, color.b);
      colors.setXYZ(i * 2 + 1, color.r, color.g, color.b);
    }
    position.needsUpdate = true;
    colors.needsUpdate = true;
  });

  return <group rotation={TILT}>
    <instancedMesh ref={blocks} args={[assets.geometry, assets.material, COUNT]} frustumCulled={false} />
    <primitive object={assets.lines} frustumCulled={false} />
  </group>;
}

/** A faint calibration plate under the cradle: three rings and a tick scale, turning slowly. */
export function BenchPlate({ y }: { y: number }) {
  const plate = useRef<THREE.LineSegments>(null);
  const assets = useMemo(() => {
    const vertices: number[] = [];
    const ring = (radius: number, segments: number) => {
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const b = ((i + 1) / segments) * Math.PI * 2;
        vertices.push(Math.cos(a) * radius, 0, Math.sin(a) * radius, Math.cos(b) * radius, 0, Math.sin(b) * radius);
      }
    };
    ring(1.95, 72); ring(2.45, 96); ring(2.62, 96);
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const outer = i % 6 === 0 ? 2.86 : 2.72;
      vertices.push(Math.cos(a) * 2.62, 0, Math.sin(a) * 2.62, Math.cos(a) * outer, 0, Math.sin(a) * outer);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.LineBasicMaterial({ color: "#3c3c3c", transparent: true, opacity: 0.55 });
    return { geometry, material };
  }, []);
  useEffect(() => () => { assets.geometry.dispose(); assets.material.dispose(); }, [assets]);
  useFrame((_, delta) => { if (plate.current) plate.current.rotation.y -= Math.min(delta, 0.05) * 0.02; });
  return <lineSegments ref={plate} geometry={assets.geometry} material={assets.material} position={[0, y, 0]} />;
}
