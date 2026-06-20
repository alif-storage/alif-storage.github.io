import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x071021, 0.03);

const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0,1.2,4);

const hemi = new THREE.HemisphereLight(0x99ddff, 0x202040, 0.8);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5,10,7);
scene.add(dir);

// Create a glossy torus as hero object
const mat = new THREE.MeshStandardMaterial({color:0x00e6c3, metalness:0.7, roughness:0.15, emissive:0x00242a, emissiveIntensity:0.15});
const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(0.7,0.22,128,24), mat);
torus.position.set(-0.6,0.4,0);
scene.add(torus);

// Floating project boxes
const boxMat = new THREE.MeshStandardMaterial({color:0xffffff, metalness:0.2, roughness:0.45});
const boxes = [];
for(let i=0;i<5;i++){
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.55,0.12), boxMat.clone());
  b.position.set((Math.random()-0.5)*4, (Math.random()-0.2)*1.4-0.2, (Math.random()-0.5)*2);
  b.rotation.set(Math.random()*0.8-0.4, Math.random()*Math.PI, 0);
  b.material.color.setHSL(0.55+Math.random()*0.2, 0.6, 0.65);
  scene.add(b); boxes.push(b);
}

// Subtle particles
const partGeo = new THREE.BufferGeometry();
const count = 250;
const positions = new Float32Array(count*3);
for(let i=0;i<count;i++) positions.set([(Math.random()-0.5)*10, (Math.random()-0.5)*6, (Math.random()-0.5)*6], i*3);
partGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
const partMat = new THREE.PointsMaterial({color:0x6ef1d0, size:0.02, transparent:true, opacity:0.6});
scene.add(new THREE.Points(partGeo, partMat));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.enablePan = false; controls.maxDistance = 10; controls.minDistance = 2.2;

function resize(){
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w,h,true);
  camera.aspect = w/h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize, {passive:true});
resize();

let t=0;
function animate(){
  requestAnimationFrame(animate);
  t += 0.01;
  torus.rotation.x = Math.sin(t*0.7)*0.15; torus.rotation.y += 0.006;
  boxes.forEach((b,i)=>{
    b.position.y += Math.sin(t*0.6 + i)*0.0015;
    b.rotation.x += 0.002 + i*0.0005;
    b.rotation.y += 0.003;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Simple parallax with mouse
document.addEventListener('mousemove', (e)=>{
  const nx = (e.clientX / innerWidth - 0.5) * 2;
  const ny = (e.clientY / innerHeight - 0.5) * 2;
  camera.position.x += (nx*0.6 - camera.position.x) * 0.04;
  camera.position.y += (-ny*0.5 - camera.position.y) * 0.04;
  camera.lookAt(0,0,0);
});
