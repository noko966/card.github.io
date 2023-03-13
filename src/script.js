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

const sphereModelPath = '/models/card.glb'

const cardMaterialPath = '/models/card.jpg'
// const cardMaterialRoughPath = '/models/card_mat_rough.jpg'
// const cardMaterialMetalPath = '/models/card_mat_metal.jpg'

const cardMaterialRoughPath = '/models/card_mat_metal.jpg'
const cardMaterialMetalPath = '/models/card_mat_rough.jpg'
const aoMapPath = '/models/card_mat_rough.jpg'

const cardMaterial = new THREE.TextureLoader().load( cardMaterialPath );
const cardMaterialRough = new THREE.TextureLoader().load( cardMaterialRoughPath );
const cardMaterialMetal = new THREE.TextureLoader().load( cardMaterialMetalPath );
const aoMap = new THREE.TextureLoader().load( aoMapPath );
// aoMap.encoding = THREE.sRGBEncoding;
// cardMaterialRough.encoding = THREE.sRGBEncoding;
// cardMaterialMetal.encoding = THREE.sRGBEncoding;

cardMaterial.encoding = THREE.sRGBEncoding;

const urls = [
    new THREE.TextureLoader().load('/models/px.jpg'), new THREE.TextureLoader().load('/models/nx.jpg'),
    new THREE.TextureLoader().load('/models/py.jpg'), new THREE.TextureLoader().load('/models/ny.jpg'),
    new THREE.TextureLoader().load('/models/pz.jpg'), new THREE.TextureLoader().load('/models/nz.jpg')
];

const reflectionCube = new THREE.CubeTextureLoader().load( urls );
reflectionCube.encoding = THREE.sRGBEncoding;


// Debug
const gui = new dat.GUI({
    width: 340
})



const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x1e1e1e );

let sceneMaterial




/**
 * Lights
 */

let ax = new THREE.AxesHelper(50)
// scene.add(ax)

let light = new THREE.DirectionalLight(0xffffff, 3.5);
light.position.set(0.0, 0, 2.0);


let lightBack = new THREE.DirectionalLight(0xffffff, 3.5);
lightBack.position.set(0.0, 0, -2.0);
// light.castShadow = true;
// light.shadow.mapSize.width = 1024;
// light.shadow.mapSize.height = 1024;
// light.shadow.camera.near = 0.5;
// light.shadow.camera.far = 500;

// let camSize = 10;
// light.shadow.camera.left = -camSize;
// light.shadow.camera.bottom = -camSize;
// light.shadow.camera.right = camSize;
// light.shadow.camera.top = camSize;

let ambientLight = new THREE.AmbientLight(0x1e1e1e, 2.6);
scene.add(light)
scene.add(lightBack)


scene.add(ambientLight)



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
camera.position.set(0, 0, 1)
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
                // color: 0x000000,
                metalness: .6,
                roughness: .6,
                roughnessMap: cardMaterialRough,
                metalnessMap: cardMaterialMetal,
                map: cardMaterial,

                // aoMap: aoMap,
				aoMapIntensity: .5,
                envMap: reflectionCube,
				envMapIntensity: .6,
				// displacementMap: displacementMap,
				// displacementScale: settings.displacementScale,
				// displacementBias: - 0.428408,

				
            });
            obj.material.map.flipY = false;
            obj.material.metalnessMap.flipY = false;
            obj.material.roughnessMap.flipY = false;

            obj.material.roughnessMap.magFilter = THREE.NearestFilter;

            sceneMaterial = obj.material;
            console.log(sceneMaterial);
            gui.add(  sceneMaterial, 'metalness' ).min(0).max(1).step(.1).name("metalness");
            gui.add(  sceneMaterial, 'roughness' ).min(0).max(1).step(.1).name("roughness");
            gui.add(  sceneMaterial, 'aoMapIntensity' ).min(0).max(1).step(.1).name("aemap");
            gui.add(  sceneMaterial, 'envMapIntensity' ).min(0).max(1).step(.1).name("env");




        })
        gltf.scene.scale.set(1, 1, 1)

        gltf.scene.rotation.set(0,Math.PI / 2,Math.PI / 2)



        scene.add(gltf.scene);
        
    }
)

// console.log(scene.children[5].material);

gui.add(  light, 'intensity' ).min(0).max(5).step(.1).name("light intensity");
gui.add(  ambientLight, 'intensity' ).min(0).max(5).step(.1).name("ambient light intensity");
gui.add(  light.position, 'x' ).min(0).max(5).step(.1).name("light x");
gui.add(  light.position, 'y' ).min(0).max(5).step(.1).name("light y");
gui.add(  light.position, 'z' ).min(0).max(5).step(.1).name("light z");


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
















