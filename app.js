// import three.js
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

// import GLTFLoader allow for import the .glft file
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

// import GSAP for animations
import { gsap } from 'https://cdn.skypack.dev/gsap';

let canvasform = document.getElementById('dCanvas');
let width = canvasform.offsetWidth;
let height = canvasform.offsetHeight;

//create a scene
let scene = new THREE.Scene();

//create a camera
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

//keep the object in the scene
let object;

// Create a group to hold our object
let objectGroup = new THREE.Group();
scene.add(objectGroup);

//instantiation of the GLTFLoader
let loader = new GLTFLoader();

//load the .glft file
loader.load(
     './tide_pod/scene.gltf',
     function (gltf) {
          object = gltf.scene;

          // Scale up the 3D model - adjust these values as needed
          object.scale.set(35, 35, 35);

          // Set the fixed orientation
          object.rotation.x = Math.PI / 2;
          object.rotation.y = Math.PI / 4;
          object.rotation.z = 0;

          // Add the object to our group instead of directly to the scene
          objectGroup.add(object);

          // Initialize the model position based on current section
          modelMove();
     }
)

let renderer = new THREE.WebGLRenderer({
     alpha: true,
});
renderer.setSize(width, height);

document.getElementById('dCanvas').appendChild(renderer.domElement);

// Adjust camera position to better view the front of the pod
camera.position.set(0, 0, 10); // Move camera to face the pod directly

// Add lights
let ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

let light1 = new THREE.PointLight(0x4c4c4c, 5);
light1.position.set(0, 300, 500);
scene.add(light1);

let light2 = new THREE.PointLight(0x4c4c4c, 5);
light2.position.set(500, 100, 0);
scene.add(light2);

let light3 = new THREE.PointLight(0x4c4c4c, 5);
light3.position.set(0, 100, -500);
scene.add(light3);

let light4 = new THREE.PointLight(0x4c4c4c, 5);
light4.position.set(-500, 300, 500);
scene.add(light4);

// Define different positions and rotations for each section
const sectionPositions = [
     {
          id: 'hero',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 35
     },
     {
          id: 'liquid1',
          position: { x: 8, y: -1, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 30
     },
     {
          id: 'liquid2',
          position: { x: -8, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 25
     },
     {
          id: 'liquid3',
          position: { x: 8, y: 1, z: -3 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 30
     },
     {
          id: 'final',
          position: { x: -8, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 30
     }
];

// Mobile-specific positions for screens below 768px
const sectionPositionsMobile = [
     {
          id: 'hero',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 30
     },
     {
          id: 'liquid1',
          position: { x: 0, y: -1, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 25
     },
     {
          id: 'liquid2',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 25
     },
     {
          id: 'liquid3',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 25
     },
     {
          id: 'final',
          position: { x: 0, y: -3, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 25
     }
];

// Function to handle model movement based on current section
const modelMove = () => {
     if (!object) return;

     const sections = document.querySelectorAll('section');
     let currentSection;

     sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          // Check if section is in view (adjust the threshold as needed)
          if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
               currentSection = section.className;
          }
     });

     if (!currentSection) return;

     // Determine which position array to use based on screen width
     const isMobile = window.innerWidth <= 768;
     const positions = isMobile ? sectionPositionsMobile : sectionPositions;

     // Find the configuration for the current section
     let sectionConfig = positions.find(
          (config) => currentSection.includes(config.id)
     );

     if (sectionConfig) {
          // Animate the object group to the new position and rotation
          gsap.to(objectGroup.position, {
               x: sectionConfig.position.x,
               y: sectionConfig.position.y,
               z: sectionConfig.position.z,
               duration: 2,
               ease: "power2.out"
          });

          gsap.to(objectGroup.rotation, {
               x: sectionConfig.rotation.x,
               y: sectionConfig.rotation.y,
               z: sectionConfig.rotation.z,
               duration: 2,
               ease: "power2.out"
          });

          gsap.to(object.scale, {
               x: sectionConfig.scale,
               y: sectionConfig.scale,
               z: sectionConfig.scale,
               duration: 2,
               ease: "power2.out"
          });
     }
};

// Add a slight rotation to make the model more dynamic
function animate() {
     requestAnimationFrame(animate);

     // Only add a slight rotation if not transitioning between sections
     if (!gsap.isTweening(objectGroup.rotation)) {
          objectGroup.rotation.y += 0.01;
     }

     renderer.render(scene, camera);
}
animate();

// Listen for scroll events to update model position
window.addEventListener('scroll', () => {
     modelMove();
});

// Make the animation responsive
window.addEventListener('resize', () => {
     width = canvasform.offsetWidth;
     height = canvasform.offsetHeight;
     renderer.setSize(width, height);
     camera.aspect = width / height;
     camera.updateProjectionMatrix();
     renderer.setSize(width, height);
});