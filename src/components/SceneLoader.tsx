"use client";
import dynamic from 'next/dynamic';
import kosCover from '../../public/images/kos-cover.webp';
import {Component,useState,useEffect,type ReactNode} from 'react';
import {projects} from '@/data/projects';
const Scene=dynamic(()=>import('./scene/PortfolioScene'),{ssr:false,loading:()=> <Fallback/>});
function Fallback(){return <div className="fallback" role="img" aria-label="Vee portrait"><div className="fallback-portrait"/><a className="fallback-project" href={projects[0].href} target="_blank" rel="noopener noreferrer" aria-label="KasperskyOS for Mobile — open case study"><img src={kosCover.src} alt="KasperskyOS for Mobile"/></a></div>}
class Boundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<Fallback/>:this.props.children}}
export function SceneLoader(){const [supported,set]=useState<boolean|null>(null);useEffect(()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl2')||c.getContext('webgl');set(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{set(false)}},[]);return <Boundary>{supported===null?<Fallback/>:supported?<Scene/>:<Fallback/>}</Boundary>}
