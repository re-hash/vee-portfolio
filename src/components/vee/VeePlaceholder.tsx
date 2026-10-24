"use client";
import {useMemo,useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {buildHead,buildShell} from './surface';
import {sceneConfig} from '@/lib/scene-config';
import type {VeeProps} from './types';
import {useReducedMotion} from '@/lib/motion';
export function VeePlaceholder({qualityLevel}:VeeProps){
 const shell=useMemo(buildShell,[]),geo=useMemo(()=>buildHead(shell,sceneConfig.quality[qualityLevel]),[shell,qualityLevel]);
 const mat=useRef<THREE.ShaderMaterial>(null),reduced=useReducedMotion();
 useEffect(()=>()=>geo.dispose(),[geo]);useEffect(()=>()=>shell.dispose(),[shell]);
 useFrame(({clock})=>{if(mat.current)mat.current.uniforms.uTime.value=reduced?0:clock.elapsedTime});
 return <group>
  <mesh geometry={shell} renderOrder={0}><meshBasicMaterial color="#020406" side={THREE.DoubleSide}/></mesh>
  <points geometry={geo} renderOrder={1}><shaderMaterial ref={mat} transparent depthWrite={false} vertexColors toneMapped={false} uniforms={{uTime:{value:0}}}
   vertexShader={`attribute float aSize; varying vec3 vColor; varying float vAlpha; uniform float uTime;
    void main(){vColor=color;vec3 p=position;float phase=p.y*15.+p.x*19.;p+=normal*sin(uTime*.35+phase)*.0007;
    vec4 mv=modelViewMatrix*vec4(p,1.);vec3 n=normalize(normalMatrix*normal);vec3 view=normalize(-mv.xyz);
    float rim=pow(1.-abs(dot(n,view)),2.);float features=exp(-pow((p.y-.95)/.27,2.))*.12;
    vAlpha=(.16+rim*.64+features)*(.87+.13*sin(phase+uTime*.45));gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*13./-mv.z,.7,2.4);}`}
   fragmentShader={`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float core=smoothstep(.5,.05,d);gl_FragColor=vec4(vColor,core*vAlpha);}`}/></points>
 </group>;
}
