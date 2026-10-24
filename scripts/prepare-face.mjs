import fs from 'node:fs';
const source = fs.readFileSync(new URL('../public/models/canonical-face.obj', import.meta.url), 'utf8');
const vertices = [], triangles = [];
for (const line of source.split('\n')) {
  if (line.startsWith('v ')) vertices.push(line.slice(2).trim().split(/\s+/).map(Number));
  if (line.startsWith('f ')) {
    const face = line.slice(2).trim().split(/\s+/).map(x => Number(x.split('/')[0]) - 1);
    for (let i = 1; i < face.length - 1; i++) triangles.push([face[0], face[i], face[i + 1]]);
  }
}
if (vertices.length !== 468 || triangles.length < 800) throw new Error('Unexpected canonical face mesh');
fs.writeFileSync(new URL('../src/data/canonical-face.json', import.meta.url), JSON.stringify({ vertices, triangles }));
console.log(`Prepared ${vertices.length} anatomical vertices and ${triangles.length} face triangles`);
