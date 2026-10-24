"use client";
import {useRef,useEffect} from 'react';
import {useFrame,type ThreeEvent} from '@react-three/fiber';
import * as THREE from 'three';
import {VeePlaceholder} from './VeePlaceholder';
import {VeeAvatar} from './VeeAvatar';
import type {VeeProps} from './types';
import {useReducedMotion} from '@/lib/motion';

export function VeeController(props:Partial<VeeProps>){
 const ref=useRef<THREE.Group>(null);
 const drag=useRef({active:false,x:0,y:0,rx:0,ry:0,last:0});
 const reduced=useReducedMotion();
 useEffect(()=>{
  const release=()=>{drag.current.active=false};
  const reset=()=>{release();drag.current.rx=0;drag.current.ry=0};
  window.addEventListener('blur',release);window.addEventListener('vee-reset',reset);
  return()=>{window.removeEventListener('blur',release);window.removeEventListener('vee-reset',reset)};
 },[]);
 useFrame(({pointer,clock},dt)=>{
  if(!ref.current)return;
  const d=drag.current;if(d.active)d.last=clock.elapsedTime;
  if(!d.active&&clock.elapsedTime-d.last>1.2){d.rx=THREE.MathUtils.damp(d.rx,0,2.4,dt);d.ry=THREE.MathUtils.damp(d.ry,0,2.4,dt)}
  const reactive=props.interactionEnabled!==false&&!reduced&&!d.active;
  const rx=(props.rotation?.[0]??0)+d.rx+(reactive?-pointer.y*.095:0);
  const ry=(props.rotation?.[1]??-.14)+d.ry+(reactive?pointer.x*.34+Math.sin(clock.elapsedTime*.22)*.025:0);
  ref.current.rotation.x=THREE.MathUtils.damp(ref.current.rotation.x,rx,4,dt);
  ref.current.rotation.y=THREE.MathUtils.damp(ref.current.rotation.y,ry,4,dt);
 });
 const common:VeeProps={rotation:[0,0,0],lookAtTarget:[0,0,6],speaking:false,emotionalState:'neutral',interactionEnabled:true,qualityLevel:'high',...props};
 const end=(e:ThreeEvent<PointerEvent>)=>{
  drag.current.active=false;
  (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
 };
 return <group ref={ref} position={[0,-.05,0]}>
  {common.modelUrl?<VeeAvatar {...common}/>:<VeePlaceholder {...common}/>}
  <mesh visible={false}
   onPointerDown={e=>{if(!common.interactionEnabled)return;e.stopPropagation();const d=drag.current;d.active=true;d.x=e.clientX;d.y=e.clientY;(e.target as HTMLElement).setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{const d=drag.current;if(!d.active)return;e.stopPropagation();d.ry=THREE.MathUtils.clamp(d.ry+(e.clientX-d.x)*.007,-1.05,1.05);d.rx=THREE.MathUtils.clamp(d.rx+(e.clientY-d.y)*.004,-.25,.25);d.x=e.clientX;d.y=e.clientY}}
   onPointerUp={end} onPointerCancel={end}>
   <boxGeometry args={[2.1,4.8,2.1]}/><meshBasicMaterial/>
  </mesh>
 </group>;
}
