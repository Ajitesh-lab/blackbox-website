"use client";

import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Motion = { x: number; y: number; size: number; stage: number; visible: boolean };
// Dimensions in decimetres: body 2.4 × 2.76 × 2.04, excluding the cradle.
function outline(w: number, h: number, c: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-w/2+c,-h/2); shape.lineTo(w/2-c,-h/2); shape.lineTo(w/2,-h/2+c);
  shape.lineTo(w/2,h/2-c); shape.lineTo(w/2-c,h/2); shape.lineTo(-w/2+c,h/2);
  shape.lineTo(-w/2,h/2-c); shape.lineTo(-w/2,-h/2+c); shape.closePath(); return shape;
}
function solid(w: number, h: number, depth: number, chamfer = .14, bevel = .025) {
  const geometry = new THREE.ExtrudeGeometry(outline(w,h,chamfer), { depth: depth - bevel*2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, steps: 1 });
  geometry.translate(0,0,-depth/2+bevel); return geometry;
}
function mergedBoxes(boxes: number[][]) {
  const parts = boxes.map(([x,y,z,w,h,d]) => new THREE.BoxGeometry(w,h,d).translate(x,y,z));
  const merged = mergeGeometries(parts); parts.forEach(p=>p.dispose()); return merged;
}
function labelTexture(tampered: boolean) {
  const canvas = document.createElement("canvas"); canvas.width=1024; canvas.height=256;
  const ctx=canvas.getContext("2d")!; ctx.fillStyle="#141516"; ctx.fillRect(0,0,1024,256);
  ctx.textAlign="center"; ctx.font="42px monospace"; ctx.fillStyle="#b0b2b4";
  ctx.fillText("BLACK BOX / FDR-01",512,95); ctx.font="34px monospace";
  ctx.fillStyle=tampered?"#ff3b30":"#85888b"; ctx.fillText(tampered?"TAMPERED":"SEALED",512,172);
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; return texture;
}
function Recorder({ motion, tampered }: { motion: MutableRefObject<Motion>; tampered: MutableRefObject<boolean> }) {
  const rig=useRef<THREE.Group>(null); const displaced=useRef<THREE.Mesh>(null);
  const led=useRef<THREE.MeshBasicMaterial>(null); const leak=useRef<THREE.MeshBasicMaterial>(null);
  const scan=useRef<THREE.Mesh>(null); const label=useRef<THREE.MeshPhysicalMaterial>(null);
  const positioned=useRef(false);
  const fault=useRef(0); const elapsed=useRef(0); const scanTime=useRef(10); const wasTampered=useRef(false);
  const assets=useMemo(()=> {
    const ribs: number[][]=[]; const moving: number[][]=[];
    for(let i=0;i<35;i++) (i>=16&&i<=19?moving:ribs).push([0,.91-i*.052,.997,2.24,.043,.038]);
    const vents: number[][]=[];
    // Recessed fins behind four structural rails on both side panels.
    for(const sign of [-1,1]) for(let i=0;i<25;i++) vents.push([sign*1.205,-.99+i*.082,-.07,.024,.038,1.44]);
    const frames: number[][]=[];
    for(const sign of [-1,1]) {
      for(const y of [-1.1,1.1]) frames.push([sign*1.24,y,-.07,.095,.14,1.75]);
      for(const z of [-.88,.74]) frames.push([sign*1.24,0,z,.095,2.2,.13]);
    }
    // A true countersunk annulus with a recessed hexagonal socket, not a hex cap.
    const bolt= new THREE.Shape(); bolt.absarc(0,0,.081,0,Math.PI*2,false);
    const socket=new THREE.Path(); for(let i=0;i<6;i++) { const a=-i*Math.PI/3; if(i===0) socket.moveTo(Math.cos(a)*.038,Math.sin(a)*.038); else socket.lineTo(Math.cos(a)*.038,Math.sin(a)*.038); } socket.closePath(); bolt.holes.push(socket);
    const boltGeometry=new THREE.ExtrudeGeometry(bolt,{depth:.025,bevelEnabled:true,bevelSize:.008,bevelThickness:.009,bevelSegments:2,steps:1});
    const bossProfile=[new THREE.Vector2(.084,0),new THREE.Vector2(.115,0),new THREE.Vector2(.13,.012),new THREE.Vector2(.12,.048),new THREE.Vector2(.09,.052),new THREE.Vector2(.084,0)];
    const boss=new THREE.LatheGeometry(bossProfile,32); boss.rotateX(Math.PI/2);
    const cradle=solid(2.82,.23,2.37,.1,.025);
    const step=solid(2.59,.15,2.2,.1,.02);
    const feet=mergedBoxes([[-1.13,-1.83,-.85,.43,.16,.5],[1.13,-1.83,-.85,.43,.16,.5],[-1.13,-1.83,.85,.43,.16,.5],[1.13,-1.83,.85,.43,.16,.5]]);
    const material=new THREE.MeshPhysicalMaterial({color:"#292b2d",roughness:.55,metalness:.42});
    // Recording light is an emissive mask on the physical milled ribs only.
    const uniforms={time:{value:0},fault:{value:0}};
    material.onBeforeCompile=shader=> { Object.assign(shader.uniforms,uniforms); shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 localPoint;").replace("#include <begin_vertex>","#include <begin_vertex>\nlocalPoint = position;"); shader.fragmentShader=shader.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 localPoint; uniform float time; uniform float fault;").replace("#include <emissivemap_fragment>","#include <emissivemap_fragment>\nfloat head = 1.15 - mod(time * .65, 4.4); float pulse = exp(-pow((localPoint.y-head)*28.,2.)); totalEmissiveRadiance += vec3(1.7)*pulse*(1.-fault)*step(.999,localPoint.z);"); };
    return {body:solid(2.30,2.76,1.83),shell:solid(2.4,2.76,.16),ribs:mergedBoxes(ribs),moving:mergedBoxes(moving),vents:mergedBoxes(vents),frames:mergedBoxes(frames),boltGeometry,boss,cradle,step,feet,material,uniforms,sealed:labelTexture(false),tampered:labelTexture(true)};
  },[]);
  useEffect(()=>()=>{ Object.values(assets).forEach(value=>{if(value instanceof THREE.BufferGeometry||value instanceof THREE.Material||value instanceof THREE.Texture)value.dispose();}); },[assets]);
  useFrame((state,delta)=> {
    const dt=Math.min(delta,.05); const t=elapsed.current+=dt; const target=motion.current;
    if(!rig.current)return;
    rig.current.visible=target.visible;
    const distance=state.camera.position.z;
    const height=2*Math.tan(THREE.MathUtils.degToRad(36/2))*distance;
    const width=height*state.size.width/state.size.height;
    rig.current.position.x=positioned.current?THREE.MathUtils.damp(rig.current.position.x,target.x*width,7,dt):target.x*width;
    rig.current.position.y=positioned.current?THREE.MathUtils.damp(rig.current.position.y,target.y*height,7,dt):target.y*height;
    const scale=target.size*height/4.4;
    rig.current.scale.setScalar(positioned.current?THREE.MathUtils.damp(rig.current.scale.x,scale,7,dt):scale);
    positioned.current=true;
    const angle=target.stage<1?-.47:target.stage<2?-.65:.42;
    rig.current.rotation.y=THREE.MathUtils.damp(rig.current.rotation.y,angle+Math.sin(t*.16)*.025,5,dt);
    rig.current.rotation.x=THREE.MathUtils.damp(rig.current.rotation.x,.16,5,dt);
    state.camera.position.z=THREE.MathUtils.damp(distance,target.stage>1.5&&target.stage<2.5?9.6:10,4,dt);
    if(tampered.current&&!wasTampered.current)scanTime.current=0;
    wasTampered.current=tampered.current; scanTime.current+=dt;
    fault.current=THREE.MathUtils.damp(fault.current,tampered.current?1:0,7,dt);
    const f=fault.current;
    if(displaced.current) displaced.current.position.z=f*.045;
    if(leak.current)leak.current.opacity=f*.9;
    if(led.current)led.current.color.setRGB(1,1,1).multiplyScalar(.22).lerp(new THREE.Color("#ff3b30").multiplyScalar(1.2+Math.sin(t*12)*.6),f);
    if(label.current)label.current.map=f>.35?assets.tampered:assets.sealed;
    if(scan.current){scan.current.visible=tampered.current&&scanTime.current<1.4;scan.current.position.y=1.05-scanTime.current/1.4*2.15;}
    assets.uniforms.time.value=t; assets.uniforms.fault.value=f;
  });
  return <group ref={rig} rotation={[.16,-.47,0]}>
    <mesh geometry={assets.body} position={[0,0,-.105]} material={assets.material} />
    <mesh geometry={assets.shell} position={[0,0,.91]} material={assets.material} />
    <mesh geometry={assets.ribs} material={assets.material}/>
    <mesh ref={displaced} geometry={assets.moving} material={assets.material}/>
    <mesh position={[0,-.005,.999]}><planeGeometry args={[2.2,.21]}/><meshBasicMaterial ref={leak} color="#ff3b30" transparent opacity={0} toneMapped={false}/></mesh>
    <mesh geometry={assets.vents}><meshPhysicalMaterial color="#111315" metalness={.35} roughness={.7}/></mesh>
    <mesh geometry={assets.frames} material={assets.material}/>
    {[-1,1].flatMap(x=>[-1.17,1.17].map(y=><group key={`${x}-${y}`} position={[x,y,1.005]}><mesh geometry={assets.boss} material={assets.material}/><mesh geometry={assets.boltGeometry}><meshPhysicalMaterial color="#73777b" metalness={.8} roughness={.38}/></mesh></group>))}
    <mesh position={[-.73,1.1,1.012]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.043,.043,.025,20]}/><meshPhysicalMaterial color="#101112" metalness={.5} roughness={.5}/></mesh>
    <mesh position={[-.73,1.1,1.031]}><sphereGeometry args={[.023,12,8]}/><meshBasicMaterial ref={led} color="#444444" toneMapped={false}/></mesh>
    <mesh position={[0,-1.06,.994]}><boxGeometry args={[1.34,.39,.012]}/><meshPhysicalMaterial ref={label} map={assets.sealed} bumpMap={assets.sealed} bumpScale={-.002} metalness={.45} roughness={.65}/></mesh>
    <mesh ref={scan} position={[0,0,1.055]} visible={false}><planeGeometry args={[2.21,.007]}/><meshBasicMaterial color="#ff3b30" toneMapped={false}/></mesh>
    <mesh geometry={assets.cradle} position={[0,-1.68,0]}><meshPhysicalMaterial color="#17191b" metalness={.45} roughness={.6}/></mesh>
    <mesh geometry={assets.step} position={[0,-1.5,0]} material={assets.material}/>
    <mesh geometry={assets.feet}><meshPhysicalMaterial color="#111315" roughness={.75} metalness={.25}/></mesh>
    <ContactShadows position={[0,-1.93,0]} opacity={.55} scale={7} blur={2.8} far={4} frames={1} resolution={256}/>
  </group>;
}

export default function FlightCanvas({onReady,onFailure}:{onReady:()=>void;onFailure:()=>void}) {
  const motion=useRef<Motion>({x:.24,y:0,size:.8,stage:0,visible:true});
  const tampered=useRef(false); const root=useRef<RootState|null>(null);
  useEffect(()=> {
    const sections=Array.from(document.querySelectorAll<HTMLElement>("[data-flight-stage]"));
    const update=()=> {
      const nav=document.querySelector(".site-nav")?.getBoundingClientRect().height??78;
      const view=innerHeight-nav; const anchor=nav;
      const centres=sections.map(el=>{const r=el.getBoundingClientRect();return r.top;});
      let stage=0; for(let i=0;i<centres.length-1;i++)if(centres[i]<=anchor)stage=i+THREE.MathUtils.clamp((anchor-centres[i])/(centres[i+1]-centres[i]),0,1);
      const slots=sections.map(section=> {
        const slot=section.querySelector<HTMLElement>(".model-slot")!;
        const rect=slot.getBoundingClientRect();
        if(section.dataset.flightStage!=="hero")return rect;
        const headline=section.querySelector("h1")!.getBoundingClientRect();
        // Centre at 69vw, but reserve the headline's actual bounds plus 64px.
        // Shrink the old stage by 15%, then fit it into that clear right column.
        const centre=innerWidth*.69;
        const halfWidth=Math.max(0,Math.min(rect.width*.85/2,centre-headline.right-64,innerWidth*.95-centre));
        return {left:centre-halfWidth,top:rect.top+rect.height*.075,width:halfWidth*2,height:rect.height*.85};
      });
      const i=Math.min(Math.floor(stage),slots.length-1); const j=Math.min(i+1,slots.length-1); const mix=THREE.MathUtils.smoothstep(stage-i,0,1);
      const a=slots[i],b=slots[j]; const lerp=THREE.MathUtils.lerp;
      const visible=sections.some(el=>{const r=el.getBoundingClientRect();return r.bottom>nav&&r.top<innerHeight;});
      // Follow real reserved rectangles, including the smaller slot below the final CTA.
      motion.current={x:(lerp(a.left+a.width/2,b.left+b.width/2,mix)/innerWidth-.5),y:.5-(lerp(a.top+a.height/2,b.top+b.height/2,mix)-nav)/view,size:Math.min(lerp(a.height,b.height,mix)/view,lerp(a.width,b.width,mix)/view),stage,visible};
      root.current?.setFrameloop(!document.hidden&&visible?"always":"never");
    };
    const tamper=(event:Event)=>{tampered.current=(event as CustomEvent<boolean>).detail;};
    tampered.current=!!document.querySelector(".integrity-failed");
    window.addEventListener("flight-tamper",tamper);window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);document.addEventListener("visibilitychange",update);
    const observer=new ResizeObserver(update);sections.forEach(el=>{observer.observe(el);const headline=el.querySelector("h1");if(headline)observer.observe(headline);});update();
    return()=>{observer.disconnect();window.removeEventListener("flight-tamper",tamper);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);document.removeEventListener("visibilitychange",update);};
  },[]);
  return <div className="flight-canvas"><Canvas dpr={[1,1.5]} gl={{alpha:true,antialias:false,preserveDrawingBuffer:typeof window!=="undefined"&&new URLSearchParams(window.location.search).has("poster")}} onCreated={state=>{root.current=state;state.gl.setClearColor(0x090909,0);state.gl.domElement.addEventListener("webglcontextlost",event=>{event.preventDefault();onFailure();},{once:true});onReady();}}>
    <PerspectiveCamera makeDefault position={[0,0,10]} fov={36}/><ambientLight intensity={.5}/>
    <directionalLight position={[-4,6,5]} intensity={3}/><directionalLight position={[4,3,-4]} intensity={5}/>
    <Environment resolution={128} frames={1}><Lightformer position={[-4,3,4]} scale={[3,6,1]} intensity={4}/><Lightformer position={[4,1,2]} rotation={[0,-Math.PI/4,0]} scale={[2,5,1]} intensity={2}/><Lightformer position={[1,4,-3]} rotation={[0,Math.PI,0]} scale={[5,3,1]} intensity={5}/></Environment>
    <Recorder motion={motion} tampered={tampered}/>
    <EffectComposer multisampling={0}><N8AO aoRadius={.18} intensity={1.2} halfRes/><Bloom luminanceThreshold={1.1} intensity={.15} mipmapBlur={false}/></EffectComposer>
  </Canvas></div>;
}
