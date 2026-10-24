"use client";
import {Html} from '@react-three/drei';
import {useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import type {Group} from 'three';
import {projects,type Project} from '@/data/projects';
import {ProjectCard} from '@/components/portfolio/ProjectCard';
import {useReducedMotion} from '@/lib/motion';
const placements:[number,number,number][]=[[-2.5,.95,-2.3],[2.15,1.75,-3.3],[-2.15,-1.2,-1.7],[2.65,-.85,-2.8]];
function FloatingCard({project,index}:{project:Project;index:number}){const ref=useRef<Group>(null);const reduced=useReducedMotion();const width=useThree(s=>s.viewport.width);const [x,y,z]=placements[index];const spread=Math.min(1,width/7.8);useFrame(({clock})=>{if(ref.current){ref.current.position.x=x*spread;ref.current.position.y=y+(reduced?0:Math.sin(clock.elapsedTime*.17+index*2)*.055);ref.current.position.z=z+(reduced?0:Math.sin(clock.elapsedTime*.12+index)*.045)}});return <group ref={ref} position={[x*spread,y,z]} rotation={project.rotation}><Html transform occlude="blending" distanceFactor={7.5} zIndexRange={[10,0]}><ProjectCard project={project}/></Html></group>}
export function ProjectObjects(){return <>{projects.map((p,i)=><FloatingCard key={p.id} project={p} index={i}/>)}</>}
