"use client";
import {useGLTF} from '@react-three/drei';import {useMemo} from 'react';import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';import type {VeeProps} from './types';
// Future GLBs should be centered, face +Z, with head/neck bounds approximately y=-2.2…2.6.
export function VeeAvatar({modelUrl}:VeeProps){if(!modelUrl)throw new Error('VeeAvatar requires modelUrl');return <LoadedAvatar url={modelUrl}/>}
function LoadedAvatar({url}:{url:string}){const {scene}=useGLTF(url);const model=useMemo(()=>clone(scene),[scene]);return <primitive object={model}/>}
