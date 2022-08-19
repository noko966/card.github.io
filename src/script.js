import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'


import waterVertexShader from './shaders/fire/vertex.glsl'
import waterFragmentShader from './shaders/fire/fragment.glsl'


import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';


// import sphere from '../static/models/sphere2.glb'
// import spaceTexture from '../static/models/space2.jpg'

const sphereModelPath = '/models/sphere2.glb'


// Debug
const gui = new dat.GUI({
    width: 340
})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

let ax = new THREE.AxesHelper(50)
scene.add(ax)

let light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0, 1, 3);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
// light.frustumCulled = false

let camSize = 10;
light.shadow.camera.left = -camSize;
light.shadow.camera.bottom = -camSize;
light.shadow.camera.right = camSize;
light.shadow.camera.top = camSize;

scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))



//Color
debugObject.debthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 0, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



const gltfLoader = new GLTFLoader();
gltfLoader.load(
    sphereModelPath,
    (gltf) =>
    {
        gltf.scene.traverse(function(obj){
            if (!obj.isMesh) return;
            obj.material = new THREE.MeshStandardMaterial({
                color: 0xdedede,
                metalness: 0.7,
                roughness: 0.3
            });
        })
        gltf.scene.scale.set(1, 1, 1)
        scene.add(gltf.scene);
        
    }
)


let planet;

/**
 * Animate
 */


const tick = () => {

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
















