import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
const matcapTexture = textureLoader.load('./textures/matcaps/2.png');
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg');
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({
    //map: doorColorTexture, 
    //color: 'red',
    //transparent: true,
    //opacity: 0.8,
    //side: THREE.DoubleSide
// });

// const material = new THREE.MeshNormalMaterial({ wireframe: true });
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial({
//     shininess: 1000,
//     specular: new THREE.Color(0x1188ff)
// });

//Material Cartoon Effect
// const material = new THREE.MeshToonMaterial({ 
//     gradientMap: gradientTexture,
// });
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false; 

//MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1; 
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

//MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1; 
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

//clearcoat
//material.clearcoat = 1;
//material.clearcoatRoughness = 0;

//sheen (fluffy materials like fabric)
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

//iridescence (for textures like disk)
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

//transmission - see what's behind the object
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;



/**
 * Debug
 */
const gui = new GUI();
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);
// gui.add(material, 'sheen').min(0).max(1).step(0.0001);
// gui.addColor(material, 'sheenColor');
// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(1).max(2.33).step(0.0001);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

gui.add(material, 'transmission').min(0).max(10).step(0.0001);

// ior - index of refraction, feel translucent (e.g. diamond: 2.417)
gui.add(material, 'ior').min(0).max(10).step(0.0001);
gui.add(material, 'thickness').min(0).max(1).step(0.0001);


/**
 * Mesh Gemoetries 
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64), 
    material 
);
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100), 
    material
);
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128), 
    material
);
scene.add(sphere, plane, torus);

sphere.position.x = -1.5;
torus.position.x = 1.5;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
});
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/**
 * Resizing
 */
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);
camera.lookAt(sphere);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y= 0.1 * elapsedTime;
    sphere.rotation.x = -0.15 * elapsedTime;
    plane.rotation.x = -0.15 * elapsedTime;
    torus.rotation.x= -0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();