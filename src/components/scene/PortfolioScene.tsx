"use client";
import {Canvas} from '@react-three/fiber';
import {useState,useEffect,Suspense} from 'react';
import {VeeController} from '@/components/vee/VeeController';
import {SceneCamera} from './SceneCamera';
import {BackgroundParticles} from './BackgroundParticles';
import {ProjectObjects} from './ProjectObjects';
import {sceneConfig} from '@/lib/scene-config';
export default function PortfolioScene(){const [mobile,set]=useState(false);useEffect(()=>{const q=matchMedia('(max-width: 760px)');const fn=()=>set(q.matches);fn();q.addEventListener('change',fn);return()=>q.removeEventListener('change',fn)},[]);return <Canvas camera={{position:[0,.02,8.8],fov:42}} dpr={sceneConfig.dpr} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#050608',0)}}><Suspense fallback={null}><SceneCamera/><BackgroundParticles/><ProjectObjects/><group scale={1.46}><VeeController qualityLevel={mobile?'low':'high'}/></group></Suspense></Canvas>}
