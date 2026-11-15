"use client";

import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Four-dimensional hypercube: edges differ in exactly one coordinate.
const VERTICES = Array.from({ length: 16 }, (_, i) => [0, 1, 2, 3].map(bit => (i & (1 << bit)) ? 1 : -1));
const EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) for (let bit = 0; bit < 4; bit++) if (i < (i ^ (1 << bit))) EDGES.push([i, i ^ (1 << bit)]);
const FACES: number[][] = [];
for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
  for (let i = 0; i < 16; i++) if (!(i & (1 << a)) && !(i & (1 << b))) {
    FACES.push([i, i ^ (1 << a), i ^ (1 << a) ^ (1 << b), i ^ (1 << b)]);
  }
}
const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);

const vertexShader = `
  varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 local = instanceMatrix * vec4(position, 1.0);
    vPosition = local.xyz;
    vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * local;
  }
`;
const blockFragment = `
  uniform float uTime; uniform float uFracture;
  varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
  void main() {
    float rim = pow(1.0 - abs(vNormal.z), 2.0);
    float seams = step(.47, max(abs(vUv.x-.5), abs(vUv.y-.5)));
    float fracture = step(.6, sin(vPosition.x*22.0+vPosition.y*17.0)) * uFracture * step(.0,vPosition.x) * (1.-step(1.8,vPosition.x));
    vec3 graphite = vec3(.045,.062,.08) + max(dot(vNormal,normalize(vec3(-1.,2.,3.))),0.)*.12;
    vec3 color = graphite + vec3(.38,.53,.66)*(rim*.8+seams*.65);
    color = mix(color,vec3(1.4,.12,.09),fracture*.7);
    gl_FragColor = vec4(color,1.);
  }
`;
const edgeFragment = `
  uniform float uTime; uniform float uFracture;
  varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
  void main() {
    float pulse = pow(max(0.,sin(vUv.y*18.-uTime*1.4+vPosition.x)),16.);
    float rim = .5+.5*abs(vNormal.z);
    float damaged = uFracture * step(.0,vPosition.x) * (1.-step(1.8,vPosition.x));
    vec3 color = mix(vec3(.35,.53,.69),vec3(1.6,.08,.055),damaged);
    gl_FragColor = vec4(color*(.65+pulse*2.2)*rim,1.);
  }
`;

function Scene({ progress, active, tampered }: { progress: MutableRefObject<number>; active: MutableRefObject<boolean>; tampered: MutableRefObject<boolean> }) {
  const blocks = useRef<THREE.InstancedMesh>(null);
  const edges = useRef<THREE.InstancedMesh>(null);
  const hashes = useRef<THREE.InstancedMesh>(null);
  const rig = useRef<THREE.Group>(null);
  const chromatic = useRef<ChromaticAberrationEffect>(null);
  const pointer = useRef(new THREE.Vector2());
  const localTime = useRef(0);
  const lastProgress = useRef(0);
  const fractureStart = useRef(-100);
  const fractured = useRef(false);
  const data = useMemo(() => {
    const uniforms = { uTime: { value: 0 }, uFracture: { value: 0 }, uSurfaceOpacity: { value: .1 } };
    const blockGeometry = new RoundedBoxGeometry(1, 1, 1, 2, .07);
    const surfaceGeometry = new THREE.BufferGeometry();
    surfaceGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FACES.length * 18), 3).setUsage(THREE.DynamicDrawUsage));
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: `varying vec3 vPoint; void main() { vPoint = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `uniform float uSurfaceOpacity; varying vec3 vPoint; void main() { vec3 n = normalize(cross(dFdx(vPoint),dFdy(vPoint))); float light = .2 + .8*pow(1.-abs(n.z),2.); gl_FragColor = vec4(vec3(.36,.48,.59), uSurfaceOpacity * light); }`,
    });
    const blockMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader: blockFragment, uniforms });
    const edgeMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader: edgeFragment, uniforms });
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.font = '24px monospace'; ctx.fillStyle = '#b7ccdd'; ctx.fillText('9f2a · c81b · a604', 8, 40);
    const texture = new THREE.CanvasTexture(canvas);
    const hashMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .66, depthWrite: false, side: THREE.DoubleSide });
    return { uniforms, blockGeometry, surfaceGeometry, surfaceMaterial, blockMaterial, edgeMaterial, hashMaterial, texture, dummy: new THREE.Object3D(), points: Array.from({ length: 16 }, () => new THREE.Vector3()), up: new THREE.Vector3(0, 1, 0), diff: new THREE.Vector3(), mid: new THREE.Vector3() };
  }, []);
  useEffect(() => () => { data.blockGeometry.dispose(); data.surfaceGeometry.dispose(); data.surfaceMaterial.dispose(); data.blockMaterial.dispose(); data.edgeMaterial.dispose(); data.hashMaterial.dispose(); data.texture.dispose(); }, [data]);
  useFrame((state, delta) => {
    if (!active.current || !blocks.current || !edges.current || !rig.current || !hashes.current) return;
    const dt = Math.min(delta, .05);
    localTime.current += dt;
    const t = localTime.current;
    lastProgress.current = THREE.MathUtils.damp(lastProgress.current, progress.current, 5, dt);
    const p = lastProgress.current;
    const chain = smooth(.15, .95, p);
    const seal = smooth(2.15, 2.95, p);
    const fractureTarget = (tampered.current ? 1 : 0) * smooth(1.35, 1.8, p) * (1 - smooth(2.12, 2.5, p));
    const fracture = THREE.MathUtils.damp(data.uniforms.uFracture.value, fractureTarget, 8, dt);
    if (fracture > .5 && !fractured.current) { fractureStart.current = t; fractured.current = true; }
    if (fracture < .1) fractured.current = false;
    const glitch = Math.max(0, 1 - (t - fractureStart.current) / .42);
    chromatic.current?.offset.set(glitch * .0022, glitch * .0008);
    data.uniforms.uTime.value = t;
    data.uniforms.uFracture.value = fracture;
    pointer.current.lerp(state.pointer, .035);
    rig.current.rotation.set(.13 + pointer.current.y * .08, -.25 + pointer.current.x * .12, -.12 + chain * .16);
    rig.current.position.set(1.35 * (1 - seal) + .65 * seal, .05, 0);
    const angle = t * .105;
    VERTICES.forEach((vertex, i) => {
      const v: number[] = [...vertex];
      // Sequential rotations in XW, YW and ZW. Norm stays 2, so d=4 is safe.
      for (let axis = 0; axis < 3; axis++) {
        const a = angle * [1, .73, .49][axis] + [.35, .54, .12][axis];
        const x = v[axis], w = v[3];
        v[axis] = x * Math.cos(a) - w * Math.sin(a);
        v[3] = x * Math.sin(a) + w * Math.cos(a);
      }
      const scale = 4 / (4 - v[3]);
      const group = i >> 2;
      const x = (group - 1.5) * 1.55 + ((i & 1) ? .27 : -.27);
      const y = ((i & 2) ? .27 : -.27) + Math.sin(group * .8) * .2;
      const z = ((i & 1) ? .2 : -.2);
      const point = data.points[i];
      point.set(THREE.MathUtils.lerp(v[0] * scale * 1.55, x, chain), THREE.MathUtils.lerp(v[1] * scale * 1.55, y, chain), THREE.MathUtils.lerp(v[2] * scale * 1.55, z, chain));
      if (group === 2) { point.y += fracture * ((i & 2) ? .48 : -.48); point.z += fracture * ((i & 1) ? .45 : -.45); }
      point.lerp(data.mid.set(((i & 1) - .5) * .65, (((i >> 1) & 1) - .5) * .65, ((i >> 2) - 1.5) * .48), seal);
      data.dummy.position.copy(point);
      data.dummy.rotation.set(t * .06 * (1 - chain), .2 + fracture * (group === 2 ? i * .16 : 0), .1);
      data.dummy.scale.setScalar(THREE.MathUtils.lerp(.23, .43, seal));
      data.dummy.updateMatrix(); blocks.current!.setMatrixAt(i, data.dummy.matrix);
    });
    data.uniforms.uSurfaceOpacity.value = .14 * (1 - chain) + .12 * seal;
    const surfacePosition = data.surfaceGeometry.getAttribute("position") as THREE.BufferAttribute;
    let surfaceIndex = 0;
    FACES.forEach(face => {
      for (const corner of [0, 1, 2, 0, 2, 3]) {
        const point = data.points[face[corner]];
        surfacePosition.setXYZ(surfaceIndex++, point.x, point.y, point.z);
      }
    });
    surfacePosition.needsUpdate = true;
    EDGES.forEach(([a, b], i) => {
      const start = data.points[a], end = data.points[b];
      data.diff.subVectors(end, start);
      data.dummy.position.copy(start).addScaledVector(data.diff, .5);
      data.dummy.quaternion.setFromUnitVectors(data.up, data.mid.copy(data.diff).normalize());
      data.dummy.scale.set(.009, data.diff.length(), .009);
      data.dummy.updateMatrix(); edges.current!.setMatrixAt(i, data.dummy.matrix);
      if (i < 6) {
        data.dummy.position.copy(start).lerp(end, (t * .07 + i * .17) % 1);
        data.dummy.position.y += .12;
        data.dummy.quaternion.copy(state.camera.quaternion);
        data.dummy.scale.set(.82, .103, 1);
        data.dummy.updateMatrix(); hashes.current!.setMatrixAt(i, data.dummy.matrix);
      }
    });
    blocks.current.instanceMatrix.needsUpdate = true;
    edges.current.instanceMatrix.needsUpdate = true;
    hashes.current.instanceMatrix.needsUpdate = true;
    // Four scene draws plus composer passes, comfortably below 40.
  });
  return <>
    <PerspectiveCamera makeDefault position={[0, 0, 10.8]} fov={43} />
    <group ref={rig}>
      <mesh geometry={data.surfaceGeometry} material={data.surfaceMaterial} frustumCulled={false} />
      <instancedMesh ref={blocks} args={[data.blockGeometry, data.blockMaterial, 16]} frustumCulled={false} />
      <instancedMesh ref={edges} args={[undefined, data.edgeMaterial, 32]} frustumCulled={false}><cylinderGeometry args={[1, 1, 1, 6]} /></instancedMesh>
      <instancedMesh ref={hashes} args={[undefined, data.hashMaterial, 6]} frustumCulled={false}><planeGeometry /></instancedMesh>
    </group>
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={.65} intensity={.65} mipmapBlur />
      <Noise opacity={.025} blendFunction={BlendFunction.SOFT_LIGHT} />
      <ChromaticAberration ref={chromatic} offset={new THREE.Vector2(0, 0)} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  </>;
}

export default function FlightCanvas({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const progress = useRef(0);
  const tampered = useRef(false);
  const active = useRef(true);
  const wrapper = useRef<HTMLDivElement>(null);
  const canvasState = useRef<RootState | null>(null);
  useEffect(() => {
    const main = document.querySelector(".flight-main");
    tampered.current = !!document.querySelector(".integrity-failed");
    let intersecting = true;
    const updateActive = () => { active.current = intersecting && !document.hidden; canvasState.current?.setFrameloop(active.current ? "always" : "never"); };
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; updateActive(); });
    if (main) observer.observe(main);
    const update = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-flight-stage]"));
      const anchor = innerHeight * .48;
      let value = 0;
      for (let i = 0; i < sections.length - 1; i++) {
        const aRect = sections[i].getBoundingClientRect();
        const bRect = sections[i + 1].getBoundingClientRect();
        const a = aRect.top + aRect.height * .5;
        const b = bRect.top + bRect.height * .5;
        if (a <= anchor) value = i + THREE.MathUtils.clamp((anchor - a) / (b - a), 0, 1);
      }
      progress.current = value;
    };
    const updateTamper = (event: Event) => { tampered.current = (event as CustomEvent<boolean>).detail; };
    window.addEventListener("flight-tamper", updateTamper);
    document.addEventListener("visibilitychange", updateActive);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update(); updateActive();
    return () => { observer.disconnect(); window.removeEventListener("flight-tamper", updateTamper); document.removeEventListener("visibilitychange", updateActive); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div ref={wrapper} className="flight-canvas"><Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} onCreated={state => {
    canvasState.current = state;
    state.gl.setClearColor(0x07090c, 0);
    state.gl.domElement.addEventListener("webglcontextlost", event => { event.preventDefault(); onFailure(); }, { once: true });
    if (document.hidden) { active.current = false; state.setFrameloop("never"); }
    onReady();
  }} fallback={null}><Scene progress={progress} active={active} tampered={tampered} /></Canvas></div>;
}
