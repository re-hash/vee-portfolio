import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import canonical from '@/data/canonical-face.json';

// MediaPipe canonical facial anatomy, Apache-2.0; see THIRD_PARTY_NOTICES.md.
const face = canonical.vertices.map(([x,y,z]) => {
  const jaw=THREE.MathUtils.smoothstep(-y,2,9);
  return new THREE.Vector3(x*.112*(1-jaw*.07),y*.12+.65,(z-2)*.112+.25);
});
const oval=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const gaussian=(v:number,c:number,w:number)=>Math.exp(-Math.pow((v-c)/w,2));

export function buildShell(){
 const positions:number[]=[],indices:number[]=[];
 const vertex=(p:THREE.Vector3)=>{positions.push(p.x,p.y,p.z);return positions.length/3-1};
 face.forEach(vertex);
 for(const tri of canonical.triangles)indices.push(...tri);
 // Curved occipital volume closes the face boundary, including upper cranium.
 const rings=28,segments=oval.length,start=positions.length/3;
 for(let ring=0;ring<=rings;ring++){
  const t=ring/rings,arc=t*Math.PI/2;
  for(const id of oval){const rim=face[id],upper=THREE.MathUtils.smoothstep(rim.y,.8,1.65);
   vertex(new THREE.Vector3(rim.x*Math.cos(arc)*(1+.06*Math.sin(t*Math.PI)),.72+(rim.y-.72)*Math.cos(arc)+upper*.85*Math.sin(t*Math.PI),THREE.MathUtils.lerp(rim.z,-.92,Math.sin(arc))));
  }
 }
 for(let ring=0;ring<rings;ring++)for(let j=0;j<segments;j++){
  const a=start+ring*segments+j,b=start+ring*segments+(j+1)%segments,c=a+segments,d=b+segments;
  indices.push(a,b,c,b,d,c);
 }
 // Neck widens towards the lower crop; shallow tendon ridges avoid a cylinder silhouette.
 const neckStart=positions.length/3,neckRows=34,neckCols=64;
 for(let i=0;i<=neckRows;i++)for(let j=0;j<=neckCols;j++){
  const t=i/neckRows,a=j/neckCols*Math.PI*2,r=.29+.12*t+.18*Math.pow(1-t,5),ridge=.018*Math.cos(a*4)*Math.sin(t*Math.PI);
  vertex(new THREE.Vector3(Math.sin(a)*(r+ridge),-2.2+t*1.82,Math.cos(a)*(r*.86+ridge)-.24));
 }
 for(let i=0;i<neckRows;i++)for(let j=0;j<neckCols;j++){
  const a=neckStart+i*(neckCols+1)+j,b=a+1,c=a+neckCols+1,d=c+1;
  indices.push(a,b,c,b,d,c);
 }
 // Ear conchae and raised helices.
 for(const side of [-1,1]){
  const base=positions.length/3,rows=13,cols=48;
  for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
   const r=i/rows,a=j/cols*Math.PI*2,helix=.055*gaussian(r,.85,.13);
   vertex(new THREE.Vector3(side*(.83+.10*r*Math.cos(a)+helix),.64+.29*r*Math.sin(a),-.07+.16*r*Math.cos(a)+.045*(1-r)));
  }
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){
   const a=base+i*(cols+1)+j,b=a+1,c=a+cols+1,d=c+1;indices.push(a,b,c,b,d,c);
  }
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const weights:number[]=[];
 for(let i=0;i<positions.length;i+=3){
  const x=positions[i],y=positions[i+1],z=positions[i+2],frontal=THREE.MathUtils.smoothstep(z,.2,.6);
  const eyes=gaussian(Math.abs(x),.34,.22)*gaussian(y,.99,.15),lips=gaussian(x,0,.30)*gaussian(y,.15,.16),nose=gaussian(x,0,.16)*gaussian(y,.65,.37);
  weights.push(.65+frontal*(eyes*2.4+lips*2.2+nose*1.3));
 }
 geometry.setAttribute('weight',new THREE.Float32BufferAttribute(weights,1));geometry.computeBoundingSphere();return geometry;
}

export function buildHead(shell:THREE.BufferGeometry,count:number){
 let seed=29;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const sampler=new MeshSurfaceSampler(new THREE.Mesh(shell)).setWeightAttribute('weight').build();
 // three r180 exposes this method; the matching @types release omits its declaration.
 (sampler as MeshSurfaceSampler & {setRandomGenerator:(rng:()=>number)=>MeshSurfaceSampler}).setRandomGenerator(random);
 const positions:number[]=[],normals:number[]=[],colors:number[]=[],sizes:number[]=[];
 const point=new THREE.Vector3(),normal=new THREE.Vector3();
 for(let i=0;i<count;i++){
  sampler.sample(point,normal);point.addScaledVector(normal,.003);
  positions.push(point.x,point.y,point.z);normals.push(normal.x,normal.y,normal.z);
  const lip=point.z>.5&&Math.abs(point.x)<.27&&point.y>-.01&&point.y<.28,ear=point.x>.85&&point.y>.35&&point.y<.9,chin=point.x>.1&&point.x<.35&&point.y<-.25&&point.y>-.48&&point.z>.3;
  const coral=(lip||ear||chin)&&random()<.43;
  const color=new THREE.Color(coral?'#ff746d':'#c0deef');color.multiplyScalar(.6+random()*.4);
  colors.push(color.r,color.g,color.b);sizes.push(.55+random()*.8);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setAttribute('aSize',new THREE.Float32BufferAttribute(sizes,1));return geometry;
}
