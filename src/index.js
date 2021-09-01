// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { SpotLightHelper } = require("three");
const Terrain = require("./terrain");

const settings = {
  animate: true,
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, 250);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  const light = new THREE.SpotLight("white", 1);
  light.position.set(0, 0, 100);

  // Setup your scene
  const scene = new THREE.Scene();
  const terrain = new Terrain({ baseColor: 0x27ae60, animated: true, flying: 0.05 });
  const water = new Terrain({
    amplitude: 8,
    animated: true,
    baseColor: 0x2980b9,
    flying: 0.001
  });

  scene.add(water.setup());
  scene.add(terrain.setup());

  scene.add(light);
  scene.add(new SpotLightHelper(light));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      terrain.update();
      water.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
